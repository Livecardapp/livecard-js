import dq from './dquery';
import { WebstreamVideo } from '../model/webstream';
import { FlashVideo } from '../model/flashstream';
import MediaModalMixin from './media-modal-mixin';
import ErrorType from '../lib/errors';
import { MessageModel } from '../model/message';

class VideoModal {
  constructor(tag, asset, isMobile, onSuccess, onFailure) {
    this.tag = tag;
    this.isMobile = isMobile;
    this.onSuccess = onSuccess;
    this.onFailure = onFailure;
    this.mediaView = null;
    Object.assign(this, MediaModalMixin(this, asset));
  }

  inject(showIntro) {
    const components = this.isMobile ?
      `<input type="file" accept="video/mp4,video/x-m4v,video/webm,video/quicktime,video/*" capture="user" id="inputVideo" style="display: none;">` :
      `<div id="video-placeholder"></div>`;

    dq.insert('#livecard-wrapper', this.template(components, !this.isMobile, 'video'));
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
    const err = data.isNative ?
      message.setContentAsVideoFromCamera(data.content) :
      message.setContentAsVideoFromFlash(data.content);
    this.hide();
    err === null ? this.onSuccess(message) : this.onFailure(err);
  }

  // PRIVATE

  async _showRecordingView(onFailure) {
    const vp = 'video-placeholder';

    try {
      this.showSpinner();
      const camera = new WebstreamVideo();
      const stream = await camera.init();

      if (typeof stream === 'undefined' || stream === null)
        throw new Error('Native video camera cannot be initialized');

      this.mediaView = new NativeVideoView(camera);
      this.mediaView.setView(vp, () => { this.hideSpinner(); });
      document.getElementById('capture').srcObject = stream;

      dq.addClass('#video-container', 'livecard-fade-show');
    } catch (error) {
      this.hideSpinner();

      if (error.name === 'NotAllowedError')
        return onFailure(ErrorType.RECORDING_UNAUTHROIZED);

      try {
        this.mediaView = new FlashVideoView('LCCapture');
        this.mediaView.setView(vp);
      } catch (error) {
        console.log('flash error', error);
        onFailure(ErrorType.RECORDING_NOT_SUPPORTED);
      }
    }
  }
}

class NativeVideoView {
  constructor(device) {
    this.device = device;
  }

  setView(placeholder, loadCallback) {
    dq.before(placeholder, '<video id="capture" autoplay muted playsinline></video><video id="recorded" style="display: none"></video>');
    dq.remove(placeholder);
    dq.on('#capture', 'loadedmetadata', loadCallback);
  }

  start() {
    this.device.start();
  }

  stop() {
    this.device.stop();
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
    return { isNative: true, content: this.device.data() };
  }
}

class FlashVideoView {
  constructor(cameraId) {
    this.cameraId = cameraId;
    this.device = new FlashVideo(cameraId);
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
    const d = { isNative: false };
    d.content = this.recordStarted && this.recordEnded ? this.device.streamName() : null;
    return d;
  }
}

export default VideoModal;
