import axios from 'axios'
import { make } from 'vuex-pathify'
import { CreateURL, GetPostHeaders } from '@/util/helpers'
import store from '../index'

// Data
const state = {
  jobTitles: [],
}

const mutations = make.mutations(state)

const actions = {
  // Create Methods
  createJobTitle: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('JobTitle/SaveJobTitle'), payload, GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('jobTitle/jobTitles', [...store.get('jobTitle/jobTitles'), res.data])
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
  updateJobTitle: (context, payload) => {
    store.set('app/isLoading', true)

    axios.put(CreateURL('JobTitle/UpdateJobTitle'), payload, GetPostHeaders(store.get('user/user').token))
      .then(() => {
        const arr = store.get('jobTitle/jobTitles')
        const index = arr.findIndex(e => e.id === payload.id)
        arr[index] = payload
        store.set('jobTitle/jobTitles', [...arr])
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
  getJobTitles: () => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')

    axios.get(CreateURL('JobTitle/GetJobTitles'), GetPostHeaders(currUser.token))
      .then(({ data: res }) => {
        store.set('jobTitle/jobTitles', res.data)
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  getJobTitleById: (context, payload) => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')

    axios.get(CreateURL(`JobTitle/GetJobTitleById/${payload}`), GetPostHeaders(currUser.token))
      .then(({ data: res }) => {
        store.set('jobTitle/jobTitles', [res.data])
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  getJobTitlesByCompanyId: (context, payload) => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')

    axios.get(CreateURL(`JobTitle/GetJobTitlesByCompanyId/${payload}`), GetPostHeaders(currUser.token))
      .then(({ data: res }) => {
        store.set('jobTitle/jobTitles', res.data)
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
