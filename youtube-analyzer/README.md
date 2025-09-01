# YouTube Analyzer

YouTube Analyzer is a Node.js service that allows users to analyze YouTube videos. The service captures a thumbnail, downloads audio, converts it to text with timestamps, and analyzes AI probability for each sentence.

## Features

- Submit YouTube URLs via a web form or REST API.
- Capture a thumbnail of the video.
- Download audio and convert it to WAV format.
- Transcribe audio with timestamps and speaker diarization.
- Analyze sentences with GPTZero and append AI probability.

## Requirements

- **Node.js** (v14 or higher)
- **FFmpeg** (installed and added to PATH)
- **Docker** (optional, for containerized deployment)

## Setup Instructions
**Configure environment variables:**
   Create a `.env` file from `.env.example` and fill in the required values:
   - `ELEVENLABS_API_KEY`: API key for ElevenLabs Scribe.
   - `GPTZERO_API_KEY`: API key for GPTZero.
   - `PORT`: Port for the server to listen on (default: 8080).

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hau1605/SpeedForce.git
   cd SpeedForce/youtube-analyzer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the application:**
   ```bash
   npm start
   ```


## Run with Docker

1. Build and run the container:
   ```bash
   docker-compose up --build
   ```

2. Access the application at `http://0.0.0.0:8080`.

## Deployment
The original requirement was: Deploys on a small GCE VM, binding to 0.0.0.0:8080; document the firewall rule and an SSH port-forward fallback.

I could not perform this requirement because I do not have access to a Google Cloud account.
Instead, I have deployed the application on Render: `https://your-app-name.onrender.com`


## Note about GPTZeroService

Currently, in the `gptZeroService.js` file, the `getAiProbability` function is **mocked** (fake) because I do not have a `GPTZERO_API_KEY`. If you have a `GPTZERO_API_KEY`, use the `getAiProbability` function that is commented out in the file.

## Sample Output

Generated results will be stored in the `storage` directory:
- Audio: `storage/audio/sample_audio.mp3`, `storage/audio/sample_audio.wav`
- JSON transcript: `storage/result/sample_result.json`
- Thumbnail image: `storage/thumbnails/sample_thumbnail.jpg`
