import axios from 'axios'
import { make } from 'vuex-pathify'
import { trailingSlash } from '../../util/helpers'
import store from '../index'

const getMappedActivities = (items = []) => {
  // const arr = []

  // items.forEach(e => {
  //   arr.push({
  //     ...e,
  //     name: `${e.shiftHours}s mesai`,
  //     start: new Date(e.date),
  //     end: new Date(e.date),
  //     color: 'green',
  //     timed: false,
  //   })

  //   if (e.overShiftHours && e.overShiftHours > 0) {
  //     arr.push({
  //       ...e,
  //       name: `${e.overShiftHours}s mesai`,
  //       start: new Date(e.date),
  //       end: new Date(e.date),
  //       color: 'red',
  //       timed: false,
  //     })
  //   }

  //   if (e.dayOffHours && e.dayOffHours > 0) {
  //     arr.push({
  //       ...e,
  //       name: `${e.dayOffHours}s izin`,
  //       start: new Date(e.date),
  //       end: new Date(e.date),
  //       color: 'orange',
  //       timed: false,
  //     })
  //   }
  // })

  // return arr

  //* OLD SYSTEM
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
  isLoading: false,
}

const mutations = make.mutations(state)

const actions = {
  async createActivity (context, payload) {
    store.set('app/isLoading', true)

    const res = await this.$api.activity.create(payload)

    if (res) {
      store.set('activity/activities', [...store.get('activity/activities'), ...getMappedActivities(payload)])
      store.dispatch('app/showAlert', { message: 'Başarıyla oluşturuldu.', type: 'success' }, { root: true })
    } else {
      store.dispatch('app/showAlert', { message: 'Bir hata oluştu.', type: 'error' }, { root: true })
    }
    store.set('app/isLoading', false)
  },
  async createActivities (context, payload) {
    store.set('app/isLoading', true)

    const res = await axios.post(`${trailingSlash(process.env.VUE_APP_ROOT_API)}api/Activity/SaveActivities`, payload)

    res.then(e => {
      store.set('activity/activities', [...store.get('activity/activities'), ...getMappedActivities(payload)])
      store.dispatch('app/showAlert', { message: 'Başarıyla oluşturuldu.', type: 'success' }, { root: true })
    }).catch(err => {
      store.dispatch('app/showAlert', { message: 'Bir hata oluştu.', type: 'error' }, { root: true })
      console.log('err', err)
    }).finally(() => { store.set('app/isLoading', false) })
  },
  async updateActivity (context, payload) {
    store.set('app/isLoading', true)

    const res = await this.$api.activity.update(payload)

    if (res) {
      const arr = store.get('activity/activities')
      const index = arr.findIndex(e => e.id === payload.id)
      arr[index] = payload
      store.set('activity/activities', [...arr])
      store.dispatch('app/showAlert', { message: 'Aktivite başarıyla güncellendi.', type: 'success' }, { root: true })
    } else {
      store.dispatch('app/showAlert', { message: 'Bir hata oluştu.', type: 'error' }, { root: true })
    }

    store.set('app/isLoading', false)
  },
  async getActivitiesByConsultantIdAndYearMonth (context, payload) {
    store.set('app/isLoading', true)

    const res = await this.$api.activity.getByParams({ url: 'ConsultantIdAndYearMonth', params: [payload.consultantId, payload.yearMonth] })

    if (res) {
      store.set('activity/activities', getMappedActivities(res.data))
    } else {
      store.dispatch('app/showAlert', { message: 'Danışman aktiviteleri alınırken bir hata oluştu.', type: 'error' }, { root: true })
    }

    store.set('app/isLoading', false)
  },
  async deleteActivity (context, id) {
    store.set('app/isLoading', true)

    const res = await this.$api.activity.delete(id)

    if (res) {
      store.dispatch('app/showAlert', { message: 'Aktivite silindi.', type: 'error' }, { root: true })
    } else {
      store.dispatch('app/showAlert', { message: 'Aktivite silinirken hata oluştu.', type: 'error' }, { root: true })
    }

    store.set('app/isLoading', true)
  },
  async deleteActivities (context, ids) {
    store.set('app/isLoading', true)

    const res = await axios.delete(`${trailingSlash(process.env.VUE_APP_ROOT_API)}/api/Activity/DeleteActivities`, ids)

    res.then(e => {
      store.dispatch('app/showAlert', { message: 'Aktiviteler silindi.', type: 'error' }, { root: true })
    }).catch(err => {
      store.dispatch('app/showAlert', { message: 'Aktiviteler silinirken hata oluştu.', type: 'error' }, { root: true })
      console.log('err', err)
    }).finally(() => { store.set('app/isLoading', false) })
  },
  setLoading (c, payload) {
    store.set('activity/isLoading', payload)
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
