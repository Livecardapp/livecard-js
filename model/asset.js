const root = '';
const version = 'livecard-sdk';

class Asset {
  iconBack(ver) { return `${root}/${typeof ver === 'undefined' ? version : ver}/images/back.png`; }
  iconDismiss(ver) { return `${root}/${typeof ver === 'undefined' ? version : ver}/images/dismiss.png`; }
  iconMic(ver) {
    // https://www.flaticon.com/free-icon/voice-recorder_254014
    return `${root}/${typeof ver === 'undefined' ? version : ver}/images/voice-recorder.png`;
  }
};

export default Asset;