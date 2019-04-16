class WebcamModal {
  constructor(isMobile, modalTag, listener) {
    this.isMobile = isMobile;
    this.tag = modalTag;
    this.listener = listener;
  }

  insert() {
    document.querySelector("#livecard-wrapper").innerHTML = this.template();

    // reset video container
    document.getElementById('video-container').classList.remove('livecard-fade-show', 'livecard-fade-show-start');
    document.getElementById('video-container').style.display = '';
    document.querySelector("#livecard-wrapper").innerHTML = '';

    // input image
    document.querySelector("#inputImage").onchange = () => {
      this.hideAllModals();
      if (document.querySelector("#inputImage").files.length === 0) {
        this.imageChooseFailureCallback(LiveCardError.NO_IMAGE_SELECTED);
        return;
      }
      this.imageChooseSuccessCallback();
    };

    // input video
    document.querySelector("#inputVideo").onchange = () => {
      this.hideAllModals();
      if (document.querySelector("#inputVideo").files.length === 0) {
        this.videoRecordFailureCallback(LiveCardError.NO_VIDEO_SELECTED);
        return;
      }
      this.videoRecordSuccessCallback();
    };

    // controls
    document.querySelector("#capture").onloadedmetadata = () => { this.hideSpinner(); };
    document.querySelector("#btnRecord").addEventListener("click", () => this.listener.btnRecordClick());
    document.querySelector("#btnStop").addEventListener("click", () => this.listener.btnStopClick());
    document.querySelector("#btnRetake").addEventListener("click", () => this.listener.btnRetakeClick());
    document.querySelector("#btnPlay").addEventListener("click", () => this.listener.btnPlayClick());
    document.querySelector("#btnUse").addEventListener("click", () => this.listener.btnUseClick());

    // instructions
    document
      .querySelector("#create_video_card_btn")
      .addEventListener("click", () => {
        if (this.isMobile) {
          this.hideModal("#video_gift_msg_modal");
        } else {
          document.querySelector("#create_video_instructions").classList.add("livecard-fade-out");
          setTimeout(function () {
            document.querySelector("#create_video_instructions").style.display = "none";
            document.querySelector("#create_video_instructions").classList.remove("livecard-fade-out");
            document.querySelector("#video_gift_msg_modal").classList.add("showing-video-container");
            document.querySelector("#video-container").classList.add("livecard-fade-show-start");
            document.querySelector("#video-container").classList.add("livecard-fade-show");
            setTimeout(function () { document.querySelector("#video-container").style.display = "block"; }, 400);
          }, 400);
        }
        this.showRecordingUI();
      });

    // close button
    const closeBtn = document.querySelectorAll('.livecard-modal-close');
    const remove = this.remove.bind(this);
    closeBtn.addEventListener('click', event => { remove(); });
  }

  remove() {
    console.log('reset video container');
    this.listener = null;
    // remove all event handlers
  }

  hide() {
    document.querySelector("#video_gift_msg_modal").classList.remove("show");
    document.querySelector("#video_gift_msg_modal").classList.remove("showing-video-container");
    document.querySelector("#create_video_instructions").style.display = "block";
    document.querySelector("#video-container").style.display = "none";
  }

  show() {
    document.querySelector("#video_gift_msg_modal").classList.add("show");
  }

  showSpinner() {
    document.querySelector('.livecard-spinner').style.display = 'block';
  }

  hideSpinner() {
    document.querySelector('.livecard-spinner').style.display = 'none';
  }

  template() {
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
                <input type="file" accept="video/mp4,video/x-m4v,video/webm,video/quicktime,video/*" capture="user" id="inputVideo" style="display: none;">
                <input type="file" accept="image/*" id="inputImage" style="display: none;">
                <video id="capture" autoplay muted playsinline></video>
                <video id="recorded" style="display: none"></video>
                <canvas id="imgCanvas" style="display: none;"></canvas>
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

export default WebcamModal;
