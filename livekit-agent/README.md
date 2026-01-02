# LiveKit Interview Agent

AI-powered voice interview agent using LiveKit + Gemini Live API.

## Architecture

```
┌─────────────────┐     WebRTC      ┌─────────────────┐
│   Frontend      │◄───────────────►│  LiveKit Cloud  │
│   (Browser)     │                 │  (WebRTC SFU)   │
└─────────────────┘                 └────────┬────────┘
                                             │
                                             │ WebSocket
                                             ▼
                                    ┌─────────────────┐
                                    │  LiveKit Agent  │
                                    │  (This Server)  │
                                    └────────┬────────┘
                                             │
                                             │ WebSocket
                                             ▼
                                    ┌─────────────────┐
                                    │  Gemini Live    │
                                    │      API        │
                                    └─────────────────┘
```

## Prerequisites

1. **Node.js 20+** installed
2. **LiveKit Cloud Account** (free tier: 1,000 mins/month)
   - Sign up at https://cloud.livekit.io
3. **Google API Key** for Gemini
   - Get from https://aistudio.google.com/apikey

## Setup

### 1. Install Dependencies

```bash
cd livekit-agent
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret
GOOGLE_API_KEY=your_gemini_api_key
```

### 3. Run Locally (Development)

```bash
npm run dev
```

### 4. Test with LiveKit Playground

1. Go to https://agents-playground.livekit.io
2. Connect to your LiveKit project
3. The agent should automatically join and start the interview

## Deployment on Google Compute Engine

### 1. Create VM Instance

```bash
gcloud compute instances create livekit-agent \
  --machine-type=e2-micro \
  --zone=us-central1-a \
  --image-family=ubuntu-2204-lts \
  --image-project=ubuntu-os-cloud \
  --tags=livekit-agent
```

### 2. SSH into VM

```bash
gcloud compute ssh livekit-agent --zone=us-central1-a
```

### 3. Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 4. Clone and Setup

```bash
git clone <your-repo-url>
cd career-advisor/livekit-agent
npm install
cp .env.example .env.local
nano .env.local  # Edit with your credentials
```

### 5. Run with PM2 (Process Manager)

```bash
sudo npm install -g pm2
pm2 start src/agent.js --name interview-agent
pm2 save
pm2 startup
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `LIVEKIT_URL` | LiveKit Cloud WebSocket URL |
| `LIVEKIT_API_KEY` | LiveKit API Key |
| `LIVEKIT_API_SECRET` | LiveKit API Secret |
| `GOOGLE_API_KEY` | Gemini API Key (from AI Studio) |

## Troubleshooting

### Agent not connecting
- Verify LiveKit credentials are correct
- Check if VM firewall allows outbound WebSocket connections

### Audio issues
- Gemini Live handles audio natively - no additional processing needed
- WebRTC ensures low-latency, high-quality audio

### Agent crashes
- Check logs: `pm2 logs interview-agent`
- Ensure Node.js 20+ is installed
