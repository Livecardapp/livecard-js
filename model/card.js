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
    }

    try {
      const res = await request.post();
      console.log('got card response', res);

      if (!res.success) {
        throw new Error(ErrorType.CREATE_CARD_ERROR);
      }

      if (this.message.type !== MessageModelType.VIDEO)
        return Promise.resolve({ liveCardId: this.liveCardId, mediaUrl: res.card.image_url });

      const videoReq = new LCRequest(domain, 'videos/upload');
      videoReq.setHeader('Accept', 'application/vnd.LiveCard+json;version=1');
      videoReq.setHeader('License-Key', this.licenseKey);
      videoReq.setData('video[card_id]', res.card.id);
      videoReq.setAttachment('video[file]', this.message.content, 'video.mov');

      const videoRes = await videoReq.post();
      console.log('got video response', videoRes.card.video_url.replace('video.mov', 'video_trans.mp4'));

      return Promise.resolve({ liveCardId: this.liveCardId, mediaUrl: videoRes.card.video_url.replace('video.mov', 'video_trans.mp4') });
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
}

export default CardModel;

// uploadFlashVideo: function(serverCardId) {
//   var data = new FormData();
//   data.append("card_id", serverCardId);
//   data.append("stream_name", this.flashStreamName);

//   var request = new XMLHttpRequest();
//   request.open("POST", "https://wowzatest.live.cards/upload_video.php", true);
  
//   request.setRequestHeader("License-Key", this.licenseKey);
//   request.responseType = "json";
//   request.send(data);

//   request.addEventListener("load", () => {
//     this.debugLog("Video upload success for card id " + serverCardId);

//     var videoUrl = request.response.card.video_url.replace(
//       ".mp4",
//       "_trans.mp4"
//     );

//     this.createCardSuccessCallback(this.liveCardId, videoUrl);
//   });

//   request.addEventListener("error", error => {
//     this.debugLog("uploadVideo failure: ", error);

//     this.createCardFailureCallback(LiveCardError.CREATE_CARD_ERROR);
//   });
// },