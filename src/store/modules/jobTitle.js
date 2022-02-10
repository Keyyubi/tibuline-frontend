import { make } from 'vuex-pathify'
import store from '../index'

// Data
const state = {
  jobTitles: [],
}

const mutations = make.mutations(state)

const actions = {
  async createJobTitle (context, payload) {
    store.set('app/isLoading', true)

    const res = await this.$api.jobTitle.create(payload)
    if (res) {
      store.set('jobTitle/jobTitles', [...store.get('jobTitle/jobTitles'), res.data])
      store.dispatch('app/showAlert', { message: 'Başarıyla oluşturuldu.', type: 'success' }, { root: true })
    } else {
      store.dispatch('app/showAlert', { message: 'Bir hata oluştu.', type: 'error' }, { root: true })
    }

    store.set('app/isLoading', false)
  },
  async updateJobTitle (context, payload) {
    store.set('app/isLoading', true)

    const res = await this.$api.jobTitle.update(payload)
    if (res) {
      const arr = store.get('jobTitle/jobTitles')
      const index = arr.findIndex(e => e.id === payload.id)
      arr[index] = payload
      store.set('jobTitle/jobTitles', [...arr])
      store.dispatch('app/showAlert', { message: 'Başarıyla güncellendi.', type: 'success' }, { root: true })
    } else {
      store.dispatch('app/showAlert', { message: 'Bir hata oluştu.', type: 'error' }, { root: true })
    }

    store.set('app/isLoading', false)
  },
  async getJobTitles () {
    store.set('app/isLoading', true)

    const res = await this.$api.jobTitle.get()

    store.set('jobTitle/jobTitles', res.data)
    store.set('app/isLoading', false)
  },
  async getJobTitleById (context, payload) {
    store.set('app/isLoading', true)

    const res = await this.$api.jobTitle.getById(payload)

    store.set('jobTitle/jobTitles', [res.data])
    store.set('app/isLoading', false)
  },
  resetStore: () => {
    store.set('jobTitle/jobTitles', [])
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
