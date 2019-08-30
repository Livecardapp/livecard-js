// ----- //
// IMAGE //
// ----- //

export class WebstreamImage {
  constructor() {
    Object.assign(this, StreamMixin(false, true));
  }
}

// ----- //
// AUDIO //
// ----- //

export class WebstreamAudio {
  constructor(bufferSize) {
    const mimeTypes = ['audio/webm', 'audio/webm\;codecs=opus'];
    const s = bufferSize || 4096;
    Object.assign(this, StreamMixin(true, false), AudioContextMixin(this, s), AudioContextRecorderMixin(this, s), AudioContextVisualizerMixin());
  }
}

const AudioContextMixin = (o, bufferSize) => {
  mixin = {};
  mixin.context = null;
  mixin.input = null;
  mixin.analyser = null;
  mixin.processor = null;

  mixin.setContext = (stream, onAudioProcess) => {
    if (o.processor === null) {
      o.context = new (window.AudioContext || window.webkitAudioContext)();
      o.analyser = o.context.createAnalyser();
      o.input = o.context.createMediaStreamSource(stream);

      if (o.context.createJavaScriptNode) {
        o.processor = o.context.createJavaScriptNode(bufferSize, 1, 1);
      } else if (o.context.createScriptProcessor) {
        o.processor = o.context.createScriptProcessor(bufferSize, 1, 1);
      } else {
        o.context = null;
        o.input = null;
        o.analyser = null;
        o.processor = null;
        return false;
      }

      o.processor.onaudioprocess = onAudioProcess;
      o.analyser.fftSize = 1024;
      o.analyser.minDecibels = -90;
      o.analyser.maxDecibels = -10;
      o.analyser.smoothingTimeConstant = 0.85;
    }

    o.input.connect(o.analyser);
    o.analyser.connect(o.processor);
    o.processor.connect(o.context.destination);
    return true;
  };

  mixin.clearContext = () => {
    if (o.processor === null) return;
    o.input.disconnect();
    o.analyser.disconnect();
    o.processor.disconnect();
  }

  return mixin;
};

const AudioContextRecorderMixin = (o, bufferSize) => {
  mixin = {};
  mixin.data = [];
  mixin.dataLength = 0;

  mixin.onSaveData = (event) => {
    o.data.push(new Float32Array(event.inputBuffer.getChannelData(0)));
    o.dataLength = o.dataLength + bufferSize;
  };

  mixin.toWav = (config, callback) => {
    const webWorker = o._processInWebWorker(o._makeInlineWebWorker);
    webWorker.onmessage = function (event) {
      callback(event.data.buffer, event.data.view);
      // release memory
      URL.revokeObjectURL(webWorker.workerURL);
    };
    webWorker.postMessage(config);
  }

  mixin._processInWebWorker = (inlineWorker) => {
    const w = `;this.onmessage = function (e) {${inlineWorker.name} (e.data);}`;
    var workerURL = URL.createObjectURL(new Blob([inlineWorker.toString(), w], { type: 'application/javascript' }));
    const worker = new Worker(workerURL);
    worker.workerURL = workerURL;
    return worker;
  }

  mixin._makeInlineWebWorker = () => {
    const inlineWebWorker = (config, cb) => {
      var data = config.data.slice(0);
      var sampleRate = config.sampleRate;
      data = joinBuffers(data, config.recordingLength);

      function joinBuffers(channelBuffer, count) {
        var result = new Float64Array(count);
        var offset = 0;
        var lng = channelBuffer.length;

        for (var i = 0; i < lng; i++) {
          var buffer = channelBuffer[i];
          result.set(buffer, offset);
          offset += buffer.length;
        }

        return result;
      }

      function writeUTFBytes(view, offset, string) {
        var lng = string.length;
        for (var i = 0; i < lng; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      }

      var dataLength = data.length;

      // create wav file
      var buffer = new ArrayBuffer(44 + dataLength * 2);
      var view = new DataView(buffer);

      writeUTFBytes(view, 0, 'RIFF'); // RIFF chunk descriptor/identifier
      view.setUint32(4, 44 + dataLength * 2, true); // RIFF chunk length
      writeUTFBytes(view, 8, 'WAVE'); // RIFF type
      writeUTFBytes(view, 12, 'fmt '); // format chunk identifier, FMT sub-chunk
      view.setUint32(16, 16, true); // format chunk length
      view.setUint16(20, 1, true); // sample format (raw)
      view.setUint16(22, 1, true); // mono (1 channel)
      view.setUint32(24, sampleRate, true); // sample rate
      view.setUint32(28, sampleRate * 2, true); // byte rate (sample rate * block align)
      view.setUint16(32, 2, true); // block align (channel count * bytes per sample)
      view.setUint16(34, 16, true); // bits per sample
      writeUTFBytes(view, 36, 'data'); // data sub-chunk identifier
      view.setUint32(40, dataLength * 2, true); // data chunk length

      // write the PCM samples
      var index = 44;
      for (var i = 0; i < dataLength; i++) {
        view.setInt16(index, data[i] * 0x7FFF, true);
        index += 2;
      }

      if (cb) return cb({ buffer: buffer, view: view });
      postMessage({ buffer: buffer, view: view });
    }

    return inlineWebWorker;
  };
};

const AudioContextVisualizerMixin = () => {
  const mixin = {};

  mixin.onVisualizeAnalyzerData = (analyser) => {
    const binCount = analyser.frequencyBinCount;
    const a = new Uint8Array(binCount);
    analyser.getByteFrequencyData(a);
    const length = a.length;
    let values = 0;
    for (let i = 0; i < length; i++) { values += a[i]; }
    return values / length;
  };

  return mixin;
};

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