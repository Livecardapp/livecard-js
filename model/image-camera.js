import { WebcamImageRecorder } from '../lib/webcam';

class ImageCameraModel {
  constructor() {
    this.camera = null;
  }

  async initNative() {
    if (this.camera !== null)
      return Promise.resolve({ created: false, stream: window.stream });

    try {
      this.camera = new WebcamImageRecorder();
      const stream = await this.camera.init();
      console.log('Native webcam initialized');
      return Promise.resolve({ created: true, stream });
    } catch (error) {
      this.camera = null;
      return Promise.reject();
    }
  }

  stageDataForUpload() {
    this.camera.streamStop();
  }

  remove() {
    this.camera.remove();
  }
}

export default ImageCameraModel;