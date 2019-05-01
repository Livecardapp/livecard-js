import ErrorType from '../lib/errors';

const MessageModelType = {
  VIDEO: 0, IMAGE: 1, TEXT: 2
};

const MAX_IMAGE_SIZE = 50000;  // 0.5M blob
const MAX_VIDEO_SIZE = 200000; // 2M blob

class MessageModel {
  constructor() {
    // always have some setting for type
    this.type = MessageModelType.TEXT;
    this.content = null;
  }

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

  setContentAsText(text) {
    if (typeof text !== 'string' || text === null)
      return ErrorType.MISSING_TEXT;

    this.content = text;
    this.type = MessageModelType.TEXT;

    return null;
  }

  validate() {
    if (this.type === MessageModelType.VIDEO && this.content === null)
      return ErrorType.MISSING_VIDEO;

    if (this.type === MessageModelType.IMAGE && this.content === null)
      return ErrorType.MISSING_IMAGE;

    if (this.type === MessageModelType.TEXT && this.content === null)
      return ErrorType.MISSING_TEXT;

    return null;
  }

  _setContentAsBlobFromFiles(type, files) {
    if (files.length === 0)
      return type === MessageModelType.IMAGE ? ErrorType.MISSING_IMAGE : ErrorType.MISSING_VIDEO;

    const blob = files[0];

    if (type === MessageModelType.IMAGE && blob.size > MAX_IMAGE_SIZE)
      return ErrorType.IMAGE_SIZE_TOO_LARGE;

    if (type === MessageModelType.VIDEO && blob.size > MAX_VIDEO_SIZE)
      return ErrorType.VIDEO_SIZE_TOO_LARGE;

    this.content = blob;
    this.type = type;

    return null;
  }
}

export {
  MessageModelType,
  MessageModel,
};