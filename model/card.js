import ErrorType from '../lib/errors';
import LCRequest from '../lib/request';
import { MessageModel, MessageModelType } from '../model/message';

const domain = 'https://api.livecard.cards/api';

class CardModel {
  constructor(licenseKey, liveCardId, recipientPhoneRequired = false) {
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
      return ErrorType.MISSING_MESSAGE;

    const messageErrorCode = this.message.validate();
    return messageErrorCode === null ? null : messageErrorCode;
  }

  async createOrder() {
    const errorCode = this.validate();
    if (errorCode !== null)
      return Promise.reject(new Error(errorCode));

    const request = new LCRequest(domain, 'cards');

    request.setHeader('Accept', 'application/vnd.LiveCard+json;version=1');
    request.setHeader('License-Key', this.licenseKey);
    request.setData('card[livecard_id]', this.liveCardId);

    if (this.recipientPhone !== null)
      request.setData('card[recipient_phone_number]', this.recipientPhone);

    if (this.message.type === MessageModelType.TEXT) {
      request.setData('card[gift_message]', this.message.content);
    } else if (this.message.type === MessageModelType.IMAGE) {
      request.setAttachment('card[file]', this.message.content);
    } else if (this.message.type === MessageModelType.AUDIO) {
      request.setAttachment('card[file]', this.message.content, 'audio.ogg');
    }

    try {
      const res = await request.post();
      console.log('got card response', res);

      if (!res.success)
        return Promise.reject(new Error(ErrorType.CREATE_CARD_ERROR));

      if (this.message.type === MessageModelType.VIDEO) {
        const videoRes = await this._nativeVideoUpload(this.licenseKey, res.card.id, this.message.content);
        const videoUrl = videoRes.card.video_url.replace('video.mov', 'video_trans.mp4');
        console.log('got native video response', videoUrl);
        return Promise.resolve({ liveCardId: this.liveCardId, mediaUrl: videoUrl });
      }

      if (this.message.type === MessageModelType.FLASH_VIDEO) {
        const videoRes = await this._flashVideoUpload(this.licenseKey, res.card.id, this.message.content);
        const videoUrl = videoRes.card.video_url.replace('.mp4', '_trans.mp4');
        console.log('got flash video response', videoUrl);
        return Promise.resolve({ liveCardId: this.liveCardId, mediaUrl: videoUrl });
      }

      if (this.message.type === MessageModelType.FLASH_AUDIO) {
        const audioRes = await this._flashAudioUpload(this.licenseKey, res.card.id, this.message.content);
        const audioUrl = audioRes.card.audio_url.replace('.mp3', '_trans.mp3');
        console.log('got flash audio response', audioUrl);
        return Promise.resolve({ liveCardId: this.liveCardId, mediaUrl: audioUrl });
      }

      return Promise.resolve({ liveCardId: this.liveCardId, mediaUrl: res.card.image_url });
    } catch (error) {
      console.log(error.message);
      return Promise.reject(new Error(ErrorType.CREATE_CARD_ERROR));
    }
  }

  async confirmOrder() {
    const req = new LCRequest(domain, 'cards/update_order');

    req.setHeader('Accept', 'application/vnd.LiveCard+json;version=1');
    req.setHeader('License-Key', this.licenseKey);
    req.setData('card[livecard_id]', this.liveCardId);
    req.setData('card[order_confirmed]', true);

    try {
      await req.put();
      return Promise.resolve();
    } catch (error) {
      console.log(error.message);
      return Promise.reject(new Error(ErrorType.CONFIRM_CARD_ERROR));
    }
  }

  async _nativeVideoUpload(licenseKey, cardId, content) {
    const req = new LCRequest(domain, 'videos/upload');
    req.setHeader('Accept', 'application/vnd.LiveCard+json;version=1');
    req.setHeader('License-Key', licenseKey);
    req.setData('video[card_id]', cardId);
    req.setAttachment('video[file]', content, 'video.mov');
    return req.post();
  }

  async _flashVideoUpload(licenseKey, cardId, streamName) {
    const req = new LCRequest('https://wowzatest.live.cards', 'upload_video.php');
    req.setHeader('License-Key', licenseKey);
    req.setData('card_id', cardId);
    req.setData('stream_name', streamName);
    return req.post();
  }

  async _flashAudioUpload(licenseKey, cardId, streamName) {
    // todo
    // const req = new LCRequest('https://wowzatest.live.cards', 'upload_video.php');
    // req.setHeader('License-Key', licenseKey);
    // req.setData('card_id', cardId);
    // req.setData('stream_name', streamName);
    // return req.post();
    return { card: { audio_url: 'https://www.audio-response-url.com/test.mp3' } };
  }

}

export default CardModel;