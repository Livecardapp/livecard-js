import { WebcamVideoRecorder } from '../lib/webcam';
import { FlashVideoRecorder } from '../lib/flashcam';

class VideoCameraModel {
  constructor() {
    this.isNative = true;
    this.camera = null;
  }

  async init(flashCameraId, flashViewId) {
    if (this.camera !== null) {
      console.log('already initialized');
      const result = { isNative: this.isNative, stream: this.isNative ? window.stream : null };
      return Promise.resolve(result);
    }

    // try webcam

    try {
      this.camera = new WebcamVideoRecorder();
      const stream = await this.camera.init();
      this.isNative = true;
      return Promise.resolve({ isNative: true, stream });
    } catch (error) {
      console.log(`Failed to init webcam - ${error}`);
    }

    // try flashcam

    this.isNative = false;
    this.camera = new FlashVideoRecorder(flashCameraId);
    this.camera.init(flashViewId);
    return Promise.resolve({ isNative: false, stream: null });
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