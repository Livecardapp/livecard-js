class AppView {
  constructor(successTag, errorTag) {
    this.successTag = successTag;
    this.errorTag = errorTag;
  }

  setButtonSuccess() {
    document.querySelector(this.successTag).addEventListener('click', event => {
      console.log('hello world');
    });
  }

  setButtonError() {
    document.querySelector("#btn-error").addEventListener('click', event => {
      throw new Error('Uh-oh, something went wrong');
    });
  }
}

export default AppView;