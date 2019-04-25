import ErrorType from '../lib/errors';
import LCRequest from '../lib/request';
import { MessageModel, MessageModelType } from '../model/message';

const baseUrl = 'https://api.livecard.cards/api';

class CardModel {
  constructor(licenseKey, liveCardId, recipientPhoneRequired) {
    this.licenseKey = licenseKey;
    this.liveCardId = liveCardId;
    this.recipientPhoneRequired = recipientPhoneRequired;
    this.recipientPhone = null;
    this.message = null;
  }

  setRecipientPhoneNumber(phoneNumber) {
    if (typeof phoneNumber !== 'string' || phoneNumber.length === 0)
      return false;
    this.recipientPhone = phoneNumber;
    return true;
  }

  setMessage(message) {
    if (typeof message !== 'object' || message === null) return false;
    if (!(message instanceof MessageModel)) return false;
    if (message.validate() !== null) return false;
    this.message = message;
    return true;
  }

  validate() {
    if (this.recipientPhoneRequired && this.recipientPhone === null)
      return ErrorType.MISSING_PHONE;

    if (this.message === null)
      return ErrorType.MISSING_TEXT;

    const messageErrorCode = this.message.validate();
    return messageErrorCode === null ? null : messageErrorCode;
  }

  async setOrder() {
    const errorCode = this.validate();
    if (errorCode !== null)
      return Promise.reject(new Error(errorCode));

    const request = new LCRequest(baseUrl);
    const headers = { 'Accept': 'application/vnd.LiveCard+json;version=1', 'License-Key': this.licenseKey };
    const body = {};

    body['card[livecard_id]'] = this.liveCardId;

    if (this.recipientPhone !== null)
      body['card[recipient_phone_number]'] = this.recipientPhone;

    if (this.message.type === MessageModelType.TEXT) {
      body['card[gift_message]'] = this.message.content;
    } else if (this.message.type === MessageModelType.IMAGE) {
      body['card[file]'] = this.message.content;
    }

    try {
      const data = await request.post('cards', headers, body);

      if (this.message.type !== MessageModelType.VIDEO)
        return Promise.resolve({ liveCardId, imageUrl: data.card.image_url });

      const videoRequest = new LCRequest(baseUrl);
      const videoBody = {};

      videoBody['video[file]'] = this.message.content;
      videoBody['video[card_id]'] = data.card.id;

      videoData = await videoRequest.post('videos/upload', headers, videoBody);
      return Promise.resolve({ liveCardId, videoUrl: videoData.card.video_url.replace('video.mov', 'video_trans.mp4') });
    } catch (error) {
      console.log(error.message);
      return Promise.reject(new Error(ErrorType.CREATE_CARD_ERROR));
    }
  }

  async confirmOrder() {
    const request = new LCRequest(baseUrl);
    const headers = { 'Accept': 'application/vnd.LiveCard+json;version=1', 'License-Key': this.licenseKey };
    const body = { 'card[livecard_id]': this.liveCardId, 'card[order_confirmed]': true };
    try {
      await request.put('cards/update_order', headers, body);
      console.log('Order confirmed for LiveCard id ' + this.liveCardId);
      return Promise.resolve();
    } catch (error) {
      console.log(error.message);
      return Promise.reject(new Error(ErrorType.CONFIRM_CARD_ERROR));
    }
  }
}

export default CardModel;