import ErrorType from '../lib/errors';

const MAX_AUDIO_SIZE = 2000000; // 2M blob
const MAX_IMAGE_SIZE = 500000;  // 0.5M blob
const MAX_VIDEO_SIZE = 2000000; // 2M blob

export const MessageModelType = {
  TEXT: 0, AUDIO: 1, IMAGE: 2, VIDEO: 3, FLASH: 4
};

export class MessageModel {
  constructor() {
    // always have some setting for type
    this.type = MessageModelType.TEXT;
    this.content = null;
  }

  // TEXT
  setContentAsText(text) {
    if (typeof text !== 'string' || text === null)
      return ErrorType.MISSING_TEXT;

    this.content = text;
    this.type = MessageModelType.TEXT;

    return null;
  }

  // AUDIO
  setContentAsAudioFromFiles(files) {
    return this._setContentAsBlobFromFiles(MessageModelType.AUDIO, files);
  }

  setContentAsAudioFromMic(recordedBlobs) {
    const blob = new Blob(recordedBlobs, { type: 'audio/webm' });

    if (blob.size > MAX_AUDIO_SIZE)
      return ErrorType.AUDIO_SIZE_TOO_LARGE;

    this.content = blob;
    this.type = MessageModelType.AUDIO;

    return null;
  }

  // IMAGE
  setContentAsImageFromFiles(files) {
    return this._setContentAsBlobFromFiles(MessageModelType.IMAGE, files);
  }

  setContentAsImageFromCamera(canvasDataUrl) {
    // method creates image from canvas base64 data url string
    if (typeof canvasDataUrl !== 'string' || canvasDataUrl.length === 0)
      return ErrorType.MISSING_IMAGE;

    const parts = canvasDataUrl.split(',');
    const mime = parts[0].match(/:(.*?);/)[1];

    if (parts[0].indexOf('base64') !== -1) {
      const bstr = atob(parts[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      const blob = new Blob([u8arr], { type: mime });

      if (blob.size > MAX_IMAGE_SIZE)
        return ErrorType.IMAGE_SIZE_TOO_LARGE;

      this.content = blob;
      this.type = MessageModelType.IMAGE;

      return null;
    }

    const raw = decodeURIComponent(parts[1]);
    const blob = new Blob([raw], { type: mime });

    if (blob.size > MAX_IMAGE_SIZE)
      return ErrorType.IMAGE_SIZE_TOO_LARGE;

    this.content = blob;
    this.type = MessageModelType.IMAGE;

    return null;
  }

  // VIDEO
  setContentAsVideoFromFiles(files) {
    return this._setContentAsBlobFromFiles(MessageModelType.VIDEO, files);
  }

  setContentAsVideoFromCamera(recordedBlobs) {
    const blob = new Blob(recordedBlobs, { type: 'video/webm' });

    if (blob.size > MAX_VIDEO_SIZE)
      return ErrorType.VIDEO_SIZE_TOO_LARGE;

    this.content = blob;
    this.type = MessageModelType.VIDEO;

    return null;
  }

  // FLASH
  setContentAsVideoFromFlash(streamName) {
    if (typeof streamName === 'undefined' || streamName === null)
      return ErrorType.MISSING_VIDEO;

    this.type = MessageModelType.FLASH;
    this.content = streamName;

    return null;
  }

  setContentAsAudioFromFlash(streamName) {
    // todo
    return null;
  }

  validate() {
    if (this.type === MessageModelType.TEXT && this.content === null)
      return ErrorType.MISSING_TEXT;

    if (this.type === MessageModelType.AUDIO && this.content === null)
      return ErrorType.MISSING_AUDIO;

    if (this.type === MessageModelType.IMAGE && this.content === null)
      return ErrorType.MISSING_IMAGE;

    if (this.type === MessageModelType.VIDEO && this.content === null)
      return ErrorType.MISSING_VIDEO;

    if (this.type === MessageModelType.FLASH && this.content === null)
      return ErrorType.MISSING_VIDEO;

    return null;
  }

  _setContentAsBlobFromFiles(type, files) {
    if (files.length === 0) {
      if (type === MessageModelType.AUDIO)
        return ErrorType.MISSING_AUDIO;

      if (type === MessageModelType.IMAGE)
        return ErrorType.MISSING_IMAGE;

      return ErrorType.MISSING_VIDEO;
    }

    const blob = files[0];

    if (type === MessageModelType.AUDIO && blob.size > MAX_AUDIO_SIZE)
      return ErrorType.AUDIO_SIZE_TOO_LARGE;

    if (type === MessageModelType.IMAGE && blob.size > MAX_IMAGE_SIZE)
      return ErrorType.IMAGE_SIZE_TOO_LARGE;

    if (type === MessageModelType.VIDEO && blob.size > MAX_VIDEO_SIZE)
      return ErrorType.VIDEO_SIZE_TOO_LARGE;

    this.content = blob;
    this.type = type;

    return null;
  }
}