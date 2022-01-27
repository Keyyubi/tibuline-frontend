import axios from 'axios'
import { make } from 'vuex-pathify'
import { CreateURL, GetPostHeaders } from '@/util/helpers'
import store from '../index'

// Data
const state = {
  contracts: [],
}

const mutations = make.mutations(state)

const actions = {
  // Create Methods
  createContract: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('Contract/SaveContract'), payload, GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('contract/contracts', [...store.get('contract/contracts'), res.data])
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
  updateContract: (context, payload) => {
    store.set('app/isLoading', true)

    axios.put(CreateURL('Contract/UpdateContract'), payload, GetPostHeaders(store.get('user/user').token))
      .then(() => {
        const arr = store.get('contract/contracts')
        const index = arr.findIndex(e => e.id === payload.id)
        arr[index] = payload
        store.set('contract/contracts', [...arr])
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
  getContracts: () => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')

    axios.get(CreateURL('Contract/GetContracts'), GetPostHeaders(currUser.token))
      .then(({ data: res }) => {
        store.set('contract/contracts', res.data)
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  getContractById: (context, payload) => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')

    axios.get(CreateURL(`Contract/GetContractById/${payload}`), GetPostHeaders(currUser.token))
      .then(({ data: res }) => {
        store.set('contract/contracts', [res.data])
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  getContractsByCompany: (context, payload) => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')

    axios.get(CreateURL(`Contract/GetContractsByCompanyId/${payload}`), GetPostHeaders(currUser.token))
      .then(({ data: res }) => {
        store.set('contract/contracts', res.data)
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  uploadContract: (context, payload) => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')
    payload.formData.append('CompanyId', currUser.companyId)

    axios.post(CreateURL('Contract/UploadContractDocuments/upload'), payload.formData, {
      headers: {
        Authorization: `Bearer ${currUser.token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(({ data: res }) => {
        const arr = store.get('contract/contracts')
        const index = arr.findIndex(e => e.id === payload.id)
        const contract = arr[index]
        contract.filePath = res.data

        axios.put(CreateURL('Contract/UpdateContract'), contract, GetPostHeaders(currUser.token))
        .then(() => {
          arr[index] = contract
          store.set('contract/contracts', arr)
         store.dispatch('app/showAlert', { message: 'Başarıyla yüklendi.', type: 'success' }, { root: true })
        })
      })
      .catch(error => {
        console.log('Error', error)
        store.dispatch('app/showAlert', { message: 'Bir hata oluştu.', type: 'error' }, { root: true })
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
