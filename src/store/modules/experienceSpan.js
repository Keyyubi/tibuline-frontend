import axios from 'axios'
import { make } from 'vuex-pathify'
import { CreateURL, GetPostHeaders } from '@/util/helpers'
import store from '../index'

// Data
const state = {
  experienceSpans: [],
}

const mutations = make.mutations(state)

const actions = {
  // Create Methods
  createExperienceSpan: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('ExperienceSpan/SaveExperienceSpan'), payload, GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('experienceSpan/experienceSpans', [...store.get('experienceSpan/experienceSpans'), res.data])
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
  updateExperienceSpan: (context, payload) => {
    store.set('app/isLoading', true)

    axios.put(CreateURL('ExperienceSpan/UpdateExperienceSpan'), payload, GetPostHeaders(store.get('user/user').token))
      .then(() => {
        const arr = store.get('experienceSpan/experienceSpans')
        const index = arr.findIndex(e => e.id === payload.id)
        arr[index] = payload
        store.set('experienceSpan/experienceSpans', [...arr])
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
  getExperienceSpans: () => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')

    axios.get(CreateURL('ExperienceSpan/GetExperienceSpans'), GetPostHeaders(currUser.token))
      .then(({ data: res }) => {
        store.set('experienceSpan/experienceSpans', res.data)
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  getExperienceSpanById: (context, payload) => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')

    axios.get(CreateURL(`ExperienceSpan/GetExperienceSpanById/${payload}`), GetPostHeaders(currUser.token))
      .then(({ data: res }) => {
        store.set('experienceSpan/experienceSpans', [res.data])
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  resetStore: () => {
    store.set('experienceSpan/experienceSpans', [])
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
