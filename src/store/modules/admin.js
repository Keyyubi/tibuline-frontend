import axios from 'axios'
import { make } from 'vuex-pathify'
import { CreateURL } from '@/util/globals'
import store from '../index'

// Data
const state = {
  unitManagers: [],
  suppliers: [],
  costCenters: [],
  projects: [],
  jobTitles: [],
  budgetPlans: [],
}

const mutations = make.mutations(state)

const actions = {
  ...make.actions(state),
  createUser: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('User'), payload)
      .then(res => {
        store.set('app/isErrorMsg', false)
        store.set('app/responseMsg', 'Kullanıcı başarıyla oluşturuldu.')
      })
      .catch(({ response }) => {
        const { errors } = response.data.error
        const msg = errors.join(' ')
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', msg)
      })
      .finally(() => {
        store.set('app/isLoading', false)
        setTimeout(() => {
          store.set('app/responseMsg', '')
        }, 2000)
      })
  },
  getUnitManagers: () => {
    store.set('app/isLoading', true)

    axios.get(CreateURL('User/UnitManagers'))
      .then(({ data: res }) => {
        store.set('admin/unitManagers', res.data)
      })
      .catch(({ response }) => {
        const { errors } = response.data.error
        const msg = errors.join(' ')
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', msg)
      })
      .finally(() => {
        store.set('app/isLoading', false)
        setTimeout(() => {
          store.set('app/responseMsg', '')
        }, 2000)
      })
  },
  getSuppliers: () => {
    store.set('app/isLoading', true)

    axios.get(CreateURL('User/Suppliers'))
      .then(({ data: res }) => {
        store.set('admin/unitManagers', res.data)
      })
      .catch(({ response }) => {
        const { errors } = response.data.error
        const msg = errors.join(' ')
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', msg)
      })
      .finally(() => {
        store.set('app/isLoading', false)
        setTimeout(() => {
          store.set('app/responseMsg', '')
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
