import { make } from 'vuex-pathify'
import store from '../index'

// Data
const state = {
  suppliers: [],
}

const mutations = make.mutations(state)

const actions = {
  async createSupplier (context, payload) {
    store.set('app/isLoading', true)

    const res = await this.$api.supplier.create(payload)
    if (res) {
      store.set('supplier/suppliers', [...store.get('supplier/suppliers'), res.data])
      store.dispatch('app/showAlert', { message: 'Başarıyla oluşturuldu.', type: 'success' }, { root: true })
    } else {
      store.dispatch('app/showAlert', { message: 'Bir hata oluştu.', type: 'error' }, { root: true })
    }

    store.set('app/isLoading', false)
  },
  async updateSupplier (context, payload) {
    store.set('app/isLoading', true)

    const res = await this.$api.supplier.update(payload)
    if (res) {
      const arr = store.get('supplier/suppliers')
      const index = arr.findIndex(e => e.id === payload.id)
      arr[index] = payload
      store.set('supplier/suppliers', [...arr])
      store.dispatch('app/showAlert', { message: 'Başarıyla güncellendi.', type: 'success' }, { root: true })
    } else {
      store.dispatch('app/showAlert', { message: 'Bir hata oluştu.', type: 'error' }, { root: true })
    }

    store.set('app/isLoading', false)
  },
  async getSuppliers () {
    store.set('app/isLoading', true)

    const res = await this.$api.supplier.get()

    store.set('supplier/suppliers', res.data)
    store.set('app/isLoading', false)
  },
  async getSupplierById (context, payload) {
    store.set('app/isLoading', true)

    const res = await this.$api.supplier.getById(payload)

    store.set('supplier/suppliers', [res.data])
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
