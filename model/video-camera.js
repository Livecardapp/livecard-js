import { WebcamVideoRecorder } from '../lib/webcam';
import { FlashVideoRecorder } from '../lib/flashcam';

class VideoCameraModel {
  constructor() {
    this.isNative = true;
    this.camera = null;
  }

  async initNative() {
    if (this.camera !== null) {
      console.log('already initialized');
      const result = { created: false, stream: this.isNative ? window.stream : null };
      return Promise.resolve(result);
    }
    try {
      this.camera = new WebcamVideoRecorder();
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

  start() {
    this.camera.recordStart();
  }

  stop() {
    this.camera.recordStop();
  }

  buffer() {
    return this.camera.bufferVideo();
  }

  data() {
    return this.camera.blobs;
  }

  reset() {
    this.camera.reset();
  }

  remove() {
    if (this.camera === null) return;
    this.camera.webcamRemove();
  }

  stageVideoForUpload() {
    this.camera.streamStop();
    return this.camera.hasData();
  }
}

export default VideoCameraModel;