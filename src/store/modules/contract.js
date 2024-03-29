import { make } from 'vuex-pathify'
import store from '../index'

// Data
const state = {
  contracts: [],
  isLoading: false,
}

const mutations = make.mutations(state)

const actions = {
  async createContract (context, payload) {
    store.set('app/isLoading', true)

    const res = await this.$api.contract.create(payload)

    if (res) {
      store.set('contract/contracts', [...store.get('contract/contracts'), res])
      store.dispatch('app/showAlert', { message: 'Başarıyla oluşturuldu.', type: 'success' }, { root: true })
    } else {
      store.dispatch('app/showAlert', { message: 'Bir hata oluştu.', type: 'error' }, { root: true })
    }

    store.set('app/isLoading', false)
  },
  async updateContract (context, payload) {
    store.set('app/isLoading', true)

    const res = await this.$api.contract.update(payload)

    if (res) {
      const arr = store.get('contract/contracts')
      const index = arr.findIndex(e => e.id === payload.id)
      arr[index] = payload
      store.set('contract/contracts', [...arr])
      store.dispatch('app/showAlert', { message: 'Başarıyla güncellendi.', type: 'success' }, { root: true })
    } else {
      store.dispatch('app/showAlert', { message: 'Bir hata oluştu.', type: 'error' }, { root: true })
    }

    store.set('app/isLoading', false)
  },
  async getContractById (context, payload) {
    store.set('app/isLoading', true)

    const res = await this.$api.contract.getById(payload)

    store.set('contract/contracts', [res.data])
    store.set('app/isLoading', false)
  },
  async getContractsBySupplierId () {
    store.set('app/isLoading', true)
    const { company } = JSON.parse(localStorage.getItem('tibuline@user')).user

    const res = await this.$api.contract.getByParams({ url: 'SupplierId', params: [company.id] })
    store.set('contract/contracts', res.data)

    store.set('contract/isLoading', false)
    store.set('app/isLoading', false)
  },
  async uploadContract (context, payload) {
    store.set('app/isLoading', true)
    const { company } = JSON.parse(localStorage.getItem('tibuline@user')).user
    payload.formData.append('SupplierId', company.id)

    const path = await this.$api.contract.upload(payload.formData)

    if (path) {
      payload.contract.filePath = path.data
      const res = await this.$api.contract.update(payload.contract)

      if (res) {
        const arr = store.get('contract/contracts')
        const index = arr.findIndex(e => e.id === payload.contract.id)
        arr[index] = payload.contract
        store.set('contract/contracts', arr)
        store.dispatch('app/showAlert', { message: 'Başarıyla yüklendi.', type: 'success' }, { root: true })
      } else {
        store.dispatch('app/showAlert', { message: 'Dosya başarıyla yüklendi fakat sözleşme güncellenemedi.', type: 'error' }, { root: true })
      }
    } else {
      store.dispatch('app/showAlert', { message: 'Dosya yüklenemedi.', type: 'success' }, { root: true })
    }

    setTimeout(() => {
      store.set('app/isLoading', false)
    }, 1000)
  },
  setLoading (c, payload) {
    store.set('contract/isLoading', payload)
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
