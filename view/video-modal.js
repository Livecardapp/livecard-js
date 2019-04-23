import dq from './dquery';
import VideoModel from '../model/video';
import WebcamMixin from './webcam-mixin';

class VideoModal {
  constructor(tag, isMobile, onSuccess, onFailure) {
    this.tag = tag;
    this.isMobile = isMobile;
    this.onSuccess = onSuccess;
    this.onFailure = onFailure;
    this.videoModel = new VideoModel();
    Object.assign(this, WebcamMixin());
  }

  inject(showIntro) {
    const components = this.isMobile ?
      `<input type="file" accept="video/mp4,video/x-m4v,video/webm,video/quicktime,video/*" capture="user" id="inputVideo" style="display: none;">` :
      `<div class="livecard-spinner" style="display: none;"></div><video id="capture" autoplay muted playsinline></video><video id="recorded" style="display: none"></video>`;

    dq.insert('#livecard-wrapper', this.template(components, !this.isMobile));
    dq.css('#create_video_instructions', 'display', showIntro ? 'block' : 'none');

    // close button
    const remove = this.remove.bind(this);
    dq.click('.livecard-modal-close', () => { remove(); });

    if (this.isMobile) {
      dq.change("#inputVideo", () => {
        document.querySelector("#inputVideo").files.length === 0 ? this.onFailure(1) : this.onSuccess();
      });

      const hide = this.hide.bind(this);
      dq.click('#create_video_card_btn', () => {
        hide();
        dq.click('#inputVideo');
      });
      return;
    }

    // controls
    dq.on('#capture', 'loadedmetadata', () => { this.hideSpinner(); });
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
    this.videoModel.start();
    dq.css("#btnRecord", 'display', "none");
    dq.css("#btnStop", 'display', "inline");
  }

  btnStopClick() {
    this.videoModel.stop();
    dq.css("#btnStop", 'display', "none");
    dq.css("#btnPlay", 'display', "inline");
    dq.css("#btnRetake", 'display', "inline");
    dq.css("#btnUse", 'display', "inline");

    // show static video
    document.querySelector("#recorded").src = this.videoModel.buffer();

    dq.css("#capture", 'display', "none");
    dq.css("#recorded", 'display', "block");
  }

  btnPlayClick() {
    document.getElementById("recorded").play();
  }

  btnRetakeClick() {
    this.videoModel.reset();
    dq.css("#recorded", 'display', "none");
    dq.css("#capture", 'display', "block");
    dq.css("#btnPlay", 'display', "none");
    dq.css("#btnRetake", 'display', "none");
    dq.css("#btnUse", 'display', "none");
    dq.css("#btnRecord", 'display', "inline");
  }

  btnUseClick() {
    dq.css("#video-container", 'display', "none");
    document.getElementById("recorded").pause();
    this.hide();
    this.videoModel.stageVideoForUpload() ? this.onSuccess() : this.onFailure(3);
  }

  // PRIVATE

  async _showRecordingView(onFailure) {
    try {
      dq.css('.livecard-spinner', 'display', 'block');
      const result = await this.videoModel.init();
      if (typeof result.stream !== 'undefined')
        document.querySelector("#capture").srcObject = result.stream;
      dq.addClass("#video-container", "livecard-fade-show");
    } catch (error) {
      onFailure(0);
    }
  }

}

export default VideoModal;
