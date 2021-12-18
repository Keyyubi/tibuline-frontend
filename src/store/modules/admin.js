import axios from 'axios'
import { make } from 'vuex-pathify'
import { CreateURL } from '@/util/globals'
import store from '../index'

// Data
const state = {
  responseMsg: '',
  isError: false,
}

const mutations = make.mutations(state)

const actions = {
  ...make.actions(state),
  createUser: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('User'), payload)
      .then(res => {
        console.log('res', res)
        store.set('admin/isError', false)
        store.set('admin/responseMsg', 'Kullanıcı başarıyla oluşturuldu.')
      })
      .catch(({ response }) => {
        const { errors } = response.data.error
        const msg = errors.join(' ')
        store.set('admin/isError', true)
        store.set('admin/responseMsg', msg)
      })
      .finally(() => {
        store.set('app/isLoading', false)
        setTimeout(() => {
          store.set('admin/responseMsg', '')
        }, 2000)
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
