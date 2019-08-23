import dq from './dquery';

const MediaModalMixin = (instance, asset) => {
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
    if (typeof instance.mediaView === 'undefined' || instance.mediaView === null) return;
    if (typeof instance.mediaView.device === 'undefined' || instance.mediaView.device === null) return;
    instance.mediaView.device.remove();
    instance.mediaView.device = null;
  };

  const recordIcon = asset.iconRecord();
  const stopIcon = asset.iconStop();
  const playIcon = asset.iconPlay();

  const dismissIcon = asset.iconDismiss();
  const giftIcon = asset.iconGift();
  const vanIcon = asset.iconVan();
  const textBubbleIcon = asset.iconTextBubble();

  mixin.template = (components, includeControls, type) => {
    const controls = includeControls ? `
      <div class="livecard-controls">
        <img src="${recordIcon}" class="icon-video-record" id="btnRecord" />
        <img src="${stopIcon}" class="icon-video-stop" style="display: none;" id="btnStop" />
        <button id="btnRetake" style="display: none;">Retake</button>
        <img src="${playIcon}" class="icon-video-play" style="display: none;" id="btnPlay" />
        <button id="btnUse" style="display: none;">Use</button>
      </div>` : '';

    const upper = type.toUpperCase();
    const title = type.charAt(0).toUpperCase() + type.slice(1);

    return `
      <div class="livecard-modal fade" id="video_gift_msg_modal" tabindex="-1" role="dialog" aria-labelledby="video_gift_msg_modal_label" aria-hidden="true">
        <div class="livecard-modal-dialog livecard-modal-dialog-centered" role="document">
          <div class="livecard-modal-content">
            <div class="livecard-modal-body">
              <img src="${dismissIcon}" alt="x" class="livecard-modal-close" aria-label="Close" />
              <div id="create_video_instructions">
                <div class="livecard-instructions">
                  <h2 class="livecard-modal-title text-center" id="video_gift_msg_modal_label">${upper} GIFT MESSAGE</h2>
                  <div class="livecard-instructions-steps">
                    <div class="step">
                      <div class="img-holder">
                        <img src="${giftIcon}" alt="" />
                      </div>
                      Create ${title} Card Below
                    </div>
                    <div class="step">
                      <div class="img-holder">
                        <img src="${vanIcon}" alt="" />
                      </div>
                      Gift is delivered to recipient
                    </div>
                    <div class="step">
                      <div class="img-holder">
                        <img src="${textBubbleIcon}" alt="" />
                      </div>
                      ${title} is sent via Text to gift recipient
                    </div>
                  </div>
                  <button type="button" class="btn livecard-btn-modal-submit" id="create_video_card_btn">
                    CREATE ${upper}<span class="d-none d-sm-inline"> CARD</span>
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
