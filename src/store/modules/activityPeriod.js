import axios from 'axios'
import { make } from 'vuex-pathify'
import { CreateURL, GetPostHeaders } from '@/util/helpers'
import store from '../index'

const state = {
  activityPeriods: [],
}

const mutations = make.mutations(state)

const actions = {
  // Create Methods
  createActivityPeriod: (context, payload) => {
    axios.post(CreateURL('ActivityPeriod/SaveActivityPeriod'), payload, GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('activityPeriod/activityPeriods', [...store.get('activityPeriod/activityPeriods'), res.data])
        store.dispatch('app/showAlert', { message: 'Başarıyla oluşturuldu.', type: 'success' }, { root: true })
      })
      .catch(error => {
        console.log('Error', error)
        store.dispatch('app/showAlert', { message: 'Bir hata oluştu.', type: 'error' }, { root: true })
      })
  },
  updateActivityPeriod: (context, payload) => {
    store.set('app/isLoading', true)

    axios.put(CreateURL('ActivityPeriod/UpdateActivityPeriod'), payload, GetPostHeaders(store.get('user/user').token))
      .then(() => {
        const arr = store.get('activityPeriod/activityPeriods')
        const index = arr.findIndex(e => e.id === payload.id)
        arr[index] = payload
        store.set('activityPeriod/activityPeriods', [...arr])
        store.dispatch('app/showAlert', { message: 'Aktivite dönemi başarıyla güncellendi.', type: 'success' }, { root: true })
      })
      .catch(error => {
        console.log('Error', error)
        store.dispatch('app/showAlert', { message: 'Bir hata oluştu.', type: 'error' }, { root: true })
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  getActivityPeriods: () => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')

    axios.get(CreateURL('ActivityPeriod/GetActivityPeriods'), GetPostHeaders(currUser.token))
      .then(({ data: res }) => {
        store.set('activityPeriod/activityPeriods', res.data)
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  getActivityPeriodById: (context, payload) => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')

    axios.get(CreateURL(`ActivityPeriod/GetActivityPeriodById/${payload}`), GetPostHeaders(currUser.token))
      .then(({ data: res }) => {
        store.set('activityPeriod/activityPeriods', res.data)
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  getActivityPeriodsByConsultantId: (context, payload) => {
    store.set('app/isLoading', true)

    axios.get(CreateURL(`ActivityPeriod/GetActivityPeriodsByConsultantId/${payload}`), GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('activityPeriod/activityPeriods', res.data)
      })
      .catch(error => {
        console.log('Error', error)
        store.dispatch('app/showAlert', { message: 'Danışman aktiviteleri alınırken bir hata oluştu.', type: 'error' }, { root: true })
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
