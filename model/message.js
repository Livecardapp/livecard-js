import ErrorType from '../lib/errors';

const MessageModelType = { 
  VIDEO: 0, IMAGE: 1, TEXT: 2 
};

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
    this.content = new Blob(recordedBlobs, { type: 'video/webm' });
    this.type = MessageModelType.VIDEO;
    return true;
  }

  setContentAsImageFromFiles(files) {
    return this._setContentAsBlobFromFiles(MessageModelType.IMAGE, files);
  }

  setContentAsImageFromCamera(canvasDataUrl) {
    // method creates image from canvas base64 data url string
    if (typeof canvasDataUrl !== 'string' || canvasDataUrl.length === 0)
      return false;

    console.log('process image', canvasDataUrl);
    const parts = canvasDataUrl.split(',');
    const mime = parts[0].match(/:(.*?);/)[1];

    if (parts[0].indexOf('base64') !== -1) {
      const bstr = atob(parts[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      this.content = new Blob([u8arr], { type: mime });
      this.type = MessageModelType.IMAGE;
      return true;
    }

    const raw = decodeURIComponent(parts[1]);
    this.content = new Blob([raw], { type: mime });
    this.type = MessageModelType.IMAGE;
    return true;
  }

  setContentAsText(text) {
    if (typeof text !== 'string' || text === null) 
      return false;
    this.content = text;
    this.type = MessageModelType.TEXT;
    return true;
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
    if (files.length === 0) return false;
    this.content = files[0].slice();
    this.type = type;
    return true;
  }
}

export {
  MessageModelType,
  MessageModel,
};