# Real-time Voice AI Application

A web-based real-time voice AI chat application built with Next.js and OpenAI's Realtime API. Experience natural voice conversations with AI using multiple voice options and seamless, low-latency interactions.

## Features

- 🎤 **Real-time Voice Chat** - Low-latency speech-to-speech using OpenAI Realtime API
- 🎭 **Multiple Voice Options** - Choose from 6 different AI voices (alloy, echo, fable, onyx, nova, shimmer)
- ⚡ **Voice Interruption** - Speak anytime to interrupt the AI mid-response
- 🔒 **Secure Sessions** - Ephemeral token generation for secure client-side connections
- 📊 **Connection Status** - Visual feedback for connection states
- 🎨 **Modern UI** - Beautiful gradient backgrounds and smooth animations
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Technology Stack

- **Frontend**: Next.js 14+ (App Router), React 18+, TypeScript
- **Styling**: Tailwind CSS with modern gradient effects
- **Audio**: Web Audio API for microphone access and playback
- **Real-time**: WebSocket connection to OpenAI Realtime API
- **Backend**: Next.js API routes for session token generation

## Getting Started

### Prerequisites

- Node.js 18+ 
- OpenAI API key with Realtime API access

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd realtimeapi-nextjs
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Add your OpenAI API key to `.env.local`:
```
OPENAI_API_KEY=your_openai_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Start a Conversation**: Click the green microphone button to start a voice chat
2. **Select Voice**: Use the voice selector to choose from 6 different AI voices
3. **Interrupt AI**: Speak anytime to interrupt the AI's response
4. **End Call**: Click the red stop button to end the conversation

## Project Structure

```
realtimeapi_nextjs/
├── app/
│   ├── api/
│   │   └── session/
│   │       └── route.ts          # Session token generation
│   ├── page.tsx                   # Main page
│   ├── layout.tsx                 # Root layout
│   └── globals.css                # Global styles
├── components/
│   ├── VoiceChat.tsx              # Main voice chat UI
│   ├── VoiceSelector.tsx          # Voice selection component
│   └── ConnectionStatus.tsx       # Connection indicator
├── lib/
│   ├── realtime-client.ts         # WebSocket client
│   ├── audio-service.ts           # Audio handling
│   └── utils.ts                   # Helper functions
├── types/
│   └── realtime.ts                # TypeScript types
└── README.md
```

## Key Components

### AudioService (`lib/audio-service.ts`)
- Handles microphone permissions and audio input
- Manages audio playback for AI responses
- Converts audio between formats (Float32Array ↔ PCM16 ↔ Base64)

### RealtimeClient (`lib/realtime-client.ts`)
- Manages WebSocket connection to OpenAI Realtime API
- Handles connection lifecycle and reconnection logic
- Processes incoming audio chunks and events
- Implements interruption logic

### VoiceChat (`components/VoiceChat.tsx`)
- Main UI component with connection controls
- Start/stop call functionality
- Error handling and user feedback
- Visual indicators for connection status

## API Routes

### `/api/session` (GET)
Creates a new OpenAI Realtime session and returns an ephemeral token safe for client-side use.

**Response:**
```json
{
  "id": "session_id",
  "token": "ephemeral_token",
  "expires_at": 1234567890
}
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | Your OpenAI API key with Realtime API access |

## Browser Compatibility

- Chrome 66+
- Firefox 60+
- Safari 14.1+
- Edge 79+

**Note**: Requires microphone access and Web Audio API support.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Structure

The application follows Next.js 14 App Router conventions with:
- Server-side API routes for secure token generation
- Client-side components for real-time audio handling
- TypeScript for type safety
- Tailwind CSS for styling

## Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy to your preferred platform (Vercel, Netlify, etc.)

3. Set environment variables in your deployment platform:
   - `OPENAI_API_KEY`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Acknowledgments

- Inspired by OpenAI's Realtime API capabilities
- Built with modern web technologies
- UI/UX inspired by mobile voice chat applications
