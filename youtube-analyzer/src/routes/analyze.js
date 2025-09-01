import express from 'express';
import PuppeteerService from '../services/puppeteerService.js';
import YtdlService from '../services/ytdlService.js';
import FfmpegService from '../services/ffmpegService.js';
import ElevenLabsService from '../services/elevenLabsService.js';
import GptZeroService from '../services/gptZeroService.js';
import * as Storage from '../utils/storage.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const { url } = req.body;
    
    if (!url) {
        return res.status(400).json({ error: 'YouTube URL is required' });
    }

    function getYouTubeId(url) {
        const urlObj = new URL(url);
        return urlObj.searchParams.get("v");
    }
    const videoId = getYouTubeId(url);

    if (Storage.existsJson(`${videoId}`)) {
        console.log(`Result for video ID ${videoId} already exists. Retrieving from storage.`);
        const result = Storage.getJson(`${videoId}`);
        return res.status(200).json({ id: videoId, message: 'Analysis complete', result });
    }

    try {
        const puppeteerService = new PuppeteerService();
        const ytdlService = new YtdlService();
        const ffmpegService = new FfmpegService();
        const elevenLabsService = new ElevenLabsService(process.env.ELEVENLABS_API_KEY);
        const gptZeroService = new GptZeroService();

        console.log(`Start step 1`);
        await puppeteerService.launchBrowser();
        await puppeteerService.loadYouTubePage(url);
        const thumbnailPath = await puppeteerService.takeThumbnailScreenshot(videoId);
        await puppeteerService.closeBrowser();
        console.log(`End step 1`);

        console.log(`Start step 2`);
        const audioPath = await ytdlService.downloadAudio(url, `storage/audio/${videoId}.mp3`);
        console.log(`End step 2`);

        console.log(`Start step 3`);
        const wavPath = await ffmpegService.convertToWav(audioPath, `storage/audio/${videoId}.wav`);
        console.log(`End step 3`);

        console.log(`Start step 4`);
        const transcriptionResult = await elevenLabsService.transcribeAudio(wavPath);
        console.log(`End step 4`);

        console.log(`Start step 5`);
        const analyzedTranscript = await gptZeroService.analyzeSentences(transcriptionResult);
        console.log(`End step 5`);

        console.log(`Start step 6`);
        const result = {
            transcription: {
                id: `${videoId}`,
                videoUrl: `${url}`,
                audioFile: `${audioPath}`,
                screenshot: `${thumbnailPath}`,
                results: [
                    {
                        sentences: analyzedTranscript,
                    },
                ],
            },
        };
        Storage.saveJson(`${videoId}.json`, result);
        console.log('End step 6');

        res.status(200).json({ id: videoId, message: 'Analysis complete' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred during analysis' });
    }
});

export default router;
