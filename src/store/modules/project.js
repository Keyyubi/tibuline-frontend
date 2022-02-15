import { make } from 'vuex-pathify'
import store from '../index'

// Data
const state = {
  projects: [],
}

const mutations = make.mutations(state)

const actions = {
  async createProject (context, payload) {
    store.set('app/isLoading', true)

    const res = await this.$api.project.create(payload)
    if (res) {
      payload.id = res
      store.set('project/projects', [...store.get('project/projects'), payload])
      store.dispatch('app/showAlert', { message: 'Başarıyla oluşturuldu.', type: 'success' }, { root: true })
    } else {
      store.dispatch('app/showAlert', { message: 'Bir hata oluştu.', type: 'error' }, { root: true })
    }

    store.set('app/isLoading', false)
  },
  async updateProject (context, payload) {
    store.set('app/isLoading', true)

    const res = await this.$api.project.update(payload)
    if (res) {
      const arr = store.get('project/projects')
      const index = arr.findIndex(e => e.id === payload.id)
      arr[index] = payload
      store.set('project/projects', [...arr])
      store.dispatch('app/showAlert', { message: 'Başarıyla güncellendi.', type: 'success' }, { root: true })
    } else {
      store.dispatch('app/showAlert', { message: 'Bir hata oluştu.', type: 'error' }, { root: true })
    }

    store.set('app/isLoading', false)
  },
  async getProjects () {
    store.set('app/isLoading', true)

    const res = await this.$api.project.get()

    store.set('project/projects', res.data)
    store.set('app/isLoading', false)
  },
  async getProjectsByAssignedTo () {
    store.set('app/isLoading', true)
    const { id } = store.get('user/user')

    const res = await this.$api.project.getByParams({ url: 'AssignedTo', params: [id] })

    if (res) {
      store.set('project/projects', res.data)
    } else {
      store.dispatch('app/showAlert', { message: 'Projeler getirilirken bir hata oluştu.', type: 'error' }, { root: true })
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
