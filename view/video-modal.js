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
      showRecordingUI();
    });
  }

  remove() {
    if (!this.isMobile) {
      // todo: stop video stream
    }
    dq.insert('#livecard-wrapper', '');
  }

  show() {
    dq.addClass('#video_gift_msg_modal', 'show');
  }

  hide() {
    dq.removeClass('#video_gift_msg_modal', 'show');
    dq.removeClass('#video_gift_msg_modal', 'showing-video-container');
    dq.css('#create_video_instructions', 'display', 'block');
    dq.css('#video-container', 'display', 'none');
  }

  showSpinner() {
    dq.css('.livecard-spinner', 'display', 'block');
  }

  hideSpinner() {
    dq.css('.livecard-spinner', 'display', 'none');
  }

  showRecordingUI() {
    if (navigator.mediaDevices) {
      console.log('get stream');
      this.showSpinner();
      // const constraints = {
      //   audio: true,
      //   video: { width: { ideal: 1920, min: 1280 }, height: { ideal: 1080, min: 720 } }
      // };
      // navigator.mediaDevices
      //   .getUserMedia(constraints)
      //   .then(this.showVideoCaptureUI.bind(this))
      //   .catch(this.videoCaptureNotSupported.bind(this));
    } else {
      // this.hideAllModals();
      // this.videoRecordFailureCallback(LiveCardError.RECORDING_NOT_SUPPORTED);
      console.log('failure');
    }
  }

  showVideoCaptureUI(vstream) {
    window.stream = vstream;
    document.querySelector("#capture").srcObject = vstream;
    dq.addClass("#video-container", "livecard-fade-show");
  }

  videoCaptureNotSupported(error) {
    this.hideSpinner();
    console.log('video recording not supported');
    // this.hideAllModals();
    // this.videoRecordFailureCallback(LiveCardError.RECORDING_NOT_SUPPORTED);
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

  template() {
    const canvas = this.imageMode ? '<canvas id="imgCanvas" style="display: none;"></canvas>' : '';
    return `
      <div class="livecard-modal fade" id="video_gift_msg_modal" tabindex="-1" role="dialog" aria-labelledby="video_gift_msg_modal_label" aria-hidden="true">
        <div class="livecard-modal-dialog livecard-modal-dialog-centered" role="document">
          <div class="livecard-modal-content">
            <div class="livecard-modal-body">
              <img src="https://retailer.live.cards/checkout/livecard-sdk/images/dismiss.png" alt="x" class="livecard-modal-close" aria-label="Close" />
              <div id="create_video_instructions">
                <div class="livecard-instructions">
                  <h2 class="livecard-modal-title text-center" id="video_gift_msg_modal_label">VIDEO GIFT MESSAGE</h2>
                  <div class="livecard-instructions-steps">
                    <div class="step">
                      <div class="img-holder">
                        <img src="https://retailer.live.cards/checkout/livecard-sdk/images/video-gift-message.png" alt="" />
                      </div>
                      Create Video Card Below
                    </div>
                    <div class="step">
                      <div class="img-holder">
                        <img src="https://retailer.live.cards/checkout/livecard-sdk/images/van.png" alt="" />
                      </div>
                      Gift is delivered to recipient
                    </div>
                    <div class="step">
                      <div class="img-holder">
                        <img src="https://retailer.live.cards/checkout/livecard-sdk/images/video-text-gift.png" alt="" />
                      </div>
                      Video is sent via Text to gift recipient
                    </div>
                  </div>
                  <button type="button" class="btn livecard-btn-modal-submit" id="create_video_card_btn">
                    CREATE VIDEO<span class="d-none d-sm-inline"> CARD</span>
                  </button>
                </div>
              </div>
              <div id="video-container" class="livecard-hidden" style="--aspect-ratio:16/9;">
                <div class="livecard-spinner" style="display: none;"></div>
                <video id="capture" autoplay muted playsinline></video>
                <video id="recorded" style="display: none"></video>
                ${canvas}
                <div class="livecard-controls">
                  <img src="https://retailer.live.cards/checkout/livecard-sdk/images/video-record.png" class="icon-video-record" id="btnRecord" />
                  <img src="https://retailer.live.cards/checkout/livecard-sdk/images/video-stop.png" class="icon-video-stop" style="display: none;" id="btnStop" />
                  <button id="btnRetake" style="display: none;">Retake</button>
                  <img src="https://retailer.live.cards/checkout/livecard-sdk/images/video-play.png" class="icon-video-play" style="display: none;" id="btnPlay" />
                  <button id="btnUse" style="display: none;">Use</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }

};

export default VideoModal;
