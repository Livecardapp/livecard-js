import dq from './dquery';
import WebcamMixin from './webcam-mixin';
import ImageCameraModel from '../model/image-camera';
import { MessageModel } from '../model/message';
import ErrorType from '../lib/errors';

class ImageWebcamModal {
  constructor(tag, onSuccess, onFailure) {
    this.tag = tag;
    this.onSuccess = onSuccess;
    this.onFailure = onFailure;
    this.camera = new ImageCameraModel();
    this.cameraView = null;
    Object.assign(this, WebcamMixin());
  }

  inject() {
    dq.insert('#livecard-wrapper', this.template('<div id="image-placeholder"></div>', true));

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

  remove() {
    this._remove(this.camera);
  }

  btnRecordClick() {
    this.cameraView.record();
    dq.css("#btnRecord", 'display', "none");
    dq.css("#btnRetake", 'display', "inline");
    dq.css("#btnUse", 'display', "inline");
  }

  btnRetakeClick() {
    this.cameraView.retake();
    dq.css("#btnRetake", 'display', "none");
    dq.css("#btnUse", 'display', "none");
    dq.css("#btnRecord", 'display', "inline");
  }

  btnUseClick() {
    this.hide();
    this.camera.stageDataForUpload();
    const message = new MessageModel();
    const err = message.setContentAsImageFromCamera(this.cameraView.image());
    err === null ? this.onSuccess(message) : this.onFailure(err);
  }

  // PRIVATE

  async _showRecordingUI(onFailure) {
    try {
      // init native camera
      this.showSpinner();
      const result = await this.camera.initNative();

      if (result.stream === null)
        throw new Error('Native image camera cannot be initialized');

      this.cameraView = new NativeCameraView();
      this.cameraView.setView('image-placeholder', () => { this.hideSpinner(); });
      document.querySelector("#capture").srcObject = result.stream;
      dq.addClass("#video-container", "livecard-fade-show");
      console.log('native image camera initialized');
    } catch (error) {
      try {
        this.hideSpinner();
        this.cameraView = new FlashCameraView('LCCapture');
        this.cameraView.setView('image-placeholder');
        this.camera.initFlash('LCCapture', 'flashContent');
        this.cameraView.adjustView();
        console.log('flash image camera initialized');
      } catch (error) {
        console.log(error);
        onFailure(ErrorType.RECORDING_NOT_SUPPORTED);
      }
    }
  }
}

class NativeCameraView {
  setView(placeholder, loadCallback) {
    const view = `
      <video id="capture" autoplay muted playsinline></video>
      <video id="recorded" style="display: none"></video>
      <canvas id="imgCanvas" style="display: none;"></canvas>`;
    dq.before(placeholder, view);
    dq.remove(placeholder);
    dq.on('#capture', 'loadedmetadata', loadCallback);
  }

  record() {
    const canvas = document.getElementById("imgCanvas");
    const captureElem = document.getElementById("capture");
    canvas.width = captureElem.clientWidth;
    canvas.height = captureElem.clientHeight;
    const canvasContext = canvas.getContext("2d");
    canvasContext.drawImage(captureElem, 0, 0, canvas.width, canvas.height);
    canvas.style.display = "block";
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
    return document.getElementById("imgCanvas").toDataURL("image/jpeg");
  }

}

class FlashCameraView {
  constructor(cameraId) {
    this.cameraId = cameraId;
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
  }

  adjustView() {
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