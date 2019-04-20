import Webcam from '../lib/webcam';

class VideoModel {
  constructor() {
    this.blobs = [];
    this.mediaRecorder
  }

  start() {
    this.blobs = [];
    if (typeof window.MediaRecorder === 'undefined') {
      try {
        if (!MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
          console.log("video/webm;codecs=vp9 is not Supported");
          if (!MediaRecorder.isTypeSupported("video/webm;codecs=vp8")) {
            console.log("video/webm;codecs=vp8 is not Supported");
            if (!MediaRecorder.isTypeSupported("video/webm")) {
              console.log("video/webm is not Supported");
            }
          }
        }
        this.mediaRecorder = new MediaRecorder(window.stream, options);
      } catch (e) {
        console.error("Exception while creating MediaRecorder: " + e);
        return;
      }
    }

    console.log("Created MediaRecorder", this.mediaRecorder, "with options", options);
    this.mediaRecorder.ondataavailable = this.onData.bind(this);
    this.mediaRecorder.start(10); // collect 10ms of data
    this.debugLog("MediaRecorder started", this.mediaRecorder);
    document.querySelector("#btnRecord").style.display = "none";
    document.querySelector("#btnStop").style.display = "inline";
  }

  onData(event) {
    if (typeof window.MediaRecorder === 'undefined') return;
    if (event.data && event.data.size > 0) {
      this.blobs.push(event.data);
    }
  }
}

export default VideoModel;