export interface RealtimeSession {
  token: string;
  expires_at: string;
}

export interface VoiceOption {
  id: string;
  name: string;
  description: string;
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface AudioChunk {
  data: string; // base64 encoded PCM16
  timestamp: number;
}

export interface RealtimeEvent {
  type: string;
  data?: any;
}

export interface SessionConfig {
  model: string;
  voice: string;
  instructions: string;
  input_audio_format: string;
  output_audio_format: string;
  input_audio_transcription: {
    model: string;
  };
  turn_detection: {
    type: string;
    threshold: number;
    prefix_padding_ms: number;
    silence_duration_ms: number;
  };
  tools: any[];
  tool_choice: string;
  temperature: number;
  max_response_output_tokens: number;
}

export const VOICE_OPTIONS: VoiceOption[] = [
  { id: 'alloy', name: 'Alloy', description: 'Balanced, natural tone' },
  { id: 'ash', name: 'Ash', description: 'Soft, calm presence' },
  { id: 'ballad', name: 'Ballad', description: 'Warm, narrative style' },
  { id: 'coral', name: 'Coral', description: 'Bright and friendly' },
  { id: 'echo', name: 'Echo', description: 'Clear, approachable voice' },
  { id: 'sage', name: 'Sage', description: 'Confident, thoughtful' },
  { id: 'shimmer', name: 'Shimmer', description: 'Gentle and smooth' },
  { id: 'verse', name: 'Verse', description: 'Expressive, engaging' },
  { id: 'marin', name: 'Marin', description: 'Crisp, youthful' },
  { id: 'cedar', name: 'Cedar', description: 'Deep, resonant' },
];
