import axios from 'axios'
import { make } from 'vuex-pathify'
import { CreateURL } from '@/util/helpers'
import store from '../index'

// Data
const state = {
  experiences: [],
}

const mutations = make.mutations(state)

const actions = {
  // Create Methods
  createExperience: (context, payload) => {
    store.set('app/isLoading', true)

    // this.$api.experience.create(payload)
    axios.post(CreateURL('Experience/SaveExperience'), payload)
      .then(({ data: res }) => {
        store.set('experience/experiences', [...store.get('experience/experiences'), res.data])
        store.dispatch('app/showAlert', { message: 'Başarıyla oluşturuldu.', type: 'success' }, { root: true })
      })
      .catch(error => {
        console.log('Error11', error)
        store.dispatch('app/showAlert', { message: 'Bir hata oluştu.', type: 'error' }, { root: true })
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  updateExperience: (context, payload) => {
    store.set('app/isLoading', true)

    axios.put(CreateURL('Experience/UpdateExperience'), payload)
      .then(() => {
        const arr = store.get('experience/experiences')
        const index = arr.findIndex(e => e.id === payload.id)
        arr[index] = payload
        store.set('experience/experiences', [...arr])
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
  getExperiences: () => {
    store.set('app/isLoading', true)
    // console.log('api', this.$api)

    axios.get(CreateURL('Experience/GetExperiences'))
      .then(({ data: res }) => {
        store.set('experience/experiences', res.data)
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  getExperienceById: (context, payload) => {
    store.set('app/isLoading', true)

    axios.get(CreateURL(`Experience/GetExperienceById/${payload}`))
      .then(({ data: res }) => {
        store.set('experience/experiences', [res.data])
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  resetStore: () => {
    store.set('experience/experiences', [])
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
