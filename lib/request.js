class LCRequest {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.file = null;
    window.fetch ? Object.assign(this, FetchMixin()) : Object.assign(this, HTTPMixin());
  }

  setAttachment(key, blob, filename = null) {
    this.file = [key, blob];
    if (typeof filename === 'undefined' || filename === null) return;
    this.file.push(filename);
  }

  async post(path, headers, data) {
    return this._mutate("POST", `${this.baseURL}/${path}`, headers, data);
  }

  async put(path, headers, data) {
    return this._mutate("PUT", `${this.baseURL}/${path}`, headers, data);
  }

  async _mutate(type, url, headers, data) {
    if (typeof headers !== 'object' || headers === null || Object.keys(headers).length === 0)
      return Promise.reject(new Error(`LCRequest: ${type}, ${path}. Invalid headers.`));

    if (typeof data !== 'object' || data === null || Object.keys(data).length === 0)
      return Promise.reject(new Error(`LCRequest: ${type}, ${path}. Invalid data.`));

    const formData = new FormData();

    // set non attachment params
    Object.keys(data).forEach(key => {
      if (data[key] instanceof Blob) return;
      formData.append(key, data[key]);
    });

    // set attachment
    if (this.file !== null) {
      if (this.file.length === 2)
        formData.append(this.file[0], this.file[1]);
      else
        formData.append(this.file[0], this.file[1], this.file[2]);
    }

    return this._execMutation(type, url, headers, formData);
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