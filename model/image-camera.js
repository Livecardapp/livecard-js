import { WebcamImageRecorder } from '../lib/webcam';

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
      return Promise.resolve({ created: true, stream });
    } catch (error) {
      console.log('Failed to init native webcam');
      this.camera = null;
      this.isNative = true;
      return Promise.reject();
    }
  }

  initFlash(flashCameraId, flashViewId) {
    if (this.camera !== null) return;
    this.isNative = false;
    this.camera = new FlashVideoRecorder(flashCameraId);
    this.camera.init(flashViewId);
    console.log('Flash webcam initialized');
  }

  stageDataForUpload() {
    this.camera.streamStop();
  }

  remove() {
    this.camera.remove();
  }
}

export default ImageCameraModel;