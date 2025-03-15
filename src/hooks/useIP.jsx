import { useState, useEffect } from 'react';
import { getClientIP, checkIPCooldown } from '../services/trackingService';

/**
 * Custom hook to handle IP tracking functionality
 * @param {number} cooldownPeriod - Cooling period in minutes
 * @returns {Object} IP state and verification functions
 */
const useIP = (cooldownPeriod = 60) => {
  const [clientIP, setClientIP] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canClaim, setCanClaim] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Fetch client IP on mount
  useEffect(() => {
    const fetchIP = async () => {
      setIsLoading(true);
      try {
        const ip = await getClientIP();
        setClientIP(ip);
        
        // Check if this IP is on cooldown
        const { canClaim: allowClaim, timeRemaining: cooldownRemaining } = await checkIPCooldown(ip, cooldownPeriod);
        setCanClaim(allowClaim);
        setTimeRemaining(cooldownRemaining);
      } catch (err) {
        console.error("Error fetching IP:", err);
        setError("Failed to verify your session. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchIP();
  }, [cooldownPeriod]);

  // Check if the current IP is allowed to claim
  const verifyIPEligibility = async () => {
    if (!clientIP) return false;
    
    try {
      const { canClaim: allowClaim, timeRemaining: cooldownRemaining } = await checkIPCooldown(clientIP, cooldownPeriod);
      setCanClaim(allowClaim);
      setTimeRemaining(cooldownRemaining);
      return allowClaim;
    } catch (err) {
      console.error("Error verifying IP eligibility:", err);
      setError("Failed to verify your session. Please try again later.");
      return false;
    }
  };

  return {
    clientIP,
    isLoading,
    error,
    canClaim,
    timeRemaining,
    verifyIPEligibility
  };
};

export default useIP;