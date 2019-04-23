import VideoModal from './view/video-modal';
import MessageModal from './view/message-modal';
import ImageModal from './view/image-modal';
import ImageWebcamModal from './view/image-webcam-modal';
import CardModal from './view/card-modal';
import CameraUnsupportedModal from './view/camera-unsupported-modal';

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
  IMAGE: 1,
  TEXT: 2,
  CARD: 3,
  UNSUPPORTED: 4,
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

  if (Context.modal !== null && Context.modal.type !== ModalType.VIDEO) {
    Context.modal.remove();
    Context.modal = null;
  }

  if (Context.modal === null) {
    Context.modal = new VideoModal(ModalType.VIDEO, Context.isMobile, params.onSuccess, params.onFailure);
    Context.modal.inject(params.showIntro);
  }

  Context.modal.show();
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
    Context.modal.inject(params.showIntro, (value) => {
      Context.giftMessage = value;
      console.log('Context', Context);
      params.onSuccess();
    });
  }

  Context.modal.show();
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

  if (Context.modal !== null && Context.modal.type !== ModalType.IMAGE) {
    Context.modal.remove();
    Context.modal = null;
  }

  if (Context.modal === null) {
    const onSuccess = (type) => {
      if (type === 0) {
        params.onSuccess();
      } else if (type === 1) {
        const onCamSuccess = (url) => {
          Context.snapshotDataUrl = url;
          params.onSuccess();
        };
        Context.modal = new ImageWebcamModal(ModalType.IMAGE, onCamSuccess, params.onFailure);
        Context.modal.inject();
        Context.modal.show();
      }
    };
    Context.modal = new ImageModal(ModalType.IMAGE, Context.isMobile, onSuccess, params.onFailure);
    Context.modal.inject();
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

/**
 * Show modal informing user that video recording is not supported
 */
const showRecordingNotSupported = (params) => {
  if (Context.modal !== null && Context.modal.type !== ModalType.UNSUPPORTED) {
    Context.modal.remove();
    Context.modal = null;
  }

  if (Context.modal === null) {
    Context.modal = new CameraUnsupportedModal(ModalType.UNSUPPORTED, params.onSuccess);
    Context.modal.inject();
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
  showRecordingNotSupported,
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
