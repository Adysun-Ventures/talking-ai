export interface RealtimeSession {
  id: string;
  token: string;
  expires_at: number;
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
  { id: 'alloy', name: 'Alloy', description: 'Neutral, balanced tone' },
  { id: 'echo', name: 'Echo', description: 'Warm, friendly voice' },
  { id: 'fable', name: 'Fable', description: 'Expressive, storytelling voice' },
  { id: 'onyx', name: 'Onyx', description: 'Deep, authoritative voice' },
  { id: 'nova', name: 'Nova', description: 'Bright, energetic voice' },
  { id: 'shimmer', name: 'Shimmer', description: 'Soft, gentle voice' },
];
