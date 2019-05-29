import { WebcamVideoRecorder } from '../lib/webcam';
import { FlashCamera } from '../lib/flashcam';

class VideoCameraModel {
  constructor() {
    this.isNative = true;
    this.camera = null;
  }

  async initNative() {
    if (this.camera !== null)
      return Promise.resolve({ created: false, stream: this.isNative ? window.stream : null });

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
    this.camera = new FlashCamera(flashCameraId);
    this.camera.init(flashViewId);
    console.log('Flash webcam initialized');
  }

  streamName() {
    return this.isNative ? null : this.camera.streamName();
  }

  start() {
    this.camera.recordStart();
  }

  stop() {
    this.camera.recordStop();
  }

  buffer() {
    return this.isNative ? this.camera.bufferVideo() : null;
  }

  data() {
    return this.camera.blobs;
  }

  reset() {
    this.camera.reset();
  }

  remove() {
    if (this.camera === null) return;
    this.camera.remove();
    this.camera = null;
  }

  stageDataForUpload() {
    if (this.isNative) this.camera.streamStop();
    return this.camera.hasData();
  }
}

export default VideoCameraModel;