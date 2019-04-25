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
  CONFIRM_CARD_ERROR: 9,

  // No message was set
  MISSING_MESSAGE: 10,
};

export default ErrorType;