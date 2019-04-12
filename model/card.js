import LCRequest from '../lib/request';

const LCCardError = {
  RECIPIENT_PHONE: 0,
  MESSAGE_TYPE: 1,
  MESSAGE_CONTENT: 2,
};

class LCCard {
  constructor(recipientPhone, messagetype, messageContent) {
    this.recipientPhone = recipientPhone;
    this.messageType = messagetype;
    this.messageContent = messageContent;
  }

  invalid() {
    if (typeof this.recipientPhone !== 'string' || this.recipientPhone.length === 0)
      return LCCardError.RECIPIENT_PHONE;

    if (typeof this.messageType !== 'string' || !['video', 'image', 'text'].includes())
      return LCCardError.MESSAGE_TYPE;

    if (typeof this.messageContent === 'undefined' || this.messageContent === null || this.messageContent.length === 0)
      return LCCardError.MESSAGE_CONTENT;

    return null;
  }

  async save() {
    const code = this.invalid();
    if (code !== null)
      return Promise.reject(new Error(code));

    // todo
  }
}

export {
  LCCardError,
  LCCard
};

// createCard: function(params) {
//   this.debugLog("Creating card with params", params);

//   this.createCardSuccessCallback = params.onSuccess;
//   this.createCardFailureCallback = params.onFailure;

//   if (this.requireRecipientPhone && this.recipientPhone === "") {
//     this.debugLog('recipientPhone === ""');
//     this.createCardFailureCallback(LiveCardError.MISSING_PHONE);
//     return;
//   }

//   if (
//     this.messageType === "video" &&
//     ((!this.usingFileInput && this.recordedBlobs.length === 0) ||
//       (this.usingFileInput &&
//         document.querySelector("#inputVideo").files.length === 0))
//   ) {
//     this.createCardFailureCallback(LiveCardError.MISSING_VIDEO);
//     return;
//   }

//   if (
//     this.messageType === "image" &&
//     ((!this.usingFileInput && this.snapshotDataUrl === null) ||
//       (this.usingFileInput &&
//         document.querySelector("#inputImage").files.length === 0))
//   ) {
//     this.createCardFailureCallback(LiveCardError.MISSING_IMAGE);
//     return;
//   }

//   if (this.messageType === "text" && this.giftMessage.length === 0) {
//     this.debugLog("error here");
//     this.createCardFailureCallback(LiveCardError.MISSING_TEXT);
//     return;
//   }

//   var postData = new FormData();
//   postData.append("card[livecard_id]", this.liveCardId);

//   if (this.recipientPhone !== "") {
//     postData.append("card[recipient_phone_number]", this.recipientPhone);
//   }

//   if (this.messageType === "text") {
//     postData.append("card[gift_message]", this.giftMessage);
//   } else if (this.messageType === "image") {
//     if (this.usingFileInput) {
//       postData.append(
//         "card[file]",
//         document.querySelector("#inputImage").files[0]
//       );
//     } else {
//       postData.append("card[file]", this.dataURLtoBlob(this.snapshotDataUrl));
//     }
//   }

//   var request = new XMLHttpRequest();
//   request.open("POST", "https://api.livecard.cards/api/cards", true);
//   request.setRequestHeader(
//     "Accept",
//     "application/vnd.LiveCard+json;version=1"
//   );
//   request.setRequestHeader("License-Key", this.licenseKey);
//   request.responseType = "json";
//   request.send(postData);

//   request.addEventListener("load", () => {
//     this.debugLog("Success! Server card id: ", request.response.card.id);

//     if (this.messageType === "video") {
//       this.uploadVideo(request.response.card.id);
//     } else {
//       var imageUrl = request.response.card.image_url;

//       this.createCardSuccessCallback(this.liveCardId, imageUrl);
//     }
//   });

//   request.addEventListener("error", error => {
//     this.debugLog("createCard failure: ", error);

//     this.createCardFailureCallback(LiveCardError.CREATE_CARD_ERROR);
//   });
// },