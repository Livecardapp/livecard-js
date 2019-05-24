class WebcamImageRecorder {
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

class WebcamVideoRecorder {
  constructor() {
    this.blobs = [];
    this.recorder = null;
    Object.assign(this, WebcamStreamMixin());
  }

  async init() {
    const webcamInit = this.webcamInit;
    const _setRecorder = this._setRecorder.bind(this);

    return new Promise(async (resolve, reject) => {
      if (typeof window.MediaRecorder === 'undefined')
        return reject();

      let fileType = null;
      if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9"))
        fileType = "video/webm;codecs=vp9";
      else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8"))
        fileType = "video/webm;codecs=vp8";
      else if (MediaRecorder.isTypeSupported("video/webm"))
        fileType = "video/webm";

      if (fileType === null)
        return reject();

      const stream = await webcamInit();
      const error = _setRecorder(stream, fileType);

      if (error === null)
        return resolve(stream);

      reject(error);
    });
  }

  recordStart() {
    if (this.recorder === null) return false;
    this.blobs = [];
    // collect 10ms of data
    this.recorder.start(10);
  }

  recordStop() {
    if (this.recorder === null) return;
    this.recorder.stop();
  }

  bufferVideo() {
    const buffer = new Blob(this.blobs, { type: "video/webm" });
    return window.URL.createObjectURL(buffer);
  }

  hasData() {
    return this.blobs.length > 0;
  }

  reset() {
    this.blobs = [];
  }

  remove() {
    this.webcamRemove();
  }

  // PRIVATE

  _setRecorder(stream, fileType) {
    try {
      this.recorder = new MediaRecorder(stream, { mimeType: fileType });
      this.recorder.ondataavailable = this._onData.bind(this);
      return null;
    } catch (error) {
      return error;
    }
  }

  _onData(evt) {
    if (this.recorder === null) return;
    if (evt.data && evt.data.size === 0) return;
    this.blobs.push(evt.data);
  }
}

const WebcamStreamMixin = () => {
  return {
    webcamInit: async () => {

      if (typeof navigator.mediaDevices === 'undefined' || navigator.mediaDevices === null)
        return Promise.reject();

      const constraints = {
        audio: true,
        video: {
          width: { ideal: 1920, min: 1280 },
          height: { ideal: 1080, min: 720 }
        }
      };

      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        window.stream = stream;
        return Promise.resolve(stream);
      } catch (error) {
        console.log('webcamInit', error);
        return Promise.reject();
      }
    },
    streamStop: () => {
      window.stream.getTracks().forEach(function (curTrack) { curTrack.stop(); });
    },
    webcamRemove: () => {
      if (typeof window.stream === 'undefined' || window.stream === null) return;
      window.stream.getTracks().forEach(function (curTrack) { curTrack.stop(); });
      window.stream = null;
    },
  };
};

export { WebcamImageRecorder, WebcamVideoRecorder };
