import dq from './dquery';
import WebcamMixin from './webcam-mixin';

class VideoModal {
  constructor(modalTag, isMobile) {
    this.tag = modalTag;
    this.isMobile = isMobile;
    Object.assign(this, WebcamMixin);
  }

  inject(onSuccess, onFailure) {
    const components = this.isMobile ?
      `<input type="file" accept="video/mp4,video/x-m4v,video/webm,video/quicktime,video/*" capture="user" id="inputVideo" style="display: none;">` :
      `<div class="livecard-spinner" style="display: none;"></div><video id="capture" autoplay muted playsinline></video><video id="recorded" style="display: none"></video>`;

    dq.insert('#livecard-wrapper', this.template(components, !this.isMobile));

    // close button
    const remove = this.remove.bind(this);
    dq.click('.livecard-modal-close', () => { remove(); });

    // show
    this.show();

    if (this.isMobile) {
      dq.change("#inputVideo", () => {
        document.querySelector("#inputVideo").files.length === 0 ? onFailure(1) : onSuccess();
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

    const showRecordingUI = this.showRecordingUI.bind(this);
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
      showRecordingUI(onFailure);
    });
  }

  showRecordingUI(onFailure) {
    if (typeof navigator.mediaDevices === 'undefined' || navigator.mediaDevices === null) {
      onFailure(0);
      return;
    }

    this.showSpinner();

    const constraints = {
      audio: true,
      video: { width: { ideal: 1920, min: 1280 }, height: { ideal: 1080, min: 720 } }
    };

    const hideSpinner = this.hideSpinner.bind(this);
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(vstream => {
        window.stream = vstream;
        document.querySelector("#capture").srcObject = vstream;
        dq.addClass("#video-container", "livecard-fade-show");
      })
      .catch(error => {
        hideSpinner();
        onFailure(0);
      });
  }

  btnRecordClick() {
    console.log('start recording');
  }

  btnStopClick() {
    console.log('stop recording');
  }

  btnRetakeClick() {
    console.log('retake recording');
  }

  btnPlayClick() {
    console.log('play recording');
  }

  btnUseClick() {
    console.log('use recording');
  }

};

export default VideoModal;
