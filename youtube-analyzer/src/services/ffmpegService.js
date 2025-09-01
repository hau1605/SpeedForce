import ffmpegPath from "ffmpeg-static";
import { spawn } from "child_process";

class FfmpegService {
  constructor() {
    this.ffmpegPath = ffmpegPath;
  }

  convertToWav(inputFilePath, outputFilePath) {
    return new Promise((resolve, reject) => {
      const ffmpeg = spawn(this.ffmpegPath, [
        "-i", inputFilePath,
        "-ar", "16000",
        "-ac", "1",
        "-b:a", "16k",
        outputFilePath,
      ]);

      ffmpeg.on("error", (error) => {
        reject(`FFmpeg error: ${error.message}`);
      });

      ffmpeg.on("close", (code) => {
        if (code === 0) resolve(outputFilePath);
        else reject(`FFmpeg process exited with code: ${code}`);
      });
    });
  }
}

export default FfmpegService;
