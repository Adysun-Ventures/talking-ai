import type { ConnectionStatus } from '@/types/realtime';

export class RealtimeFallbackClient {
  private status: ConnectionStatus = 'disconnected';
  private onStatusChange?: (status: ConnectionStatus) => void;
  private onError?: (error: string) => void;

  async connect(apiKey: string, voice: string = 'alloy'): Promise<void> {
    try {
      this.setStatus('connecting');
      
      // For now, show a message that the feature is in development
      console.log('Realtime Voice AI - Development Mode');
      console.log('This feature requires the OpenAI Agents SDK which is currently in beta.');
      console.log('For production use, please implement with the official SDK when available.');
      
      // Simulate connection for demo purposes
      setTimeout(() => {
        this.setStatus('connected');
        console.log('Demo mode: Voice AI simulation active');
      }, 1000);
      
    } catch (error) {
      console.error('Connection error:', error);
      this.setStatus('error');
      this.onError?.(error instanceof Error ? error.message : 'Connection failed');
    }
  }

  disconnect(): void {
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
    return this.status === 'connected';
  }
}
