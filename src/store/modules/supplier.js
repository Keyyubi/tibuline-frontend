import axios from 'axios'
import { make } from 'vuex-pathify'
import { CreateURL, GetPostHeaders } from '@/util/globals'
import store from '../index'

// Data
const state = {
  consultants: [],
  costCenters: [],
  experienceSpans: [],
  jobTitles: [],
  projects: [],
  budgetPlans: [],
  company: {},
}

const mutations = make.mutations(state)

const actions = {
  // Create Methods
  createActivity: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('Activity'), payload, GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('admin/project', [...store.get('admin/project'), res.data])
        store.set('app/responseMsg', 'Başarıyla oluşturuldu.')
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
  createConsultant: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('Consultant'), payload, GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('admin/project', [...store.get('admin/project'), res.data])
        store.set('app/responseMsg', 'Başarıyla oluşturuldu.')
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
  // Update Methods
  updateBudgetPlan: (context, payload) => {
    store.set('app/isLoading', true)

    axios.put(CreateURL('BudgetPlan'), payload, GetPostHeaders(store.get('user/user').token))
      .then(() => {
        const arr = store.get('admin/budgetPlans')
        const index = arr.findIndex(e => e.id === payload.id)
        arr[index] = payload
        store.set('admin/budgetPlans', [...arr])
        store.set('app/responseMsg', 'Başarıyla oluşturuldu.')
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
  // Get Methods
  getConsultants: () => {
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
  getCurrentUserCompany: () => {
    store.set('app/isLoading', true)
    const { companyId } = store.get('user/user')
    axios.get(CreateURL(`Company/${companyId}`))
      .then(({ data: res }) => {
        console.log('res', res)
        store.set('supplied/company', res.data)
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
