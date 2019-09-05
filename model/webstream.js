// ------------ //
// MEDIA STREAM //
// ------------ //

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

// ----- //
// AUDIO //
// ----- //

export class WebstreamAudio {
  constructor(visualizer) {
    this.visualizer = visualizer;
    this.mimeType = null;
    const s = 4096;
    Object.assign(
      this,
      StreamMixin(true, false),
      AudioConnectMixin(this, s),
      AudioDataMixin(this, s),
      AudioVolumeMixin(this)
    );
  }

  setMime(mimeType) {
    this.mimeType = mimeType;
  }

  record() {
    const saveData = captureStream ? this.saveData.bind(this) : null;
    const onVolumeData = this.onVolumeData.bind(this);
    const visualizer = this.visualizer;
    const onAudioProcess = (event) => {
      saveData(event);
      visualizer(onVolumeData());
    };
    this.clearData();
    this.connect(source, onAudioProcess);
  }

  stop() {
    this.disconnect();
  }

  play() {
    // todo: 
    // - convert data to file format that can be used for both playback and upload
    // - set blob to window url
    // - set audio player source to blob
    // - load source
  }

  stageData() {
    this.stopStream();
    return this.data().length > 0;
  }

}

const AudioConnectMixin = (o, bufferSize) => {
  const mixin = {};

  mixin.context = null;
  mixin.input = null;
  mixin.analyser = null;
  mixin.processor = null;

  mixin.connect = (source, onAudioProcess) => {
    o.disconnect();

    if (o.context === null)
      o.context = new (window.AudioContext || window.webkitAudioContext)();

    if (o.analyser === null)
      o.analyser = o.context.createAnalyser();

    o.input = o.context.createMediaStreamSource(source);

    if (o.processor === null) {
      if (o.context.createJavaScriptNode) {
        o.processor = o.context.createJavaScriptNode(bufferSize, 1, 1);
      } else {
        o.processor = o.context.createScriptProcessor(bufferSize, 1, 1);
      }
    }

    o.processor.onaudioprocess = onAudioProcess;
    o.analyser.fftSize = 1024;
    o.analyser.minDecibels = -90;
    o.analyser.maxDecibels = -10;
    o.analyser.smoothingTimeConstant = 0.85;

    o.input.connect(o.analyser);
    o.analyser.connect(o.processor);
    o.processor.connect(o.context.destination);
    return true;
  };

  mixin.disconnect = (destroy = false) => {
    if (o.input !== null)
      o.input.disconnect();

    if (o.analyser !== null)
      o.analyser.disconnect();

    if (o.processor !== null)
      o.processor.disconnect();

    if (!destroy) return;

    o.input = null;
    o.analyser = null;
    o.processor = null;
    o.context = null;
  }

  return mixin;
};

const AudioDataMixin = (o) => {
  const mixin = {};
  mixin.blobs = [];

  mixin.saveData = (event) => {
    o.blobs.push(new Float32Array(event.inputBuffer.getChannelData(0)));
  };

  mixin.data = () => {
    return o.blobs;
  }

  mixin.dataURL = () => {
    return window.URL.createObjectURL(new Blob(o.blobs, { type: o.mimeType }));
  };

  mixin.clearData = () => {
    o.blobs = [];
  }

  return mixin;
};

const AudioVolumeMixin = (o) => {
  const mixin = {};

  mixin.onVolumeData = () => {
    const binCount = o.analyser.frequencyBinCount;
    const a = new Uint8Array(binCount);
    o.analyser.getByteFrequencyData(a);
    const length = a.length;
    let values = 0;
    for (let i = 0; i < length; i++) { values += a[i]; }
    return values / length;
  };

  return mixin;
};

// ----- //
// IMAGE //
// ----- //

export class WebstreamImage {
  constructor() {
    Object.assign(this, StreamMixin(false, true));
  }
}

// ----- //
// VIDEO //
// ----- //

export class WebstreamVideo {
  constructor() {
    const mimeTypes = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
    Object.assign(this, StreamMixin(true, true), MediaRecorderMixin(this, mimeTypes));
  }
}

const MediaRecorderMixin = (o, mimeTypes) => {
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

    const stream = await o.initialize();
    o.recorder = new MediaRecorder(stream, { mimeType: fileType });
    o.recorder.ondataavailable = o._onData.bind(o);

    return stream;
  };

  mixin.start = () => {
    o.blobs = [];
    o.recorder.start(10);
  };

  mixin.stop = () => {
    o.recorder.stop();
  };

  mixin.buffer = () => {
    const buffer = new Blob(o.blobs, { type: 'audio/webm' });
    return window.URL.createObjectURL(buffer);
  };

  mixin.data = () => {
    return o.blobs;
  }

  mixin.stageDataForUpload = () => {
    o.streamStop();
    return o.blobs.length > 0;
  }

  mixin.reset = () => {
    o.blobs = [];
  }

  mixin._onData = (event) => {
    if (event.data && event.data.size === 0) return;
    o.blobs.push(event.data);
  }

  return mixin;
};

// export class WebstreamAudio {
//   constructor() {
//     this.context = null;
//     this.input = null;
//     this.analyser = null;
//     this.processor = null;
//     this.visualsUnavailable = false;
//     const mimeTypes = ['audio/webm', 'audio/webm\;codecs=opus'];
//     Object.assign(this, StreamMixin(true, false), MediaRecorderMixin(this, mimeTypes));
//   }

//   startVisuals(callback) {
//     if (this.visualsUnavailable) 
//       return;

//     if (this.processor === null) {
//       this.context = new (window.AudioContext || window.webkitAudioContext)();
//       this.analyser = this.context.createAnalyser();
//       this.input = this.context.createMediaStreamSource(window.stream);

//       const getByteFrequencyData = this.analyser.getByteFrequencyData.bind(this.analyser);
//       const binCount = this.analyser.frequencyBinCount;
//       const _getAvgVolume = this._getAverageVolume;

//       if (this.context.createJavaScriptNode) {
//         this.processor = this.context.createJavaScriptNode(1024, 1, 1);
//       } else if (this.context.createScriptProcessor) {
//         this.processor = this.context.createScriptProcessor(1024, 1, 1);
//       } else {
//         this.context = null;
//         this.input = null;
//         this.analyser = null;
//         this.processor = null;
//         this.visualsUnavailable = true;
//         return;
//       }

//       this.processor.onaudioprocess = () => {
//         const a = new Uint8Array(binCount);
//         getByteFrequencyData(a)
//         callback(_getAvgVolume(a));
//       };

//       this.analyser.fftSize = 1024;
//       this.analyser.minDecibels = -90;
//       this.analyser.maxDecibels = -10;
//       this.analyser.smoothingTimeConstant = 0.85;
//     }

//     this.input.connect(this.analyser);
//     this.analyser.connect(this.processor);
//     this.processor.connect(this.context.destination);
//   }

//   visualsAvailable() {
//     return !this.visualsUnavailable;
//   }

//   stopVisuals() {
//     if (this.visualsUnavailable) return;
//     if (this.processor === null) return;
//     this.input.disconnect();
//     this.analyser.disconnect();
//     this.processor.disconnect();
//   }

//   _getAverageVolume(array) {
//     const length = array.length;
//     let values = 0;
//     for (let i = 0; i < length; i++) {
//       values += array[i];
//     }
//     return values / length;
//   }
// }