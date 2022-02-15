import { make } from 'vuex-pathify'
import store from '../index'

const state = {
  activityPeriods: [],
}

const mutations = make.mutations(state)

const actions = {
  async createActivityPeriod (context, payload) {
    store.set('app/isLoading', true)

    const res = await this.$api.activityPeriod.create(payload)

    if (res) {
      payload.id = res
      store.set('activityPeriod/activityPeriods', [...store.get('activityPeriod/activityPeriods'), payload])
      store.dispatch('app/showAlert', { message: 'Aktivite dönemi başarıyla oluşturuldu.', type: 'success' }, { root: true })
    } else {
      store.dispatch('app/showAlert', { message: 'Aktivite dönemi oluşturulamadı.', type: 'error' }, { root: true })
    }

    store.set('app/isLoading', false)
  },
  async updateActivityPeriod (context, payload) {
    store.set('app/isLoading', true)

    const res = await this.$api.activityPeriod.update(payload)
      if (res) {
        const arr = store.get('activityPeriod/activityPeriods')
        const index = arr.findIndex(e => e.id === payload.id)
        arr[index] = payload
        store.set('activityPeriod/activityPeriods', [...arr])
        store.dispatch('app/showAlert', { message: 'Aktivite dönemi başarıyla güncellendi.', type: 'success' }, { root: true })
      } else {
        store.dispatch('app/showAlert', { message: 'Aktivite dönemi güncellenemedi.', type: 'error' }, { root: true })
      }
      store.set('app/isLoading', false)
  },
  async getActivityPeriods () {
    store.set('app/isLoading', true)

    const res = await this.$api.activityPeriod.get()

    store.set('activityPeriod/activityPeriods', res.data)
    store.set('app/isLoading', false)
  },
  async getActivityPeriodsByConsultantId (context, payload) {
    store.set('app/isLoading', true)

    const res = await this.$api.activityPeriod.getByParams({ url: 'ConsultantId', params: [payload] })

    if (res) {
      store.set('activityPeriod/activityPeriods', res.data)
    } else {
      store.dispatch('app/showAlert', { message: 'Danışman aktiviteleri alınırken bir hata oluştu.', type: 'error' }, { root: true })
    }

    store.set('app/isLoading', false)
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
