import dq from './dquery';
import ErrorType from '../lib/errors';
import { MessageModel } from '../model/message';

class ImageModal {
  constructor(tag, asset, isMobile, onSuccess, onFailure) {
    this.tag = tag;
    this.dismissIcon = asset.iconDismiss();
    this.isMobile = isMobile;
    this.onSuccess = onSuccess;
    this.onFailure = onFailure;
  }

  inject() {
    dq.insert('#livecard-wrapper', this.template());

    dq.change("#inputImage", () => {
      if (document.querySelector("#inputImage").files.length === 0)
        return this.onFailure(ErrorType.NO_IMAGE_SELECTED);
      const message = new MessageModel();
      const err = message.setContentAsImageFromFiles(document.querySelector("#inputImage").files);
      err === null ? this.onSuccess(message) : this.onFailure(err);
    });

    if (this.isMobile) return;

    const onSuccess = this.onSuccess;
    const remove = this.remove;

    dq.click('#btnImageFromWebcam', () => {
      remove();
      onSuccess(null);
    });

    dq.click('#btnImageFromDisk', () => { dq.click('#inputImage'); });
    dq.click('.livecard-modal-close', () => { remove(); });
  }

  remove() {
    dq.insert('#livecard-wrapper', '');
  }

  show() {
    this.isMobile ? dq.click('#inputImage') : dq.addClass('#choose_image_modal', 'show');
  }

  hide() {
    if (this.isMobile) return;
    dq.removeClass('#choose_image_modal', 'show');
  }

  template() {
    return this.isMobile ? `<input type="file" accept="image/*" id="inputImage" style="display: none;">` :
      `<div class="livecard-modal fade" id="choose_image_modal" tabindex="-1" role="dialog" aria-labelledby="choose_image_modal_label" aria-hidden="true">
      <div class="livecard-modal-dialog livecard-modal-dialog-centered" role="document">
        <div class="livecard-modal-content">
          <div class="livecard-modal-body" id="chooseImageMessage">
            <img src="${this.dismissIcon}" alt="x" class="livecard-modal-close" aria-label="Close" />
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
