export class FlashImage {
  constructor(recorderId) {
    Object.assign(this, FlashMixin('image', recorderId));
  }
}

export class FlashAudio {
  constructor(recorderId) {
    Object.assign(this, FlashMixin('audio', recorderId));
  }
}

export class FlashVideo {
  constructor(recorderId) {
    Object.assign(this, FlashMixin('video', recorderId));
  }
}

const FlashMixin = (type, recorderId) => {
  const mixin = {};

  const flashStreamName = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });

  mixin.streamName = () => { return flashStreamName; };

  // Flash static root path
  const path = '/livecard-sdk/flash/';

  // For version detection, set to min. required Flash Player version, or 0 (or 0.0.0), for no version detection. 
  const swfVersionStr = '16.0.0';

  // To use express install, set to playerProductInstall.swf, otherwise the empty string. 
  const xiSwfUrlStr = `${path}expressInstall.swf`;

  const flashvars = {
    lc_debug: true,
    rtmp_host: '18.234.125.64',
    rtmp_app: 'petro',
    rtmp_inst: '_definst_',
    video_width: 320,
    video_height: 240,
    video_quality: 95,
    stream_name: flashStreamName
  };

  const params = { quality: 'high', bgcolor: '#000000', allowscriptaccess: 'sameDomain', allowfullscreen: 'true' };
  const attributes = { id: recorderId, name: recorderId };
  const swfUrlStr = `${path}LCCapture.swf?cb=${(new Date()).getTime()}`;

  const size = type === 'audio' ? '100%' : '100%';

  mixin.init = (viewId) => {
    swfobject.embedSWF(swfUrlStr, viewId, size, size, swfVersionStr, xiSwfUrlStr, flashvars, params, attributes);
    swfobject.createCSS(`#${viewId}`, 'display:block;text-align:left;');
    console.log(`Init Flash ${type}`);
  };

  mixin.remove = () => {
    swfobject.removeSWF(recorderId);
    console.log(`Remove Flash ${type}`);
  };

  return mixin;
};