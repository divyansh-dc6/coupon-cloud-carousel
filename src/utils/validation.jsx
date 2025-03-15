/**
 * Validates a coupon code format
 * @param {string} code - The coupon code to validate
 * @returns {boolean} Whether the code is valid
 */
export const validateCouponCode = (code) => {
    if (!code || typeof code !== 'string') return false;
    
    // Coupon should be at least 4 characters
    if (code.length < 4) return false;
    
    // Coupon should not contain spaces
    if (/\s/.test(code)) return false;
    
    // Additional validation can be added as needed
    return true;
  };
  
  /**
   * Validates coupon form data
   * @param {Object} couponData - The coupon data to validate
   * @returns {Object} Object containing validation result and errors
   */
  export const validateCouponForm = (couponData) => {
    const errors = {};
    
    // Validate code
    if (!validateCouponCode(couponData.code)) {
      errors.code = "Coupon code must be at least 4 characters and contain no spaces";
    }
    
    // Validate description (optional)
    if (couponData.description && couponData.description.length > 500) {
      errors.description = "Description must be less than 500 characters";
    }
    
    // Validate value (if applicable)
    if (couponData.value !== undefined) {
      const value = parseFloat(couponData.value);
      if (isNaN(value) || value < 0) {
        errors.value = "Value must be a positive number";
      }
    }
    
    // Validate expiration date (if applicable)
    if (couponData.expirationDate) {
      const expDate = new Date(couponData.expirationDate);
      const now = new Date();
      
      if (isNaN(expDate.getTime()) || expDate < now) {
        errors.expirationDate = "Expiration date must be in the future";
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  /**
   * Validates an email address
   * @param {string} email - The email to validate
   * @returns {boolean} Whether the email is valid
   */
  export const validateEmail = (email) => {
    if (!email || typeof email !== 'string') return false;
    
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  /**
   * Validates a password
   * @param {string} password - The password to validate
   * @returns {Object} Object containing validation result and message
   */
  export const validatePassword = (password) => {
    if (!password || typeof password !== 'string') {
      return { isValid: false, message: "Password is required" };
    }
    
    if (password.length < 6) {
      return { isValid: false, message: "Password must be at least 6 characters" };
    }
    
    return { isValid: true, message: "" };
  };