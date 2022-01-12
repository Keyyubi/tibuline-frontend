import axios from 'axios'
import { make } from 'vuex-pathify'
import { CreateURL, GetPostHeaders, ROLE_IDS } from '@/util/globals'
import store from '../index'

// Data
const state = {
  activities: [],
  budgets: [],
  companies: [],
  contracts: [],
  costCenters: [],
  demands: [],
  demandedConsultant: [],
  experienceSpans: [],
  jobTitles: [],
  projects: [],
  respons: '',
}

const mutations = make.mutations(state)

const actions = {
  // Create Methods
  createDemand: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('Demand/SaveDemand'), payload, GetPostHeaders())
      .then(({ data: res }) => {
        store.set('manager/demands', [...store.get('manager/demands'), res.data])
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
  createContract: (context, payload) => {
    store.set('app/isLoading', true)

    const local = localStorage.getItem('tibuline@user') || '{}'
    const { user } = JSON.parse(local)

    axios.post(CreateURL('Contract/UploadContractDocuments/upload'), payload.formData, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then(({ data: res }) => {
        payload.sending.filePath = res.data
        axios.post(CreateURL('Contract/SaveContract'), payload.sending, GetPostHeaders())
        .then(({ data: res }) => {
          store.set('manager/contracts', [...store.get('manager/contracts'), res.data])
          store.set('app/responseMsg', 'Başarıyla oluşturuldu.')
        })
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
  createProject: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('Project/SaveProject'), payload, GetPostHeaders())
      .then(({ data: res }) => {
        store.set('manager/projects', [...store.get('manager/projects'), res.data])
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
        const arr = store.get('supplier/demands')
        const index = arr.findIndex(e => e.id === payload.id)
        arr[index] = payload
        store.set('supplier/demands', [...arr])
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
  updateContract: (context, payload) => {
    axios.put(CreateURL('Activity/UpdateActivity'), payload, GetPostHeaders())
      .then(() => {
        const arr = store.get('supplier/demands')
        const index = arr.findIndex(e => e.id === payload.id)
        arr[index] = payload
        store.set('supplier/demands', [...arr])
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
  getBudgetPlansByCompany: (context, payload) => {
    store.set('app/isLoading', true)

    axios.get(CreateURL(`BudgetCalculation/GetBudgetCalculationsByCompanyId/${payload}`), GetPostHeaders())
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
  getConsultantById: (context, payload) => {
    store.set('app/isLoading', true)

    axios.get(CreateURL(`Consultant/GetConsultantById/${payload}`), GetPostHeaders())
      .then(({ data: res }) => {
        store.set('manager/demandedConsultant', [res.data])
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
  getContracts: () => {
    store.set('app/isLoading', true)

    // axios.get(CreateURL(`Contract/GetContractsByManagerId/${store.get('user/user').id}`), GetPostHeaders())
    axios.get(CreateURL('Contract/GetContracts'), GetPostHeaders())
      .then(({ data: res }) => {
        store.set('manager/contracts', res.data)
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

    axios.get(CreateURL('CostCenter/GetCostCenters'), GetPostHeaders())
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
  getDemands: () => {
    store.set('app/isLoading', true)

    axios.get(CreateURL('Demand/GetDemands'), GetPostHeaders())
      .then(({ data: res }) => {
        store.set('manager/demands', res.data)
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

    axios.get(CreateURL('ExperienceSpan/GetExperienceSpans'), GetPostHeaders())
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

    axios.get(CreateURL('JobTitle/GetJobTitles'), GetPostHeaders())
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
  getExperienceSpansByCompany: (context, payload) => {
    store.set('app/isLoading', true)

    axios.get(CreateURL(`ExperienceSpan/GetExperienceSpansByCompanyId/${payload}`), GetPostHeaders())
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
  getJobTitlesByCompany: (context, payload) => {
    store.set('app/isLoading', true)

    axios.get(CreateURL(`JobTitle/GetJobTitlesByCompanyId/${payload}`), GetPostHeaders())
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
    const local = localStorage.getItem('tibuline@user') || '{}'
    const { user } = JSON.parse(local)

    axios.get(CreateURL(`Project/GetProjectsByAssignedTo/${user.id}`), GetPostHeaders())
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

    axios.get(CreateURL('Company/GetSupplierCompanies'), GetPostHeaders())
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
