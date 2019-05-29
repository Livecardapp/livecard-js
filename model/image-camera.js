import { WebcamImageRecorder } from '../lib/webcam';
import FlashCamera from '../lib/flashcam';

class ImageCameraModel {
  constructor() {
    this.isNative = true;
    this.camera = null;
  }

  async initNative() {
    if (this.camera !== null)
      return Promise.resolve({ created: false, stream: this.isNative ? window.stream : null });

    try {
      this.camera = new WebcamImageRecorder();
      const stream = await this.camera.init();
      this.isNative = true;
      console.log('Native webcam initialized');
      return Promise.resolve({ created: true, stream });
    } catch (error) {
      this.camera = null;
      this.isNative = true;
      return Promise.reject();
    }
  }

  initFlash(flashCameraId, flashViewId) {
    if (this.camera !== null) return;
    this.isNative = false;
    this.camera = new FlashCamera(flashCameraId);
    this.camera.init(flashViewId);
    console.log('Flash webcam initialized');
  }

  stageDataForUpload() {
    if (!this.isNative) return;
    this.camera.streamStop();
  }

  remove() {
    this.camera.remove();
  }
}

export default ImageCameraModel;