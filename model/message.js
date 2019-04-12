const LCMessageType = {
  VIDEO: 0,
  IMAGE: 1,
  TEXT: 2,
};

const LCMessageError = {
  TYPE_MISSING: 0,
  CONTENT_VIDEO_INVALID: 1,
  CONTENT_IMAGE_INVALID: 2,
  CONTENT_TEXT_INVALID: 3,
};

class LCMessage {
  constructor() {
    this.type = null;
    this.content = null;
  }

  setContentAsVideoFromFiles(files) {
    return this._setContentAsBlobFromFiles(LCMessageType.VIDEO, files);
  }

  setContentAsVideoFromBlobs(recordedBlobs) {
    this.content = new Blob(recordedBlobs, { type: "video/webm" });
    this.type = LCMessageType.VIDEO;
    return true;
  }

  setContentAsImageFromFiles(files) {
    return this._setContentAsBlobFromFiles(LCMessageType.IMAGE, files);
  }

  setContentAsImageFromDataURL(url) {
    if (typeof url !== 'string' || url.length === 0)
      return false;

    const parts = url.split(",");
    const mime = parts[0].match(/:(.*?);/)[1];

    if (parts[0].indexOf("base64") !== -1) {
      const bstr = atob(parts[1]);
      const n = bstr.length;
      const u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      this.content = new Blob([u8arr], { type: mime });
      this.type = LCMessageType.IMAGE;
      return true;
    }

    const raw = decodeURIComponent(parts[1]);
    this.content = new Blob([raw], { type: mime });
    this.type = LCMessageType.IMAGE;
    return true;
  }

  setContentAsText(text) {
    if (typeof text !== 'string' || text === null) return false;
    this.content = text;
    this.type = LCMessageType.TEXT;
    return true;
  }

  validate() {
    if (this.type === null)
      return LCMessageError.TYPE_MISSING;

    if (this.type === LCMessageType.VIDEO && this.content === null)
      return LCMessageError.CONTENT_VIDEO_INVALID;

    if (this.type === LCMessageType.IMAGE && this.content === null)
      return LCMessageError.CONTENT_IMAGE_INVALID;

    if (this.type === LCMessageType.TEXT && this.content === null)
      return LCMessageError.CONTENT_TEXT_INVALID;

    return null;
  }

  _setContentAsBlobFromFiles(type, files) {
    if (!Array.isArray(files) || files.length === 0) return false;
    this.content = files[0];
    this.type = type;
    return true;
  }
}

export {
  LCMessageType,
  LCMessageError,
  LCMessage,
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

// dataURLtoBlob: function(dataurl) {
//   var parts = dataurl.split(","),
//     mime = parts[0].match(/:(.*?);/)[1];
//   if (parts[0].indexOf("base64") !== -1) {
//     var bstr = atob(parts[1]),
//       n = bstr.length,
//       u8arr = new Uint8Array(n);
//     while (n--) {
//       u8arr[n] = bstr.charCodeAt(n);
//     }

//     return new Blob([u8arr], {
//       type: mime
//     });
//   } else {
//     var raw = decodeURIComponent(parts[1]);
//     return new Blob([raw], {
//       type: mime
//     });
//   }
// },

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