const dq = {
  insert: (id, html) => { document.querySelector(id).innerHTML = html; },
  change: (id, f) => { document.querySelector(id).onchange = f; },
  click: (id, f) => { document.querySelector(id).addEventListener("click", f); },
  css: (id, attribute, value) => { document.querySelector(id).style[attribute] = value; },
  addClass: (id, cls) => { document.querySelector(id).classList.add(cls); },
  removeClass: (id, cls) => { document.querySelector(id).classList.remove(cls); },
  val: (id) => { return document.querySelector(id).value; },
};

export default dq;