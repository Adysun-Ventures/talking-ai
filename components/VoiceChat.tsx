'use client';

import { useState, useEffect, useRef } from 'react';
import { RealtimeClient } from '@/lib/realtime-client';
import type { ConnectionStatus } from '@/types/realtime';
import ConnectionStatusComponent from './ConnectionStatus';
import VoiceSelector from './VoiceSelector';
import { cn } from '@/lib/utils';

export default function VoiceChat() {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [selectedVoice, setSelectedVoice] = useState('alloy');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const realtimeClientRef = useRef<RealtimeClient | null>(null);

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
      // Init client
      const client = new RealtimeClient();
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

  const handleVoiceChange = (voiceId: string) => {
    setSelectedVoice(voiceId);
    // Reconnect to apply new voice
    if (status === 'connected') handleStopCall();
  };

  const isConnected = status === 'connected';
  const isDisabled = isConnecting || status === 'connecting';

  return (
    <div className="flex flex-col items-center gap-8 p-8">
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

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg px-4 py-3 text-red-200 text-sm max-w-md text-center">
          {error}
        </div>
      )}

      {/* Voice Selector */}
      <VoiceSelector
        selectedVoice={selectedVoice}
        onVoiceChange={handleVoiceChange}
        disabled={isDisabled}
      />

      {/* Main Call Button */}
      <div className="relative">
        <button
          onClick={handleStartCall}
          disabled={isDisabled}
          className={cn(
            'relative w-24 h-24 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
            isConnected
              ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30'
              : 'bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/30'
          )}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {isConnecting ? (
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isConnected ? (
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h12v12H6z" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
            )}
          </div>
          {isConnected && <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-20" />}
        </button>

        {isSpeaking && (
          <div className="absolute -inset-4 rounded-full border-2 border-blue-400 animate-pulse" />
        )}
      </div>

      <div className="text-center text-white/80 max-w-md">
        {isConnected ? <p>Click the button to stop the call</p> : <p>Click the button to start a voice conversation with AI</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-white/70 text-sm">
        <div className="bg-white/5 rounded-lg p-4">
          <div className="font-medium text-white mb-1">Real-time</div>
          <div>Low-latency voice chat</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <div className="font-medium text-white mb-1">Interrupt</div>
          <div>Speak anytime to interrupt</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <div className="font-medium text-white mb-1">Multiple Voices</div>
          <div>Choose from 6 different voices</div>
        </div>
      </div>
    </div>
  );
}
