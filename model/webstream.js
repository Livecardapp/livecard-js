export class WebstreamImage {
  constructor() {
    Object.assign(this, StreamMixin(false, true));
  }
}

export class WebstreamAudio {
  constructor() {
    this.context = null;
    this.input = null;
    this.analyser = null;
    this.processor = null;
    this.visualsUnavailable = false;
    const mimeTypes = ['audio/webm', 'audio/webm\;codecs=opus'];
    Object.assign(this, StreamMixin(true, false), RecorderMixin(this, mimeTypes));
  }

  startVisuals(callback) {
    if (this.visualsUnavailable) 
      return;

    if (this.processor === null) {
      this.context = new (window.AudioContext || window.webkitAudioContext)();
      this.analyser = this.context.createAnalyser();
      this.input = this.context.createMediaStreamSource(window.stream);

      const getByteFrequencyData = this.analyser.getByteFrequencyData.bind(this.analyser);
      const binCount = this.analyser.frequencyBinCount;
      const _getAvgVolume = this._getAverageVolume;

      if (this.context.createJavaScriptNode) {
        this.processor = this.context.createJavaScriptNode(1024, 1, 1);
      } else if (this.context.createScriptProcessor) {
        this.processor = this.context.createScriptProcessor(1024, 1, 1);
      } else {
        this.context = null;
        this.input = null;
        this.analyser = null;
        this.processor = null;
        this.visualsUnavailable = true;
        return;
      }

      this.processor.onaudioprocess = () => {
        const a = new Uint8Array(binCount);
        getByteFrequencyData(a)
        callback(_getAvgVolume(a));
      };

      this.analyser.fftSize = 1024;
      this.analyser.minDecibels = -90;
      this.analyser.maxDecibels = -10;
      this.analyser.smoothingTimeConstant = 0.85;
    }

    this.input.connect(this.analyser);
    this.analyser.connect(this.processor);
    this.processor.connect(this.context.destination);
  }

  visualsAvailable() {
    return !this.visualsUnavailable;
  }

  stopVisuals() {
    if (this.visualsUnavailable) return;
    if (this.processor === null) return;
    this.input.disconnect();
    this.analyser.disconnect();
    this.processor.disconnect();
  }

  _getAverageVolume(array) {
    const length = array.length;
    let values = 0;
    for (let i = 0; i < length; i++) {
      values += array[i];
    }
    return values / length;
  }
}

export class WebstreamVideo {
  constructor() {
    const mimeTypes = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
    Object.assign(this, StreamMixin(true, true), RecorderMixin(this, mimeTypes));
  }
}

const StreamMixin = (hasAudio, hasVideo) => {
  const mixin = {};

  mixin.initialize = async () => {
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
  };

  mixin.streamStop = () => {
    window.stream.getTracks().forEach(function (curTrack) { curTrack.stop(); });
  };

  mixin.remove = () => {
    if (typeof window.stream === 'undefined' || window.stream === null) return;
    window.stream.getTracks().forEach(function (curTrack) { curTrack.stop(); });
    window.stream = null;
  };

  return mixin;
};

const RecorderMixin = (instance, mimeTypes) => {
  const mixin = {};

  mixin.blobs = [];
  mixin.recorder = null;

  mixin.init = async () => {
    if (typeof window.MediaRecorder === 'undefined')
      throw new Error('No media recorder');

    const fileType = mimeTypes.reduce((acc, x) => {
      return acc !== null ? acc : MediaRecorder.isTypeSupported(x) ? x : null;
    }, null);

    if (fileType === null)
      throw new Error('Video file format not supported');

    const stream = await instance.initialize();
    instance.recorder = new MediaRecorder(stream, { mimeType: fileType });
    instance.recorder.ondataavailable = instance._onData.bind(instance);

    return stream;
  };

  mixin.start = () => {
    instance.blobs = [];
    instance.recorder.start(10);
  };

  mixin.stop = () => {
    instance.recorder.stop();
  };

  mixin.buffer = () => {
    const buffer = new Blob(instance.blobs, { type: 'audio/webm' });
    return window.URL.createObjectURL(buffer);
  };

  mixin.data = () => {
    return instance.blobs;
  }

  mixin.stageDataForUpload = () => {
    instance.streamStop();
    return instance.blobs.length > 0;
  }

  mixin.reset = () => {
    instance.blobs = [];
  }

  mixin._onData = (event) => {
    if (event.data && event.data.size === 0) return;
    instance.blobs.push(event.data);
  }

  return mixin;
};
