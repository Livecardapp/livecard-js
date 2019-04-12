class LCRequest {
  constructor(baseURL) {
    this.baseURL = baseURL;
    window.fetch ? Object.assign(this, FetchMixin()) : Object.assign(this, HTTPMixin());
  }

  async post(path, headers, data) {
    return this._mutate("POST", `${this.baseURL}/${path}`, headers, data);
  }

  async put(path, headers, data) {
    return this._mutate("PUT", `${this.baseURL}/${path}`, headers, data);
  }

  async _mutate(type, path, headers, data) {
    if (typeof headers !== 'object' || headers === null || Object.keys(headers).length === 0)
      return Promise.reject(new Error(`LCRequest: ${type}, ${path}. Invalid headers.`));

    if (typeof data !== 'object' || data === null || Object.keys(data).length === 0)
      return Promise.reject(new Error(`LCRequest: ${type}, ${path}. Invalid data.`));

    const formData = new FormData();
    Object.keys(data).forEach(key => { formData.append(key, data[key]); });

    return this._execMutation(type, `${this.baseURL}/${path}`, headers, formData);
  }
}

const HTTPMixin = () => {
  return {
    _execMutation: async (method, url, headers, formData) => {
      const request = new XMLHttpRequest();
      Object.keys(headers).forEach(key => { request.setRequestHeader(key, headers[key]); });
      request.open(method, url, true);
      request.send(formData);
      return new Promise((resolve, reject) => {
        request.addEventListener('load', () => { resolve(); });
        request.addEventListener('error', error => { reject(error); });
      });
    },
  };
};

const FetchMixin = () => {
  return {
    _execMutation: async (method, url, headers, formData) => {
      return fetch(url, { method, headers, body: formData });
    },
  };
};

export default LCRequest;

// confirmCard: function(params) {
//   this.debugLog("confirmCard");

//   var formData = new FormData();
//   formData.append("card[livecard_id]", this.liveCardId);
//   formData.append("card[order_confirmed]", true);

//   var request = new XMLHttpRequest();
//   request.open(
//     "PUT",
//     "https://api.livecard.cards/api/cards/update_order",
//     true
//   );
//   request.setRequestHeader(
//     "Accept",
//     "application/vnd.LiveCard+json;version=1"
//   );
//   request.setRequestHeader("License-Key", this.licenseKey);
//   request.send(formData);

//   request.addEventListener("load", () => {
//     this.debugLog("Order confirmed for LiveCard id " + this.liveCardId);
//     params.onSuccess();
//   });

//   request.addEventListener("error", error => {
//     this.debugLog("confirmCard failure:", error);
//     params.onFailure(LiveCardError.CONFIRM_CARD_ERROR);
//   });
// },

// ============================================================================================

// uploadVideo: function(serverCardId) {
//   var data = new FormData();

//   if (this.usingFileInput) {
//     data.append(
//       "video[file]",
//       document.querySelector("#inputVideo").files[0]
//     );
//   } else {
//     var videoBuffer = new Blob(this.recordedBlobs, {
//       type: "video/webm"
//     });
//     data.append("video[file]", videoBuffer, "video.mov");
//   }

//   data.append("video[card_id]", serverCardId);

//   this.debugLog("Uploading video for card id " + serverCardId + "...");

//   var request = new XMLHttpRequest();
//   request.open("POST", "https://api.livecard.cards/api/videos/upload", true);
//   request.setRequestHeader(
//     "Accept",
//     "application/vnd.LiveCard+json;version=1"
//   );
//   request.setRequestHeader("License-Key", this.licenseKey);
//   request.responseType = "json";
//   request.send(data);

//   request.addEventListener("load", () => {
//     this.debugLog("Video upload success for card id " + serverCardId);

//     var videoUrl = request.response.card.video_url.replace(
//       "video.mov",
//       "video_trans.mp4"
//     );

//     this.createCardSuccessCallback(this.liveCardId, videoUrl);
//   });

//   request.addEventListener("error", error => {
//     this.debugLog("uploadVideo failure: ", error);

//     this.createCardFailureCallback(LiveCardError.CREATE_CARD_ERROR);
//   });
// },

// ============================================================================================

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