import LCRequest from '../lib/request';
import { LCMessage, LCMessageType } from '../model/message';

const LCCardError = {
  RECIPIENT_PHONE_MISSING: 0,
  MESSAGE_MISSING: 1,
  CREATE_CARD_ERROR: 2,
};

class LCCard {
  constructor(recipientPhoneRequired = false) {
    this.recipientPhoneRequired = recipientPhoneRequired;
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
    if (this.recipientPhoneRequired && this.recipientPhone === null)
      return LCCardError.RECIPIENT_PHONE_MISSING;

    if (this.message === null)
      return LCCardError.MESSAGE_MISSING;

    const messageErrorCode = this.message.validate();
    if (messageErrorCode !== null)
      return messageErrorCode;

    return null;
  }

  async save(licenseKey, liveCardId) {
    const errorCode = this.validate();
    if (errorCode !== null)
      return Promise.reject(new Error(errorCode));

    const baseUrl = 'https://api.livecard.cards/api';
    const request = new LCRequest(baseUrl);
    const headers = { 'Accept': 'application/vnd.LiveCard+json;version=1', 'License-Key': licenseKey };
    const body = {};

    body['card[livecard_id]'] = this.liveCardId;

    if (this.recipientPhone !== null)
      body['card[recipient_phone_number]'] = this.recipientPhone;

    if (this.message.type === LCMessageType.TEXT) {
      body['card[gift_message]'] = this.message.content;
    } else if (this.message.type === LCMessageType.IMAGE) {
      body['card[file]'] = this.message.content;
    }

    try {
      const data = await request.post('cards', headers, body);
      if (this.messageType === 'video') {
        const videoRequest = new LCRequest(baseUrl);
        const videoBody = {};

        videoBody['video[file]'] = this.content;
        videoBody['video[card_id]'] = data.card.id;

        videoData = await videoRequest.post('videos/upload', headers, videoBody);
        return Promise.resolve({ liveCardId, videoUrl: videoData.card.video_url.replace('video.mov', 'video_trans.mp4') });
      } else {
        return Promise.resolve({ liveCardId, imageUrl: data.card.image_url });
      }
    } catch (error) {
      console.log(error.message);
      return Promise.reject(new Error(LCCardError.CREATE_CARD_ERROR));
    }
  }
}

export {
  LCCardError,
  LCCard
};