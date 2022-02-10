import { make } from 'vuex-pathify'
import store from '../index'

// Data
const state = {
  budgets: [],
  invoiceBudget: {},
}

const mutations = make.mutations(state)

const actions = {
  async createBudget (context, payload) {
    store.set('app/isLoading', true)

    const res = await this.$api.budget.create(payload)

    if (res) {
      store.set('budget/budgets', [...store.get('budget/budgets'), payload])
      store.dispatch('app/showAlert', { message: 'Başarıyla oluşturuldu.', type: 'success' }, { root: true })
    } else {
      store.dispatch('app/showAlert', { message: 'Bir hata oluştu.', type: 'error' }, { root: true })
    }

    store.set('app/isLoading', false)
  },
  async updateBudget (context, payload) {
    store.set('app/isLoading', true)

    const res = await this.$api.budget.create(payload)

    if (res) {
      const arr = store.get('budget/budgets')
      const index = arr.findIndex(e => e.id === payload.id)
      arr[index] = payload
      store.set('budget/budgets', [...arr])
      store.dispatch('app/showAlert', { message: 'Başarıyla güncellendi.', type: 'success' }, { root: true })
    } else {
      store.dispatch('app/showAlert', { message: 'Bir hata oluştu.', type: 'error' }, { root: true })
    }

    store.set('app/isLoading', false)
  },
  async getBudgets () {
    store.set('app/isLoading', true)

    const res = await this.$api.budget.get()

    store.set('budget/budgets', res.data)
    store.set('app/isLoading', false)
  },
  async getBudgetsBySupplierId (context, payload) {
    store.set('app/isLoading', true)

    const res = await this.$api.budget.getByParams({ url: 'SupplierId', params: [payload] })

    if (res) {
      store.set('budget/budgets', res.data)
    } else {
      store.dispatch('app/showAlert', { message: 'Tedarikçi bütçesi bulunamadı.', type: 'error' }, { root: true })
    }

    store.set('app/isLoading', false)
  },
  async getBudgetsByParams (context, payload) {
    store.set('app/isLoading', true)

    const res = await this.$api.budget.getByParams({ url: 'SupplierIdAndExperienceIdAndJobTitleId', params: [payload.supplierId, payload.experienceId, payload.jobTitleId] })

    if (res) {
      store.set('budget/invoiceBudget', res.data[0])
    } else {
      store.dispatch('app/showAlert', { message: 'Bütçesi bulunamadı.', type: 'error' }, { root: true })
    }

    store.set('app/isLoading', false)
  },
  resetStore: () => {
    store.set('budget/budgets', [])
    store.set('budget/invoiceBudget', {})
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
