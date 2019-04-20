import dq from './dquery';

class ImageModal {
  constructor(modalTag) {
    this.tag = modalTag;
  }

  inject(onSuccess, onFailure) {
    dq.insert('#livecard-wrapper', this.template());

    // dq.click('#btnImageFromWebcam', () => {
    //   this.hideModal('#choose_image_modal');
    //   dq.css('#create_video_instructions', 'display', 'none');
    //   this.showRecordingUI();
    //   dq.addClass('#video_gift_msg_modal', 'showing-video-container');
    //   this.showModal('#video_gift_msg_modal');
    //   dq.css('#video-container', 'display', 'block');
    // });

    dq.click('#btnImageFromDisk', () => {
      this.usingFileInput = true;
      dq.click('#inputImage');
    });

    dq.change("#inputImage", () => {
      // this.hideAllModals();
      document.querySelector("#inputImage").files.length === 0 ? onFailure(LiveCardError.NO_IMAGE_SELECTED) : onSuccess();
    });

    // close button
    const remove = this.remove.bind(this);
    dq.click('.livecard-modal-close', event => { remove(); });
  }

  remove() {
    dq.insert('#livecard-wrapper', '');
  }

  show() {
    dq.addClass('#choose_image_modal', 'show');
  }

  hide() {
    dq.removeClass('#choose_image_modal', 'show');
  }

  template() {
    return `
    <div class="livecard-modal fade" id="choose_image_modal" tabindex="-1" role="dialog" aria-labelledby="choose_image_modal_label" aria-hidden="true">
      <div class="livecard-modal-dialog livecard-modal-dialog-centered" role="document">
        <div class="livecard-modal-content">
          <div class="livecard-modal-body" id="chooseImageMessage">
            <img src="https://retailer.live.cards/checkout/livecard-sdk/images/dismiss.png" alt="x" class="livecard-modal-close" aria-label="Close" />
            <h2 class="livecard-modal-title text-center" id="choose_image_modal_label">CHOOSE IMAGE</h2>
            <p class="lead text-center">You can either snap a picture using your webcam or choose an image from your hard drive</p>
            <br><br>
            <button type="button" class="btn livecard-btn-modal-submit" id="btnImageFromWebcam">Use Webcam</button>
            <br><br>
            <button type="button" class="btn livecard-btn-modal-submit" id="btnImageFromDisk">Choose from disk</button>
          </div>
        </div>
      </div>
    </div>
    <input type="file" accept="image/*" id="inputImage" style="display: none;">`;
  }

};

export default ImageModal;