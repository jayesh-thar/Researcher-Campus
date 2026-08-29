import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, X, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

export const ServerStatusGuard: React.FC = () => {
  const [isNetworkOffline, setIsNetworkOffline] = useState<boolean>(!navigator.onLine);
  const [isServerOffline, setIsServerOffline] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);

  const checkHealth = async () => {
    if (!navigator.onLine) {
      setIsNetworkOffline(true);
      return;
    }
    setIsNetworkOffline(false);
    setChecking(true);
    try {
      await api.get('/health', { timeout: 8000 });
      setIsServerOffline(false);
    } catch {
      setIsServerOffline(true);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    const handleOnline = () => {
      setIsNetworkOffline(false);
      checkHealth();
    };

    const handleOffline = () => {
      setIsNetworkOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    checkHealth();
    const interval = setInterval(checkHealth, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const shouldShow = (isNetworkOffline || isServerOffline) && !dismissed;
  if (!shouldShow) return null;

  return (
    <div className="bg-slate-900/95 backdrop-blur-xs text-white px-4 py-2.5 text-xs flex items-center justify-between font-sans sticky top-0 z-50 border-b border-slate-800 shadow-md animate-fadeIn">
      <div className="flex items-center space-x-2.5">
        {isNetworkOffline ? (
          <WifiOff className="w-4 h-4 text-red-400 shrink-0 animate-pulse" />
        ) : (
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
        )}
        <span className="text-slate-200">
          {isNetworkOffline ? (
            <>
              <strong className="text-white font-semibold">Internet Disconnected:</strong> No active internet connection detected. Please verify your network settings.
            </>
          ) : (
            <>
              <strong className="text-white font-semibold">Academic Backend Connecting:</strong> Cloud instances may take ~20–30 seconds to wake up from cold start. If operations pause, please wait a moment or click Retry.
            </>
          )}
        </span>
      </div>

      <div className="flex items-center space-x-2 shrink-0">
        <button
          onClick={checkHealth}
          disabled={checking}
          className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-2.5 py-1 rounded text-[11px] font-medium transition-colors disabled:opacity-50 border border-slate-700 cursor-pointer"
        >
          <RefreshCw className={`w-3 h-3 ${checking ? 'animate-spin text-amber-400' : ''}`} />
          <span>{checking ? 'Connecting...' : 'Retry Connection'}</span>
        </button>

        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
          title="Dismiss notice"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
