import axios from 'axios'

// const baseUrl = process.env.VUE_APP_ROOT_API

export class API {
  baseUrl = process.env.VUE_APP_ROOT_API
  header
  singular
  plural

  constructor (endpoint) {
    this.singular = endpoint[0] === endpoint[0].toUpperCase()
      ? endpoint
      : endpoint[0].toUpperCase() + endpoint.split(endpoint[0])[1]

    this.plural = this.singular.endsWith('y')
      ? this.singular.split(this.singular[this.singular.length - 1])[0] + 'ies'
      : this.singular + 's'

    this.header = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        'Content-type': 'application/json',
      },
    }
  }

  getUrl (endpoint) {
    const base = `${this.baseUrl.endsWith('/') ? this.baseUrl : this.baseUrl + '/'}`
    return `${base}api/${this.singular}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`
  }

  handleErrors (err) {
    // Note: here you may want to add your errors handling
    console.log({ message: 'Errors is handled here', err })
  }

  async get () {
    try {
      const response = await axios.get(this.getUrl(`Get${this.plural}`), this.header)

      return response.data
    } catch (err) {
      this.handleErrors(err)
    }
  }

  async getById (id) {
    try {
      if (!id) throw Error('Id is not provided')

      const response = await axios.get(this.getUrl(`Get${this.singular}ById/${id}`), this.header)

      return response.data
    } catch (err) {
      this.handleErrors(err)
    }
  }

  /**
   *
   * @param {Object} obj
   * @description obj parameters should be like { url: 'THE_STRING_THAT_WILL_BE_PLACED_AFTER_BY_KEYWORD", params: [Parameters array with order]}
   * @returns
   */
  async getByParams (obj) {
    try {
      if (!obj || !obj.params || obj.params.length === 0) throw Error('Parameters are not provided')

      let url = this.getUrl(`Get${this.plural}By${obj.url}`)
      obj.params.forEach(e => {
        url += `/${e}`
      })

      const response = await axios.get(url, this.header)
      console.log('Response for ', this.plural, ' => ', response)

      return response.data
    } catch (err) {
      this.handleErrors(err)
    }
  }

  async create (data = {}) {
    try {
      await axios.post(this.getUrl(`Save${this.singular}`), data, this.header)
      return true
    } catch (err) {
      this.handleErrors(err)
    }
  }

  async update (data = {}) {
    try {
      await axios.put(this.getUrl(`Update${this.singular}`), data, this.header)
      return true
    } catch (err) {
      this.handleErrors(err)
    }
  }

  async delete (id) {
    if (!id) throw Error('Id is not provided')

    try {
      await axios.delete(this.getUrl(`Delete${this.singular}/${id}`), this.header)
      return true
    } catch (err) {
      this.handleErrors(err)
    }
  }

  async upload (formData = {}) {
    const head = {
      Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      'Content-Type': 'multipart/form-data',
    }

    try {
      const response = await axios.post(this.getUrl(`Upload${this.singular}Documents/upload`), formData, head)
      return response.data
    } catch (err) {
      this.handleErrors(err)
    }
  }
}
