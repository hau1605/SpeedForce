import fs from "fs";
import ytdl from "@distube/ytdl-core";

class YtdlService {
  downloadAudio(url, outputPath) {
    return new Promise((resolve, reject) => {
      const stream = ytdl(url, { quality: "highestaudio" });
      const fileStream = fs.createWriteStream(outputPath);

      stream.pipe(fileStream);

      stream.on("end", () => {
        resolve(outputPath);
      });

      stream.on("error", (error) => {
        reject(error);
      });
    });
  }
}

export default YtdlService;
