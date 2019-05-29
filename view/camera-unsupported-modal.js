import dq from './dquery';

class CameraUnsupportedModal {
  constructor(tag) {
    this.tag = tag;
  }

  inject() {
    dq.insert('#livecard-wrapper', this.template());
    const remove = this.remove;
    dq.click("#btnChooseVideo", () => { dq.click("#inputVideo"); });
    dq.change("#inputVideo", () => { remove(); });
    dq.click('.livecard-modal-close', () => { remove(); });
  }

  show() {
    dq.addClass('#capture_not_supported_modal', 'show');
  }

  remove() {
    dq.insert('#livecard-wrapper', '');
  }

  template() {
    return `
    <div class="livecard-modal fade" id="capture_not_supported_modal" tabindex="-1" role="dialog" aria-labelledby="capture_not_supported_modal_label" aria-hidden="true">
      <div class="livecard-modal-dialog livecard-modal-dialog-centered" role="document">
        <div class="livecard-modal-content">
          <div class="livecard-modal-body" id="noRecordingSupportMessage">
            <img src="https://retailer.live.cards/checkout/livecard-sdk/images/dismiss.png" alt="x" class="livecard-modal-close" aria-label="Close" />
            <h2 class="livecard-modal-title text-center" id="capture_not_supported_modal_label">VIDEO CAPTURE NOT SUPPORTED</h2>
            <p class="lead">It looks like your browser doesn't support video capture or you don't have a webcam configured. Please click below to choose a video file from your hard drive.</p>
            <button type="button" class="btn livecard-btn-modal-submit" id="btnChooseVideo">Choose Video</button>
            <input type="file" accept="video/mp4,video/x-m4v,video/webm,video/quicktime,video/*" capture="user" id="inputVideo" style="display: none;">
          </div>
        </div>
      </div>
    </div>`;
  }

};

export default CameraUnsupportedModal;
