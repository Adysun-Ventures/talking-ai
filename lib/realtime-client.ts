import type { ConnectionStatus } from '@/types/realtime';

export class RealtimeClient {
  private status: ConnectionStatus = 'disconnected';
  private onStatusChange?: (status: ConnectionStatus) => void;
  private onError?: (error: string) => void;
  private onSpeakingChange?: (isSpeaking: boolean) => void;
  
  private peerConnection: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private isSpeaking: boolean = false;
  private currentVoice: string = 'alloy';

  async connect(voice: string = 'alloy'): Promise<void> {
    try {
      this.setStatus('connecting');
      this.currentVoice = voice;
      
      console.log('Connecting to OpenAI Realtime API...');
      
      // Create peer connection with proper ICE servers
      this.peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      });

      // Get user media with proper audio constraints
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 24000,
          channelCount: 1
        } 
      });

      // Add audio tracks to peer connection
      this.mediaStream.getTracks().forEach(track => {
        this.peerConnection!.addTrack(track, this.mediaStream!);
      });

      // Create data channel for OpenAI events
      this.dataChannel = this.peerConnection.createDataChannel('oai-events');
      this.setupDataChannelHandlers();

      // Handle incoming audio stream
      this.peerConnection.ontrack = (event) => {
        console.log('Received audio track from OpenAI');
        this.setupAudioOutput(event.streams[0]);
      };

      // Handle connection state changes
      this.peerConnection.onconnectionstatechange = () => {
        console.log('Connection state:', this.peerConnection?.connectionState);
        if (this.peerConnection?.connectionState === 'connected') {
          this.setStatus('connected');
        } else if (this.peerConnection?.connectionState === 'failed') {
          this.setStatus('error');
          this.onError?.('WebRTC connection failed');
        }
      };

      // Handle ICE connection state
      this.peerConnection.oniceconnectionstatechange = () => {
        console.log('ICE connection state:', this.peerConnection?.iceConnectionState);
      };

      // Create and send SDP offer
      const offer = await this.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: false
      });
      await this.peerConnection.setLocalDescription(offer);

      // Send offer to server which proxies to OpenAI using unified interface
      const response = await fetch(`/api/realtime?voice=${encodeURIComponent(this.getVoiceId())}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/sdp',
        },
        body: offer.sdp!,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Realtime API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      // Set remote description with answer
      const answerSdp = await response.text();
      const answer: RTCSessionDescriptionInit = {
        type: 'answer',
        sdp: answerSdp
      };
      await this.peerConnection.setRemoteDescription(answer);

      console.log('WebRTC connection established with OpenAI Realtime API');
      
    } catch (error) {
      console.error('Connection error:', error);
      this.setStatus('error');
      this.onError?.(error instanceof Error ? error.message : 'Connection failed');
    }
  }

  private setupDataChannelHandlers(): void {
    if (!this.dataChannel) return;

    this.dataChannel.onopen = () => {
      console.log('Data channel opened');
      
      // Mark as connected when data channel is ready
      this.setStatus('connected');

      // Send minimal session configuration; include required session.type
      const config = {
        type: 'session.update',
        session: {
          type: 'realtime',
          instructions: [
            "You are 'Einstein Bot' — an AI statue that answers scientific questions.",
            "Audience: Children and teenagers aged 8 to 18.",
            "Supported languages: English, Hindi, Marathi only.",
            "Default language: Start every conversation in English.",
            "If user replies in Hindi or Marathi, continue in that same language.",
            "Tone: Friendly, intelligent, respectful, and age-appropriate.",
            "Answer style: Simple, clear, and short — like explaining to students.",
            "Always explain in layman terms, avoid jargon and long explanations.",
            "Responses must be precise and accurate; avoid open-ended answers.",
            "Use minimal words, 2–4 lines max per reply.",
            "Adapt tone to match the user's tone but maintain politeness and decency.",
            "Never respond in any other language except English, Hindi, or Marathi.",
            "If question is outside science, politely say: 'I only talk about science topics.'",
            "Never use slang, sarcasm, or controversial remarks.",
            "Maintain factual accuracy in all responses."
          ].join('\n')
        }
      };

      if (this.dataChannel) {
        this.dataChannel.send(JSON.stringify(config));
        // Optional: trigger a brief English welcome aligned with Einstein Bot policy
        const greet = {
          type: 'response.create',
          response: {
            instructions: "Hello! I'm Einstein Bot. Ask me any science question."
          }
        };
        this.dataChannel.send(JSON.stringify(greet));
      }
    };

    this.dataChannel.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleRealtimeEvent(data);
      } catch (error) {
        console.error('Error parsing data channel message:', error);
      }
    };

    this.dataChannel.onerror = (error) => {
      console.error('Data channel error:', error);
      this.onError?.('Data channel error');
    };
  }

  private handleRealtimeEvent(event: any): void {
    console.log('Realtime event:', event.type);
    
    switch (event.type) {
      case 'session.created':
        console.log('Session created successfully');
        break;
      case 'response.audio.delta':
        // Legacy name; keep for compatibility
        this.handleAudioDelta(event.delta);
        break;
      case 'response.output_audio_transcript.delta':
        // Transcript is streaming; consider AI as speaking
        this.setSpeaking(true);
        break;
      case 'response.output_audio.done':
        // Output audio finished
        this.setSpeaking(false);
        break;
      case 'output_audio_buffer.stopped':
        // Buffering stopped indicates end of speech
        this.setSpeaking(false);
        break;
      case 'output_audio_buffer.started':
        // Buffering started; AI is speaking
        this.setSpeaking(true);
        break;
      case 'conversation.item.input_audio_buffer.speech_started':
        console.log('User started speaking');
        break;
      case 'conversation.item.input_audio_buffer.speech_stopped':
        console.log('User stopped speaking');
        break;
      case 'error':
        console.error('Realtime API error:', event.error);
        this.onError?.(event.error.message || 'Unknown error');
        break;
      default:
        console.log('Unhandled event type:', event.type);
    }
  }

  private handleAudioDelta(delta: string): void {
    // Convert base64 audio to audio buffer and play
    if (this.audioContext && delta) {
      try {
        const audioData = atob(delta);
        const audioBuffer = new ArrayBuffer(audioData.length);
        const view = new Uint8Array(audioBuffer);
        for (let i = 0; i < audioData.length; i++) {
          view[i] = audioData.charCodeAt(i);
        }
        
        this.audioContext.decodeAudioData(audioBuffer).then(buffer => {
          const source = this.audioContext!.createBufferSource();
          source.buffer = buffer;
          source.connect(this.audioContext!.destination);
          source.start();
        }).catch(error => {
          console.error('Error decoding audio:', error);
        });
      } catch (error) {
        console.error('Error playing audio delta:', error);
      }
    }
  }

  private setupAudioOutput(stream: MediaStream): void {
    // Use a single playback path to avoid echo (no double routing)
    this.audioElement = document.createElement('audio');
    this.audioElement.srcObject = stream;
    this.audioElement.autoplay = true;
    this.audioElement.volume = 1.0;
    // Inline playback hint for iOS via attribute
    this.audioElement.setAttribute('playsinline', 'true');

    // If you need WebAudio processing later, ensure the <audio> is muted
    // and only route through AudioContext (do not do both).
  }

  private setSpeaking(speaking: boolean): void {
    this.isSpeaking = speaking;
    this.onSpeakingChange?.(speaking);
  }

  private getVoiceId(): string {
    // Map voice names to OpenAI voice IDs
    const voiceMap: { [key: string]: string } = {
      'alloy': 'alloy',
      'ash': 'ash',
      'ballad': 'ballad',
      'coral': 'coral',
      'echo': 'echo',
      'sage': 'sage',
      'shimmer': 'shimmer',
      'verse': 'verse',
      'marin': 'marin',
      'cedar': 'cedar'
    };
    return voiceMap[this.currentVoice] || 'alloy';
  }

  disconnect(): void {
    console.log('Disconnecting from OpenAI Realtime API...');
    
    if (this.dataChannel) {
      this.dataChannel.close();
      this.dataChannel = null;
    }
    
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement = null;
    }
    
    this.setStatus('disconnected');
    this.setSpeaking(false);
  }

  setOnStatusChange(callback: (status: ConnectionStatus) => void): void {
    this.onStatusChange = callback;
  }

  setOnError(callback: (error: string) => void): void {
    this.onError = callback;
  }

  setOnSpeakingChange(callback: (isSpeaking: boolean) => void): void {
    this.onSpeakingChange = callback;
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

  get speaking(): boolean {
    return this.isSpeaking;
  }
}