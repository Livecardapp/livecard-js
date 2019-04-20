import dq from './dquery';

const WebcamMixin = {
  injectView: (components) => {
    dq.insert('#livecard-wrapper', this.template(components));
    const remove = this.remove.bind(this);
    dq.click('.livecard-modal-close', () => { remove(); });
    this.show();
  },

  remove: () => {
    dq.insert('#livecard-wrapper', '');
  },

  show: () => {
    dq.addClass('#video_gift_msg_modal', 'show');
  },

  hide: () => {
    dq.removeClass('#video_gift_msg_modal', 'show');
    dq.removeClass('#video_gift_msg_modal', 'showing-video-container');
    dq.css('#create_video_instructions', 'display', 'block');
    dq.css('#video-container', 'display', 'none');
  },

  startSpinner: () => {
    dq.css('.livecard-spinner', 'display', 'block');
  },

  stopSpinner: () => {
    dq.css('.livecard-spinner', 'display', 'none');
  },

  getStream: async () => {
    if (navigator.mediaDevices) {
      console.log('get stream');
      this.startSpinner();
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
  },

  // showVideoCaptureUI(vstream) {
  //   this.hideSpinner();
  //   window.stream = vstream;
  //   document.querySelector("#capture").srcObject = vstream;
  //   dq.addClass("#video-container", "livecard-fade-show");
  // }

  // videoCaptureNotSupported(error) {
  //   this.hideSpinner();
  //   console.log('video recording not supported');
  //   // this.hideAllModals();
  //   // this.videoRecordFailureCallback(LiveCardError.RECORDING_NOT_SUPPORTED);
  // }

  template: (components, includeControls) => {
    const controls = includeControls ? `
    <div class="livecard-controls">
      <img src="https://retailer.live.cards/checkout/livecard-sdk/images/video-record.png" class="icon-video-record" id="btnRecord" />
      <img src="https://retailer.live.cards/checkout/livecard-sdk/images/video-stop.png" class="icon-video-stop" style="display: none;" id="btnStop" />
      <button id="btnRetake" style="display: none;">Retake</button>
      <img src="https://retailer.live.cards/checkout/livecard-sdk/images/video-play.png" class="icon-video-play" style="display: none;" id="btnPlay" />
      <button id="btnUse" style="display: none;">Use</button>
    </div>` : '';
    
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
                ${components}
                ${controls}
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }

};

export default WebcamMixin;
