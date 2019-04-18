import dq from './dquery';

class FileView {
  constructor(tag, imageMode) {
    this.tag = tag;
    this.imageMode = imageMode;
  }

  inject(onSuccess, onFailure) {
    const template = this.imageMode ? 
    `<input type="file" accept="image/*" id="inputImage" style="display: none;">` : 
    `<input type="file" accept="video/mp4,video/x-m4v,video/webm,video/quicktime,video/*" capture="user" id="inputVideo" style="display: none;">`;
    dq.insert('#livecard-wrapper', template);
    dq.change("#inputImage", () => {
      document.querySelector("#inputImage").files.length === 0 ? onFailure(LiveCardError.NO_IMAGE_SELECTED) : onSuccess();
    });
  }

  show() {
    const id = this.imageMode ? '#inputImage' : '#inputVideo';
    dq.click(id);
  }

  remove() {
    dq.insert('#livecard-wrapper', '');
  }

}

export default FileView;