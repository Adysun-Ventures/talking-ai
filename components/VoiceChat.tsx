'use client';

import { useState, useEffect, useRef } from 'react';
import { RealtimeClient } from '@/lib/realtime-client';
import type { ConnectionStatus } from '@/types/realtime';
import ConnectionStatusComponent from './ConnectionStatus';
import { cn } from '@/lib/utils';
import { Loader2, Square, Mic } from 'lucide-react';

type VoiceChatProps = {
  personaId?: string;
  defaultVoice?: string;
};

export default function VoiceChat({ personaId, defaultVoice }: VoiceChatProps) {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [selectedVoice, setSelectedVoice] = useState(defaultVoice || 'alloy');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const realtimeClientRef = useRef<RealtimeClient | null>(null);

  // Update voice when defaultVoice prop changes
  useEffect(() => {
    if (defaultVoice) {
      setSelectedVoice(defaultVoice);
    }
  }, [defaultVoice]);

  useEffect(() => {
    return () => {
      realtimeClientRef.current?.disconnect();
    };
  }, []);

  const handleStartCall = async () => {
    if (status === 'connected') {
      handleStopCall();
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Init client with persona context (server will use this for instructions + voice)
      const client = new RealtimeClient({ personaId });
      realtimeClientRef.current = client;

      client.setOnStatusChange((newStatus) => {
        setStatus(newStatus);
        if (newStatus === 'connected') setIsConnecting(false);
      });

      client.setOnError((errorMessage) => {
        setError(String(errorMessage));
        setIsConnecting(false);
        setStatus('error');
      });

      client.setOnSpeakingChange((speaking) => setIsSpeaking(speaking));

      // Connect with selected voice (server handles authentication)
      await client.connect(selectedVoice);
    } catch (e) {
      console.error('Failed to start call:', e);
      setError(e instanceof Error ? e.message : 'Failed to start call');
      setIsConnecting(false);
      setStatus('error');
    }
  };

  const handleStopCall = () => {
    realtimeClientRef.current?.disconnect();
    realtimeClientRef.current = null;
    setStatus('disconnected');
    setIsConnecting(false);
    setError(null);
    setIsSpeaking(false);
  };

  // Voice selection is disabled; we use persona-provided defaultVoice only.

  const isConnected = status === 'connected';
  const isDisabled = isConnecting || status === 'connecting';

  return (
    <div className="flex flex-col items-center gap-8 p-8">

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg px-4 py-3 text-red-200 text-sm max-w-md text-center">
          {error}
        </div>
      )}

  

      {/* Main Call Button */}
      <div className="relative">
        <button
          onClick={handleStartCall}
          disabled={isDisabled}
          aria-label={isConnected ? 'Stop call' : 'Start voice chat'}
          className={cn(
            'relative w-[88px] h-[88px] md:w-[104px] md:h-[104px] rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
            isConnected
              ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30'
              : 'bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/30'
          )}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {isConnecting ? (
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            ) : isConnected ? (
              <Square className="w-8 h-8 text-white" />
            ) : (
              <Mic className="w-8 h-8 text-white" />
            )}
          </div>
          {isConnected && <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-20" />}
        </button>

        {isSpeaking && (
          <div className="absolute -inset-4 rounded-full border-2 border-blue-400 animate-pulse" />
        )}
      </div>



      {/* Connection Status */}
      <div className="flex items-center gap-4">
        <ConnectionStatusComponent status={status} />
        {isSpeaking && (
          <div className="flex items-center gap-2 text-white/80">
            <div className="w-2 h-2 rounded-full animate-pulse bg-blue-400" />
            <span className="text-sm">AI is speaking...</span>
          </div>
        )}
      </div>
      {/* Voice selection UI removed; voice is chosen per persona. */}

    </div>
  );
}
