'use client';

import { ConnectionStatus } from '@/types/realtime';
import { cn } from '@/lib/utils';

interface ConnectionStatusProps {
  status: ConnectionStatus;
  className?: string;
}

export default function ConnectionStatus({ status, className }: ConnectionStatusProps) {
  const getStatusConfig = (status: ConnectionStatus) => {
    switch (status) {
      case 'connected':
        return {
          text: 'Connected',
          color: 'text-green-400',
          bgColor: 'bg-green-400',
          icon: '🟢'
        };
      case 'connecting':
        return {
          text: 'Connecting...',
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-400',
          icon: '🟡'
        };
      case 'error':
        return {
          text: 'Error',
          color: 'text-red-400',
          bgColor: 'bg-red-400',
          icon: '🔴'
        };
      default:
        return {
          text: 'Disconnected',
          color: 'text-gray-400',
          bgColor: 'bg-gray-400',
          icon: '⚪'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(
        "w-2 h-2 rounded-full animate-pulse",
        config.bgColor
      )}></div>
      <span className={cn("text-sm font-medium", config.color)}>
        {config.text}
      </span>
    </div>
  );
}
