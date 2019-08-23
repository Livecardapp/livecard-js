const root = '';
const version = 'livecard-sdk';

// Note: iconMic => https://www.flaticon.com/free-icon/voice-recorder_254014

class Asset {
  iconBack(ver) { return `${root}/${typeof ver === 'undefined' ? version : ver}/images/back.png`; }
  iconDismiss(ver) { return `${root}/${typeof ver === 'undefined' ? version : ver}/images/dismiss.png`; }
  iconMic(ver) { return `${root}/${typeof ver === 'undefined' ? version : ver}/images/voice-recorder.png`; }
  iconGift(ver) { return `${root}/${typeof ver === 'undefined' ? version : ver}/images/gift-message.png`; }
  iconVan(ver) { return `${root}/${typeof ver === 'undefined' ? version : ver}/images/van.png`; }
  iconTextBubble(ver) { return `${root}/${typeof ver === 'undefined' ? version : ver}/images/video-text-gift.png`; }
  iconRecord(ver) { return `${root}/${typeof ver === 'undefined' ? version : ver}/images/video-record.png`; }
  iconStop(ver) { return `${root}/${typeof ver === 'undefined' ? version : ver}/images/video-stop.png`; }
  iconPlay(ver) { return `${root}/${typeof ver === 'undefined' ? version : ver}/images/video-play.png`; }
};

export default Asset;