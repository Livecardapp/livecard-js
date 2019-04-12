const LCMessageType = {
  VIDEO: 0,
  IMAGE: 1,
  TEXT: 2,
};

class LCMessage {
  constructor(type, fromFile, blob) {
    if (typeof type !== 'number' || ![0, 1, 2].includes(type))
      throw new Error('LCMessage: Invalid type.');

    this.type = type;
    if (type !== LCMessageType.TEXT) {
      this.fromFile = false;
      this.blob = null;
    } else {
      if (blob instanceof Blob) {
        this.fromFile = fromFile;
        this.blob = blob;
      }
      throw new Error('LCMessage: Invalid message.')
    }
  }
}

export {
  LCMessageType,
  LCMessage,
};