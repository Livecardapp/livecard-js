export class WebstreamImage {
  constructor() {
    Object.assign(this, WebstreamMixin(false, true));
  }
}

export class WebstreamAudio {
  constructor() {
    this.blobs = [];
    this.recorder = null;
    Object.assign(this, WebstreamMixin(true, false));
  }

  async init() {
    if (typeof window.MediaRecorder === 'undefined')
      throw new Error('No media recorder');

    let fileType = null;
    if (MediaRecorder.isTypeSupported('audio/webm'))
      fileType = 'audio/webm';
    else if (MediaRecorder.isTypeSupported('audio/webm\;codecs=opus'))
      fileType = 'audio/webm\;codecs=opus';

    if (fileType === null)
      throw new Error('Video file format not supported');

    const stream = await this.initialize();
    this.recorder = new MediaRecorder(stream, { mimeType: fileType });
    this.recorder.ondataavailable = this._onData.bind(this);

    return stream;
  }

  start() {
    this.blobs = [];
    this.recorder.start(10);
  }

  stop() {
    this.recorder.stop();
  }

  buffer() {
    const buffer = new Blob(this.blobs, { type: 'audio/webm' });
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

  _onData(event) {
    if (event.data && event.data.size === 0) return;
    this.blobs.push(event.data);
  }

}

export class WebstreamVideo {
  constructor() {
    this.blobs = [];
    this.recorder = null;
    Object.assign(this, WebstreamMixin(true, true));
  }

  async init() {
    const initStream = this.initialize;
    const _setRecorder = this._setRecorder.bind(this);

    return new Promise(async (resolve, reject) => {
      if (typeof window.MediaRecorder === 'undefined')
        return reject(new Error('No media recorder'));

      let fileType = null;
      if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9'))
        fileType = 'video/webm;codecs=vp9';
      else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8'))
        fileType = 'video/webm;codecs=vp8';
      else if (MediaRecorder.isTypeSupported('video/webm'))
        fileType = 'video/webm';

      if (fileType === null)
        return reject(new Error('Video file format not supported'));

      let stream = null;

      try {
        stream = await initStream();
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
    const buffer = new Blob(this.blobs, { type: 'video/webm' });
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

const WebstreamMixin = (hasAudio, hasVideo) => {
  return {
    initialize: async () => {

      if (typeof navigator.mediaDevices === 'undefined' || navigator.mediaDevices === null)
        return Promise.reject();

      const constraints = {
        audio: hasAudio,
        video: hasVideo ? { width: { ideal: 1920, min: 1280 }, height: { ideal: 1080, min: 720 } } : false,
      };

      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        window.stream = stream;
        return Promise.resolve(stream);
      } catch (error) {
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