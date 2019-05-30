export class WebstreamImage {
  constructor() {
    Object.assign(this, WebcamStreamMixin(false, true));
  }
}

export class WebstreamVideo {
  constructor() {
    this.blobs = [];
    this.recorder = null;
    Object.assign(this, WebcamStreamMixin(true, true));
  }

  async init() {
    const initCamera = this.initialize;
    const _setRecorder = this._setRecorder.bind(this);

    return new Promise(async (resolve, reject) => {
      if (typeof window.MediaRecorder === 'undefined')
        return reject(new Error('No media recorder'));

      let fileType = null;
      if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9"))
        fileType = "video/webm;codecs=vp9";
      else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8"))
        fileType = "video/webm;codecs=vp8";
      else if (MediaRecorder.isTypeSupported("video/webm"))
        fileType = "video/webm";

      if (fileType === null)
        return reject(new Error('Video file format not supported'));

      let stream = null;

      try {
        stream = await initCamera();
      } catch (err) {
        return reject(err);
      }

      const error = _setRecorder(stream, fileType);

      if (error === null)
        return resolve(stream);

      reject(error);
    });
  }

  start() {
    if (this.recorder === null) return false;
    this.blobs = [];
    // collect 10ms of data
    this.recorder.start(10);
  }

  stop() {
    if (this.recorder === null) return;
    this.recorder.stop();
  }

  buffer() {
    const buffer = new Blob(this.blobs, { type: "video/webm" });
    return window.URL.createObjectURL(buffer);
  }

  data() {
    return this.blobs;
  }

  stageDataForUpload() {
    this.streamStop();
    return this.blobs.length > 0;
  }

  reset() {
    this.blobs = [];
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

const WebcamStreamMixin = (hasAudio, hasVideo) => {
  return {
    initialize: async () => {

      if (typeof navigator.mediaDevices === 'undefined' || navigator.mediaDevices === null)
        return Promise.reject();

      console.log(`stream: hasAudio ${hasAudio}, hasVideo ${hasVideo}`);
      
      const constraints = {
        audio: hasAudio,
        video: hasVideo ? { width: { ideal: 1920, min: 1280 }, height: { ideal: 1080, min: 720 } } : false,
      };

      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        window.stream = stream;
        return Promise.resolve(stream);
      } catch (error) {
        console.log('initCamera', error);
        return Promise.reject(error);
      }
    },
    streamStop: () => {
      window.stream.getTracks().forEach(function (curTrack) { curTrack.stop(); });
    },
    remove: () => {
      if (typeof window.stream === 'undefined' || window.stream === null) return;
      window.stream.getTracks().forEach(function (curTrack) { curTrack.stop(); });
      window.stream = null;
    },
  };
};