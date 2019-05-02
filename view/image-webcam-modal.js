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
    Object.assign(this, WebcamMixin());
  }

  inject() {
    const components = `
    <video id="capture" autoplay muted playsinline></video>
    <video id="recorded" style="display: none"></video>
    <canvas id="imgCanvas" style="display: none;"></canvas>`;
    dq.insert('#livecard-wrapper', this.template(components, true));

    // controls
    dq.on('#capture', 'loadedmetadata', () => { this.hideSpinner(); });
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
    const canvas = document.getElementById("imgCanvas");
    const captureElem = document.getElementById("capture");
    canvas.width = captureElem.clientWidth;
    canvas.height = captureElem.clientHeight;
    const canvasContext = canvas.getContext("2d");
    canvasContext.drawImage(captureElem, 0, 0, canvas.width, canvas.height);
    dq.css("#btnRecord", 'display', "none");
    dq.css("#btnRetake", 'display', "inline");
    dq.css("#btnUse", 'display', "inline");
    dq.css("#capture", 'display', "none");
    canvas.style.display = "block";
  }

  btnRetakeClick() {
    const canvas = document.getElementById("imgCanvas");
    const canvasContext = canvas.getContext("2d");
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.display = "none";
    dq.css("#capture", 'display', "block");
    dq.css("#btnRetake", 'display', "none");
    dq.css("#btnUse", 'display', "none");
    dq.css("#btnRecord", 'display', "inline");
  }

  btnUseClick() {
    const canvas = document.getElementById("imgCanvas");
    this.hide();
    this.camera.streamStop();
    const message = new MessageModel();
    const err = message.setContentAsImageFromCamera(canvas.toDataURL("image/jpeg"));
    err === null ? this.onSuccess(message) : this.onFailure(err);
  }

  // PRIVATE

  async _showRecordingUI(onFailure) {
    try {
      this.showSpinner();
      const stream = await this.camera.init();
      document.querySelector("#capture").srcObject = stream;
      dq.addClass("#video-container", "livecard-fade-show");
    } catch (error) {
      this.hideSpinner();
      onFailure(ErrorType.RECORDING_NOT_SUPPORTED);
    }
  }

}

export default ImageWebcamModal;