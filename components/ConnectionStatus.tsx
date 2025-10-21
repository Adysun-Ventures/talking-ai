'use client';

import type { ConnectionStatus } from '@/types/realtime';
import { cn } from '@/lib/utils';
import { Mic } from 'lucide-react';

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
          bgColor: 'bg-green-400'
        };
      case 'connecting':
        return {
          text: 'Connecting...',
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-400'
        };
      case 'error':
        return {
          text: 'Error',
          color: 'text-red-400',
          bgColor: 'bg-red-400'
        };
      default:
        return {
          text: 'Press to ask',
          color: 'text-gray-400',
          bgColor: 'bg-gray-400'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {status === 'connected' && (
        <div
          className={cn(
            "w-2 h-2 rounded-full animate-pulse",
            'bg-green-400'
          )}
        ></div>
      )}
      {status !== 'connected' && (
        <Mic className={cn('w-4 h-4', 'text-red-400')} />
      )}
      <span className={cn(
        "text-sm font-medium",
        status === 'connected' ? 'text-green-400' : 'text-red-400'
      )}>
        {config.text}
      </span>
    </div>
  );
}
