import axios from 'axios'
import { make } from 'vuex-pathify'
import { CreateURL, GetPostHeaders } from '@/util/globals'
import store from '../index'

// Data
const state = {
  activities: [],
  budgets: [],
  companies: [],
  contracts: [],
  consultants: [],
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

    axios.post(CreateURL('Demand/SaveDemand'), payload, GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('manager/demands', [...store.get('manager/demands'), res.data])
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
  createContract: (context, payload) => {
    store.set('app/isLoading', true)
    const token = store.get('user/user').token

    axios.post(CreateURL('Contract/UploadContractDocuments/upload'), payload.formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(({ data: res }) => {
        payload.sending.filePath = res.data
        axios.post(CreateURL('Contract/SaveContract'), payload.sending, GetPostHeaders(token))
        .then(({ data: res }) => {
          store.set('manager/contracts', [...store.get('manager/contracts'), res.data])
        store.dispatch('app/showAlert', { message: 'Başarıyla oluşturuldu.', type: 'success' }, { root: true })
        })
      })
      .catch(error => {
        console.log('Error', error)
        store.dispatch('app/showAlert', { message: 'Bir hata oluştu.', type: 'error' }, { root: true })
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  createProject: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('Project/SaveProject'), payload, GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('manager/projects', [...store.get('manager/projects'), res.data])
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
  // Update Methods
  updateActivity: (context, payload) => {
    store.set('app/isLoading', true)

    axios.put(CreateURL('Activity/UpdateActivity'), payload, GetPostHeaders(store.get('user/user').token))
      .then(() => {
        const arr = store.get('supplier/demands')
        const index = arr.findIndex(e => e.id === payload.id)
        arr[index] = payload
        store.set('supplier/demands', [...arr])
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
  updateContract: (context, payload) => {
    store.set('app/isLoading', true)

    axios.put(CreateURL('Activity/UpdateActivity'), payload, GetPostHeaders(store.get('user/user').token))
      .then(() => {
        const arr = store.get('supplier/demands')
        const index = arr.findIndex(e => e.id === payload.id)
        arr[index] = payload
        store.set('supplier/demands', [...arr])
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
  updateDemand: (context, payload) => {
    store.set('app/isLoading', true)

    axios.put(CreateURL('Demand/UpdateDemand'), payload, GetPostHeaders(store.get('user/user').token))
      .then(() => {
        if (payload.consultantPayload && payload.consultantPayload.id) {
          const consultant = { ...payload.consultantPayload }
          axios.put(CreateURL('Consultant/UpdateConsultant'), consultant, GetPostHeaders(store.get('user/user').token))
        }
        const arr = store.get('manager/demands')
        const index = arr.findIndex(e => e.id === payload.id)
        arr[index] = payload
        store.set('manager/demands', [...arr])
        store.set('app/message', 'Başarıyla güncellendi.')
      })
      .catch(error => {
        console.log('Error', error)
        store.dispatch('app/showAlert', { message: 'Bir hata oluştu.', type: 'error' }, { root: true })
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  // Get Methods
  getBudgetPlansByCompany: (context, payload) => {
    store.set('app/isLoading', true)

    axios.get(CreateURL(`BudgetCalculation/GetBudgetCalculationsByCompanyId/${payload}`), GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('manager/budgets', res.data)
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  getConsultantById: (context, payload) => {
    store.set('app/isLoading', true)

    axios.get(CreateURL(`Consultant/GetConsultantById/${payload}`), GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('manager/demandedConsultant', res.data)
      })
      .catch(error => {
        console.log('Error', error)
        store.dispatch('app/showAlert', { message: 'Danışman bilgileri alınırken bir hata oluştu.', type: 'error' }, { root: true })
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  getConsultants: (context, payload) => {
    store.set('app/isLoading', true)

    // axios.get(CreateURL(`Consultant/GetConsultants/${payload.consultantId}/${payload.yearMonth}`), GetPostHeaders(store.get('user/user').token))
    axios.get(CreateURL('Consultant/GetConsultants'), GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('manager/consultants', res.data)
      })
      .catch(error => {
        console.log('Error', error)
        store.dispatch('app/showAlert', { message: 'Danışman aktiviteleri alınırken bir hata oluştu.', type: 'error' }, { root: true })
      })
      .finally(() => {
        store.set('app/isLoading', false)
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
        store.dispatch('app/showAlert', { message: 'Danışman aktiviteleri alınırken bir hata oluştu.', type: 'error' }, { root: true })
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  getContracts: () => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')

    axios.get(CreateURL(`Contract/GetContractsByCreatedBy/${currUser.id}`), GetPostHeaders(currUser.token))
      .then(({ data: res }) => {
        store.set('manager/contracts', res.data)
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        store.set('app/isLoading', false)
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
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  getDemands: () => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')

    axios.get(CreateURL(`Demand/GetDemandsByCreatedBy/${currUser.id}`), GetPostHeaders(currUser.token))
      .then(({ data: res }) => {
        store.set('manager/demands', res.data)
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  getExperienceSpans: () => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')

    axios.get(CreateURL('ExperienceSpan/GetExperienceSpans'), GetPostHeaders(currUser.token))
      .then(({ data: res }) => {
        store.set('manager/experienceSpans', res.data)
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  getJobTitles: () => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')

    axios.get(CreateURL('JobTitle/GetJobTitles'), GetPostHeaders(currUser.token))
      .then(({ data: res }) => {
        store.set('manager/jobTitles', res.data)
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  getExperienceSpansByCompany: (context, payload) => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')

    axios.get(CreateURL(`ExperienceSpan/GetExperienceSpansByCompanyId/${payload}`), GetPostHeaders(currUser.token))
      .then(({ data: res }) => {
        store.set('manager/experienceSpans', res.data)
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  getJobTitlesByCompany: (context, payload) => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')

    axios.get(CreateURL(`JobTitle/GetJobTitlesByCompanyId/${payload}`), GetPostHeaders(currUser.token))
      .then(({ data: res }) => {
        store.set('manager/jobTitles', res.data)
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  getProjects: () => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')

    axios.get(CreateURL(`Project/GetProjectsByAssignedTo/${currUser.id}`), GetPostHeaders(currUser.token))
      .then(({ data: res }) => {
        store.set('manager/projects', res.data)
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        store.set('app/isLoading', false)
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
