import axios from 'axios'
import { make } from 'vuex-pathify'
import { CreateURL, GetPostHeaders } from '@/util/helpers'
import store from '../index'

const getMappedActivities = (items = []) => {
  const arr = items.length > 0 ? items.map(e => {
    const name = `${e.shiftHours}s mesai ${e.overShiftHours ? ' - ' + e.overShiftHours + 's fazla mesai' : ''}`
    return {
      ...e,
      name,
      start: new Date(e.date),
      end: new Date(e.date),
      color: 'green',
      timed: false,
    }
  }) : []
  return arr
}

// Data
const state = {
  activities: [],
}

const mutations = make.mutations(state)

const actions = {
  // Create Methods
  createActivity: (context, payload) => {
    axios.post(CreateURL('Activity/SaveActivity'), payload, GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('activity/activities', [...store.get('activity/activities'), ...getMappedActivities(res.data)])
        store.dispatch('app/showAlert', { message: 'Başarıyla oluşturuldu.', type: 'success' }, { root: true })
      })
      .catch(error => {
        console.log('Error', error)
        store.dispatch('app/showAlert', { message: 'Bir hata oluştu.', type: 'error' }, { root: true })
      })
  },
  updateActivity: (context, payload) => {
    store.set('app/isLoading', true)

    axios.put(CreateURL('Activity/UpdateActivity'), payload, GetPostHeaders(store.get('user/user').token))
      .then(() => {
        const arr = store.get('activity/activities')
        const index = arr.findIndex(e => e.id === payload.id)
        arr[index] = payload
        store.set('activity/activities', [...arr])
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
  getActivity: () => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')

    axios.get(CreateURL('Activity/GetActivities'), GetPostHeaders(currUser.token))
      .then(({ data: res }) => {
        store.set('activity/activities', getMappedActivities(res.data))
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  getActivityById: (context, payload) => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')

    axios.get(CreateURL(`Activity/GetActivityById/${payload}`), GetPostHeaders(currUser.token))
      .then(({ data: res }) => {
        store.set('activity/activities', getMappedActivities(res.data))
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  getActivitiesByConsultantIdAndYearMonth: (context, payload) => {
    store.set('app/isLoading', true)

    axios.get(CreateURL(`Activity/GetActivitiesByConsultantIdAndYearMonth/${payload.consultantId}/${payload.yearMonth}`), GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('activity/activities', getMappedActivities(res.data))
      })
      .catch(error => {
        console.log('Error', error)
        store.dispatch('app/showAlert', { message: 'Danışman aktiviteleri alınırken bir hata oluştu.', type: 'error' }, { root: true })
      })
      .finally(() => {
        setTimeout(() => {
          store.set('app/isLoading', false)
        }, 1000)
      })
  },
  getActivitiesByConsultantIdAndYearMonthAndStatus: (context, payload) => {
    store.set('app/isLoading', true)

    axios.get(CreateURL(`Activity/GetActivitiesByConsultantIdAndYearMonthAndStatus/${payload.consultantId}/${payload.yearMonth}/${payload.activityStatus}`), GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('activity/activities', getMappedActivities(res.data))
      })
      .catch(error => {
        console.log('Error', error)
        store.dispatch('app/showAlert', { message: 'Danışman aktiviteleri alınırken bir hata oluştu.', type: 'error' }, { root: true })
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  deleteActivity: (context, id) => {
    axios.delete(CreateURL(`Activity/DeleteActivity/${id}`), GetPostHeaders(store.get('user/user').token))
      .then(() => {
        store.dispatch('app/showAlert', { message: 'Aktivite silindi.', type: 'error' }, { root: true })
      })
      .catch(error => {
        console.log('Error', error)
        store.dispatch('app/showAlert', { message: 'Aktivite silinirken hata oluştu.', type: 'error' }, { root: true })
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
