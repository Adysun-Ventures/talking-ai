'use client';

import { useState, useEffect, useRef } from 'react';
import { VOICE_OPTIONS, VoiceOption } from '@/types/realtime';
import { cn } from '@/lib/utils';

interface VoiceSelectorProps {
  selectedVoice: string;
  onVoiceChange: (voiceId: string) => void;
  disabled?: boolean;
}

export default function VoiceSelector({ 
  selectedVoice, 
  onVoiceChange, 
  disabled = false 
}: VoiceSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (rootRef.current && !rootRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    document.addEventListener('keydown', handleKey);

    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen]);

  const selectedVoiceOption = VOICE_OPTIONS.find(voice => voice.id === selectedVoice);

  return (
    <div ref={rootRef} className="relative">
      {/* Voice Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "min-w-[160px] flex items-center justify-between gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-lg text-white text-sm transition-colors duration-150 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed",
          isOpen && "bg-white/20"
        )}
      >
        <span className="font-medium">{selectedVoiceOption?.name || 'Select Voice'}</span>
        <svg 
          className={cn(
            "w-4 h-4 transition-transform duration-150",
            isOpen && "rotate-180"
          )} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Voice Options Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-lg overflow-auto max-h-60 z-10">
          {VOICE_OPTIONS.map((voice) => (
            <button
              key={voice.id}
              onClick={() => {
                onVoiceChange(voice.id);
                setIsOpen(false);
              }}
              className={cn(
                "w-full px-3 py-2 text-left text-white text-sm transition-colors duration-150 hover:bg-white/20 flex items-center gap-3",
                selectedVoice === voice.id && "bg-white/20"
              )}
            >
              <div className={cn(
                "w-2.5 h-2.5 rounded-full",
                selectedVoice === voice.id ? "bg-blue-400" : "bg-white/40"
              )}></div>
              <div>
                <div className="text-sm font-medium">{voice.name}</div>
                <div className="text-xs text-white/70">{voice.description}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
