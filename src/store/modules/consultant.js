import axios from 'axios'
import { make } from 'vuex-pathify'
import { CreateURL } from '@/util/helpers'
import store from '../index'

// Data
const state = {
  consultants: [],
}

const mutations = make.mutations(state)

const actions = {
  // Create Methods
  createConsultant: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('Consultant/SaveConsultant'), payload)
      .then(({ data: res }) => {
        store.set('consultant/consultants', [...store.get('consultant/consultants'), res.data])
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
  updateConsultant: (context, payload) => {
    store.set('app/isLoading', true)

    axios.put(CreateURL('Consultant/UpdateConsultant'), payload)
      .then(() => {
        const arr = store.get('consultant/consultants')
        const index = arr.findIndex(e => e.id === payload.id)
        arr[index] = payload
        store.set('consultant/consultants', [...arr])
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
  uploadFiles: (context, payload) => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')
    payload.formData.append('SupplierId', currUser.company.Id)

    axios.post(CreateURL('Consultant/UploadConsultantDocuments/upload'), payload.formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(({ data: res }) => {
        payload.sending.filePath = res.data
        axios.put(CreateURL('Consultant/UpdateConsultant'), payload.sending)
        .then(() => {
          const arr = store.get('consultant/consultants')
          const index = arr.findIndex(e => e.id === payload.sending.id)
          arr[index] = payload.sending
          store.set('consultant/consultants', arr)
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
  getConsultants: () => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')

    axios.get(CreateURL(`Consultant/GetConsultantsBySupplierId/${currUser.company.id}`))
      .then(({ data: res }) => {
        store.set('consultant/consultants', res.data)
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  getConsultantById: (context, payload) => {
    store.set('app/isLoading', true)

    axios.get(CreateURL(`Consultant/GetConsultantById/${payload}`))
      .then(({ data: res }) => {
        store.set('consultant/consultants', [res.data])
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  getConsultantsByManagerId: () => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')

    axios.get(CreateURL(`Consultant/GetConsultantsByManagerId/${currUser.id}`))
      .then(({ data: res }) => {
        store.set('consultant/consultants', res.data)
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  getAllConsultants: () => {
    store.set('app/isLoading', true)

    axios.get(CreateURL('Consultant/GetConsultants'))
      .then(({ data: res }) => {
        store.set('consultant/consultants', res.data)
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
