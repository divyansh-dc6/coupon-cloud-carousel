import { useContext } from 'react';
import { CouponContext } from '../context/CouponContext';

/**
 * Custom hook to access the coupon context
 * @returns {Object} Coupon context containing coupons, claim history, and CRUD functions
 */
const useCoupons = () => {
  const couponContext = useContext(CouponContext);
  
  if (!couponContext) {
    throw new Error("useCoupons must be used within a CouponProvider");
  }
  
  return couponContext;
};

export default useCoupons;