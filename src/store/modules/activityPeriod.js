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

    const approvedPeriods = [
      { id: 1, name: '2022-01', consultantId: 6, totalShiftHours: 150, totalOverShiftHours: 20, isInvoiced: false },
      { id: 2, name: '2022-02', consultantId: 6, totalShiftHours: 140, totalOverShiftHours: 0, isInvoiced: false },
      { id: 3, name: '2022-03', consultantId: 7, totalShiftHours: 140, totalOverShiftHours: 0, isInvoiced: false },
      { id: 4, name: '2022-04', consultantId: 6, totalShiftHours: 140, totalOverShiftHours: 0, isInvoiced: false },
      { id: 5, name: '2022-05', consultantId: 8, totalShiftHours: 140, totalOverShiftHours: 0, isInvoiced: false },
      { id: 6, name: '2022-06', consultantId: 6, totalShiftHours: 135, totalOverShiftHours: 15, isInvoiced: false },
      { id: 7, name: '2021-10', consultantId: 7, totalShiftHours: 150, totalOverShiftHours: 0, isInvoiced: false },
      { id: 8, name: '2021-11', consultantId: 6, totalShiftHours: 140, totalOverShiftHours: 0, isInvoiced: false },
      { id: 9, name: '2021-12', consultantId: 8, totalShiftHours: 120, totalOverShiftHours: 20, isInvoiced: false },
    ]

    const filtered = approvedPeriods.filter(e => e.consultantId === payload) || approvedPeriods
    store.set('activityPeriod/activityPeriods', filtered)
    store.set('app/isLoading', false)

    // axios.get(CreateURL(`ActivityPeriod/GetActivityPeriodsByConsultantId/${payload}`), GetPostHeaders(store.get('user/user').token))
    //   .then(({ data: res }) => {
    //     store.set('activityPeriod/activityPeriods', res.data)
    //   })
    //   .catch(error => {
    //     console.log('Error', error)
    //     store.dispatch('app/showAlert', { message: 'Danışman aktiviteleri alınırken bir hata oluştu.', type: 'error' }, { root: true })
    //   })
    //   .finally(() => {
    //     store.set('app/isLoading', false)
    //   })
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
