import { WebcamVideoRecorder } from '../lib/webcam';

class VideoCameraModel {
  constructor() {
    this.camera = null;
  }

  async initNative() {
    if (this.camera !== null)
      return Promise.resolve({ created: false, stream: window.stream });

    try {
      this.camera = new WebcamVideoRecorder();
      const stream = await this.camera.init();
      return Promise.resolve({ created: true, stream });
    } catch (error) {
      console.log('Failed to init native webcam');
      this.camera = null;
      return Promise.reject();
    }
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
    this.camera.remove();
    this.camera = null;
  }

  stageDataForUpload() {
    this.camera.streamStop();
    return this.camera.hasData();
  }
}

export default VideoCameraModel;