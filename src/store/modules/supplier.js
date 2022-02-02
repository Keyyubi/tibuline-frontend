import axios from 'axios'
import { make } from 'vuex-pathify'
import { CreateURL, GetPostHeaders } from '@/util/helpers'
import store from '../index'

// Data
const state = {
  suppliers: [],
}

const mutations = make.mutations(state)

const actions = {
  // Create Methods
  createSupplier: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('Supplier/SaveSupplier'), payload, GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('supplier/suppliers', [...store.get('supplier/suppliers'), res.data])
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
  updateSupplier: (context, payload) => {
    store.set('app/isLoading', true)

    axios.put(CreateURL('Supplier/UpdateSupplier'), payload, GetPostHeaders(store.get('user/user').token))
      .then(() => {
        const arr = store.get('supplier/suppliers')
        const index = arr.findIndex(e => e.id === payload.id)
        arr[index] = payload
        store.set('supplier/suppliers', [...arr])
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
  getSuppliers: () => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')

    axios.get(CreateURL('Supplier/GetSuppliers'), GetPostHeaders(currUser.token))
      .then(({ data: res }) => {
        store.set('supplier/suppliers', res.data)
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  getSupplierById: (context, payload) => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')

    axios.get(CreateURL(`Supplier/GetSupplierById/${payload}`), GetPostHeaders(currUser.token))
      .then(({ data: res }) => {
        store.set('supplier/suppliers', [res.data])
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
