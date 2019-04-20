import VideoModal from './view/video-modal';
import MessageModal from './view/message-modal';
import FileView from './view/file-view';
import ImageModal from './view/image-modal';
import CardModal from './view/card-modal';
import dq from './view/dquery';

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
  // (Optional) Controls whether the SDK requires a recipient phone to create a card. Set to `false` 
  // if you do not plan to collect recipient phone for SMS delivery during the checkout process.
  requireRecipientPhone: true,
  isMobile: false,
  usingFileInput: false,
  liveCardId: '',
  recordedBlobs: [],
  snapshotDataUrl: null,
  mediaRecorder: null,
  giftMessage: '',
  recipientPhone: '',
  messageType: 'text',
  createCardSuccessCallback: null,
  createCardFailureCallback: null,
  debug: false,
  modal: null,
};

const ModalType = {
  VIDEO: 0,
  VIDEO_FILE: 1,
  IMAGE: 2,
  IMAGE_FILE: 3,
  TEXT: 4,
  CARD: 5,
};

let licenseKey = null;

/**
 * Begin the video capture flow (display in modal)
 * @param {Object}  params
 * @param {boolean} params.showIntro        Controls whether the introductory modal describing the video recording process is shown
 * @param {captureSuccess} params.onSuccess  Callback for successful recording
 * @param {captureFailure} params.onFailure  Callback for failed recording
 */
const startVideoRecording = (params) => {
  Context.messageType = 'video';

  const webcamModal = new VideoModal(ModalType.VIDEO, Context.isMobile);
  webcamModal.inject(params.onSuccess, params.onFailure);

  dq.css('#create_video_instructions', 'display', params.showIntro ? 'block' : 'none');
  // if (params.showIntro) {
  //   dq.css('#create_video_instructions', 'display', 'block');
  //   return;
  // }

  // dq.css('#create_video_instructions', 'display', 'none');
  // if (Context.isMobile) return;
  // setTimeout(function () {
  //   dq.addClass('#video_gift_msg_modal', 'showing-video-container');
  //   dq.addClass('#video-container', 'livecard-fade-show-start');
  //   dq.addClass('#video-container', 'livecard-fade-show');
  //   setTimeout(function () { dq.css('#video-container', 'display', 'block'); }, 400);
  // }, 400);
}

/**
 * Begin text gift message capture flow (displays in modal)
 * @param {Object}  params
 * @param {boolean} params.showIntro        Controls whether the introductory modal describing the text gift message process is shown
 * @param {captureSuccess} params.callback  Callback after user has entered a text gift message
 */
const showGiftTextInput = (params) => {
  Context.messageType = 'text';

  if (Context.modal !== null && Context.modal.type !== ModalType.TEXT) {
    Context.modal.remove();
    Context.modal = null;
  }

  if (Context.modal === null) {
    Context.modal = new MessageModal(ModalType.TEXT);
    Context.modal.inject((value) => {
      Context.giftMessage = value;
      console.log('Context', Context);
      params.onSuccess();
    });
  }

  Context.modal.show(params.showIntro);
};

/**
 * Begin the static image capture flow (displays in modal)
 * @param {Object}  params
 * @param {captureSuccess} params.onSuccess  Callback for successful image capture
 * @param {captureFailure} params.onFailure  Callback for failed image capture
 */
const showImageInput = (params) => {
  Context.messageType = 'image';
  Context.usingFileInput = Context.isMobile;

  const removeable = Context.modal === null ? false :
    (Context.isMobile ? Context.modal.type !== ModalType.IMAGE_FILE : Context.modal.type !== ModalType.IMAGE);

  if (removeable) {
    Context.modal.remove();
    Context.modal = null;
  }

  if (Context.modal === null) {
    Context.modal = Context.isMobile ? new FileView(ModalType.IMAGE_FILE, true) : new ImageModal(ModalType.IMAGE);
    Context.modal.inject(params.onSuccess, params.onFailure);
  }

  Context.modal.show();
};

/**
 * Begin the phone capture flow (displays in modal)
 * @param {Object}  params
 * @param {captureSuccess} params.callback  Callback for successful phone capture
 */
const showPhoneInput = (params) => {
  if (Context.modal !== null && Context.modal.type !== ModalType.CARD) {
    Context.modal.remove();
    Context.modal = null;
  }

  if (Context.modal === null) {
    Context.modal = new CardModal(ModalType.CARD);
    const onBack = () => {
      Context.modal.remove();
      Context.modal = null;
      params.onBack();
    };

    const onSuccess = (value) => {
      Context.recipientPhone = value;
      console.log('Context', Context);
      params.onSuccess();
    };

    Context.modal.inject(onBack, onSuccess);
  }

  Context.modal.show();
};

export {
  licenseKey,
  ErrorType,
  startVideoRecording,
  showGiftTextInput,
  showImageInput,
  showPhoneInput,
};

// =======================
// INITIALIZE LIVECARD APP
// =======================

document.addEventListener('DOMContentLoaded', () => {
  const livecardBox = document.createElement('div');

  livecardBox.id = 'livecard-wrapper';
  document.querySelector('body').appendChild(livecardBox);

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
  let guid = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < 6; i++)
    guid += possible.charAt(Math.floor(Math.random() * possible.length));

  Context.liveCardId = guid;

  console.log('Done init: ', Context.isMobile, Context.usingFileInput, Context.liveCardId);
});
