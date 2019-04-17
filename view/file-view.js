import dq from './dquery';

class FileView {

  constructor(tag) {
    this.tag = tag;
  }

  inject(onSuccess, onFailure) {
    dq.insert('#livecard-wrapper', `<input type="file" accept="image/*" id="inputImage" style="display: none;">`);
    dq.change("#inputImage", () => {
      document.querySelector("#inputImage").files.length === 0 ? onFailure(LiveCardError.NO_IMAGE_SELECTED) : onSuccess();
    });
  }

  show() {
    console.log('show #inputImage')
    dq.click('#inputImage');
  }

  remove() {
    dq.insert('#livecard-wrapper', '');
  }

}

export default FileView;