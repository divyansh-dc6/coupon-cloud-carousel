/**
 * Format a date to a readable string
 * @param {Date|string|number} date - Date to format
 * @param {boolean} includeTime - Whether to include time in the output
 * @returns {string} Formatted date string
 */
export const formatDate = (date, includeTime = false) => {
    if (!date) return "N/A";
    
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) return "Invalid Date";
    
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    
    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }
    
    return dateObj.toLocaleDateString('en-US', options);
  };
  
  /**
   * Format time remaining from minutes to a readable string
   * @param {number} minutes - Minutes remaining
   * @returns {string} Formatted time string
   */
  export const formatTimeRemaining = (minutes) => {
    if (minutes <= 0) return "Now";
    
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    let result = `${hours} hour${hours !== 1 ? 's' : ''}`;
    
    if (remainingMinutes > 0) {
      result += ` ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
    }
    
    return result;
  };
  
  /**
   * Generate a unique coupon code
   * @param {number} length - Length of the code
   * @returns {string} Generated coupon code
   */
  export const generateCouponCode = (length = 8) => {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluded potentially confusing characters like O, 0, 1, I
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
  };
  
  /**
   * Truncate a string to a maximum length with ellipsis
   * @param {string} str - String to truncate
   * @param {number} maxLength - Maximum length
   * @returns {string} Truncated string
   */
  export const truncateString = (str, maxLength = 30) => {
    if (!str || str.length <= maxLength) return str;
    return `${str.substring(0, maxLength)}...`;
  };
  
  /**
   * Calculate the time difference between two dates in minutes
   * @param {Date} date1 - First date
   * @param {Date} date2 - Second date
   * @returns {number} Time difference in minutes
   */
  export const getTimeDifferenceInMinutes = (date1, date2) => {
    const diffInMs = Math.abs(date2 - date1);
    return Math.floor(diffInMs / (1000 * 60));
  };
  
  /**
   * Mask an IP address for privacy (e.g., 192.168.1.1 → 192.168.x.x)
   * @param {string} ip - IP address to mask
   * @returns {string} Masked IP address
   */
  export const maskIPAddress = (ip) => {
    if (!ip) return "Unknown";
    
    const parts = ip.split('.');
    if (parts.length !== 4) return ip; // Not an IPv4 address
    
    return `${parts[0]}.${parts[1]}.x.x`;
  };