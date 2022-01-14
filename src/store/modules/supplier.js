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
  contracts: [],
  costCenters: [],
  demands: [],
  demandedConsultant: [],
  experienceSpans: [],
  unitManagers: [],
  jobTitles: [],
  projects: [],
}

const mutations = make.mutations(state)

const actions = {
  // Create Methods
  createActivity: (context, payload) => {
    axios.post(CreateURL('Activity/SaveActivity'), payload, GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        context.commit('app/showAlert', { alertMessage: 'Başarıyla oluşturuldu.', alertType: 'success' })
      })
      .catch(error => {
        console.log('Error', error)
        context.commit('app/showAlert', { alertMessage: 'Bir hata oluştu.', alertType: 'error' })
      })
  },
  createConsultant: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('Consultant/SaveConsultant'), payload, GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('supplier/consultants', [...store.get('supplier/consultants'), res.data])
        context.commit('app/showAlert', { alertMessage: 'Başarıyla oluşturuldu.', alertType: 'success' })
      })
      .catch(error => {
        console.log('Error', error)
        context.commit('app/showAlert', { alertMessage: 'Bir hata oluştu.', alertType: 'error' })
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  // Update Methods
  updateActivity: (context, payload) => {
    axios.put(CreateURL('Activity/UpdateActivity'), payload, GetPostHeaders(store.get('user/user').token))
      .then(() => {
        context.commit('app/showAlert', { alertMessage: 'Başarıyla güncellendi.', alertType: 'success' })
      })
      .catch(error => {
        console.log('Error', error)
        context.commit('app/showAlert', { alertMessage: 'Bir hata oluştu.', alertType: 'error' })
      })
  },
  updateConsultant: (context, payload) => {
    axios.put(CreateURL('Consultant/UpdateConsultant'), payload, GetPostHeaders(store.get('user/user').token))
      .then(() => {
        context.commit('app/showAlert', { alertMessage: 'Başarıyla güncellendi.', alertType: 'success' })
      })
      .catch(error => {
        console.log('Error', error)
        context.commit('app/showAlert', { alertMessage: 'Bir hata oluştu.', alertType: 'error' })
      })
  },
  updateDemand: (context, payload) => {
    axios.put(CreateURL('Demand/UpdateDemand'), payload, GetPostHeaders(store.get('user/user').token))
      .then(() => {
        const arr = store.get('supplier/demands')
        const index = arr.findIndex(e => e.id === payload.id)
        arr[index] = payload
        store.set('supplier/demands', [...arr])
        context.commit('app/showAlert', { alertMessage: 'Başarıyla güncellendi.', alertType: 'success' })
      })
      .catch(error => {
        console.log('Error', error)
        context.commit('app/showAlert', { alertMessage: 'Bir hata oluştu.', alertType: 'error' })
      })
  },
  uploadContract: (context, payload) => {
    store.set('app/isLoading', true)
    const token = store.get('user/user').token

    axios.post(CreateURL('Consultant/UploadConsultantDocuments'), payload.formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(({ data: res }) => {
        payload.sending.contractFilePath = res.data
        axios.put(CreateURL('Consultant/UpdateConsultant'), payload.sending, GetPostHeaders(token))
        .then(({ data: res }) => {
          store.set('supplier/contracts', [...store.get('supplier/contracts'), res.data])
        context.commit('app/showAlert', { alertMessage: 'Başarıyla oluşturuldu.', alertType: 'success' })
        })
      })
      .catch(error => {
        console.log('Error', error)
        context.commit('app/showAlert', { alertMessage: 'Bir hata oluştu.', alertType: 'error' })
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  // Get Methods
  getBudgetPlans: () => {
    store.set('app/isLoading', true)

    axios.get(CreateURL(`BudgetCalculation/GetBudgetCalculationsByCompanyId/${store.get('user/user').companyId}`), GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('supplier/budgets', res.data)
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  getConsultants: () => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')

    axios.get(CreateURL(`Consultant/GetConsultantsByCompanyId/${currUser.companyId}`), GetPostHeaders(currUser.token))
      .then(({ data: res }) => {
        store.set('supplier/consultants', res.data)
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
        store.set('supplier/demandedConsultant', res.data)
      })
      .catch(error => {
        console.log('Error', error)
        context.commit('app/showAlert', { alertMessage: 'Danışman bilgileri alınırken bir hata oluştu.', alertType: 'error' })
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
        store.set('supplier/activities', arr)
      })
      .catch(error => {
        console.log('Error', error)
        context.commit('app/showAlert', { alertMessage: 'Danışman aktiviteleri alınırken bir hata oluştu.', alertType: 'error' })
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  getContracts: () => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')

    axios.get(CreateURL(`Contract/GetContractsBySupplierCompany/${currUser.companyId}`), GetPostHeaders(currUser.token))
      .then(({ data: res }) => {
        store.set('supplier/contracts', res.data)
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

    axios.get(CreateURL(`Demand/GetDemandsBySupplierCompany/${currUser.companyId}`), GetPostHeaders(currUser.token))
      .then(({ data: res }) => {
        store.set('supplier/demands', res.data)
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

    axios.get(CreateURL(`ExperienceSpan/GetExperienceSpansByCompanyId/${currUser.companyId}`), GetPostHeaders(currUser.token))
      .then(({ data: res }) => {
        store.set('supplier/experienceSpans', res.data)
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

    axios.get(CreateURL(`JobTitle/GetJobTitlesByCompanyId/${currUser.companyId}`), GetPostHeaders(currUser.token))
      .then(({ data: res }) => {
        store.set('supplier/jobTitles', res.data)
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

    axios.get(CreateURL('Project/GetProjects'), GetPostHeaders(currUser.token))
      .then(({ data: res }) => {
        store.set('supplier/projects', res.data)
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  getUnitManagers: () => {
    store.set('app/isLoading', true)

    axios.get(CreateURL(`User/GetUsersByRoleId/${ROLE_IDS.UNIT_MANAGER}`), GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('supplier/unitManagers', res.data)
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  // Delete methods
  deleteActivity: (context, id) => {
    const currUser = store.get('user/user')

    axios.delete(CreateURL(`Activity/DeleteActivity/${id}`), GetPostHeaders(currUser.token))
      .then(() => {
        context.commit('app/showAlert', { alertMessage: 'Aktivite silindi.', alertType: 'error' })
      })
      .catch(error => {
        console.log('Error', error)
        context.commit('app/showAlert', { alertMessage: 'Aktivite silinirken hata oluştu.', alertType: 'error' })
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
