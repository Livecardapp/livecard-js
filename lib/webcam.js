class Webcam {

  constructor() {
    this.data = [];
    this.mediaRecorder = null;
  }

  static async getStream() {
    if (typeof navigator.mediaDevices === 'undefined' || navigator.mediaDevices === null)
      return Promise.reject();

    const constraints = {
      audio: true,
      video: { width: { ideal: 1920, min: 1280 }, height: { ideal: 1080, min: 720 } }
    };

    try {
      let stream = await navigator.mediaDevices.getUserMedia(constraints);
      return Promise.resolve(stream);
    } catch (error) { 
      return Promise.reject();
    }
  }

}

export default Webcam;