import dq from './view/dquery';

class MessageModal {
  constructor(modalTag, listener) {
    this.tag = modalTag;
    this.listener = listener;
    Object.assign(this, ViewMixin);
  }

  inject(callback) {
    dq.insert('#livecard-wrapper', this.template());

    dq.click('#create_text_card_btn', () => {
      dq.addClass('#create_text_instructions', 'livecard-fade-out');
      setTimeout(() => {
        dq.removeClass('#create_text_instructions', 'livecard-fade-out');
        dq.css('#create_text_instructions', 'display', 'none');
        dq.css('#text-container', 'display', 'flex');
      }, 400);
    });

    const hide = this.hide.bind(this);
    dq.click('#submit_text_card_btn', () => {
      hide();
      callback(dq.val('#textGiftMessage'));
    });

    // close button
    const remove = this.remove.bind(this);
    dq.click('.livecard-modal-close', event => { remove(); });
  }

  remove() {
    console.log('reset video container');
    this.listener = null;
    // remove all event handlers
  }

  hide() {
    this.removeClass('#gift_msg_modal', 'show');
  }

  show() {
    this.addClass('#gift_msg_modal', 'show');
  }

  template() {
    return `
    <div class="livecard-modal fade" id="gift_msg_modal" tabindex="-1" role="dialog" aria-labelledby="gift_msg_modal_label" aria-hidden="true">
      <div class="livecard-modal-dialog livecard-modal-dialog-centered" role="document">
        <div class="livecard-modal-content">
          <div class="livecard-modal-body">
            <img src="https://retailer.live.cards/checkout/livecard-sdk/images/dismiss.png" alt="x" class="livecard-modal-close" aria-label="Close" />
            <div class="livecard-instructions" id="create_text_instructions">
              <h2 class="modal-title text-center" id="gift_msg_modal_label">GIFT MESSAGE</h2>
              <div class="livecard-instructions-steps">
                <div class="step">
                  <div class="img-holder">
                    <img src="https://retailer.live.cards/checkout/livecard-sdk/images/gift-message.png" alt="" />
                  </div>
                  Create message below
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
                  Message sent via Text to gift recipient
                </div>
              </div>
              <button type="button" class="btn livecard-btn-modal-submit" id="create_text_card_btn">CREATE MESSAGE</button>
            </div>
            <div id="text-container" style="display: none">
              <h2 class="livecard-modal-title text-center">Write your gift message...</h2>
              <textarea class="livecard-form-control" id="textGiftMessage"></textarea>
              <button type="button" class="btn livecard-btn-modal-submit" id="submit_text_card_btn">SUBMIT MESSAGE</button>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  }

};

export default MessageModal;
