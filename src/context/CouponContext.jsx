import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getNextAvailableCoupon, 
  recordCouponClaim, 
  checkEligibility,
  getAllCoupons,
  getClaimHistory,
  getSettings
} from '../services/couponService';


const CouponContext = createContext();

export const useCoupon = () => useContext(CouponContext);

export const CouponProvider = ({ children }) => {
  const [coupons, setCoupons] = useState([]);
  const [claims, setClaims] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [claimMessage, setClaimMessage] = useState(null);

  // Load coupons for admin view
  const loadCoupons = async () => {
    try {
      setLoading(true);
      setError(null);
      const couponsData = await getAllCoupons();
      setCoupons(couponsData);
      return couponsData;
    } catch (err) {
      setError("Failed to load coupons: " + err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Load claim history for admin view
  const loadClaimHistory = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const claimsData = await getClaimHistory(filters);
      setClaims(claimsData);
      return claimsData;
    } catch (err) {
      setError("Failed to load claim history: " + err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Load settings
  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const settingsData = await getSettings();
      setSettings(settingsData);
      return settingsData;
    } catch (err) {
      setError("Failed to load settings: " + err.message);
      return {};
    } finally {
      setLoading(false);
    }
  };

  // Claim a coupon
  const claimCoupon = async () => {
    try {
      setLoading(true);
      setError(null);
      setClaimMessage(null);
      
      // Get tracking data
      const { ip, browserFingerprint } = await getTrackingData();
      
      if (!ip || !browserFingerprint) {
        setError("Unable to verify your device. Please enable cookies and try again.");
        return null;
      }
      
      // Check eligibility
      const eligibility = await checkEligibility(ip, browserFingerprint);
      
      if (!eligibility.eligible) {
        const { hours, minutes } = eligibility.timeLeft;
        const waitMessage = `Please wait ${hours} hours and ${minutes} minutes before claiming again.`;
        
        setClaimMessage({
          type: 'error',
          title: 'Coupon claim restricted',
          message: eligibility.reason === 'IP' 
            ? `This IP address has recently claimed a coupon. ${waitMessage}`
            : `This browser has recently claimed a coupon. ${waitMessage}`
        });
        
        return null;
      }
      
      // Get next available coupon
      const coupon = await getNextAvailableCoupon();
      
      if (!coupon) {
        setClaimMessage({
          type: 'error',
          title: 'No coupons available',
          message: 'There are no coupons available at the moment. Please try again later.'
        });
        
        return null;
      }
      
      // Record the claim
      await recordCouponClaim(coupon.id, coupon.code, ip, browserFingerprint);
      
      setClaimMessage({
        type: 'success',
        title: 'Coupon claimed successfully!',
        message: `Your coupon code is: ${coupon.code}`,
        coupon
      });
      
      return coupon;
    } catch (err) {
      setError("Failed to claim coupon: " + err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    coupons,
    claims,
    settings,
    loading,
    error,
    claimMessage,
    loadCoupons,
    loadClaimHistory,
    loadSettings,
    claimCoupon,
    setClaimMessage
  };

  return (
    <CouponContext.Provider value={value}>
      {children}
    </CouponContext.Provider>
  );
};