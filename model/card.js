import LCRequest from '../lib/request';
import { LCMessage } from '../model/message';

const LCCardError = {
  RECIPIENT_PHONE_MISSING: 0,
  MESSAGE_MISSING: 1,
};

class LCCard {
  constructor() {
    this.recipientPhone = null;
    this.message = null;
  }

  setRecipientPhoneNumber(phoneNumber) {
    if (typeof phoneNumber !== 'string' || phoneNumber.length === 0) return false;
    this.recipientPhone = phoneNumber;
    return true;
  }

  setMessage(message) {
    if (typeof message !== 'object' || message === null) return false;
    if (!(message instanceof LCMessage)) return false;
    this.message = message;
    return true;
  }

  validate() {
    if (this.recipientPhone === null)
      return LCCardError.RECIPIENT_PHONE_MISSING;

    if (this.message === null)
      return LCCardError.MESSAGE_MISSING;

    const messageErrorCode = this.message.validate();
    if (messageErrorCode !== null)
      return messageErrorCode;

    return null;
  }

  async save() {
    const errorCode = this.validate();
    if (errorCode !== null)
      return Promise.reject(new Error(errorCode));

    // todo
  }
}

export {
  LCCardError,
  LCCard
};