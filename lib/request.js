class LCRequest {
  constructor(domain, path) {
    this.domain = domain;
    this.path = path;
    this.headers = {};
    this.body = {};
    this.file = null;
    window.fetch ? Object.assign(this, FetchMixin()) : Object.assign(this, HTTPMixin());
  }

  setPath(path) {
    this.path = path;
  }

  setHeader(key, value) {
    this.headers[key] = value;
  }

  setData(key, value) {
    this.body[key] = value;
  }

  setAttachment(key, blob, filename = null) {
    this.file = [key, blob];
    if (typeof filename === 'undefined' || filename === null) return;
    this.file.push(filename);
  }

  async post() {
    return this._mutate("POST", `${this.domain}/${this.path}`);
  }

  async put() {
    return this._mutate("PUT", `${this.domain}/${this.path}`);
  }

  async _mutate(type, url) {
    if (typeof this.headers !== 'object' || this.headers === null || Object.keys(this.headers).length === 0)
      return Promise.reject(new Error(`LCRequest: ${type}, ${this.path}. Invalid headers.`));

    if (typeof this.body !== 'object' || this.body === null || Object.keys(this.body).length === 0)
      return Promise.reject(new Error(`LCRequest: ${type}, ${this.path}. Invalid data.`));

    const formData = new FormData();

    // set non attachment params
    Object.keys(this.body).forEach(key => {
      if (this.body[key] instanceof Blob) return;
      formData.append(key, this.body[key]);
    });

    // set attachment
    if (this.file !== null) {
      if (this.file.length === 2)
        formData.append(this.file[0], this.file[1]);
      else
        formData.append(this.file[0], this.file[1], this.file[2]);
    }

    return this._execMutation(type, url, this.headers, formData);
  }
}

const HTTPMixin = () => {
  return {
    _execMutation: async (method, url, headers, formData) => {
      const request = new XMLHttpRequest();
      Object.keys(headers).forEach(key => { request.setRequestHeader(key, headers[key]); });
      request.open(method, url, true);
      request.send(formData);
      return new Promise((resolve, reject) => {
        request.addEventListener('load', () => { resolve(request.response); });
        request.addEventListener('error', error => { reject(error); });
      });
    },
  };
};

const FetchMixin = () => {
  return {
    _execMutation: async (method, url, headers, formData) => {
      try {
        console.log('fetch', url, { method, headers, body: formData });
        const response = await fetch(url, { method, headers, body: formData });
        return response.json();
      } catch (error) {
        return Promise.reject(error);
      }
    },
  };
};

export default LCRequest;