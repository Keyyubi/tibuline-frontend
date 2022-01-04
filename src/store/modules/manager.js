import axios from 'axios'
import { make } from 'vuex-pathify'
import { CreateURL, GetPostHeaders, ROLE_IDS } from '@/util/globals'
import store from '../index'

// Data
const state = {
  activities: [],
  budgets: [],
  costCenters: [],
  experienceSpans: [],
  jobTitles: [],
  projects: [],
  companies: [],
  demands: [],
}

const mutations = make.mutations(state)

const actions = {
  // Create Methods
  createConsultant: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('Consultant/SaveConsultant'), payload, GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('manager/consultants', [...store.get('manager/consultants'), res.data])
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
          store.set('app/isErrorMsg', false)
        }, 2000)
      })
  },
  createDemand: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('Demand/SaveDemand'), payload, GetPostHeaders(store.get('user/user').token))
      .then(() => {
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
          store.set('app/isErrorMsg', false)
        }, 2000)
      })
  },
  // Update Methods
  updateActivity: (context, payload) => {
    axios.put(CreateURL('Activity/UpdateActivity'), payload, GetPostHeaders(store.get('user/user').token))
      .then(() => {
        store.set('app/responseMsg', 'Başarıyla oluşturuldu.')
      })
      .catch(error => {
        console.log('Error', error)
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', 'Bir hata oluştu.')
      })
      .finally(() => {
        setTimeout(() => {
          store.set('app/responseMsg', '')
          store.set('app/isErrorMsg', false)
        }, 2000)
      })
  },
  // Get Methods
  getBudgetPlans: (context, payload) => {
    store.set('app/isLoading', true)

    axios.get(CreateURL(`BudgetCalculation/GetBudgetCalculationsByCompanyId/${payload}`), GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('manager/budgets', res.data)
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
          store.set('app/isErrorMsg', false)
        }, 2000)
      })
  },
  getConsultantActivities: (context, payload) => {
    store.set('app/isLoading', true)

    axios.get(CreateURL(`Activity/GetActivitiesByConsultantIdAndYearMonth/${payload.consultantId}/${payload.yearMonth}`), GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        const arr = res.data.map(e => {
          const name = `${e.shiftHours}s mesai ${e.overShiftHours ? ' - ' + e.overShiftHours + 's fazla mesai' : ''}`
          return {
            ...e,
            name,
            start: new Date(e.date),
            end: new Date(e.date),
            color: 'green',
            timed: false,
          }
        })
        store.set('manager/activities', arr)
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
          store.set('app/isErrorMsg', false)
        }, 2000)
      })
  },
  getCostCenters: () => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')

    axios.get(CreateURL('CostCenter/GetCostCenters'), GetPostHeaders(currUser.token))
      .then(({ data: res }) => {
        store.set('manager/costCenters', res.data)
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
          store.set('app/isErrorMsg', false)
        }, 2000)
      })
  },
  getExperienceSpans: (context, payload) => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')

    axios.get(CreateURL(`ExperienceSpan/GetExperienceSpansByCompanyId/${payload}`), GetPostHeaders(currUser.token))
      .then(({ data: res }) => {
        store.set('manager/experienceSpans', res.data)
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
          store.set('app/isErrorMsg', false)
        }, 2000)
      })
  },
  getJobTitles: (context, payload) => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')

    axios.get(CreateURL(`JobTitle/GetJobTitlesByCompanyId/${payload}`), GetPostHeaders(currUser.token))
      .then(({ data: res }) => {
        store.set('manager/jobTitles', res.data)
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
          store.set('app/isErrorMsg', false)
        }, 2000)
      })
  },
  getProjects: () => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')

    axios.get(CreateURL('Project/GetProjects'), GetPostHeaders(currUser.token))
      .then(({ data: res }) => {
        store.set('manager/projects', res.data)
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
          store.set('app/isErrorMsg', false)
        }, 2000)
      })
  },
  getSupplierCompanies: () => {
    store.set('app/isLoading', true)

    axios.get(CreateURL('Company/GetSupplierCompanies'), GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('manager/companies', res.data)
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
          store.set('app/isErrorMsg', false)
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
