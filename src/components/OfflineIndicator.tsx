import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 flex items-center gap-2 rounded-full bg-[#16181c] border border-[#ffd400]/40 px-3.5 py-1.5 text-[13px] font-medium text-[#ffd400] shadow-lg backdrop-blur-md">
      <WifiOff className="w-3.5 h-3.5" />
      <span>Offline Mode · Sadhana is 100% saved locally</span>
    </div>
  );
};
