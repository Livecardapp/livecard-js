import dq from './dquery';
import { WebstreamAudio } from '../model/webstream';
import MediaModalMixin from './media-modal-mixin';
import ErrorType from '../lib/errors';
import { MessageModel } from '../model/message';

class AudioModal {
  constructor(tag, isMobile, onSuccess, onFailure) {
    this.tag = tag;
    this.isMobile = isMobile;
    this.onSuccess = onSuccess;
    this.onFailure = onFailure;
    this.mediaView = null;
    Object.assign(this, MediaModalMixin(this));
  }

  inject(showIntro) {
    const components = this.isMobile ?
      `<input type="file" accept="audio/mp3,audio/webm,audio/wav,audio/*" capture="user" id="inputVideo" style="display: none;">` :
      `<div id="audio-placeholder"></div>`;

    dq.insert('#livecard-wrapper', this.template(components, !this.isMobile, 'audio'));
    dq.css('#create_video_instructions', 'display', showIntro ? 'block' : 'none');

    // close button
    const remove = this.remove.bind(this);
    dq.click('.livecard-modal-close', () => { remove(); });

    if (this.isMobile) {
      dq.change('#inputVideo', () => {
        if (document.querySelector('#inputVideo').files.length === 0)
          return this.onFailure(ErrorType.NO_VIDEO_SELECTED);
        const message = new MessageModel();
        const err = message.setContentAsAudioFromFiles(document.querySelector('#inputVideo').files);
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

  btnRecordClick() {
    this.mediaView.start();
    dq.css('#btnRecord', 'display', 'none');
    dq.css('#btnStop', 'display', 'inline');
  }

  btnStopClick() {
    this.mediaView.stop();
    dq.css('#btnStop', 'display', 'none');
    dq.css('#btnPlay', 'display', 'inline');
    dq.css('#btnRetake', 'display', 'inline');
    dq.css('#btnUse', 'display', 'inline');
  }

  btnPlayClick() {
    this.mediaView.play();
  }

  btnRetakeClick() {
    this.mediaView.retake();
    dq.css('#btnPlay', 'display', 'none');
    dq.css('#btnRetake', 'display', 'none');
    dq.css('#btnUse', 'display', 'none');
    dq.css('#btnRecord', 'display', 'inline');
  }

  btnUseClick() {
    const data = this.mediaView.data();
    const message = new MessageModel();
    this.hide();
    const err = message.setContentAsAudioFromMic(data.content);
    err === null ? this.onSuccess(message) : this.onFailure(err);
  }

  // PRIVATE

  async _showRecordingView(onFailure) {
    const vp = 'audio-placeholder';

    try {
      this.showSpinner();
      const mic = new WebstreamAudio();
      const stream = await mic.init();

      if (typeof stream === 'undefined' || stream === null)
        throw new Error('Native video mic cannot be initialized');

      this.mediaView = new NativeAudioView(mic);
      this.mediaView.setView(vp, () => { this.hideSpinner(); });
      document.getElementById('capture').srcObject = stream;

      dq.addClass('#video-container', 'livecard-fade-show');
    } catch (error) {
      this.hideSpinner();
      onFailure(ErrorType.RECORDING_NOT_SUPPORTED);
    }
  }
}

class NativeAudioView {
  constructor(device) {
    this.device = device;
  }

  setView(placeholder, loadCallback) {
    // https://www.flaticon.com/free-icon/voice-recorder_254014
    const template = `
      <div id="mic-vol"></div>
      <img id="icon-microphone" src="/livecard-sdk/images/voice-recorder.png" alt="voice-recorder.png" />
      <audio id="capture" autoplay muted playsinline></audio>
      <audio id="recorded" style="display: none"></audio>`;
    dq.before(placeholder, template);
    dq.remove(placeholder);
    dq.on('#capture', 'loadedmetadata', loadCallback);
  }

  start() {
    this.device.start();
    this.device.startVisuals(this._visualizeAudioData);
  }

  stop() {
    this.device.stop();
    this.device.stopVisuals();
    document.querySelector('#recorded').src = this.device.buffer();
    dq.css('#capture', 'display', 'none');
    dq.css('#recorded', 'display', 'block');
  }

  play() {
    document.getElementById('recorded').play();
  }

  retake() {
    this.device.reset();
    dq.css('#recorded', 'display', 'none');
    dq.css('#capture', 'display', 'block');
  }

  data() {
    dq.css('#video-container', 'display', 'none');
    document.getElementById('recorded').pause();
    if (!this.device.stageDataForUpload()) return null;
    return { content: this.device.data() };
  }

  _visualizeAudioData(data) {
    const volume = document.getElementById('mic-vol');
    const recorderControlBarHeight = 30; // value is constant at 30px
    const sizePercentageBuffer = 0.9;
    const box = volume.parentElement;
    const size = parseInt(Math.min(box.offsetWidth, box.offsetHeight - recorderControlBarHeight) * sizePercentageBuffer);
    console.log(`volume: ${data}, max size of volume indicator: ${size}`);
  }
}

export default AudioModal;
