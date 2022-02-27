import { make } from 'vuex-pathify'
import store from '../index'

// Data
const state = {
  experiences: [],
}

const mutations = make.mutations(state)

const actions = {
  async createExperience (context, payload) {
    store.set('app/isLoading', true)

    const res = this.$api.experience.create(payload)
    if (res) {
      store.set('experience/experiences', [...store.get('experience/experiences'), res])
      store.dispatch('app/showAlert', { message: 'Başarıyla oluşturuldu.', type: 'success' }, { root: true })
    } else {
      store.dispatch('app/showAlert', { message: 'Bir hata oluştu ama ne olduğu henüz bilinmiyor!', type: 'error' }, { root: true })
    }

    store.set('app/isLoading', false)
  },
  async updateExperience (context, payload) {
    store.set('app/isLoading', true)

    const res = await this.$api.experience.update(payload)

    if (res) {
      const arr = store.get('experience/experiences')
      const index = arr.findIndex(e => e.id === payload.id)
      arr[index] = payload
      store.set('experience/experiences', [...arr])
      store.dispatch('app/showAlert', { message: 'Başarıyla güncellendi.', type: 'success' }, { root: true })
    } else {
      store.dispatch('app/showAlert', { message: 'Bir hata oluştu.', type: 'error' }, { root: true })
    }

    store.set('app/isLoading', false)
  },
  async getExperiences () {
    store.set('app/isLoading', true)

    const res = await this.$api.experience.get()

    store.set('experience/experiences', res.data)
    store.set('app/isLoading', false)
  },
  async getExperienceById (context, payload) {
    store.set('app/isLoading', true)

    const res = await this.$api.experience.getById(payload)

    store.set('experience/experiences', [res.data])
    store.set('app/isLoading', false)
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
