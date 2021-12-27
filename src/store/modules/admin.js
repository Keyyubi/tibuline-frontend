import { CreateURL, GetPostHeaders } from '@/util/globals'
import axios from 'axios'
import { make } from 'vuex-pathify'
import store from '../index'

// Data
const state = {
  unitManagers: [],
  suppliers: [],
  costCenters: [],
  experienceSpans: [],
  jobTitles: [],
  projects: [],
  budgetPlans: [],
  companies: [],
}

const mutations = make.mutations(state)

const actions = {
  // Create Methods
  createUser: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('User'), payload)
      .then(res => {
        store.set('app/isErrorMsg', false)
        store.set('app/responseMsg', 'Kullanıcı başarıyla oluşturuldu.')
      })
      .catch(error => {
        console.log('Error', error)
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', 'Bir hata oluştu.')
      })
      .finally(() => {
        store.set('app/isLoading', false)
        setTimeout(() => {
          store.set('app/responseMsg', '')
        }, 2000)
      })
  },
  createBudgetPlan: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('BudgetCalculation'), payload, GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('admin/jobTitles', [...store.get('admin/budgetPlans'), res.data])
        store.set('app/responseMsg', 'Başarıyla oluşturuldu.')
      })
      .catch(error => {
        console.log('Error', error)
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', 'Bir hata oluştu.')
      })
      .finally(() => {
        store.set('app/isLoading', false)
        setTimeout(() => {
          store.set('app/responseMsg', '')
        }, 2000)
      })
  },
  createCompany: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('Company'), payload, GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('admin/companies', [...store.get('admin/companies'), res.data])
        store.set('app/responseMsg', 'Başarıyla oluşturuldu.')
      })
      .catch(error => {
        console.log('Error', error)
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', 'Bir hata oluştu.')
      })
      .finally(() => {
        store.set('app/isLoading', false)
        setTimeout(() => {
          store.set('app/responseMsg', '')
        }, 2000)
      })
  },
  createCostCenter: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('CostCenter'), payload, GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('admin/costCenters', [...store.get('admin/costCenters'), res.data])
        store.set('app/responseMsg', 'Başarıyla oluşturuldu.')
      })
      .catch(error => {
        console.log('Error', error)
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', 'Bir hata oluştu.')
      })
      .finally(() => {
        store.set('app/isLoading', false)
        setTimeout(() => {
          store.set('app/responseMsg', '')
        }, 2000)
      })
  },
  createExperienceSpan: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('ExperienceSpan'), payload, GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('admin/experienceSpans', [...store.get('admin/experienceSpans'), res.data])
        store.set('app/responseMsg', 'Başarıyla oluşturuldu.')
      })
      .catch(error => {
        // ? AXIOS ERROR HANDLING EXAMPLE
        // if (error.response) {
        //   // Request made and server responded
        //   console.log(error.response.data)
        //   console.log(error.response.status)
        //   console.log(error.response.headers)
        // } else if (error.request) {
        //   // The request was made but no response was received
        //   console.log(error.request)
        // } else {
        //   // Something happened in setting up the request that triggered an Error
        //   console.log('Error', error.message)
        // }
        // ? END OF EXAMPLE

        console.log('Error', error)
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', 'Bir hata oluştu.')
      })
      .finally(() => {
        store.set('app/isLoading', false)
        setTimeout(() => {
          store.set('app/responseMsg', '')
        }, 2000)
      })
  },
  createJobTitle: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('JobTitle'), payload, GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('admin/jobTitles', [...store.get('admin/jobTitles'), res.data])
        store.set('app/responseMsg', 'Başarıyla oluşturuldu.')
      })
      .catch(error => {
        console.log('Error', error)
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', 'Bir hata oluştu.')
      })
      .finally(() => {
        store.set('app/isLoading', false)
        setTimeout(() => {
          store.set('app/responseMsg', '')
        }, 2000)
      })
  },
  createProject: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('Project'), payload, GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('admin/project', [...store.get('admin/project'), res.data])
        store.set('app/responseMsg', 'Başarıyla oluşturuldu.')
      })
      .catch(error => {
        console.log('Error', error)
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', 'Bir hata oluştu.')
      })
      .finally(() => {
        store.set('app/isLoading', false)
        setTimeout(() => {
          store.set('app/responseMsg', '')
        }, 2000)
      })
  },
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
      .catch(error => {
        console.log('Error', error)
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', 'Bir hata oluştu.')
      })
      .finally(() => {
        store.set('app/isLoading', false)
        setTimeout(() => {
          store.set('app/responseMsg', '')
        }, 2000)
      })
  },
  updateCompany: (context, payload) => {
    store.set('app/isLoading', true)

    axios.put(CreateURL('Company'), payload, GetPostHeaders(store.get('user/user').token))
      .then(() => {
        const arr = store.get('admin/companies')
        const index = arr.findIndex(e => e.id === payload.id)
        arr[index] = payload
        store.set('admin/companies', [...arr])
        store.set('app/responseMsg', 'Başarıyla oluşturuldu.')
      })
      .catch(error => {
        console.log('Error', error)
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', 'Bir hata oluştu.')
      })
      .finally(() => {
        store.set('app/isLoading', false)
        setTimeout(() => {
          store.set('app/responseMsg', '')
        }, 2000)
      })
  },
  updateCostCenter: (context, payload) => {
    store.set('app/isLoading', true)

    axios.put(CreateURL('CostCenter'), payload, GetPostHeaders(store.get('user/user').token))
      .then(() => {
        const arr = store.get('admin/costCenters')
        const index = arr.findIndex(e => e.id === payload.id)
        arr[index] = payload
        store.set('admin/costCenters', [...arr])
        store.set('app/responseMsg', 'Başarıyla oluşturuldu.')
      })
      .catch(error => {
        console.log('Error', error)
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', 'Bir hata oluştu.')
      })
      .finally(() => {
        store.set('app/isLoading', false)
        setTimeout(() => {
          store.set('app/responseMsg', '')
        }, 2000)
      })
  },
  updateExperienceSpan: (context, payload) => {
    store.set('app/isLoading', true)

    axios.put(CreateURL('ExperienceSpan'), payload, GetPostHeaders(store.get('user/user').token))
      .then(() => {
        const arr = store.get('admin/experienceSpans')
        const index = arr.findIndex(e => e.id === payload.id)
        arr[index] = payload
        store.set('admin/experienceSpans', [...arr])
        store.set('app/responseMsg', 'Başarıyla oluşturuldu.')
      })
      .catch(error => {
        console.log('Error', error)
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', 'Bir hata oluştu.')
      })
      .finally(() => {
        store.set('app/isLoading', false)
        setTimeout(() => {
          store.set('app/responseMsg', '')
        }, 2000)
      })
  },
  updateJobTitle: (context, payload) => {
    store.set('app/isLoading', true)

    axios.put(CreateURL('JobTitle'), payload, GetPostHeaders(store.get('user/user').token))
      .then(() => {
        const arr = store.get('admin/jobTitles')
        const index = arr.findIndex(e => e.id === payload.id)
        arr[index] = payload
        store.set('admin/jobTitles', [...arr])
        store.set('app/responseMsg', 'Başarıyla oluşturuldu.')
      })
      .catch(error => {
        console.log('Error', error)
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', 'Bir hata oluştu.')
      })
      .finally(() => {
        store.set('app/isLoading', false)
        setTimeout(() => {
          store.set('app/responseMsg', '')
        }, 2000)
      })
  },
  updateProject: (context, payload) => {
    store.set('app/isLoading', true)

    axios.put(CreateURL('Project'), payload, GetPostHeaders(store.get('user/user').token))
      .then(() => {
        const arr = store.get('admin/projects')
        const index = arr.findIndex(e => e.id === payload.id)
        arr[index] = payload
        store.set('admin/projects', [...arr])
        store.set('app/responseMsg', 'Başarıyla oluşturuldu.')
      })
      .catch(error => {
        console.log('Error', error)
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', 'Bir hata oluştu.')
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
      .catch(error => {
        console.log('Error', error)
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', 'Bir hata oluştu.')
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
      .catch(error => {
        console.log('Error', error)
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', 'Bir hata oluştu.')
      })
      .finally(() => {
        store.set('app/isLoading', false)
        setTimeout(() => {
          store.set('app/responseMsg', '')
        }, 2000)
      })
  },
  getCostCenters: () => {
    store.set('app/isLoading', true)

    axios.get(CreateURL('CostCenter'), GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('admin/costCenters', res.data)
      })
      .catch(error => {
        console.log('Error', error)
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', 'Bir hata oluştu.')
      })
      .finally(() => {
        store.set('app/isLoading', false)
        setTimeout(() => {
          store.set('app/responseMsg', '')
        }, 2000)
      })
  },
  getExperienceSpans: () => {
    store.set('app/isLoading', true)

    axios.get(CreateURL('ExperienceSpan'), GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('admin/experienceSpans', res.data)
      })
      .catch(error => {
        console.log('Error', error)
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', 'Bir hata oluştu.')
      })
      .finally(() => {
        store.set('app/isLoading', false)
        setTimeout(() => {
          store.set('app/responseMsg', '')
        }, 2000)
      })
  },
  getJobTitles: () => {
    store.set('app/isLoading', true)

    axios.get(CreateURL('JobTitle'), GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('admin/jobTitles', res.data)
      })
      .catch(error => {
        console.log('Error', error)
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', 'Bir hata oluştu.')
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
