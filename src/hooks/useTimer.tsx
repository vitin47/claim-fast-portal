import { useState, useEffect, useCallback } from 'react';

export const useTimer = (initialMinutes: number = 15) => {
  const [seconds, setSeconds] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds]);

  const formatTime = useCallback(() => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, [seconds]);

  const reset = useCallback(() => {
    setSeconds(initialMinutes * 60);
    setIsActive(true);
  }, [initialMinutes]);

  return {
    seconds,
    isActive,
    formatTime,
    reset,
    isExpired: seconds === 0
  };
};