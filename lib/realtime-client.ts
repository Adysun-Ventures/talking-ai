import { AudioService } from './audio-service';
import { ConnectionStatus, RealtimeSession, RealtimeEvent } from '@/types/realtime';

export class RealtimeClient {
  private ws: WebSocket | null = null;
  private audioService: AudioService;
  private session: RealtimeSession | null = null;
  private status: ConnectionStatus = 'disconnected';
  private onStatusChange?: (status: ConnectionStatus) => void;
  private onError?: (error: string) => void;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private reconnectDelay = 1000;
  private isConversationStarted = false;

  constructor(audioService: AudioService) {
    this.audioService = audioService;
  }

  async connect(session: RealtimeSession): Promise<void> {
    try {
      this.session = session;
      this.setStatus('connecting');

      // Use WebSocket with ephemeral token in URL (correct approach for browsers)
      const wsUrl = `wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01&client_secret=${session.token}`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.setStatus('connected');
        this.reconnectAttempts = 0;
        this.sendSessionConfig();
        // Auto-start conversation after connection
        setTimeout(() => this.startConversation(), 1000);
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(event);
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        this.setStatus('disconnected');
        this.audioService.stopRecording();
        this.isConversationStarted = false;
        
        // Attempt reconnection if not a clean close
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.attemptReconnect();
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.setStatus('error');
        this.onError?.('Connection error occurred');
      };

    } catch (error) {
      console.error('Failed to connect:', error);
      this.setStatus('error');
      this.onError?.('Failed to establish connection');
    }
  }

  private sendSessionConfig(): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const config = {
      type: 'session.update',
      session: {
        modalities: ['text', 'audio'],
        instructions: 'You are a helpful AI assistant with real-time voice capabilities. You can have natural conversations and respond to voice input. Keep your responses conversational and engaging. You can discuss topics like React Native, Expo, web development, and general programming concepts.',
        voice: 'alloy',
        input_audio_format: 'pcm16',
        output_audio_format: 'pcm16',
        input_audio_transcription: {
          model: 'whisper-1'
        },
        turn_detection: {
          type: 'server_vad',
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 500
        },
        tools: [],
        tool_choice: 'auto',
        temperature: 0.8,
        max_response_output_tokens: 4096
      }
    };

    this.ws.send(JSON.stringify(config));
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);
      console.log('Received message:', data.type, data);
      
      switch (data.type) {
        case 'session.created':
          console.log('Session created:', data.session);
          break;
          
        case 'session.updated':
          console.log('Session updated:', data.session);
          break;
          
        case 'response.audio.delta':
          this.handleAudioDelta(data.delta);
          break;
          
        case 'response.audio.done':
          console.log('Audio response completed');
          break;
          
        case 'response.done':
          console.log('Response completed');
          break;
          
        case 'input_audio_buffer.speech_started':
          console.log('User started speaking');
          break;
          
        case 'input_audio_buffer.speech_stopped':
          console.log('User stopped speaking');
          // Trigger AI response when user stops speaking
          this.triggerResponse();
          break;
          
        case 'input_audio_buffer.committed':
          console.log('User audio committed');
          break;
          
        case 'output_audio_buffer.speech_started':
          console.log('AI started speaking');
          break;
          
        case 'output_audio_buffer.speech_stopped':
          console.log('AI stopped speaking');
          break;
          
        case 'error':
          console.error('Server error:', data.error);
          this.onError?.(data.error.message || 'Unknown error occurred');
          break;
          
        default:
          console.log('Unhandled message type:', data.type);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  }

  private triggerResponse(): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    
    console.log('Triggering AI response...');
    
    // Commit the input audio buffer
    this.ws.send(JSON.stringify({
      type: 'input_audio_buffer.commit'
    }));
    
    // Create a response to trigger AI generation
    this.ws.send(JSON.stringify({
      type: 'response.create',
      response: {
        modalities: ['audio']
      }
    }));
  }

  private handleAudioDelta(delta: string): void {
    // Play the audio chunk
    this.audioService.playAudio(delta).catch(error => {
      console.error('Error playing audio:', error);
    });
  }

  startConversation(): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.onError?.('Not connected to server');
      return;
    }

    if (this.isConversationStarted) {
      console.log('Conversation already started');
      return;
    }

    console.log('Starting conversation...');
    this.isConversationStarted = true;

    // Start audio recording
    this.audioService.startRecording((audioData) => {
      this.sendAudioData(audioData);
    });

    // Create input audio buffer for the conversation
    this.ws.send(JSON.stringify({
      type: 'conversation.item.create',
      item: {
        type: 'input_audio_buffer',
        input_audio_buffer: {
          format: 'pcm16',
          sample_rate: 24000
        }
      }
    }));
  }

  stopConversation(): void {
    this.audioService.stopRecording();
    this.isConversationStarted = false;
    
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'input_audio_buffer.commit'
      }));
    }
  }

  private sendAudioData(audioData: Float32Array): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const pcm16Base64 = this.audioService.convertToPCM16(audioData);
    
    // Send audio data to the input buffer
    this.ws.send(JSON.stringify({
      type: 'input_audio_buffer.append',
      delta: pcm16Base64
    }));
  }

  private attemptReconnect(): void {
    this.reconnectAttempts++;
    console.log(`Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
    
    setTimeout(() => {
      if (this.session) {
        this.connect(this.session);
      }
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  disconnect(): void {
    this.audioService.stopRecording();
    
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    
    this.setStatus('disconnected');
  }

  private setStatus(status: ConnectionStatus): void {
    this.status = status;
    this.onStatusChange?.(status);
  }

  setOnStatusChange(callback: (status: ConnectionStatus) => void): void {
    this.onStatusChange = callback;
  }

  setOnError(callback: (error: string) => void): void {
    this.onError = callback;
  }

  get currentStatus(): ConnectionStatus {
    return this.status;
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}
