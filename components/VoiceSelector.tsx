'use client';

import { useState } from 'react';
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

  const selectedVoiceOption = VOICE_OPTIONS.find(voice => voice.id === selectedVoice);

  return (
    <div className="relative">
      {/* Voice Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white transition-all duration-200 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed",
          isOpen && "bg-white/20"
        )}
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
          <span className="font-medium">{selectedVoiceOption?.name || 'Select Voice'}</span>
        </div>
        <svg 
          className={cn(
            "w-4 h-4 transition-transform duration-200",
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
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden z-10">
          {VOICE_OPTIONS.map((voice) => (
            <button
              key={voice.id}
              onClick={() => {
                onVoiceChange(voice.id);
                setIsOpen(false);
              }}
              className={cn(
                "w-full px-4 py-3 text-left text-white transition-colors duration-200 hover:bg-white/20 flex items-center gap-3",
                selectedVoice === voice.id && "bg-white/20"
              )}
            >
              <div className={cn(
                "w-3 h-3 rounded-full",
                selectedVoice === voice.id ? "bg-blue-400" : "bg-white/40"
              )}></div>
              <div>
                <div className="font-medium">{voice.name}</div>
                <div className="text-sm text-white/70">{voice.description}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
