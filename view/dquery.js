const dq = {
  insert: (id, html) => { document.querySelector(id).innerHTML = html; },
  before: (id, html) => {
    const anchor = document.getElementById(id);
    anchor.insertAdjacentHTML('beforebegin', html);
  },
  remove: (id) => {
    let element = document.getElementById(id);
    element.parentNode.removeChild(element);
  },
  change: (id, f) => { document.querySelector(id).onchange = f; },
  click: (id, f) => {
    if (typeof f === 'undefined' || f === null)
      document.querySelector(id).click();
    else
      document.querySelector(id).addEventListener('click', f);
  },
  css: (id, attribute, value) => { document.querySelector(id).style[attribute] = value; },
  addClass: (id, cls) => { document.querySelector(id).classList.add(cls); },
  removeClass: (id, cls) => { document.querySelector(id).classList.remove(cls); },
  val: (id) => { return document.querySelector(id).value; },
  on: (id, event, f) => {
    if (event === 'loadedmetadata') {
      document.querySelector(id).onloadedmetadata = f;
    }
  },
};

export default dq;