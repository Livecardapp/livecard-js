import VideoModal from './view/video-modal';
import MessageModal from './view/message-modal';
import ImageModal from './view/image-modal';
import ImageWebcamModal from './view/image-webcam-modal';
import PhoneModal from './view/phone-modal';
import CameraUnsupportedModal from './view/camera-unsupported-modal';
import ErrorType from './lib/errors';
import CardModel from './model/card';

/**
 * @file See {@link LiveCard} for library properties and methods
 * @author LiveCard LLC
 */

const Settings = {
  licenseKey: null,

  // (Optional) Controls whether the SDK requires a recipient phone to create a card. Set to `false` 
  // if you do not plan to collect recipient phone for SMS delivery during the checkout process.
  requireRecipientPhone: true,
};

const Context = {
  isMobile: false,
  liveCardId: null,
  recipientPhone: null,
  debug: false,
  modal: null,
  message: null,
};

const ModalType = {
  VIDEO: 0,
  IMAGE: 1,
  TEXT: 2,
  CARD: 3,
  UNSUPPORTED: 4,
};

/**
 * Begin the video capture flow (display in modal)
 * @param {Object}  params
 * @param {boolean} params.showIntro        Controls whether the introductory modal describing the video recording process is shown
 * @param {captureSuccess} params.onSuccess  Callback for successful recording
 * @param {captureFailure} params.onFailure  Callback for failed recording
 */
const startVideoRecording = (params) => {
  if (Context.modal !== null && Context.modal.type !== ModalType.VIDEO) {
    Context.modal.remove();
    Context.modal = null;
  }

  if (Context.modal === null) {
    const onSuccessFromVideoInput = (videoMessage) => {
      Context.message = videoMessage;
      console.log('onSuccess video message', Context.message);
      params.onSuccess();
    };
    Context.modal = new VideoModal(ModalType.VIDEO, Context.isMobile, onSuccessFromVideoInput, params.onFailure);
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
  if (Context.modal !== null && Context.modal.type !== ModalType.TEXT) {
    Context.modal.remove();
    Context.modal = null;
  }

  if (Context.modal === null) {
    Context.modal = new MessageModal(ModalType.TEXT);
    const onSuccessFromTextInput = (textMessage) => {
      Context.message = textMessage;
      console.log('onSuccess text message', Context.message);
      params.onSuccess();
    };
    Context.modal.inject(params.showIntro, onSuccessFromTextInput);
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
  if (Context.modal !== null && Context.modal.type !== ModalType.IMAGE) {
    Context.modal.remove();
    Context.modal = null;
  }

  if (Context.modal === null) {
    const onSuccessFromImageSourceSelection = (imageMessageFromFile) => {
      if (imageMessageFromFile !== null) {
        Context.message = imageMessageFromFile;
        console.log('onSuccess file image message', Context.message);
        params.onSuccess();
        return;
      }

      const onSuccessFromCamera = (imageMessageFromCamera) => {
        Context.message = imageMessageFromCamera;
        console.log('onSuccess camera image message', Context.message);
        params.onSuccess();
      };

      Context.modal = new ImageWebcamModal(ModalType.IMAGE, onSuccessFromCamera, params.onFailure);
      Context.modal.inject();
      Context.modal.show();
    };

    Context.modal = new ImageModal(ModalType.IMAGE, Context.isMobile, onSuccessFromImageSourceSelection, params.onFailure);
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
    Context.modal = new PhoneModal(ModalType.CARD);
    const onBack = () => {
      Context.modal.remove();
      Context.modal = null;
      params.onBack();
    };

    const onSuccess = (value) => {
      Context.recipientPhone = value;
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

/**
* Indicates successful request to create gift message
*
* @param {string} liveCardId   The unique identifier assigned to this gift message by LiveCard
* @param {string} imageUrl     The direct URL to the image or video associated with this gift message
* @callback createSuccess
*/

/**
* Indicates successful request to confirm gift message
*
* @callback confirmSuccess
*/

/**
 * Attempt to save gift message record
 * @param {Object}  params
 * @param {createSuccess} params.callback  Callback after successful save of gift message record
 * @param {serverFailure} params.callback  Callback after failure to save gift message record
 */
const createCard = async (params) => {
  const card = new CardModel(Settings.licenseKey, Context.liveCardId, Settings.requireRecipientPhone);
  card.setRecipientPhoneNumber(Context.recipientPhone);
  card.setMessage(Context.message);
  const err = card.validate();

  if (err !== null) {
    params.onFailure(err);
    return;
  }

  try {
    const result = await card.setOrder();
    params.onSuccess(result.liveCardId, result.mediaUrl);
  } catch (error) {
    params.onFailure(error);
  }
};

export {
  ErrorType,
  Settings,
  startVideoRecording,
  showGiftTextInput,
  showImageInput,
  showPhoneInput,
  showRecordingNotSupported,
  createCard,
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

  // init live card id
  let guid = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < 6; i++)
    guid += possible.charAt(Math.floor(Math.random() * possible.length));

  Context.liveCardId = guid;

  console.log('Done init: ', Context.isMobile, Context.liveCardId);
});
