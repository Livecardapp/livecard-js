import './livecard.scss';
import VideoModal from './view/video-modal';
import MessageModal from './view/message-modal';
import ImageModal from './view/image-modal';
import ImageWebcamModal from './view/image-webcam-modal';
import PhoneModal from './view/phone-modal';
import CameraUnsupportedModal from './view/camera-unsupported-modal';
import ErrorType from './lib/errors';
import CardModel from './model/card';
import AudioModal from './view/audio-modal';

const Context = {
  isMobile: false,
  liveCardId: null,
  recipientPhone: null,
  debug: false,
  modal: null,
  message: null,
  onFlashWebcamNotInstalled: () => { },
  onFlashWebcamNotAuthorized: () => { },
  onFlashMicNotInstalled: () => { console.log('No microphone installed'); },
  onFlashMicLevelUpdated: (event) => { },
};

const ModalType = {
  TEXT: 0, AUDIO: 1, IMAGE: 2, VIDEO: 3, CARD: 4, UNSUPPORTED: 5,
};

const resetModal = () => {
  Context.modal.remove();
  Context.modal = null;
};

// ================= LIVECARD FLASH CALLBACKS (START) =================

const noCameraInstalled = () => { Context.onFlashWebcamNotInstalled(); };
const cameraDenied = () => { Context.onFlashWebcamNotAuthorized(); };
const noMicrophoneInstalled = () => { Context.onFlashMicNotInstalled(); };
const updateMicLevel = (event) => { Context.onFlashMicLevelUpdated(event); };

const setFlashcamErrorHandling = (onFailure) => {
  Context.onFlashWebcamNotInstalled = () => {
    resetModal();
    onFailure(ErrorType.RECORDING_NOT_SUPPORTED);
  };
  Context.onFlashWebcamNotAuthorized = () => {
    resetModal();
    onFailure(ErrorType.RECORDING_UNAUTHROIZED);
  };
  Context.onFlashMicNotInstalled = () => {
    resetModal();
    onFailure(ErrorType.RECORDING_NOT_SUPPORTED);
  };
};

// ================= LIVECARD FLASH CALLBACKS (END) ===================

// ================= JSDOC GLOBAL DEFINITIONS (START) =================

/**
 * @file See {@link LiveCard} for library properties and methods
 * @author LiveCard LLC
 */

/**
 * LiveCard API Object
 * @namespace LiveCard
 */

/**
 * Indicates successful request to confirm gift message
 * @callback successCallback
 */

/**
  * Indicates failed request to create or confirm gift message
  *
  * @callback failureCallback
  * @param {LiveCardError} errorCode
  */

// ================= JSDOC GLOBAL DEFINITIONS (END) ===================

/**
 * Configuration settings used for the LiveCard API.
 * @type {object}
 * @memberof LiveCard
 * @property {string} licenseKey (Required) License key of your LiveCard account.
 * @property {boolean} requireRecipientPhone (Optional) Controls whether the SDK requires a recipient phone to create a card. Set to 'false' if you do not plan to collect recipient phone for SMS delivery during the checkout process.
 */
const Settings = {
  licenseKey: null,
  requireRecipientPhone: true,
};

/**
 * Begin text gift message capture flow (displays in modal)
 * @memberof LiveCard
 * @param {Object}  params
 * @param {boolean} params.showIntro    Controls whether the introductory modal describing the text gift message process is shown
 * @param {successCallback} params.onSuccess  Callback after user has entered a text gift message
 * @param {failureCallback} params.onFailure  Callback after user has entered a text gift message
 */
const showGiftTextInput = (params) => {
  if (Context.modal !== null && Context.modal.type !== ModalType.TEXT)
    resetModal();

  if (Context.modal === null) {
    Context.modal = new MessageModal(ModalType.TEXT);
    const onSuccessFromTextInput = (textMessage) => {
      Context.message = textMessage;
      resetModal();
      params.onSuccess();
    };
    const onFailureFromTextInput = (errorCode) => {
      resetModal();
      params.onFailure(errorCode);
    };
    Context.modal.inject(params.showIntro, onSuccessFromTextInput, onFailureFromTextInput);
  }

  Context.modal.show();
};

/**
 * Begin the audio capture flow (display in modal)
 * @memberof LiveCard
 * @param {Object}  params
 * @param {boolean} params.showIntro        Controls whether the introductory modal describing the video recording process is shown
 * @param {successCallback} params.onSuccess  Callback for successful recording
 * @param {failureCallback} params.onFailure  Callback for failed recording
 */
const startAudioRecording = (params) => {
  if (Context.modal !== null && Context.modal.type !== ModalType.AUDIO)
    resetModal();

  if (Context.modal === null) {
    const onSuccessFromAudioInput = (audioMessage) => {
      Context.message = audioMessage;
      resetModal();
      Context.onFlashMicLevelUpdated = (event) => { };
      params.onSuccess();
    };

    setFlashcamErrorHandling(params.onFailure);

    const onFailureFromAudioInput = (errorCode) => {
      Context.onFlashMicLevelUpdated = (event) => { };
      params.onFailure(errorCode);
    };

    Context.modal = new AudioModal(ModalType.AUDIO, Context.isMobile, onSuccessFromAudioInput, onFailureFromAudioInput);
    Context.onFlashMicLevelUpdated = Context.modal.onFlashMicLevelUpdated.bind(Context.modal);
    Context.modal.inject(params.showIntro);
  }

  Context.modal.show();
}

/**
 * Begin the static image capture flow (displays in modal)
 * @memberof LiveCard
 * @param {Object}  params
 * @param {successCallback} params.onSuccess  Callback for successful image capture
 * @param {failureCallback} params.onFailure  Callback for failed image capture
 */
const showImageInput = (params) => {
  if (Context.modal !== null && Context.modal.type !== ModalType.IMAGE)
    resetModal();

  if (Context.modal === null) {
    const onSuccessFromImageSourceSelection = (imageMessageFromFile) => {
      if (imageMessageFromFile !== null) {
        Context.message = imageMessageFromFile;
        resetModal();
        params.onSuccess();
        return;
      }

      setFlashcamErrorHandling(params.onFailure);

      const onSuccessFromCamera = (imageMessageFromCamera) => {
        Context.message = imageMessageFromCamera;
        resetModal();
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
 * Begin the video capture flow (display in modal)
 * @memberof LiveCard
 * @param {Object}  params
 * @param {boolean} params.showIntro        Controls whether the introductory modal describing the video recording process is shown
 * @param {successCallback} params.onSuccess  Callback for successful recording
 * @param {failureCallback} params.onFailure  Callback for failed recording
 */
const startVideoRecording = (params) => {
  if (Context.modal !== null && Context.modal.type !== ModalType.VIDEO)
    resetModal();

  if (Context.modal === null) {
    const onSuccessFromVideoInput = (videoMessage) => {
      Context.message = videoMessage;
      resetModal();
      params.onSuccess();
    };

    setFlashcamErrorHandling(params.onFailure);

    Context.modal = new VideoModal(ModalType.VIDEO, Context.isMobile, onSuccessFromVideoInput, params.onFailure);
    Context.modal.inject(params.showIntro);
  }

  Context.modal.show();
}

/**
 * Indicates that the back button has been clicked
 * @callback backNavigationCallback
 */

/**
 * Begin the phone capture flow (displays in modal)
 * @memberof LiveCard
 * @param {Object}  params
 * @param {successCallback} params.onSuccess     Callback for successful phone capture
 * @param {backNavigationCallback} params.onBack Callback for back navigation event
 */
const showPhoneInput = (params) => {
  if (Context.modal !== null && Context.modal.type !== ModalType.CARD)
    resetModal();

  if (Context.modal === null) {
    Context.modal = new PhoneModal(ModalType.CARD);
    const onBack = () => {
      resetModal();
      params.onBack();
    };

    const onSuccess = (value) => {
      Context.recipientPhone = value;
      resetModal();
      params.onSuccess();
    };

    Context.modal.inject(onBack, onSuccess);
  }

  Context.modal.show();
};

/**
 * Show modal informing user that video recording is not supported
 * @memberof LiveCard
 */
const showRecordingNotSupported = () => {
  if (Context.modal !== null && Context.modal.type !== ModalType.UNSUPPORTED)
    resetModal();

  if (Context.modal === null) {
    Context.modal = new CameraUnsupportedModal(ModalType.UNSUPPORTED);
    Context.modal.inject();
  }

  Context.modal.show();
};

/**
 * Indicates successful request to create gift message
 * @callback createCardSuccessCallback
 * @param {string} liveCardId   The unique identifier assigned to this gift message by LiveCard
 * @param {string} imageUrl     The direct URL to the image or video associated with this gift message
 */

/**
 * Attempt to save gift message record
 * @memberof LiveCard
 * @param {Object} params
 * @param {createCardSuccessCallback} params.onSuccess  Callback after successful save of gift message record
 * @param {failureCallback} params.onFailure            Callback after failure to save gift message record
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
    const result = await card.createOrder();
    params.onSuccess(result.liveCardId, result.mediaUrl);
  } catch (error) {
    params.onFailure(error);
  }
};

/**
 * Attempt to confirm gift message record when user completes checkout
 * @memberof LiveCard
 * @param {Object}  params
 * @param {successCallback} params.onSuccess  Callback after successful confirmation of gift message record
 * @param {failureCallback} params.onFailure  Callback after failure to confirm gift message record
 */
const confirmCard = async (params) => {
  try {
    const card = new CardModel(Settings.licenseKey, Context.liveCardId);
    await card.confirmOrder();
    params.onSuccess();
  } catch (error) {
    params.onFailure(error);
  }
}

export {
  ErrorType,
  Settings,
  showGiftTextInput,
  startAudioRecording,
  showImageInput,
  startVideoRecording,
  showPhoneInput,
  showRecordingNotSupported,
  createCard,
  confirmCard,
  noCameraInstalled,
  cameraDenied,
  noMicrophoneInstalled,
  updateMicLevel,
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
