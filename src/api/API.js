import axios from 'axios'
import { leadingSlash, trailingSlash } from '@/util/helpers'
import router from '@/router'

const refresh = () => {
  localStorage.removeItem('tibuline@jwt')
  const rememberMe = localStorage.getItem('tibuline@remember')

  if (rememberMe) {
    axios.post(
      `${trailingSlash(process.env.VUE_APP_ROOT_API)}api/Auth/CreateTokenByRefreshToken`,
      { token: localStorage.getItem('rfrjwt') })
      .then(({ data: res }) => {
        localStorage.setItem('tibuline@jwt', res.data.accessToken)
        localStorage.setItem('rfrjwt', res.data.refreshToken)
        axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('tibuline@jwt')}`
      })
      .catch(err => {
        console.log('err', err)
        axios.defaults.headers.common.Authorization = ''
      })
  } else {
    localStorage.removeItem('rfrjwt')
    axios.defaults.headers.common.Authorization = ''
    router.push({ path: '/' })
  }
}

export class API {
  baseUrl = trailingSlash(process.env.VUE_APP_ROOT_API)
  singular
  plural

  constructor (endpoint) {
    this.singular = endpoint[0] === endpoint[0].toUpperCase()
      ? endpoint
      : endpoint[0].toUpperCase() + endpoint.substring(1, endpoint.length)

    this.plural = this.singular.endsWith('y')
      ? this.singular.substring(0, this.singular.length - 1) + 'ies'
      : this.singular + 's'
  }

  getUrl (endpoint) {
    return `${this.baseUrl}api/${this.singular}${leadingSlash(endpoint)}`
  }

  handleErrors (err) {
    // Note: here you may want to add your errors handling
    if (err.response.status === 401) {
      refresh()
    } else {
      console.log({ message: 'Unexpected error: ', err })
    }
    return false
  }

  async get (plural = true) {
    try {
      const response = await axios.get(this.getUrl(`Get${plural ? this.plural : this.singular}`))

      return response.data
    } catch (err) {
      return this.handleErrors(err)
    }
  }

  async getById (id) {
    try {
      if (!id) throw Error('Id is not provided')

      const response = await axios.get(this.getUrl(`Get${this.singular}ById/${id}`))

      return response.data
    } catch (err) {
      return this.handleErrors(err)
    }
  }

  /**
   *
   * @param {Object: { url: 'string', params: [ARRAY]}} obj
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

      const response = await axios.get(url)

      return response.data
    } catch (err) {
      return this.handleErrors(err)
    }
  }

  async create (data = {}) {
    try {
      const result = await axios.post(this.getUrl(`Save${this.singular}`), data)
      return result.data.data
    } catch (err) {
      return this.handleErrors(err)
    }
  }

  async update (data = {}) {
    try {
      await axios.put(this.getUrl(`Update${this.singular}`), data)
      return true
    } catch (err) {
      return this.handleErrors(err)
    }
  }

  async delete (id) {
    if (!id) throw Error('Id is not provided')

    try {
      await axios.delete(this.getUrl(`Delete${this.singular}/${id}`))
      return true
    } catch (err) {
      return this.handleErrors(err)
    }
  }

  async upload (formData = {}) {
    const head = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('tibuline@jwt')}`,
        'Content-Type': 'multipart/form-data',
      },
    }

    try {
      const response = await axios.post(this.getUrl(`Upload${this.singular}Documents/upload`), formData, head)
      return response.data
    } catch (err) {
      return this.handleErrors(err)
    }
  }
}
