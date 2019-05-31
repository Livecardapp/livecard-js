import dq from './dquery';

const MediaModalMixin = (instance) => {
  const mixin = {};
  
  mixin.show = () => {
    dq.addClass('#video_gift_msg_modal', 'show');
  };

  mixin.hide = () => {
    dq.removeClass('#video_gift_msg_modal', 'show');
    dq.removeClass('#video_gift_msg_modal', 'showing-video-container');
    dq.css('#create_video_instructions', 'display', 'block');
    dq.css('#video-container', 'display', 'none');
  };

  mixin.showSpinner = () => {
    dq.css('.livecard-spinner', 'display', 'block');
  };

  mixin.hideSpinner = () => {
    dq.css('.livecard-spinner', 'display', 'none');
  };

  mixin.remove = () => {
    dq.insert('#livecard-wrapper', '');
    if (typeof instance.cameraView === 'undefined' || instance.cameraView === null) return;
    if (typeof instance.cameraView.camera === 'undefined' || instance.cameraView.camera === null) return;
    instance.cameraView.camera.remove();
    instance.cameraView.camera = null;
  };

  mixin.template = (components, includeControls) => {
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
  };

  return mixin;
};

export default MediaModalMixin;
