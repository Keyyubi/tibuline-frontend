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
  createRequest: (payload) => {
    store.set('app/isLoading', true)

//     axios.post(CreateURL('User'), payload)
//       .then(res => {
//         store.set('app/isError', false)
//         store.set('app/responseMsg', 'Kullanıcı başarıyla oluşturuldu.')
//       })
//       .catch(({ response }) => {
//         const { errors } = response.data.error
//         const msg = errors.join(' ')
//         store.set('app/isError', true)
//         store.set('app/responseMsg', msg)
//       })
//       .finally(() => {
//         store.set('app/isLoading', false)
//         setTimeout(() => {
//           store.set('app/responseMsg', '')
//         }, 2000)
//       })

    //* FOR DEVELOPMENT ONYL
    setTimeout(() => {
        store.set('app/isLoading', false)
        store.set('app/responseMsg', '')
    }, 2000)
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
