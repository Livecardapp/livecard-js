import dq from './dquery';
import { WebstreamAudio } from '../model/webstream';
import { FlashAudio } from '../model/flashstream';
import MediaModalMixin from './media-modal-mixin';
import ErrorType from '../lib/errors';
import { MessageModel } from '../model/message';

class AudioModal {
  constructor(tag, asset, onSuccess, onFailure) {
    this.tag = tag;
    this.micIcon = asset.iconMic();
    this.swfExpressInstall = asset.swfExpressInstall();
    this.swfLCCapture = asset.swfLCCapture();
    this.onSuccess = onSuccess;
    this.onFailure = onFailure;
    this.mediaView = null;
    Object.assign(this, MediaModalMixin(this, asset));
  }

  inject(showIntro) {
    dq.insert('#livecard-wrapper', this.template('<div id="audio-placeholder"></div>', true, 'audio'));
    dq.css('#create_video_instructions', 'display', showIntro ? 'block' : 'none');

    // close button
    const remove = this.remove.bind(this);
    dq.click('.livecard-modal-close', () => { remove(); });

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
    if (this.mediaView.isNative())
      this.mediaView.start()
    else {
      this.mediaView.start();
      this.mediaView.setIcon(this.micIcon);
    }
    dq.css('#btnRecord', 'display', 'none');
    dq.css('#btnStop', 'display', 'inline');
  }

  btnStopClick() {
    this.mediaView.stop();
    if (this.mediaView.isNative())
      this._resizeVolume('mic-vol', 0, 0);
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
    const err = this.mediaView.isNative() ? message.setContentAsAudioFromMic(data) : message.setContentAsAudioFromFlash(data);
    err === null ? this.onSuccess(message) : this.onFailure(err);
  }

  onFlashMicLevelUpdated(event) {
    if (this.mediaView.isNative()) return;
    this._visualizeAudioData(event);
  }

  // PRIVATE

  async _showRecordingView(onFailure) {
    const vp = 'audio-placeholder';

    try {
      this.showSpinner();
      const mic = new WebstreamAudio(this._visualizeAudioData.bind(this));
      const stream = await mic.initialize();

      if (typeof stream === 'undefined' || stream === null)
        throw new Error('Native video mic cannot be initialized');

      this.mediaView = new NativeAudioView(mic);
      this.mediaView.setView(this.micIcon, vp, () => { this.hideSpinner(); });
      document.getElementById('capture').srcObject = stream;

      dq.addClass('#video-container', 'livecard-fade-show');
    } catch (error) {
      this.hideSpinner();

      if (error.name === 'NotAllowedError')
        return onFailure(ErrorType.RECORDING_UNAUTHROIZED);

      try {
        this.mediaView = new FlashAudioView('LCCapture', this.swfExpressInstall, this.swfLCCapture);
        this.mediaView.setView(vp);
      } catch (error) {
        console.log('flash error', error);
        onFailure(ErrorType.RECORDING_NOT_SUPPORTED);
      }
    }
  }

  _visualizeAudioData(volume) {
    const id = 'mic-vol';
    const maxVolume = 20;
    const recorderControlBarHeight = 30; // value is constant at 30px
    const sizePercentageBuffer = 0.9;
    const box = document.getElementById(id).parentElement;
    const maxSize = Math.min(box.offsetWidth, box.offsetHeight - recorderControlBarHeight) * sizePercentageBuffer;
    const size = volume >= maxVolume ? parseInt(maxSize) : parseInt(maxSize * (volume / maxVolume));
    this._resizeVolume(id, size, recorderControlBarHeight);
  }

  _resizeVolume(id, size, barheight) {
    const offset = parseInt(size / 2);
    dq.css(`#${id}`, 'width', `${size}px`);
    dq.css(`#${id}`, 'height', `${size}px`);
    dq.css(`#${id}`, 'margin-top', `-${offset + barheight}px`);
    dq.css(`#${id}`, 'margin-left', `-${offset}px`);
  }
}

class NativeAudioView {
  constructor(device) {
    this.device = device;
    this.visualsEnabled = true;
  }

  setView(icon, placeholder, loadCallback) {
    const template = `
      <div id="mic-vol"></div>
      <div id="mic-vol-alt" class="no-show">VOICE RECORDING STARTED</div>
      <img id="icon-microphone" src="${icon}" alt="voice-recorder.png" />
      <audio id="capture" autoplay muted playsinline></audio>
      <audio id="recorded" style="display: none"><source id="recorded-source" src="" /></audio>`;
    dq.before(placeholder, template);
    dq.remove(placeholder);
    dq.on('#capture', 'loadedmetadata', loadCallback);
  }

  isNative() {
    return true;
  }

  // start(visualizer) {
  //   this.device.start();
  //   this.device.startVisuals(visualizer);
  //   if (this.device.visualsAvailable()) return;
  //   dq.removeClass('#mic-vol-alt', 'no-show');
  // }
  start(visualizer) {
    this.device.record(visualizer);
    dq.removeClass('#mic-vol-alt', 'no-show');
  }

  // stop() {
  //   this.device.stop();
  //   this.device.stopVisuals();
  //   document.querySelector('#recorded').src = this.device.buffer();
  //   dq.css('#capture', 'display', 'none');
  //   dq.css('#recorded', 'display', 'block');
  //   if (this.device.visualsAvailable()) return;
  //   dq.addClass('#mic-vol-alt', 'no-show');
  // }
  stop() {
    this.device.stop();
    dq.css('#capture', 'display', 'none');
    dq.css('#recorded', 'display', 'block');
    dq.addClass('#mic-vol-alt', 'no-show');
    const url = this.device.getPlaybackURL();
    console.log(`data url: ${url}`);
    // document.querySelector('#recorded').src = url;
    const audioSource = document.getElementById('recorded-source');
    audioSource.src = url;
    document.getElementById('recorded').load();
    console.log(document.getElementById('recorded'));
  }

  play() {
    document.getElementById('recorded').play();
  }

  retake() {
    this.device.clearData();
    dq.css('#recorded', 'display', 'none');
    dq.css('#capture', 'display', 'block');
  }

  data() {
    dq.css('#video-container', 'display', 'none');
    document.getElementById('recorded').pause();
    return this.device.getUploadData();
  }
}

class FlashAudioView {
  constructor(cameraId, swfExpressInstall, swfLCCapture) {
    this.cameraId = cameraId;
    this.device = new FlashAudio(cameraId, swfExpressInstall, swfLCCapture);
    this.recordStarted = false;
    this.recordEnded = false;
  }

  setView(placeholder) {
    const pageHost = ((document.location.protocol == "https:") ? "https://" : "http://");
    const html = `
    <div id="flashContent">
      <p>To view this page ensure that Adobe Flash Player version 16.0.0 or greater is installed.</p>
      <a href="http://www.adobe.com/go/getflashplayer">
        <img src='${pageHost}www.adobe.com/images/shared/download_buttons/get_flash_player.gif' alt='Get Adobe Flash player' />
      </a>
    </div>`;
    dq.before(placeholder, html);
    dq.remove(placeholder);
    this.device.init('flashContent');
    dq.css(`#${this.cameraId}`, 'position', 'absolute');
    dq.css(`#${this.cameraId}`, 'top', '0px');
    dq.css(`#${this.cameraId}`, 'left', '0px');
  }

  setIcon(icon) {
    if (dq.exists('#mic-vol')) return;
    const html = `
    <div id="mic-vol"></div>
    <img id="icon-microphone" src="${icon}" alt="voice-recorder.png" />
    <audio id="capture" autoplay muted playsinline></audio>
    <audio id="recorded" style="display: none"></audio>`;
    dq.before('LCCapture', html);
    dq.css('#mic-vol', 'z-index', 1);
  }

  isNative() {
    return false;
  }

  start() {
    document.getElementById(this.cameraId).startRecording();
    this.recordStarted = true;
  }

  stop() {
    document.getElementById(this.cameraId).stopRecording();
    this.recordEnded = true;
  }

  play() {
    document.getElementById(this.cameraId).playBack();
  }

  retake() {
    this.recordStarted = false;
    this.recordEnded = false;
    document.getElementById(this.cameraId).record();
  }

  data() {
    return this.recordStarted && this.recordEnded ? this.device.streamName() : null;
  }
}

export default AudioModal;
