import { make } from 'vuex-pathify'
import store from '../index'

// Data
const state = {
  invoices: [],
}

const mutations = make.mutations(state)

const actions = {
  async createInvoice (context, payload) {
    store.set('app/isLoading', true)

    const res = await this.$api.invoice.create(payload)
    if (res) {
      store.set('invoice/invoices', [...store.get('invoice/invoices'), res.data])
      store.dispatch('app/showAlert', { message: 'Başarıyla oluşturuldu.', type: 'success' }, { root: true })
    } else {
      store.dispatch('app/showAlert', { message: 'Bir hata oluştu.', type: 'error' }, { root: true })
    }

    store.set('app/isLoading', false)
  },
  async updateInvoice (context, payload) {
    store.set('app/isLoading', true)

    const res = await this.$api.invoice.update(payload)
    if (res) {
      const arr = store.get('invoice/invoices')
      const index = arr.findIndex(e => e.id === payload.id)
      arr[index] = payload
      store.set('invoice/invoices', [...arr])
      store.dispatch('app/showAlert', { message: 'Başarıyla güncellendi.', type: 'success' }, { root: true })
    } else {
      store.dispatch('app/showAlert', { message: 'Bir hata oluştu.', type: 'error' }, { root: true })
    }

    store.set('app/isLoading', false)
  },
  async getInvoices () {
    store.set('app/isLoading', true)

    const res = await this.$api.invoice.get()

    store.set('invoice/invoices', res.data)
    store.set('app/isLoading', false)
  },
  async getInvoicesByAssignedTo () {
    store.set('app/isLoading', true)
    const { id } = store.get('user/user')

    const res = await this.$api.budget.getByParams({ url: 'AssignedTo', params: [id] })

    if (res) {
      store.set('budget/invoiceBudget', res.data[0])
    } else {
      store.dispatch('app/showAlert', { message: 'Projeler getirilirken bir hata oluştu.', type: 'error' }, { root: true })
    }

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
