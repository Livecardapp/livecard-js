import dq from './dquery';
import IMask from 'imask';

class PhoneModal {
  constructor(modalTag, asset) {
    this.tag = modalTag;
    this.backIcon = asset.iconBack();
    this.dismissIcon = asset.iconDismiss();
  }

  inject(onBack, onDone) {
    dq.insert('#livecard-wrapper', this.template());

    new IMask(document.querySelector('.phone_us'), {
      mask: '(000) 000-0000',
      lazy: false, // make placeholder always visible
      placeholderChar: '_' // defaults to '_'
    });

    const hide = this.hide.bind(this);

    dq.click('.livecard-modal-back-arrow', () => {
      hide();
      onBack();
    });

    dq.click('#btnFinish', () => {
      hide();
      onDone(dq.val('#txtPhone'));
    });

    // close button
    const remove = this.remove.bind(this);
    dq.click('.livecard-modal-close', event => { remove(); });
  }

  remove() {
    dq.insert('#livecard-wrapper', '');
  }

  hide() {
    dq.removeClass('#card_created_modal', 'show');
  }

  show() {
    dq.addClass('#card_created_modal', 'show');
  }

  template() {
    return `
    <div class="livecard-modal fade" id="card_created_modal" tabindex="-1" role="dialog" aria-labelledby="card_created_modal_label" aria-hidden="true">
      <div class="livecard-modal-dialog livecard-modal-dialog-centered" role="document">
        <div class="livecard-modal-content">
          <div class="livecard-modal-body">
            <img src="${this.backIcon}" alt="" class="livecard-modal-back-arrow" />
            <img src="${this.dismissIcon}" alt="x" class="livecard-modal-close" aria-label="Close" />
            <h2 class="livecard-modal-title text-center" id="card_created_modal_label">VIDEO CARD CREATED</h2>
            <div class="livecard-form-group">
              <label>Gift recipient phone number</label>
              <input class="livecard-form-control phone_us" type="tel" placeholder="(888) 888-8888" id="txtPhone" />
            </div>
            <button type="button" class="btn livecard-btn-modal-submit" id="btnFinish">FINISH</button>
          </div>
        </div>
      </div>
    </div>`;
  }

};

export default PhoneModal;