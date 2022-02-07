class BaseApiService {
  baseUrl = process.env.VUE_APP_ROOT_API
  endpoint;

  constructor (endpoint) {
    if (!endpoint) throw new Error("Endpoint is not provided")
    this.endpoint = endpoint
  }

  getUrl (id = "") {
    return `${this.baseUrl}/${this.endpoint}/${id}`
  }

  handleErrors (err) {
    // Note: here you may want to add your errors handling
    console.log({ message: "Errors is handled here", err })
  }
}

class ReadOnlyApiService extends BaseApiService {
  constructor(resource) {
    super(resource);
  }
  async fetch(config = {}) {
    try {
      const response = await fetch(this.getUrl(), config);
      return await response.json();
    } catch (err) {
      this.handleErrors(err);
    }
  }
  async get(id) {
    try {
      if (!id) throw Error("Id is not provided");
      const response = await fetch(this.getUrl(id));
      return await response.json();
    } catch (err) {
      this.handleErrors(err);
    }
  }
}

class ModelApiService extends ReadOnlyApiService {
  constructor(resource) {
    super(resource);
  }
  async post(data = {}) {
    try {
      const response = await fetch(this.getUrl(), {
        method: "POST",
        body: JSON.stringify(data)
      });
      const { id } = response.json();
      return id;
    } catch (err) {
      this.handleErrors(err);
    }
  }
  async put(id, data = {}) {
    if (!id) throw Error("Id is not provided");
    try {
      const response = await fetch(this.getUrl(id), {
        method: "PUT",
        body: JSON.stringify(data)
      });
      const { id: responseId } = response.json();
      return responseId;
    } catch (err) {
      this.handleErrors(err);
    }
  }
  async delete(id) {
    if (!id) throw Error("Id is not provided");
    try {
      await fetch(this.getUrl(id), {
        method: "DELETE"
      });
      return true;
    } catch (err) {
      this.handleErrors(err);
    }
  }
}
