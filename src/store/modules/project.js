import axios from 'axios'
import { make } from 'vuex-pathify'
import { CreateURL } from '@/util/helpers'
import store from '../index'

// Data
const state = {
  projects: [],
}

const mutations = make.mutations(state)

const actions = {
  // Create Methods
  createProject: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('Project/SaveProject'), payload)
      .then(({ data: res }) => {
        store.set('project/projects', [...store.get('project/projects'), res.data])
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
  updateProject: (context, payload) => {
    store.set('app/isLoading', true)

    axios.put(CreateURL('Project/UpdateProject'), payload)
      .then(() => {
        const arr = store.get('project/projects')
        const index = arr.findIndex(e => e.id === payload.id)
        arr[index] = payload
        store.set('project/projects', [...arr])
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
  getProjects: () => {
    store.set('app/isLoading', true)

    axios.get(CreateURL('Project/GetProjects'))
      .then(({ data: res }) => {
        store.set('project/projects', res.data)
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  getProjectsByAssignedTo: () => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')

    axios.get(CreateURL(`Project/GetProjectsByAssignedTo/${currUser.id}`))
      .then(({ data: res }) => {
        store.set('project/projects', res.data)
      })
      .catch(error => {
        console.log('Error', error)
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
