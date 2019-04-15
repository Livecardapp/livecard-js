/**
 * @file See {@link LiveCard} for library properties and methods
 * @author LiveCard LLC
 */

const ErrorType = {
  // This browser does not support recording videos
  RECORDING_NOT_SUPPORTED: 0,

  // The user did not record or select a video
  NO_VIDEO_SELECTED: 1,

  // The user did not snap or select a still image
  NO_IMAGE_SELECTED: 2,

  // The video recording failed
  RECORDING_FAILED: 3,

  // Attempting to save the card record server side failed
  CREATE_CARD_ERROR: 4,

  // If `requireRecipientPhone` was enabled, this indicates a phone was not collected prior to attempting to save
  MISSING_PHONE: 5,

  // No video was provided prior to attempting to save
  MISSING_VIDEO: 6,

  // No text gift message was provided prior to attempting to save
  MISSING_TEXT: 7,

  // No static image was provided prior to attempting to save
  MISSING_IMAGE: 8,

  // The attempt to confirm this card (after checkout) failed
  CONFIRM_CARD_ERROR: 9
};

const Context = {
  licenseKey: null,

  // (Optional) Controls whether the SDK requires a recipient phone to create a card. Set to `false` 
  // if you do not plan to collect recipient phone for SMS delivery during the checkout process.
  requireRecipientPhone: true,

  isMobile: false,
  usingFileInput: false,
  liveCardId: "",
  recordedBlobs: [],
  snapshotDataUrl: null,
  mediaRecorder: null,
  giftMessage: "",
  recipientPhone: "",
  messageType: "text",
  videoRecordSuccessCallback: null,
  videoRecordFailureCallback: null,
  imageChooseSuccessCallback: null,
  imageChooseFailureCallback: null,
  createCardSuccessCallback: null,
  createCardFailureCallback: null,
  phoneInputCallback: null,
  giftTextInputCallback: null,
  debug: false,
};

const Resources = {};

export {
  ErrorType,
  Context,
  Resources,
};

// =======================
// INITIALIZE LIVECARD APP
// =======================

document.addEventListener("DOMContentLoaded", function () {
  // detect mobile
  if (
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i)
  ) {
    Context.isMobile = true;
  } else {
    Context.isMobile = false;
  }

  // init file input flag
  Context.usingFileInput = Context.isMobile;

  // init live card id
  let guid = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++)
    guid += possible.charAt(Math.floor(Math.random() * possible.length));

  Context.liveCardId = guid;

  console.log('Done init: ', Context.isMobile, Context.usingFileInput, Context.liveCardId);
});
