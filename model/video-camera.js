import { WebcamVideoRecorder } from '../lib/webcam';

class VideoCameraModel {
  constructor() {
    this.type = 0;
    this.recorder = null;
  }

  async init() {
    if (this.recorder !== null) {
      console.log('already initialized');
      const result = this.type === 0 ? { stream: window.stream } : {};
      return Promise.resolve(result);
    }

    // try webcam
    try {
      this.recorder = new WebcamVideoRecorder();
      const stream = await this.recorder.init();
      return Promise.resolve({ stream });
    } catch (error) {
      console.log(`Failed to init webcam - ${error}`);
      return Promise.reject();
    }

    // TODO: try flash cam
  }

  start() {
    this.recorder.recordStart();
  }

  stop() {
    this.recorder.recordStop();
  }

  buffer() {
    return this.recorder.bufferVideo();
  }

  data() {
    return this.recorder.blobs;
  }

  reset() {
    this.recorder.reset();
  }

  remove() {
    if (this.recorder === null) return;
    this.recorder.webcamRemove();
  }

  stageVideoForUpload() {
    this.recorder.streamStop();
    return this.recorder.hasData();
  }
}

export default VideoCameraModel;