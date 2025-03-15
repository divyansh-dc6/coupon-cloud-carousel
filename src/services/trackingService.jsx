import FingerprintJS from "@fingerprintjs/fingerprintjs";

// Get user's browser fingerprint
export const getBrowserFingerprint = async () => {
  try {
    // Initialize the agent at application startup.
    const fp = await FingerprintJS.load();

    // Get the visitor identifier when needed.
    const result = await fp.get();

    // The visitor identifier:
    const visitorId = result.visitorId;
    return visitorId;
  } catch (error) {
    console.error("Error generating browser fingerprint:", error);
    return null;
  }
};

// Get user's IP address
export const getUserIP = async () => {
  try {
    // Use a public IP address API service
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Error fetching IP address:", error);
    return null;
  }
};

// Set and get cookie for tracking
export const setCookieTracker = (value) => {
  // Set cookie with 1 year expiration
  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + 1);
  
  document.cookie = `couponTracker=${value}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Strict`;
};

export const getCookieTracker = () => {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith('couponTracker=')) {
      return cookie.substring('couponTracker='.length);
    }
  }
  return null;
};

// Combined tracking function
export const getSessionId = async () => {
  // Try to get existing cookie first
  let fingerprint = getCookieTracker();
  
  // If no cookie exists, generate new fingerprint
  if (!fingerprint) {
    fingerprint = await getBrowserFingerprint();
    if (fingerprint) {
      setCookieTracker(fingerprint);
    }
  }
  
  // Get IP address
  const ip = await getUserIP();
  
  return {
    ip,
    browserFingerprint: fingerprint || "Unknown"
  };
};
