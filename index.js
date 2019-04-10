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

document.querySelector("#btn-success").addEventListener('click', event => {
  console.log('hello world');
});

document.querySelector("#btn-error").addEventListener('click', event => {
  throw new Error('Uh-oh, something went wrong');
});

