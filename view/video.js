import CameraMixin from './camera-mixin';

class VideoView {

  constructor() {
    Object.assign(this, CameraMixin);
  }

  insert() {
    document.querySelector("#livecard-wrapper").innerHTML = this.template();
    // set event handlers;

    // close button
    const closeBtn = document.querySelectorAll('.livecard-modal-close');
    const remove = this.remove.bind(this);
    closeBtn.addEventListener('click', event => { remove(); });
  }

  remove() {
    this.resetContainer();
  }

}

export default VideoView;