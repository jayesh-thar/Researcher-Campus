import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';

export const ServerStatusGuard: React.FC = () => {
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(false);

  const checkHealth = async () => {
    setChecking(true);
    try {
      await api.get('/health', { timeout: 4000 });
      setIsOffline(false);
    } catch {
      setIsOffline(true);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 20000);
    return () => clearInterval(interval);
  }, []);

  if (!isOffline) return null;

  return (
    <div className="bg-red-900 text-white px-4 py-2 text-xs flex items-center justify-between font-mono sticky top-0 z-50 border-b border-red-950 shadow-md">
      <div className="flex items-center space-x-2">
        <WifiOff className="w-4 h-4 text-red-300 animate-pulse shrink-0" />
        <span className="font-semibold text-red-100">
          Backend API Offline: Express Server is unreachable. Please check backend server status.
        </span>
      </div>

      <button
        onClick={checkHealth}
        disabled={checking}
        className="flex items-center space-x-1.5 bg-red-800 hover:bg-red-700 text-white px-2.5 py-1 rounded text-[11px] font-semibold transition-colors disabled:opacity-50"
      >
        <RefreshCw className={`w-3 h-3 ${checking ? 'animate-spin' : ''}`} />
        <span>{checking ? 'Checking...' : 'Retry Connection'}</span>
      </button>
    </div>
  );
};
