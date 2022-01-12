import axios from 'axios'
import { make } from 'vuex-pathify'
import { CreateURL, GetPostHeaders, ROLE_IDS } from '@/util/globals'
import store from '../index'

// Data
const state = {
  activities: [],
  budgets: [],
  company: {},
  consultants: [],
  costCenters: [],
  demands: [],
  experienceSpans: [],
  unitManagers: [],
  jobTitles: [],
  projects: [],
}

const mutations = make.mutations(state)

const actions = {
  // Create Methods
  createActivity: (context, payload) => {
    axios.post(CreateURL('Activity/SaveActivity'), payload, GetPostHeaders())
      .then(({ data: res }) => {
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
  createConsultant: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('Consultant/SaveConsultant'), payload, GetPostHeaders())
      .then(({ data: res }) => {
        store.set('supplier/consultants', [...store.get('supplier/consultants'), res.data])
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
    axios.put(CreateURL('Activity/UpdateActivity'), payload, GetPostHeaders())
      .then(() => {
        const arr = store.get('supplier/activities')
        const index = arr.findIndex(e => e.id === payload.id)
        arr[index] = payload
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
  updateConsultant: (context, payload) => {
    axios.put(CreateURL('Consultant/UpdateConsultant'), payload, GetPostHeaders())
      .then(() => {
        const arr = store.get('supplier/consultants')
        const index = arr.findIndex(e => e.id === payload.id)
        arr[index] = payload
        store.set('app/responseMsg', 'Başarıyla güncellendi.')
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
  updateDemand: (context, payload) => {
    axios.put(CreateURL('Demand/UpdateDemand'), payload, GetPostHeaders())
      .then(() => {
        const arr = store.get('supplier/demands')
        const index = arr.findIndex(e => e.id === payload.id)
        arr[index] = payload
        store.set('supplier/demands', [...arr])
        store.set('app/responseMsg', 'Başarıyla güncellendi.')
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
  getBudgetPlans: () => {
    store.set('app/isLoading', true)

    axios.get(CreateURL(`BudgetCalculation/GetBudgetCalculationsByCompanyId/${store.get('user/user').companyId}`), GetPostHeaders())
      .then(({ data: res }) => {
        store.set('supplier/budgets', res.data)
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
  getConsultants: () => {
    store.set('app/isLoading', true)
    const local = localStorage.getItem('tibuline@user') || '{}'
    const { user } = JSON.parse(local)

    axios.get(CreateURL(`Consultant/GetConsultantsByCompanyId/${user.companyId}`), GetPostHeaders())
      .then(({ data: res }) => {
        store.set('supplier/consultants', res.data)
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

    axios.get(CreateURL(`Activity/GetActivitiesByConsultantIdAndYearMonth/${payload.consultantId}/${payload.yearMonth}`), GetPostHeaders())
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
        store.set('supplier/activities', arr)
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
  getDemands: () => {
    store.set('app/isLoading', true)

    axios.get(CreateURL('Demand/GetDemands'), GetPostHeaders())
      .then(({ data: res }) => {
        store.set('supplier/demands', res.data)
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
  getExperienceSpans: () => {
    store.set('app/isLoading', true)
    const local = localStorage.getItem('tibuline@user') || '{}'
    const { user } = JSON.parse(local)

    axios.get(CreateURL(`ExperienceSpan/GetExperienceSpansByCompanyId/${user.companyId}`), GetPostHeaders())
      .then(({ data: res }) => {
        store.set('supplier/experienceSpans', res.data)
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
  getJobTitles: () => {
    store.set('app/isLoading', true)
    const local = localStorage.getItem('tibuline@user') || '{}'
    const { user } = JSON.parse(local)

    axios.get(CreateURL(`JobTitle/GetJobTitlesByCompanyId/${user.companyId}`), GetPostHeaders())
      .then(({ data: res }) => {
        store.set('supplier/jobTitles', res.data)
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

    axios.get(CreateURL('Project/GetProjects'), GetPostHeaders())
      .then(({ data: res }) => {
        store.set('supplier/projects', res.data)
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
  getUnitManagers: () => {
    store.set('app/isLoading', true)

    axios.get(CreateURL(`User/GetUsersByRoleId/${ROLE_IDS.UNIT_MANAGER}`), GetPostHeaders())
      .then(({ data: res }) => {
        store.set('supplier/unitManagers', res.data)
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
  // Delete methods
  deleteActivity: (context, id) => {
    store.set('app/isLoading', true)

    axios.delete(CreateURL(`Activity/DeleteActivity/${id}`), GetPostHeaders())
      .then(() => {
        store.set('app/responseMsg', 'Aktivite silindi.')
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
