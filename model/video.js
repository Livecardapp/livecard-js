import WebcamVideoRecorder from '../lib/webcam';

class VideoModel {
  constructor() {
    this.recorder = null;
  }

  async init() {
    // try webcam
    try {
      this.recorder = new WebcamVideoRecorder();
      await this.recorder.init();
      return Promise.resolve();
    } catch(error) {
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
    return this.bufferVideo();
  }

  reset() {
    this.recorder.reset();
  }

  stageVideoForUpload() {
    this.recorder.streamStop();
    return this.recorder.hasData();
  }
}

export default VideoModel;