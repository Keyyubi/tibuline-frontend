import axios from 'axios'
import { make } from 'vuex-pathify'
import { CreateURL, GetPostHeaders } from '@/util/globals'
import store from '../index'

// Data
const state = {
  budgets: [],
}

const mutations = make.mutations(state)

const actions = {
  // Create Methods
  createBudget: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('Budget/SaveBudget'), payload, GetPostHeaders(store.get('user/user').token))
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

    axios.put(CreateURL('Budget/UpdateBudget'), payload, GetPostHeaders(store.get('user/user').token))
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
    const currUser = store.get('user/user')

    axios.get(CreateURL('Budget/GetBudgets'), GetPostHeaders(currUser.token))
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
  getBudgetsByCompanyId: (context, payload) => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')

    axios.get(CreateURL(`Budget/GetBudgetsByCompanyId/${payload}`), GetPostHeaders(currUser.token))
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
}

const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
