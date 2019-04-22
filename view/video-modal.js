import dq from './dquery';
import WebcamMixin from './webcam-mixin';

class VideoModal {
  constructor(modalTag, isMobile, onSuccess, onFailure) {
    this.tag = modalTag;
    this.isMobile = isMobile;
    this.onSuccess = onSuccess;
    this.onFailure = onFailure;

    this.recordedBlobs = [];
    this.mediaRecorder = null;

    Object.assign(this, WebcamMixin);
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

    // show
    this.show();

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

    const _showRecordingUI = this._showRecordingUI.bind(this);
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
      _showRecordingUI();
    });
  }

  btnRecordClick() {
    this.recordedBlobs = [];
    var options = { mimeType: "video/webm;codecs=vp9" };
    if (window.MediaRecorder != undefined) {
      try {
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          console.log(options.mimeType + " is not Supported");
          options = { mimeType: "video/webm;codecs=vp8" };
          if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            console.log(options.mimeType + " is not Supported");
            options = { mimeType: "video/webm" };
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
              console.log(options.mimeType + " is not Supported");
              options = { mimeType: "" };
            }
          }
        }
        this.mediaRecorder = new MediaRecorder(window.stream, options);
      } catch (e) {
        console.error("Exception while creating MediaRecorder: " + e);
        return;
      }
    }
    console.log("Created MediaRecorder", this.mediaRecorder, "with options", options);
    this.mediaRecorder.ondataavailable = this._handleDataAvailable.bind(this);
    this.mediaRecorder.start(10); // collect 10ms of data
    console.log("MediaRecorder started", this.mediaRecorder);
    dq.css("#btnRecord", 'display', "none");
    dq.css("#btnStop", 'display', "inline");
  }

  btnStopClick() {
    this.mediaRecorder.stop();
    console.log("Recorded Blobs: ", this.recordedBlobs.length);
    dq.css("#btnStop", 'display', "none");
    dq.css("#btnPlay", 'display', "inline");
    dq.css("#btnRetake", 'display', "inline");
    dq.css("#btnUse", 'display', "inline");
    this._showStaticVideo();
    dq.css("#capture", 'display', "none");
    dq.css("#recorded", 'display', "block");
  }

  btnPlayClick() {
    document.getElementById("recorded").play();
  }

  btnRetakeClick() {
    this.recordedBlobs = [];
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
    window.stream.getTracks().forEach(function (curTrack) { curTrack.stop(); });
    this.hide();
    this.recordedBlobs.length > 0 ? this.onSuccess() : this.onFailure(3);
  }

  // PRIVATE

  _handleDataAvailable(evt) {
    if (typeof window.MediaRecorder === 'undefined') return;
    if (evt.data && evt.data.size === 0) return;
    this.recordedBlobs.push(evt.data);
  }

  _showStaticVideo() {
    const recordedVideo = document.querySelector("#recorded");
    const superBuffer = new Blob(this.recordedBlobs, { type: "video/webm" });
    recordedVideo.src = window.URL.createObjectURL(superBuffer);
  }

  _showRecordingUI() {
    if (typeof navigator.mediaDevices === 'undefined' || navigator.mediaDevices === null)
      return this.onFailure(0);

    this.showSpinner();

    const constraints = {
      audio: true,
      video: { width: { ideal: 1920, min: 1280 }, height: { ideal: 1080, min: 720 } }
    };

    const hideSpinner = this.hideSpinner.bind(this);
    const onFailure = this.onFailure;

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
}

export default VideoModal;
