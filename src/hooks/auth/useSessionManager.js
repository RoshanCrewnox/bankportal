import { useState, useEffect, useCallback, useRef } from 'react';
import authService from '../../services/auth';
import toast from 'react-hot-toast';

const useSessionManager = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef(null);
  const checkIntervalRef = useRef(null);

  const logout = useCallback(async () => {
    try {
      // Clear interval first to prevent race conditions during logout
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      
      await authService.LOGOUT();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.clear();
      window.location.href = '/login';
    }
  }, []);

  const extendSession = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        const response = await authService.REFRESH_TOKEN({ refresh_token: refreshToken });
        if (response?.data) {
          setShowPopup(false);
          setTimeLeft(30);
          toast.success("Session extended successfully");
        } else {
          logout();
        }
      } else {
        logout();
      }
    } catch (error) {
      console.error("Failed to extend session:", error);
      logout();
    }
  }, [logout]);

  useEffect(() => {
    const checkSession = () => {
      const sessionDataStr = localStorage.getItem('SessionData');
      const refreshTimeStr = localStorage.getItem('SessionRefreshTime');
      
      if (!sessionDataStr || !refreshTimeStr) return;

      try {
        const sessionData = JSON.parse(sessionDataStr);
        const refreshTime = parseInt(refreshTimeStr);
        
        // sessionData.expires_in is assumed to be in seconds as per OAuth2 standards
        // If it's 6000, that's 100 minutes.
        const expiresInMs = (sessionData.expires_in || 3600) * 1000; 
        
        const currentTime = Date.now();
        const timeElapsed = currentTime - refreshTime;
        const timeRemainingMs = expiresInMs - timeElapsed;

        // Warning threshold: 30 seconds (30000ms)
        if (timeRemainingMs <= 30000 && timeRemainingMs > 0) {
          if (!showPopup) {
            setShowPopup(true);
            const secondsLeft = Math.max(1, Math.floor(timeRemainingMs / 1000));
            setTimeLeft(secondsLeft);
          }
        } else if (timeRemainingMs <= 0) {
          logout();
        } else {
          // If session was extended in another tab or elsewhere
          if (showPopup) {
            setShowPopup(false);
          }
        }
      } catch (err) {
        console.error("Error checking session:", err);
      }
    };

    // Initial check
    checkSession();

    // Check session every 5 seconds
    checkIntervalRef.current = setInterval(checkSession, 5000);
    
    return () => {
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
    };
  }, [logout, showPopup]);

  // Handle the countdown when popup is visible
  useEffect(() => {
    if (showPopup) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            logout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [showPopup, logout]);

  return {
    showPopup,
    timeLeft,
    extendSession,
    logout
  };
};

export default useSessionManager;
