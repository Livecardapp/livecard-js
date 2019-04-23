import { WebcamStreamMixin } from '../lib/webcam';

class ImageCameraModel {
  constructor() {
    Object.assign(this, WebcamStreamMixin());
  }

  async init() {
    return this.webcamInit();
  }

  remove() {
    this.webcamRemove();
  }
}

export default ImageCameraModel;