class LCRequest {
  constructor(baseURL) {
    this.baseURL = baseURL;
    window.fetch ? Object.assign(this, FetchMixin()) : Object.assign(this, HTTPMixin());
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
    Object.keys(data).forEach(key => { formData.append(key, data[key]); });

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
      } catch(error) {
        return Promise.reject(error);
      }
    },
  };
};

export default LCRequest;