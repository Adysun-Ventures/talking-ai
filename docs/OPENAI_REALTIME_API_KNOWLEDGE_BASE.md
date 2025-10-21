# OpenAI Realtime API Knowledge Base

## 📚 Overview

This document contains comprehensive information about implementing OpenAI's Realtime API in Next.js applications, based on official documentation and best practices.

## 🔗 Official Documentation Links

- [OpenAI Realtime API Guide](https://platform.openai.com/docs/guides/realtime)
- [Realtime WebRTC Guide](https://platform.openai.com/docs/guides/realtime-webrtc)
- [Realtime WebSocket Guide](https://platform.openai.com/docs/guides/realtime-websocket)
- [Realtime SIP Guide](https://platform.openai.com/docs/guides/realtime-sip)
- [Realtime Models & Prompting](https://platform.openai.com/docs/guides/realtime-models-prompting)
- [Realtime Conversations](https://platform.openai.com/docs/guides/realtime-conversations)
- [Realtime Server Controls](https://platform.openai.com/docs/guides/realtime-server-controls)
- [Realtime Transcription](https://platform.openai.com/docs/guides/realtime-transcription)
- [Voice Agents Quickstart](https://openai.github.io/openai-agents-js/guides/voice-agents/quickstart/)

## 🏗️ Architecture Overview

### Transport Layers

1. **WebRTC** (Recommended for browsers)
   - Low-latency audio streaming
   - Automatic microphone/speaker handling
   - Best for real-time voice applications

2. **WebSocket** (Alternative for browsers)
   - Manual audio handling required
   - More control over audio processing
   - Requires custom audio implementation

3. **SIP** (For telephony integration)
   - Traditional phone system integration
   - Enterprise use cases

## 🔐 Authentication Methods

### 1. Ephemeral Tokens (Recommended)

**Endpoint**: `POST https://api.openai.com/v1/realtime/client_secrets`

```bash
curl -X POST https://api.openai.com/v1/realtime/client_secrets \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "session": {
      "type": "realtime",
      "model": "gpt-4o-realtime-preview-2024-10-01"
    }
  }'
```

**Response**:
```json
{
  "value": "ek_..." // Ephemeral key starting with 'ek_'
}
```

### 2. Direct API Key (Less Secure)

```javascript
// WebSocket with API key in URL
const ws = new WebSocket(
  `wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01&client_secret=${apiKey}`
);
```

## 🎯 Implementation Approaches

### Approach A: Official SDK (Recommended)

```javascript
import { RealtimeAgent, RealtimeSession } from '@openai/agents/realtime';

const agent = new RealtimeAgent({
  name: 'Assistant',
  instructions: 'You are a helpful assistant.',
});

const session = new RealtimeSession(agent, {
  model: 'gpt-4o-realtime-preview-2024-10-01',
});

await session.connect({
  apiKey: 'ek_...' // Ephemeral key
});
```

### Approach B: Custom WebSocket Implementation

```javascript
// 1. Generate ephemeral token
const response = await fetch('/api/session');
const { token } = await response.json();

// 2. Connect WebSocket
const ws = new WebSocket(
  `wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01&client_secret=${token}`
);

// 3. Handle events
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Handle different event types
};
```

## 📡 Event Types

### Session Events
- `session.created` - Session established
- `session.updated` - Session configuration updated

### Input Audio Events
- `input_audio_buffer.speech_started` - User started speaking
- `input_audio_buffer.speech_stopped` - User stopped speaking
- `input_audio_buffer.committed` - Audio buffer committed

### Output Audio Events
- `output_audio_buffer.speech_started` - AI started speaking
- `output_audio_buffer.speech_stopped` - AI stopped speaking
- `response.audio.delta` - Audio chunk received
- `response.audio.done` - Audio response complete

### Response Events
- `response.done` - Response generation complete
- `response.create` - Trigger AI response

## 🔄 Message Flow

```
1. Connect WebSocket → session.created
2. Send session.update → session.updated
3. Create input_audio_buffer → buffer created
4. Send input_audio_buffer.append (continuously)
5. When user stops → input_audio_buffer.commit
6. Send response.create → AI starts generating
7. Receive response.audio.delta → Play audio
8. Receive response.audio.done → Response complete
```

## 🎤 Audio Configuration

### Audio Format
- **Format**: PCM16
- **Sample Rate**: 24000 Hz
- **Channels**: 1 (mono)
- **Encoding**: Base64

### Web Audio API Setup
```javascript
const audioContext = new AudioContext({ sampleRate: 24000 });
const mediaStream = await navigator.mediaDevices.getUserMedia({
  audio: {
    sampleRate: 24000,
    channelCount: 1,
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  }
});
```

## 🛠️ Next.js Implementation

### 1. API Route for Ephemeral Tokens

```typescript
// app/api/session/route.ts
export async function GET() {
  const response = await fetch('https://api.openai.com/v1/realtime/client_secrets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session: {
        type: 'realtime',
        model: 'gpt-4o-realtime-preview-2024-10-01'
      }
    })
  });

  const data = await response.json();
  return NextResponse.json({ token: data.value });
}
```

### 2. Client-Side Connection

```typescript
// lib/realtime-client.ts
export class RealtimeClient {
  private ws: WebSocket | null = null;

  async connect(session: RealtimeSession) {
    const wsUrl = `wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01&client_secret=${session.token}`;
    this.ws = new WebSocket(wsUrl);
    
    this.ws.onopen = () => {
      this.sendSessionConfig();
      this.startConversation();
    };
  }
}
```

## 🐛 Common Issues & Solutions

### Issue 1: "Missing bearer or basic authentication"
**Cause**: Incorrect WebSocket authentication
**Solution**: Use ephemeral tokens in URL parameter

### Issue 2: Bot doesn't respond to voice
**Cause**: Missing conversation start or incorrect event handling
**Solution**: 
- Auto-start conversation after WebSocket connects
- Handle `input_audio_buffer.speech_stopped` event
- Send `response.create` to trigger AI response

### Issue 3: Audio not playing
**Cause**: Incorrect audio format or Web Audio API setup
**Solution**: 
- Use PCM16 format at 24kHz
- Properly decode base64 audio data
- Use AudioContext for playback

### Issue 4: Microphone permission denied
**Cause**: HTTPS required for microphone access
**Solution**: 
- Use HTTPS in production
- Handle permission errors gracefully
- Request permission on user interaction

## 🔧 Debugging Tips

### 1. Enable Comprehensive Logging
```javascript
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('WebSocket message:', data.type, data);
};
```

### 2. Check Audio Capture
```javascript
// Verify microphone is working
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => console.log('Microphone access granted'))
  .catch(err => console.error('Microphone access denied:', err));
```

### 3. Monitor WebSocket Connection
```javascript
ws.onopen = () => console.log('WebSocket connected');
ws.onclose = (event) => console.log('WebSocket closed:', event.code, event.reason);
ws.onerror = (error) => console.error('WebSocket error:', error);
```

## 📦 Dependencies

### Core Dependencies
```json
{
  "openai": "^4.67.3",
  "next": "^14.2.5",
  "react": "^18.3.1",
  "typescript": "^5.5.3"
}
```

### Optional: Official SDK
```json
{
  "@openai/agents": "^0.1.0",
  "@openai/agents-realtime": "^0.1.0"
}
```

## 🚀 Production Considerations

### Security
- Never expose API keys in client-side code
- Use ephemeral tokens with short expiration
- Implement rate limiting
- Add authentication/authorization

### Performance
- Use WebRTC for lower latency
- Implement audio buffering
- Handle network interruptions
- Add reconnection logic

### Browser Compatibility
- Chrome 66+
- Firefox 60+
- Safari 14.1+
- Edge 79+

## 📝 Example Implementations

### Next.js Starter Template
- [OpenAI Realtime API Next.js](https://github.com/cameronking4/openai-realtime-api-nextjs)
- Features: WebRTC, shadcn/ui, tool-calling, localization

### Integration Guides
- [Building Real-Time Voice Assistant](https://wickd.ninja/blog/building-a-real-time-voice-to-voice-assistant)
- [Next.js OpenAI Integration](https://www.averagedevs.com/blog/integrate-openai-api-nextjs)

## 🔄 Updates & Changes

This knowledge base is updated based on:
- Official OpenAI documentation
- Community feedback and issues
- Best practices from production implementations
- Latest API changes and features

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Maintainer**: Development Team
