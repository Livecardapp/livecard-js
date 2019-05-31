import dq from './dquery';
import { WebstreamAudio } from '../model/webstream';
import WebcamMixin from './webcam-mixin';
import ErrorType from '../lib/errors';
import { MessageModel } from '../model/message';

class AudioModal {
  constructor(tag, isMobile, onSuccess, onFailure) {
    this.tag = tag;
    this.isMobile = isMobile;
    this.onSuccess = onSuccess;
    this.onFailure = onFailure;
    this.cameraView = null;
    Object.assign(this, WebcamMixin());
  }

  inject(showIntro) {
    const components = this.isMobile ?
      `<input type="file" accept="audio/mp3,audio/webm,audio/wav,audio/*" capture="user" id="inputVideo" style="display: none;">` :
      `<div id="audio-placeholder"></div>`;

    dq.insert('#livecard-wrapper', this.template(components, !this.isMobile));
    dq.css('#create_video_instructions', 'display', showIntro ? 'block' : 'none');

    // close button
    const remove = this.remove.bind(this);
    dq.click('.livecard-modal-close', () => { remove(); });

    if (this.isMobile) {
      dq.change('#inputVideo', () => {
        if (document.querySelector('#inputVideo').files.length === 0)
          return this.onFailure(ErrorType.NO_VIDEO_SELECTED);
        const message = new MessageModel();
        const err = message.setContentAsVideoFromFiles(document.querySelector('#inputVideo').files);
        err === null ? this.onSuccess(message) : this.onFailure(err);
      });

      const hide = this.hide.bind(this);
      dq.click('#create_video_card_btn', () => {
        hide();
        dq.click('#inputVideo');
      });
      return;
    }

    // controls
    dq.click('#btnRecord', () => this.btnRecordClick());
    dq.click('#btnStop', () => this.btnStopClick());
    dq.click('#btnRetake', () => this.btnRetakeClick());
    dq.click('#btnPlay', () => this.btnPlayClick());
    dq.click('#btnUse', () => this.btnUseClick());

    const _showRecordingView = this._showRecordingView.bind(this);
    const onFailure = this.onFailure;
    dq.click('#create_video_card_btn', () => {
      dq.addClass('#create_video_instructions', 'livecard-fade-out');
      setTimeout(() => {
        dq.css('#create_video_instructions', 'display', 'none');
        dq.removeClass('#create_video_instructions', 'livecard-fade-out');
        dq.addClass('#video_gift_msg_modal', 'showing-video-container');
        dq.addClass('#video-container', 'livecard-fade-show-start');
        dq.addClass('#video-container', 'livecard-fade-show');
        setTimeout(() => { dq.css('#video-container', 'display', 'block'); }, 400);
      }, 400);
      _showRecordingView(onFailure);
    });
  }

  remove() {
    if (typeof this.cameraView === 'undefined' || this.cameraView === null) return;
    this._remove(this.cameraView.camera);
    this.cameraView.camera = null;
  }

  btnRecordClick() {
    this.cameraView.start();
    dq.css('#btnRecord', 'display', 'none');
    dq.css('#btnStop', 'display', 'inline');
  }

  btnStopClick() {
    this.cameraView.stop();
    dq.css('#btnStop', 'display', 'none');
    dq.css('#btnPlay', 'display', 'inline');
    dq.css('#btnRetake', 'display', 'inline');
    dq.css('#btnUse', 'display', 'inline');
  }

  btnPlayClick() {
    this.cameraView.play();
  }

  btnRetakeClick() {
    this.cameraView.retake();
    dq.css('#btnPlay', 'display', 'none');
    dq.css('#btnRetake', 'display', 'none');
    dq.css('#btnUse', 'display', 'none');
    dq.css('#btnRecord', 'display', 'inline');
  }

  btnUseClick() {
    const data = this.cameraView.data();
    const message = new MessageModel();
    const err = data.isNative ?
      message.setContentAsVideoFromCamera(data.content) :
      message.setContentAsVideoFromFlash(data.content);
    this.hide();
    err === null ? this.onSuccess(message) : this.onFailure(err);
  }

  // PRIVATE

  async _showRecordingView(onFailure) {
    const vp = 'audio-placeholder';

    try {
      this.showSpinner();
      const camera = new WebstreamAudio();
      const stream = await camera.init();

      if (typeof stream === 'undefined' || stream === null)
        throw new Error('Native video camera cannot be initialized');

      this.cameraView = new NativeAudioView(camera);
      this.cameraView.setView(vp, () => { this.hideSpinner(); });
      document.getElementById('capture').srcObject = stream;

      dq.addClass('#video-container', 'livecard-fade-show');
    } catch (error) {
      this.hideSpinner();
      onFailure(ErrorType.RECORDING_NOT_SUPPORTED);
    }
  }
}

class NativeAudioView {
  constructor(camera) {
    this.camera = camera;
  }

  setView(placeholder, loadCallback) {
    dq.before(placeholder, '<audio id="capture" autoplay muted playsinline></audio><audio id="recorded" style="display: none"></audio>');
    dq.remove(placeholder);
    dq.on('#capture', 'loadedmetadata', loadCallback);
  }

  start() {
    this.camera.start();
  }

  stop() {
    this.camera.stop();
    document.querySelector('#recorded').src = this.camera.buffer();
    dq.css('#capture', 'display', 'none');
    dq.css('#recorded', 'display', 'block');
  }

  play() {
    document.getElementById('recorded').play();
  }

  retake() {
    this.camera.reset();
    dq.css('#recorded', 'display', 'none');
    dq.css('#capture', 'display', 'block');
  }

  data() {
    dq.css('#video-container', 'display', 'none');
    document.getElementById('recorded').pause();
    if (!this.camera.stageDataForUpload()) return null;
    return { isNative: true, content: this.camera.data() };
  }
}

export default AudioModal;
