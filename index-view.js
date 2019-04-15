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
    document.querySelector("#btn-error").addEventListener('click', async (event) => {
      try {
        await delayedError();
      } catch (error) {
        throw new Error('Uh-oh, something went wrong');
      }
    });
  }
}

const delayedError = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(function () { 
      console.log('reject!');
      reject(); 
    }, 2000);
  });
};

export default AppView;