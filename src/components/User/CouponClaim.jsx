import React, { useState } from "react";
import { db } from "../../services/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import FeedbackMessage from "./FeedbackMessage";

const CouponClaim = () => {
  const [loading, setLoading] = useState(false);
  const [claimMessage, setClaimMessage] = useState(null);
  const [showCouponCode, setShowCouponCode] = useState(false);

  const claimCoupon = async () => {
    setLoading(true);
    try {
      // Access the coupons collection
      const couponCollection = collection(db, "coupons");
      
      // Get all coupons
      const couponSnapshot = await getDocs(couponCollection);
      const coupons = couponSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Find an unclaimed coupon
      const unclaimedCoupon = coupons.find(coupon => !coupon.claimed);

      if (unclaimedCoupon) {
        // Mark the coupon as claimed
        const couponRef = doc(db, "coupons", unclaimedCoupon.id);
        await updateDoc(couponRef, { claimed: true });

        setClaimMessage({
          type: "success",
          title: "Coupon Claimed!",
          message: `Your coupon code is: ${unclaimedCoupon.code}`,
          coupon: unclaimedCoupon.code,
        });
      } else {
        setClaimMessage({
          type: "error",
          title: "No Coupons Left",
          message: "All coupons have been claimed. Please try again later.",
        });
      }
    } catch (error) {
      console.error("Error claiming coupon:", error);
      setClaimMessage({
        type: "error",
        title: "Error",
        message: "There was an error claiming the coupon. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    await claimCoupon();
    setShowCouponCode(true);
  };

  const handleClose = () => {
    setClaimMessage(null);
    setShowCouponCode(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Claim Your Coupon
      </h2>

      <p className="text-gray-600 mb-6 text-center">
        Click the button below to claim your unique coupon code.
      </p>

      <div className="flex justify-center">
        <button
          onClick={handleClaim}
          disabled={loading}
          className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-200 ease-in-out disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Claim Coupon"
          )}
        </button>
      </div>

      {claimMessage && (
        <FeedbackMessage
          type={claimMessage.type}
          title={claimMessage.title}
          message={claimMessage.message}
          coupon={claimMessage.coupon}
          onClose={handleClose}
          showCouponCode={showCouponCode}
        />
      )}
    </div>
  );
};

export default CouponClaim;
