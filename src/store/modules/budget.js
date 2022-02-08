import axios from 'axios'
import { make } from 'vuex-pathify'
import { CreateURL } from '@/util/helpers'
import store from '../index'

// Data
const state = {
  budgets: [],
  invoiceBudget: {},
}

const mutations = make.mutations(state)

const actions = {
  // Create Methods
  createBudget: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('Budget/SaveBudget'), payload)
      .then(({ data: res }) => {
        store.set('budget/budgets', [...store.get('budget/budgets'), res.data])
        store.dispatch('app/showAlert', { message: 'Başarıyla oluşturuldu.', type: 'success' }, { root: true })
      })
      .catch(error => {
        console.log('Error', error)
        store.dispatch('app/showAlert', { message: 'Bir hata oluştu.', type: 'error' }, { root: true })
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  updateBudget: (context, payload) => {
    store.set('app/isLoading', true)

    axios.put(CreateURL('Budget/UpdateBudget'), payload)
      .then(() => {
        const arr = store.get('budget/budgets')
        const index = arr.findIndex(e => e.id === payload.id)
        arr[index] = payload
        store.set('budget/budgets', [...arr])
        store.dispatch('app/showAlert', { message: 'Başarıyla güncellendi.', type: 'success' }, { root: true })
      })
      .catch(error => {
        console.log('Error', error)
        store.dispatch('app/showAlert', { message: 'Bir hata oluştu.', type: 'error' }, { root: true })
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  getBudgets: () => {
    store.set('app/isLoading', true)

    axios.get(CreateURL('Budget/GetBudgets'))
      .then(({ data: res }) => {
        store.set('budget/budgets', res.data)
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  getBudgetsBySupplierId: (context, payload) => {
    store.set('app/isLoading', true)

    axios.get(CreateURL(`Budget/GetBudgetsBySupplierId/${payload}`))
      .then(({ data: res }) => {
        store.set('budget/budgets', res.data)
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  getBudgetsByParams: (context, payload) => {
    store.set('app/isLoading', true)

    axios.get(
      CreateURL(`Budget/GetBudgetsBySupplierIdAndExperienceIdAndJobTitleId/${payload.supplierId}/${payload.experienceId}/${payload.jobTitleId}`),
  )
      .then(({ data: res }) => {
        store.set('budget/invoiceBudget', res.data[0])
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
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
