import axios from 'axios'
import { make } from 'vuex-pathify'
import { CreateURL, GetPostHeaders } from '@/util/helpers'
import store from '../index'

// Data
const state = {
  companies: [],
}

const mutations = make.mutations(state)

const actions = {
  // Create Methods
  createCompany: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('Company/SaveCompany'), payload, GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('company/companies', [...store.get('company/companies'), res.data])
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
  updateCompany: (context, payload) => {
    store.set('app/isLoading', true)

    axios.put(CreateURL('Company/UpdateCompany'), payload, GetPostHeaders(store.get('user/user').token))
      .then(() => {
        const arr = store.get('company/companies')
        const index = arr.findIndex(e => e.id === payload.id)
        arr[index] = payload
        store.set('company/companies', [...arr])
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
  getCompanies: () => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')

    axios.get(CreateURL('Company/GetCompanies'), GetPostHeaders(currUser.token))
      .then(({ data: res }) => {
        store.set('company/companies', res.data)
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  getCompanyById: (context, payload) => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')

    axios.get(CreateURL(`Company/GetCompanyById/${payload}`), GetPostHeaders(currUser.token))
      .then(({ data: res }) => {
        store.set('company/companies', res.data)
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  getSupplierCompanies: () => {
    store.set('app/isLoading', true)

    axios.get(CreateURL('Company/GetSupplierCompanies'), GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('company/companies', res.data)
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
