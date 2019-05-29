/**
 * LiveCard error code definitions
 * @type {object}
 * @memberof LiveCard
 * @property {number} RECORDING_NOT_SUPPORTED  Value = 0. This browser does not support recording videos.
 * @property {number} NO_VIDEO_SELECTED        Value = 1. The user did not record or select a video.
 * @property {number} NO_IMAGE_SELECTED        Value = 2. The user did not snap or select a still image.
 * @property {number} RECORDING_FAILED         Value = 3. The video recording failed.
 * @property {number} CREATE_CARD_ERROR        Value = 4. Attempting to save the card record server side failed.
 * @property {number} MISSING_PHONE            Value = 5. If requireRecipientPhone = true, this indicates a phone was not collected prior to attempting to save.
 * @property {number} MISSING_VIDEO            Value = 6. No video was provided prior to attempting to save.
 * @property {number} MISSING_TEXT             Value = 7. No text gift message was provided prior to attempting to save.
 * @property {number} MISSING_IMAGE            Value = 8. No static image was provided prior to attempting to save.
 * @property {number} CONFIRM_CARD_ERROR       Value = 9. The attempt to confirm this card (after checkout) failed.
 * @property {number} MISSING_MESSAGE          Value = 10. No message was set.
 * @property {number} IMAGE_SIZE_TOO_LARGE     Value = 11. Image too large.
 * @property {number} VIDEO_SIZE_TOO_LARGE     Value = 12. Video too large.
 * @property {number} WEBCAM_NOT_AUTHORIZED    Value = 14. User did not authorize app to use .
 */
const ErrorType = {
  RECORDING_NOT_SUPPORTED: 0,
  NO_VIDEO_SELECTED: 1,
  NO_IMAGE_SELECTED: 2,
  RECORDING_FAILED: 3,
  CREATE_CARD_ERROR: 4,
  MISSING_PHONE: 5,
  MISSING_VIDEO: 6,
  MISSING_TEXT: 7,
  MISSING_IMAGE: 8,
  CONFIRM_CARD_ERROR: 9,
  MISSING_MESSAGE: 10,
  IMAGE_SIZE_TOO_LARGE: 11,
  VIDEO_SIZE_TOO_LARGE: 12,
  WEBCAM_NOT_AUTHORIZED: 13,
};

export default ErrorType;