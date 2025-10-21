import type { ConnectionStatus } from '@/types/realtime';

export class RealtimeSDKClient {
  private session: any = null;
  private agent: any = null;
  private status: ConnectionStatus = 'disconnected';
  private onStatusChange?: (status: ConnectionStatus) => void;
  private onError?: (error: string) => void;

  async connect(apiKey: string, voice: string = 'alloy'): Promise<void> {
    try {
      this.setStatus('connecting');
      
      // Dynamic import to avoid server-side bundling issues
      const { RealtimeAgent, RealtimeSession } = await import('@openai/agents-realtime');
      
      // Create agent with voice configuration
      this.agent = new RealtimeAgent({
        name: 'Assistant',
        instructions: 'You are a helpful AI assistant with real-time voice capabilities. You can have natural conversations and respond to voice input. Keep your responses conversational and engaging. You can discuss topics like React Native, Expo, web development, and general programming concepts.',
        voice: voice,
      });

      // Create session with agent
      this.session = new RealtimeSession(this.agent, {
        model: 'gpt-4o-realtime-preview-2024-10-01',
      });

      // Connect with ephemeral key
      await this.session.connect({ apiKey });
      
      this.setStatus('connected');
      console.log('Connected to OpenAI Realtime API via WebRTC');
      console.log('Audio input/output handled automatically by SDK');
      
    } catch (error) {
      console.error('Connection error:', error);
      this.setStatus('error');
      this.onError?.(error instanceof Error ? error.message : 'Connection failed');
    }
  }

  disconnect(): void {
    if (this.session) {
      this.session.disconnect();
      this.session = null;
    }
    if (this.agent) {
      this.agent = null;
    }
    this.setStatus('disconnected');
    console.log('Disconnected from OpenAI Realtime API');
  }

  setOnStatusChange(callback: (status: ConnectionStatus) => void): void {
    this.onStatusChange = callback;
  }

  setOnError(callback: (error: string) => void): void {
    this.onError = callback;
  }

  private setStatus(status: ConnectionStatus): void {
    this.status = status;
    this.onStatusChange?.(status);
  }

  get currentStatus(): ConnectionStatus {
    return this.status;
  }

  get isConnected(): boolean {
    return this.status === 'connected' && this.session !== null;
  }
}
