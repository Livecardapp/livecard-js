import dq from './dquery';
import VideoCameraModel from '../model/video-camera';
import WebcamMixin from './webcam-mixin';
import ErrorType from '../lib/errors';
import { MessageModel } from '../model/message';

class VideoModal {
  constructor(tag, isMobile, onSuccess, onFailure) {
    this.tag = tag;
    this.isMobile = isMobile;
    this.onSuccess = onSuccess;
    this.onFailure = onFailure;
    this.camera = new VideoCameraModel();
    Object.assign(this, WebcamMixin());
  }

  inject(showIntro) {
    const components = this.isMobile ?
      `<input type="file" accept="video/mp4,video/x-m4v,video/webm,video/quicktime,video/*" capture="user" id="inputVideo" style="display: none;">` :
      `<div id="video-placeholder"></div>`;

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
    this._remove(this.camera);
  }

  btnRecordClick() {
    this.camera.start();
    dq.css('#btnRecord', 'display', 'none');
    dq.css('#btnStop', 'display', 'inline');
    console.log('start stop');
  }

  btnStopClick() {
    this.camera.stop();
    dq.css('#btnStop', 'display', 'none');
    dq.css('#btnPlay', 'display', 'inline');
    dq.css('#btnRetake', 'display', 'inline');
    dq.css('#btnUse', 'display', 'inline');

    if (!this.camera.isNative) return;

    // show static video
    document.querySelector('#recorded').src = this.camera.buffer();
    dq.css('#capture', 'display', 'none');
    dq.css('#recorded', 'display', 'block');
  }

  btnPlayClick() {
    this.camera.isNative ? document.getElementById('recorded').play() : document.getElementById('LCCapture').playBack();
  }

  btnRetakeClick() {
    this.camera.reset();

    dq.css('#btnPlay', 'display', 'none');
    dq.css('#btnRetake', 'display', 'none');
    dq.css('#btnUse', 'display', 'none');
    dq.css('#btnRecord', 'display', 'inline');

    if (!this.camera.isNative) return;

    dq.css('#recorded', 'display', 'none');
    dq.css('#capture', 'display', 'block');
  }

  btnUseClick() {
    if (!this.camera.isNative) {
      const message = new MessageModel();
      const err = message.setContentAsVideoFromFlash(this.camera.streamName());
      return err === null ? this.onSuccess(message) : this.onFailure(err);
    }

    dq.css('#video-container', 'display', 'none');
    document.getElementById('recorded').pause();
    this.hide();

    if (!this.camera.stageVideoForUpload())
      return this.onFailure(ErrorType.RECORDING_FAILED);

    const message = new MessageModel();
    const err = message.setContentAsVideoFromCamera(this.camera.data());
    err === null ? this.onSuccess(message) : this.onFailure(err);
  }

  // PRIVATE

  async _showRecordingView(onFailure) {
    const vp = 'video-placeholder';

    try {
      this.showSpinner();
      const result = await this.camera.initNative();

      if (result.created) {
        if (typeof result.stream === 'undefined' || result.stream === null) throw new Error('invalid stream');
        dq.before(vp, '<video id="capture" autoplay muted playsinline></video><video id="recorded" style="display: none"></video>');
        dq.remove(vp);
        dq.on('#capture', 'loadedmetadata', () => { this.hideSpinner(); });
        document.querySelector('#capture').srcObject = result.stream;
      }

      dq.addClass('#video-container', 'livecard-fade-show');
    } catch (error) {
      this.hideSpinner();
      try {
        const pageHost = ((document.location.protocol == "https:") ? "https://" : "http://");
        const html = `
        <div id="flashContent">
          <p>To view this page ensure that Adobe Flash Player version 16.0.0 or greater is installed.</p>
          <a href="http://www.adobe.com/go/getflashplayer">
            <img src='${pageHost}www.adobe.com/images/shared/download_buttons/get_flash_player.gif' alt='Get Adobe Flash player' />
          </a>
        </div>`;

        dq.before(vp, html);
        dq.remove(vp);

        this.camera.initFlash('LCCapture', 'flashContent');

        dq.css('#LCCapture', 'position', 'absolute');
        dq.css('#LCCapture', 'top', '0px');
        dq.css('#LCCapture', 'left', '0px');
      } catch (error) {
        onFailure(ErrorType.RECORDING_NOT_SUPPORTED);
      }
    }
  }
}

export default VideoModal;
