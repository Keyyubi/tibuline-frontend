import { make } from 'vuex-pathify'
import store from '../index'

// Data
const state = {
  costCenters: [],
}

const mutations = make.mutations(state)

const actions = {
  async createCostCenter (context, payload) {
    store.set('app/isLoading', true)

    const res = await this.$api.costCenter.create(payload)
    console.log('res', res)

    if (res) {
      payload.id = res
      store.set('costCenter/costCenters', [...store.get('costCenter/costCenters'), payload])
      store.dispatch('app/showAlert', { message: 'Başarıyla oluşturuldu.', type: 'success' }, { root: true })
    } else {
      store.dispatch('app/showAlert', { message: 'Bir hata oluştu.', type: 'error' }, { root: true })
    }

    store.set('app/isLoading', false)
  },
  async updateCostCenter (context, payload) {
    store.set('app/isLoading', true)

    const res = await this.$api.costCenter.create(payload)

    if (res) {
      const arr = store.get('costCenter/costCenters')
      const index = arr.findIndex(e => e.id === payload.id)
      arr[index] = payload
      store.set('costCenter/costCenters', [...arr])
      store.dispatch('app/showAlert', { message: 'Başarıyla güncellendi.', type: 'success' }, { root: true })
    } else {
      store.dispatch('app/showAlert', { message: 'Bir hata oluştu.', type: 'error' }, { root: true })
    }

    store.set('app/isLoading', false)
  },
  async getCostCenters () {
    store.set('app/isLoading', true)

    const res = await this.$api.costCenter.get()

    store.set('costCenter/costCenters', res.data)
    store.set('app/isLoading', false)
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
