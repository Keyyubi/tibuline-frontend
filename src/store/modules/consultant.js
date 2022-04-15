import axios from 'axios'
import { make } from 'vuex-pathify'
import { parsedToken, trailingSlash } from '../../util/helpers'
import store from '../index'

// Data
const state = {
  consultants: [],
  isLoading: false,
}

const mutations = make.mutations(state)

const actions = {
  async createConsultant (context, payload) {
    store.set('app/isLoading', true)

    const res = await this.$api.consultant.create(payload)

    if (res) {
      store.set('consultant/consultants', [...store.get('consultant/consultants'), res])
      store.dispatch('app/showAlert', { message: 'Başarıyla oluşturuldu.', type: 'success' }, { root: true })
    } else {
      store.dispatch('app/showAlert', { message: ' Danışman oluşturulurken bir hata oluştu.', type: 'error' }, { root: true })
    }

    store.set('app/isLoading', false)
  },
  async updateConsultant (context, payload) {
    store.set('app/isLoading', true)

    const res = await this.$api.consultant.update(payload)

    if (res) {
      const arr = store.get('consultant/consultants')
      const index = arr.findIndex(e => e.id === payload.id)
      arr[index] = payload
      store.set('consultant/consultants', [...arr])
      store.dispatch('app/showAlert', { message: 'Başarıyla güncellendi.', type: 'success' }, { root: true })
    } else {
      store.dispatch('app/showAlert', { message: 'Bir hata oluştu.', type: 'error' }, { root: true })
    }

    store.set('app/isLoading', false)
  },
  async getConsultants () {
    store.set('app/isLoading', true)
    const id = parsedToken().SupplierId
    if (!id) return

    const res = await this.$api.consultant.getByParams({ url: 'SupplierId', params: [id] })
    store.set('consultant/consultants', res.data)

    store.set('app/isLoading', false)
    store.set('consultant/isLoading', false)
  },
  async getConsultantById (context, payload) {
    store.set('app/isLoading', true)

    const res = await this.$api.consultant.getById(payload)

    store.set('consultant/consultants', [res.data])
    store.set('app/isLoading', false)
    store.set('consultant/isLoading', false)
  },
  async getConsultantsByManagerId () {
    store.set('app/isLoading', true)
    const currUser = JSON.parse(localStorage.getItem('tibuline@user')).user

    const res = await this.$api.consultant.getByParams({ url: 'ManagerId', params: [currUser.id] })
    store.set('consultant/consultants', res.data)

    store.set('app/isLoading', false)
    store.set('consultant/isLoading', false)
  },
  async getAllConsultants () {
    store.set('app/isLoading', true)

    const res = await this.$api.consultant.get()

    store.set('consultant/consultants', res.data)
    store.set('app/isLoading', false)
  },
  async uploadFiles (context, payload) {
    store.set('app/isLoading', true)
    const id = parsedToken().SupplierId
    if (!id) return

    payload.formData.append('SupplierId', id)

    const path = await this.$api.consultant.upload(payload.formData)

    if (path) {
      payload.sending.filePath += (payload.sending.filePath && payload.sending.filePath.length > 0 ? ',' : '') + path.data
      const res = await this.$api.consultant.update(payload.sending)

      if (res) {
        const arr = store.get('consultant/consultants')
        const index = arr.findIndex(e => e.id === payload.sending.id)
        arr[index] = payload.sending
        store.set('consultant/consultants', arr)
        store.dispatch('app/showAlert', { message: 'Başarıyla yüklendi.', type: 'success' }, { root: true })
      } else {
        store.dispatch('app/showAlert', { message: 'Dosya başarıyla yüklendi fakat danışman güncellenemedi.', type: 'error' }, { root: true })
      }
    } else {
      store.dispatch('app/showAlert', { message: 'Dosya yüklenemedi.', type: 'error' }, { root: true })
    }

    store.set('app/isLoading', false)
  },
  async deletePersonalFile (c, payload) {
    store.set('app/isLoading', true)

    try {
      const result = await axios.delete(`${trailingSlash(process.env.VUE_APP_ROOT_API)}api/Consultant/DeleteFile/${payload}`)
      console.log('res', result)

      if (result.status && result.status === 200) {
        store.dispatch('app/showAlert', { message: 'Dosya silindi.', type: 'success' }, { root: true })
      } else {
        throw new Error(result)
      }
    } catch (error) {
      console.log('Error on deleting file:', error)
      store.dispatch('app/showAlert', { message: 'Dosya silinirken hata oluştu.', type: 'error' }, { root: true })
    }

    store.set('app/isLoading', false)
  },
  setLoading (c, payload) {
    store.set('consultant/isLoading', payload)
  },
}

const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
