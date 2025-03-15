import { db } from './firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc, 
  serverTimestamp,
  limit,
  orderBy,
  increment
} from 'firebase/firestore';

// Settings reference
const settingsRef = doc(db, "settings", "distribution");

// Get the next available coupon (round-robin)
export const getNextAvailableCoupon = async () => {
  try {
    // Get the settings document
    const settingsDoc = await getDoc(settingsRef);
    const settings = settingsDoc.exists() ? settingsDoc.data() : { lastDistributedIndex: 0 };

    // Get all available coupons
    const couponsRef = collection(db, "coupons");
    const availableCouponsQuery = query(
      couponsRef,
      where("isActive", "==", true),        // Coupon is active
      where("isAssigned", "==", false),     // Coupon is not assigned yet
      orderBy("createdAt")
    );

    const availableCoupons = await getDocs(availableCouponsQuery);

    if (availableCoupons.empty) {
      return null;
    }

    const couponsArray = availableCoupons.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Determine the next index using round-robin
    let nextIndex = (settings.lastDistributedIndex + 1) % couponsArray.length;

    // Update the last distributed index
    await updateDoc(settingsRef, {
      lastDistributedIndex: nextIndex
    });

    return couponsArray[nextIndex];
  } catch (error) {
    console.error("Error getting next coupon:", error);
    throw error;
  }
};

// Record a coupon claim
export const recordCouponClaim = async (couponId, couponCode, ip, browserFingerprint) => {
  try {
    const claimRef = await addDoc(collection(db, "claims"), {
      couponId,
      couponCode,
      claimedAt: serverTimestamp(),
      ip,
      browserFingerprint
    });

    // Update the coupon's claim count and mark it as assigned
    const couponRef = doc(db, "coupons", couponId);
    await updateDoc(couponRef, {
      claimCount: increment(1),  // Increment claim count
      isAssigned: true,          // Mark as assigned
      assignedAt: serverTimestamp(), // Track when it was assigned
      updatedAt: serverTimestamp() // Update timestamp
    });

    return claimRef.id;
  } catch (error) {
    console.error("Error recording claim:", error);
    throw error;
  }
};

// Check if user is eligible to claim (based on IP and browser fingerprint)
export const checkEligibility = async (ip, browserFingerprint) => {
  try {
    // Get settings for cooldown period
    const settingsDoc = await getDoc(settingsRef);
    const settings = settingsDoc.exists() 
      ? settingsDoc.data() 
      : { cooldownPeriod: 24 }; // Default 24 hours

    const cooldownHours = settings.cooldownPeriod;
    const cooldownMs = cooldownHours * 60 * 60 * 1000;
    const earliestAllowedTime = new Date(Date.now() - cooldownMs);

    // Check for IP-based claims
    const ipClaimsRef = collection(db, "claims");
    const ipClaimsQuery = query(
      ipClaimsRef,
      where("ip", "==", ip),
      where("claimedAt", ">=", earliestAllowedTime),
      limit(1)
    );

    const ipClaims = await getDocs(ipClaimsQuery);

    if (!ipClaims.empty) {
      const claim = ipClaims.docs[0].data();
      const timeLeft = calculateTimeLeft(claim.claimedAt.toDate(), cooldownHours);
      return { 
        eligible: false, 
        reason: "IP", 
        timeLeft 
      };
    }

    // Check for browser-based claims
    const browserClaimsQuery = query(
      ipClaimsRef,
      where("browserFingerprint", "==", browserFingerprint),
      where("claimedAt", ">=", earliestAllowedTime),
      limit(1)
    );

    const browserClaims = await getDocs(browserClaimsQuery);

    if (!browserClaims.empty) {
      const claim = browserClaims.docs[0].data();
      const timeLeft = calculateTimeLeft(claim.claimedAt.toDate(), cooldownHours);
      return { 
        eligible: false, 
        reason: "Browser", 
        timeLeft 
      };
    }

    return { eligible: true };
  } catch (error) {
    console.error("Error checking eligibility:", error);
    throw error;
  }
};

// Calculate time left in cooldown period
const calculateTimeLeft = (claimTime, cooldownHours) => {
  const cooldownMs = cooldownHours * 60 * 60 * 1000;
  const expirationTime = new Date(claimTime.getTime() + cooldownMs);
  const timeLeftMs = expirationTime - Date.now();

  if (timeLeftMs <= 0) return { hours: 0, minutes: 0 };

  const hours = Math.floor(timeLeftMs / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));

  return { hours, minutes };
};

// Admin functions
export const getAllCoupons = async () => {
  try {
    const couponsRef = collection(db, "coupons");
    const couponsQuery = query(couponsRef, orderBy("createdAt", "desc"));
    const couponsSnapshot = await getDocs(couponsQuery);

    return couponsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting coupons:", error);
    throw error;
  }
};

export const addCoupon = async (couponData) => {
  try {
    const couponRef = await addDoc(collection(db, "coupons"), {
      ...couponData,
      isActive: true, // Mark as active initially
      isAssigned: false, // Not assigned when created
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return couponRef.id;
  } catch (error) {
    console.error("Error adding coupon:", error);
    throw error;
  }
};

export const updateCoupon = async (couponId, couponData) => {
  try {
    const couponRef = doc(db, "coupons", couponId);
    await updateDoc(couponRef, {
      ...couponData,
      updatedAt: serverTimestamp()
    });

    return couponId;
  } catch (error) {
    console.error("Error updating coupon:", error);
    throw error;
  }
};

export const deleteCoupon = async (couponId) => {
  try {
    const couponRef = doc(db, "coupons", couponId);
    await deleteDoc(couponRef);

    return couponId;
  } catch (error) {
    console.error("Error deleting coupon:", error);
    throw error;
  }
};

export const getClaimHistory = async (filters = {}) => {
  try {
    const claimsRef = collection(db, "claims");
    let claimsQuery = query(claimsRef, orderBy("claimedAt", "desc"));

    if (filters.couponId) {
      claimsQuery = query(claimsQuery, where("couponId", "==", filters.couponId));
    }

    const claimsSnapshot = await getDocs(claimsQuery);

    return claimsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting claim history:", error);
    throw error;
  }
};

export const updateSettings = async (settings) => {
  try {
    await updateDoc(settingsRef, {
      ...settings,
      updatedAt: serverTimestamp()
    });

    return true;
  } catch (error) {
    console.error("Error updating settings:", error);
    throw error;
  }
};

export const getSettings = async () => {
  try {
    const settingsDoc = await getDoc(settingsRef);
    return settingsDoc.exists() ? settingsDoc.data() : { cooldownPeriod: 24, lastDistributedIndex: 0 };
  } catch (error) {
    console.error("Error getting settings:", error);
    throw error;
  }
};

// Export the functions so they can be used in the CouponManager component
export {
  getAllCoupons as getCoupons, // Renaming getAllCoupons to getCoupons for consistency
};
