import axios from 'axios'
import { make } from 'vuex-pathify'
import { CreateURL, GetPostHeaders } from '@/util/helpers'
import store from '../index'

// Data
const state = {
  costCenters: [],
}

const mutations = make.mutations(state)

const actions = {
  // Create Methods
  createCostCenter: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('CostCenter/SaveCostCenter'), payload, GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('costCenter/costCenters', [...store.get('costCenter/costCenters'), res.data])
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
  updateCostCenter: (context, payload) => {
    store.set('app/isLoading', true)

    axios.put(CreateURL('CostCenter/UpdateCostCenter'), payload, GetPostHeaders(store.get('user/user').token))
      .then(() => {
        const arr = store.get('costCenter/costCenters')
        const index = arr.findIndex(e => e.id === payload.id)
        arr[index] = payload
        store.set('costCenter/costCenters', [...arr])
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
  getCostCenters: () => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')

    axios.get(CreateURL('CostCenter/GetCostCenters'), GetPostHeaders(currUser.token))
      .then(({ data: res }) => {
        store.set('costCenter/costCenters', res.data)
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
