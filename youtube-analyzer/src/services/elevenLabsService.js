import fs from "fs";
import FormData from "form-data";
import fetch from "node-fetch";

class ElevenLabsService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.apiUrl =
      "https://api.elevenlabs.io/v1/speech-to-text"; 
  }

  async transcribeAudio(filePath) {
    const formData = new FormData();
    formData.append("model_id", "scribe_v1_experimental"); 
    formData.append("file", fs.createReadStream(filePath));

    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: {
        "xi-api-key": this.apiKey, 
        ...formData.getHeaders(),
      },
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `Error transcribing audio: ${response.status} ${response.statusText} — ${text}`
      );
    }

    const result = await response.json();

    return result;
  }
}
export default ElevenLabsService;
