import React, { useState, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';

const RateLimitStatus: React.FC = () => {
  const { state } = useChat();
  const [countdown, setCountdown] = useState<number>(0);

  useEffect(() => {
    if (state.isRateLimited && state.rateLimitInfo?.retryAfter) {
      setCountdown(state.rateLimitInfo.retryAfter);
      
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [state.isRateLimited, state.rateLimitInfo?.retryAfter]);

  if (!state.isRateLimited) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            <span className="font-medium">Rate Limited:</span> {state.rateLimitInfo?.message || 'Too many requests'}
            {countdown > 0 && (
              <span className="block text-xs mt-1">
                Retrying in {countdown} second{countdown !== 1 ? 's' : ''}...
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RateLimitStatus;