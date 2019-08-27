import dq from './dquery';
import MediaModalMixin from './media-modal-mixin';
import { WebstreamImage } from '../model/webstream';
import { FlashImage } from '../model/flashstream';
import { MessageModel } from '../model/message';
import ErrorType from '../lib/errors';

class ImageWebcamModal {
  constructor(tag, asset, onSuccess, onFailure) {
    this.tag = tag;
    this.swfExpressInstall = asset.swfExpressInstall();
    this.swfLCCapture = asset.swfLCCapture();
    this.onSuccess = onSuccess;
    this.onFailure = onFailure;
    this.mediaView = null;
    Object.assign(this, MediaModalMixin(this, asset));
  }

  inject() {
    dq.insert('#livecard-wrapper', this.template('<div id="image-placeholder"></div>', true, 'image'));

    // controls
    dq.click('#btnRecord', () => this.btnRecordClick());
    dq.click('#btnRetake', () => this.btnRetakeClick());
    dq.click('#btnUse', () => this.btnUseClick());

    const _showRecordingUI = this._showRecordingUI.bind(this);
    const onFailure = this.onFailure;

    dq.addClass('#create_video_instructions', 'livecard-fade-out');
    setTimeout(() => {
      dq.css('#create_video_instructions', 'display', 'none');
      dq.removeClass('#create_video_instructions', 'livecard-fade-out');
      dq.addClass('#video_gift_msg_modal', 'showing-video-container');
      dq.addClass('#video-container', 'livecard-fade-show-start');
      dq.addClass('#video-container', 'livecard-fade-show');
      setTimeout(() => { dq.css('#video-container', 'display', 'block'); }, 400);
      _showRecordingUI(onFailure);
    }, 400);

    const remove = this.remove.bind(this);
    dq.click('.livecard-modal-close', () => { remove(); });
  }

  btnRecordClick() {
    this.mediaView.record();
    dq.css("#btnRecord", 'display', "none");
    dq.css("#btnRetake", 'display', "inline");
    dq.css("#btnUse", 'display', "inline");
  }

  btnRetakeClick() {
    this.mediaView.retake();
    dq.css("#btnRetake", 'display', "none");
    dq.css("#btnUse", 'display', "none");
    dq.css("#btnRecord", 'display', "inline");
  }

  btnUseClick() {
    this.hide();
    const message = new MessageModel();
    const err = message.setContentAsImageFromCamera(this.mediaView.image());
    err === null ? this.onSuccess(message) : this.onFailure(err);
  }

  // PRIVATE

  async _showRecordingUI(onFailure) {
    try {
      // init native camera
      this.showSpinner();
      const camera = new WebstreamImage();
      const stream = await camera.initialize();

      if (typeof stream === 'undefined' || stream === null)
        throw new Error('Native image camera cannot be initialized');

      this.mediaView = new NativeCameraView(camera);
      this.mediaView.setView('image-placeholder', () => { this.hideSpinner(); });
      document.querySelector("#capture").srcObject = stream;
      dq.addClass("#video-container", "livecard-fade-show");
      console.log('native image camera initialized');
    } catch (error) {
      this.hideSpinner();

      if (error.name === 'NotAllowedError')
        return onFailure(ErrorType.RECORDING_UNAUTHROIZED);

      try {
        this.mediaView = new FlashCameraView('LCCapture', this.swfExpressInstall, this.swfLCCapture);
        this.mediaView.setView('image-placeholder');
        console.log('flash image camera initialized');
      } catch (error) {
        console.log(error);
        onFailure(ErrorType.RECORDING_NOT_SUPPORTED);
      }
    }
  }
}

class NativeCameraView {
  constructor(device) {
    this.device = device;
  }

  setView(placeholder, loadCallback) {
    const view = `
      <video id="capture" autoplay muted playsinline></video>
      <canvas id="imgCanvas" style="display: none;"></canvas>`;
    dq.before(placeholder, view);
    dq.remove(placeholder);
    dq.on('#capture', 'loadedmetadata', loadCallback);
  }

  record() {
    const canvas = document.getElementById("imgCanvas");
    const captureElem = document.getElementById("capture");
    canvas.width = captureElem.videoWidth;
    canvas.height = captureElem.videoHeight;
    const canvasContext = canvas.getContext("2d");
    canvasContext.drawImage(captureElem, 0, 0, canvas.width, canvas.height);
    canvas.style.display = "block";
    // alert(`client: ${captureElem.clientWidth}x${captureElem.clientHeight}, video: ${captureElem.videoWidth}x${captureElem.videoHeight}, canvas: ${canvas.width}x${canvas.height}`);
    dq.css("#capture", 'display', "none");
  }

  retake() {
    const canvas = document.getElementById("imgCanvas");
    const canvasContext = canvas.getContext("2d");
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.display = "none";
    dq.css("#capture", 'display', "block");
  }

  image() {
    this.device.streamStop();
    return document.getElementById("imgCanvas").toDataURL("image/jpeg");
  }

}

class FlashCameraView {
  constructor(cameraId, swfExpressInstall, swfLCCapture) {
    this.cameraId = cameraId;
    this.device = new FlashImage(cameraId, swfExpressInstall, swfLCCapture);
    this.imageString = null;
  }

  setView(placeholder) {
    const pageHost = ((document.location.protocol == "https:") ? "https://" : "http://");
    const view = `
    <div id="flashContent">
      <p>To view this page ensure that Adobe Flash Player version 16.0.0 or greater is installed.</p>
      <a href="http://www.adobe.com/go/getflashplayer">
        <img src='${pageHost}www.adobe.com/images/shared/download_buttons/get_flash_player.gif' alt='Get Adobe Flash player' />
      </a>
    </div>
    <canvas id="imgCanvas" style="display: none;"></canvas>`;
    dq.before(placeholder, view);
    dq.remove(placeholder);
    this.device.init('flashContent');
    dq.css(`#${this.cameraId}`, 'position', 'absolute');
    dq.css(`#${this.cameraId}`, 'top', '0px');
    dq.css(`#${this.cameraId}`, 'left', '0px');
  }

  record() {
    const capturedImage = document.getElementById(this.cameraId).captureImage();
    this.imageString = `data:image/jpeg;base64,${capturedImage}`;
  }

  retake() {
    document.getElementById(this.cameraId).record();
  }

  image() {
    return this.imageString;
  }
}

export default ImageWebcamModal;