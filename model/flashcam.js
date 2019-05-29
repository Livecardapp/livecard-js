class FlashCamera {
  constructor(recorderId) {
    this.flashStreamName = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    this.recorderId = recorderId;
  }

  init(viewId) {
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
      stream_name: this.flashStreamName
    };

    const params = { quality: 'high', bgcolor: '#000000', allowscriptaccess: 'sameDomain', allowfullscreen: 'true' };
    const attributes = { id: this.recorderId, name: this.recorderId };
    const swfUrlStr = `${path}LCCapture.swf?cb=${(new Date()).getTime()}`;

    swfobject.embedSWF(swfUrlStr, viewId, '100%', '100%', swfVersionStr, xiSwfUrlStr, flashvars, params, attributes);
    swfobject.createCSS(`#${viewId}`, 'display:block;text-align:left;');
  }

  streamName() {
    return this.flashStreamName;
  }

  remove() {
    swfobject.removeSWF(this.recorderId);
  }
}

export default FlashCamera;