export class AudioService {
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private processorNode: ScriptProcessorNode | null = null;
  private isRecording = false;
  private audioQueue: Float32Array[] = [];
  private onAudioData?: (audioData: Float32Array) => void;

  async initialize(): Promise<void> {
    try {
      // Request microphone access
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // Create audio context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 24000,
      });

      // Create source node from microphone
      this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);

      // Create processor node for audio processing
      // Note: Using ScriptProcessorNode for compatibility, but AudioWorkletNode is preferred
      this.processorNode = this.audioContext.createScriptProcessor(4096, 1, 1);

      // Connect nodes
      this.sourceNode.connect(this.processorNode);
      this.processorNode.connect(this.audioContext.destination);

      // Handle audio data
      this.processorNode.onaudioprocess = (event) => {
        if (this.isRecording && this.onAudioData) {
          const inputBuffer = event.inputBuffer;
          const inputData = inputBuffer.getChannelData(0);
          this.onAudioData(new Float32Array(inputData));
        }
      };

      console.log('Audio service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize audio service:', error);
      throw error;
    }
  }

  startRecording(onAudioData: (audioData: Float32Array) => void): void {
    if (!this.audioContext || !this.processorNode) {
      throw new Error('Audio service not initialized');
    }

    this.onAudioData = onAudioData;
    this.isRecording = true;
    console.log('Recording started');
  }

  stopRecording(): void {
    this.isRecording = false;
    this.onAudioData = undefined;
    console.log('Recording stopped');
  }

  // Convert Float32Array to PCM16 and then to base64
  convertToPCM16(audioData: Float32Array): string {
    const pcm16 = new Int16Array(audioData.length);
    for (let i = 0; i < audioData.length; i++) {
      pcm16[i] = Math.max(-32768, Math.min(32767, audioData[i] * 32768));
    }
    const uint8Array = new Uint8Array(pcm16.buffer);
    return btoa(String.fromCharCode.apply(null, Array.from(uint8Array)));
  }

  // Play audio from base64 PCM16 data
  async playAudio(base64Data: string): Promise<void> {
    if (!this.audioContext) {
      throw new Error('Audio context not initialized');
    }

    try {
      // Decode base64 to ArrayBuffer
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Convert to Float32Array
      const pcm16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(pcm16.length);
      for (let i = 0; i < pcm16.length; i++) {
        float32[i] = pcm16[i] / 32768;
      }

      // Create audio buffer
      const audioBuffer = this.audioContext.createBuffer(1, float32.length, 24000);
      audioBuffer.copyToChannel(float32, 0);

      // Create buffer source and play
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      source.start();

      console.log('Playing audio chunk');
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }

  async cleanup(): Promise<void> {
    this.stopRecording();

    if (this.processorNode) {
      this.processorNode.disconnect();
      this.processorNode = null;
    }

    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    if (this.audioContext) {
      await this.audioContext.close();
      this.audioContext = null;
    }

    console.log('Audio service cleaned up');
  }

  get isInitialized(): boolean {
    return this.audioContext !== null && this.mediaStream !== null;
  }

  get isCurrentlyRecording(): boolean {
    return this.isRecording;
  }
}
