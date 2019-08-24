export class FlashImage {
  constructor(recorderId, swfExpressInstall, swfLCCapture) {
    Object.assign(this, FlashMixin('image', recorderId, swfExpressInstall, swfLCCapture));
  }
}

export class FlashAudio {
  constructor(recorderId, swfExpressInstall, swfLCCapture) {
    Object.assign(this, FlashMixin('audio', recorderId, swfExpressInstall, swfLCCapture));
  }
}

export class FlashVideo {
  constructor(recorderId, swfExpressInstall, swfLCCapture) {
    Object.assign(this, FlashMixin('video', recorderId, swfExpressInstall, swfLCCapture));
  }
}

const FlashMixin = (type, recorderId, swfExpressInstall, swfLCCapture) => {
  const mixin = {};

  const flashStreamName = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });

  mixin.streamName = () => { return flashStreamName; };

  // For version detection, set to min. required Flash Player version, or 0 (or 0.0.0), for no version detection. 
  const swfVersionStr = '16.0.0';

  const flashvars = {
    lc_debug: true,
    rtmp_host: '18.234.125.64',
    rtmp_app: 'petro',
    rtmp_inst: '_definst_',
    video_width: 320,
    video_height: 240,
    video_quality: 95,
    stream_name: flashStreamName,
    video_ratio: '4:3', /* '4:3', '16:9' */
    audio_mode: type === 'audio' ? 'true' : 'false',
    video_auto: type === 'audio' ? 'true' : 'false',
  };

  const bgColor = type === 'audio' ? '#ffffff' : '#000000';
  const params = { quality: 'high', bgcolor: bgColor, allowscriptaccess: 'sameDomain', allowfullscreen: 'true' };
  const attributes = { id: recorderId, name: recorderId };
  const swfUrlStr = `${swfLCCapture}?cb=${(new Date()).getTime()}`;

  const size = type === 'audio' ? '100%' : '100%';

  mixin.init = (viewId) => {
    swfobject.embedSWF(swfUrlStr, viewId, size, size, swfVersionStr, swfExpressInstall, flashvars, params, attributes);
    swfobject.createCSS(`#${viewId}`, 'display:block;text-align:left;');
    console.log(`Init Flash ${type}`);
  };

  mixin.remove = () => {
    swfobject.removeSWF(recorderId);
    console.log(`Remove Flash ${type}`);
  };

  return mixin;
};