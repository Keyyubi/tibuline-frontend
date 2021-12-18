// Pathify
import { make } from 'vuex-pathify'
// App
import store from '../index'

// Data
const state = {}

const mutations = make.mutations(state)

const actions = {
  ...make.actions(state),
  createUser: (context, payload) => {

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
