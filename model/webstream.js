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
    Object.assign(
      this,
      StreamMixin(true, false),
      AudioConnectMixin(this),
      AudioDataMixin(this),
      AudioVolumeMixin(this),
      AudioWavMixin(this),
    );
  }

  setMime(mimeType) {
    this.mimeType = mimeType;
  }

  record() {
    const saveData = this.saveData.bind(this);
    const volumeData = this.volumeData.bind(this);
    const visualizer = this.visualizer;
    const onAudioProcess = (event) => {
      saveData(event);
      visualizer(volumeData());
    };
    this.clearData();
    this.connect(window.stream, onAudioProcess);
  }

  stop() {
    this.disconnect();
  }

  getPlaybackURL() {
    const dataview = this.encodeAudio(this.data());
    const audioBlob = new Blob([dataview], { type: 'audio/wav' });
    return window.URL.createObjectURL(audioBlob);
  }

  getUploadData() {
    this.stopStream();
    return this.data().length > 0 ? this.data() : null;
  }

}

const AudioConnectMixin = (o) => {
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
        o.processor = o.context.createJavaScriptNode(4096, 1, 1);
      } else {
        o.processor = o.context.createScriptProcessor(4096, 1, 1);
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
  mixin.blobsLength = 0;

  mixin.saveData = (event) => {
    const channelData = event.inputBuffer.getChannelData(0);
    o.blobs.push(channelData);
    o.blobsLength += channelData.length;
    console.log(`blob length: ${o.blobsLength}`);
  };

  mixin.data = () => {
    return o.blobs;
  }

  mixin.clearData = () => {
    o.blobs = [];
    o.blobsLength = 0;
  }

  return mixin;
};

const AudioVolumeMixin = (o) => {
  const mixin = {};

  mixin.volumeData = () => {
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

const AudioWavMixin = (o) => {
  const mixin = {};

  const writeUTFBytes = (view, offset, string) => {
    const lng = string.length;
    for (let i = 0; i < lng; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  const floatTo16BitPCM = (output, offset, input) => {
    for (var i = 0; i < input.length; i++ , offset += 2) {
      var s = Math.max(-1, Math.min(1, input[i]));
      output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
  };

  mixin.encodeAudio = (data, numChannels = 0, sampleRate = 4096) => {
    var buffer = new ArrayBuffer(44 + data.length * 2);
    var view = new DataView(buffer);
    /* RIFF identifier */
    writeUTFBytes(view, 0, 'RIFF');
    /* RIFF chunk length */
    view.setUint32(4, 36 + data.length * 2, true);
    /* RIFF type */
    writeUTFBytes(view, 8, 'WAVE');
    /* format chunk identifier */
    writeUTFBytes(view, 12, 'fmt ');
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw) */
    view.setUint16(20, 1, true);
    /* channel count */
    view.setUint16(22, numChannels, true);
    /* sample rate */
    view.setUint32(24, sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, sampleRate * 4, true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, numChannels * 2, true);
    /* bits per sample */
    view.setUint16(34, 16, true);
    /* data chunk identifier */
    writeUTFBytes(view, 36, 'data');
    /* data chunk length */
    view.setUint32(40, data.length * 2, true);
    floatTo16BitPCM(view, 44, data);
    return view;
  }

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