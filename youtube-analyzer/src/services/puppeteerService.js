import puppeteer from "puppeteer";

class PuppeteerService {
  async launchBrowser() {
    this.browser = await puppeteer.launch({ headless: true });
    this.page = await this.browser.newPage();
  }

  async loadYouTubePage(url) {
    await this.page.goto(url, { waitUntil: "networkidle2" });
  }

  async verifyPlayback() {
    return this.page.evaluate(() => {
      const video = document.querySelector("video");
      return video && !video.paused && !video.ended;
    });
  }

  async takeThumbnailScreenshot(resultId) {
    const screenshotPath = `storage/thumbnails/${resultId}.jpg`;
    await this.page.screenshot({ path: screenshotPath, fullPage: false });
    return screenshotPath;
  }

  async closeBrowser() {
    await this.browser.close();
  }
}

export default PuppeteerService;
