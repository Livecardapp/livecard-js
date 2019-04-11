import AppView from './index-view';

window.onerror = (event, source, lineno, colno, error) => {
  console.log(`post error to server: 
    { 
      event: ${event}, 
      source: ${source}, 
      line: ${lineno}, 
      col: ${colno}, 
      error: '${error}',
    }`);
};

const appView = new AppView('#btn-success', '#btn-error');

appView.setButtonSuccess();
appView.setButtonError();