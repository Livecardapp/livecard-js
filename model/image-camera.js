import { WebcamStreamMixin } from '../lib/webcam';

// Note: 
// if there is a need for flash support for image capture, then:
// - move WebcamStreamMixin to be private in lib/webcam.js
// - create WebcamImageRecorder class from WebcamStreamMixin (similar to ImageCameraModel).
// - import WebcamImageRecorder into this file and use that as one of the supported image recorders.

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