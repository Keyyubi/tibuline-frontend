import { CreateURL, GetPostHeaders, ROLE_IDS } from '@/util/globals'
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

    axios.post(CreateURL('User/CreateUser'), payload)
      .then(() => {
        context.commit('app/showAlert', { alertMessage: 'Kullanıcı başarıyla oluşturuldu.', alertType: 'success' })
      })
      .catch(error => {
        console.log('Error', error)
        context.commit('app/showAlert', { alertMessage: 'Bir hata oluştu.', alertType: 'success' })
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  createBudgetPlan: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('BudgetCalculation/SaveBudgetCalculation'), payload, GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('admin/budgetPlans', [...store.get('admin/budgetPlans'), res.data])
        context.commit('app/showAlert', { alertMessage: 'Başarıyla oluşturuldu.', alertType: 'success' })
      })
      .catch(error => {
        console.log('Error', error)
        context.commit('app/showAlert', { alertMessage: 'Bir hata oluştu.', alertType: 'success' })
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  createCompany: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('Company/SaveCompany'), payload, GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('admin/companies', [...store.get('admin/companies'), res.data])
        context.commit('app/showAlert', { alertMessage: 'Başarıyla oluşturuldu.', alertType: 'success' })
      })
      .catch(error => {
        console.log('Error', error)
        context.commit('app/showAlert', { alertMessage: 'Bir hata oluştu.', alertType: 'success' })
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  createCostCenter: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('CostCenter/SaveCostCenter'), payload, GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('admin/costCenters', [...store.get('admin/costCenters'), res.data])
        context.commit('app/showAlert', { alertMessage: 'Başarıyla oluşturuldu.', alertType: 'success' })
      })
      .catch(error => {
        console.log('Error', error)
        context.commit('app/showAlert', { alertMessage: 'Bir hata oluştu.', alertType: 'success' })
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  createExperienceSpan: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('ExperienceSpan/SaveExperienceSpan'), payload, GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('admin/experienceSpans', [...store.get('admin/experienceSpans'), res.data])
        context.commit('app/showAlert', { alertMessage: 'Başarıyla oluşturuldu.', alertType: 'success' })
      })
      .catch(error => {
        console.log('Error', error)
        context.commit('app/showAlert', { alertMessage: 'Bir hata oluştu.', alertType: 'success' })
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  createJobTitle: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('JobTitle/SaveJobTitle'), payload, GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('admin/jobTitles', [...store.get('admin/jobTitles'), res.data])
        context.commit('app/showAlert', { alertMessage: 'Başarıyla oluşturuldu.', alertType: 'success' })
      })
      .catch(error => {
        console.log('Error', error)
        context.commit('app/showAlert', { alertMessage: 'Bir hata oluştu.', alertType: 'success' })
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  createProject: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('Project/SaveProject'), payload, GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('admin/projects', [...store.get('admin/projects'), res.data])
        context.commit('app/showAlert', { alertMessage: 'Başarıyla oluşturuldu.', alertType: 'success' })
      })
      .catch(error => {
        console.log('Error', error)
        context.commit('app/showAlert', { alertMessage: 'Bir hata oluştu.', alertType: 'success' })
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  updateBudgetPlan: (context, payload) => {
    store.set('app/isLoading', true)

    axios.put(CreateURL('BudgetCalculation/UpdateBudgetCalculation'), payload, GetPostHeaders(store.get('user/user').token))
      .then(() => {
        const arr = store.get('admin/budgetPlans')
        const index = arr.findIndex(e => e.id === payload.id)
        arr[index] = payload
        store.set('admin/budgetPlans', [...arr])
        context.commit('app/showAlert', { alertMessage: 'Başarıyla güncellendi.', alertType: 'success' })
      })
      .catch(error => {
        console.log('Error', error)
        context.commit('app/showAlert', { alertMessage: 'Bir hata oluştu.', alertType: 'success' })
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  updateCompany: (context, payload) => {
    store.set('app/isLoading', true)

    axios.put(CreateURL('Company/UpdateCompany'), payload, GetPostHeaders(store.get('user/user').token))
      .then(() => {
        const arr = store.get('admin/companies')
        const index = arr.findIndex(e => e.id === payload.id)
        arr[index] = payload
        store.set('admin/companies', [...arr])
        context.commit('app/showAlert', { alertMessage: 'Başarıyla güncellendi.', alertType: 'success' })
      })
      .catch(error => {
        console.log('Error', error)
        context.commit('app/showAlert', { alertMessage: 'Bir hata oluştu.', alertType: 'success' })
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  updateCostCenter: (context, payload) => {
    store.set('app/isLoading', true)

    axios.put(CreateURL('CostCenter/UpdateCostCenter'), payload, GetPostHeaders(store.get('user/user').token))
      .then(() => {
        const arr = store.get('admin/costCenters')
        const index = arr.findIndex(e => e.id === payload.id)
        arr[index] = payload
        store.set('admin/costCenters', [...arr])
        context.commit('app/showAlert', { alertMessage: 'Başarıyla güncellendi.', alertType: 'success' })
      })
      .catch(error => {
        console.log('Error', error)
        context.commit('app/showAlert', { alertMessage: 'Bir hata oluştu.', alertType: 'success' })
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  updateExperienceSpan: (context, payload) => {
    store.set('app/isLoading', true)

    axios.put(CreateURL('ExperienceSpan/UpdateExperienceSpan'), payload, GetPostHeaders(store.get('user/user').token))
      .then(() => {
        const arr = store.get('admin/experienceSpans')
        const index = arr.findIndex(e => e.id === payload.id)
        arr[index] = payload
        store.set('admin/experienceSpans', [...arr])
        context.commit('app/showAlert', { alertMessage: 'Başarıyla güncellendi.', alertType: 'success' })
      })
      .catch(error => {
        console.log('Error', error)
        context.commit('app/showAlert', { alertMessage: 'Bir hata oluştu.', alertType: 'success' })
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  updateJobTitle: (context, payload) => {
    store.set('app/isLoading', true)

    axios.put(CreateURL('JobTitle/UpdateJobTitle'), payload, GetPostHeaders(store.get('user/user').token))
      .then(() => {
        const arr = store.get('admin/jobTitles')
        const index = arr.findIndex(e => e.id === payload.id)
        arr[index] = payload
        store.set('admin/jobTitles', [...arr])
        context.commit('app/showAlert', { alertMessage: 'Başarıyla güncellendi.', alertType: 'success' })
      })
      .catch(error => {
        console.log('Error', error)
        context.commit('app/showAlert', { alertMessage: 'Bir hata oluştu.', alertType: 'success' })
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  updateProject: (context, payload) => {
    store.set('app/isLoading', true)

    axios.put(CreateURL('Project/UpdateProject'), payload, GetPostHeaders(store.get('user/user').token))
      .then(() => {
        const arr = store.get('admin/projects')
        const index = arr.findIndex(e => e.id === payload.id)
        arr[index] = payload
        store.set('admin/projects', [...arr])
        context.commit('app/showAlert', { alertMessage: 'Başarıyla güncellendi.', alertType: 'success' })
      })
      .catch(error => {
        console.log('Error', error)
        context.commit('app/showAlert', { alertMessage: 'Bir hata oluştu.', alertType: 'success' })
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  updateUser: (context, payload) => {
    store.set('app/isLoading', true)

    axios.put(CreateURL('User/UpdateUser'), payload, GetPostHeaders(store.get('user/user').token))
      .then(() => {
        const arr = payload.roleId === ROLE_IDS.UNIT_MANAGER ? store.get('admin/unitManagers') : store.get('admin/suppliers')
        const index = arr.findIndex(e => e.id === payload.id)
        arr[index] = payload
        store.set('admin/projects', [...arr])
        context.commit('app/showAlert', { alertMessage: 'Başarıyla güncellendi.', alertType: 'success' })
      })
      .catch(error => {
        console.log('Error', error)
        context.commit('app/showAlert', { alertMessage: 'Bir hata oluştu.', alertType: 'success' })
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  getBudgetPlans: () => {
    store.set('app/isLoading', true)

    axios.get(CreateURL('BudgetCalculation/GetBudgetCalculations'), GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('admin/budgetPlans', res.data)
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  getCompanies: () => {
    store.set('app/isLoading', true)

    axios.get(CreateURL('Company/GetCompanies'), GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('admin/companies', res.data)
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
        store.set('admin/companies', res.data)
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

    axios.get(CreateURL('CostCenter/GetCostCenters'), GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('admin/costCenters', res.data)
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

    axios.get(CreateURL('ExperienceSpan/GetExperienceSpans'), GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('admin/experienceSpans', res.data)
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
        store.set('admin/unitManagers', res.data)
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

    axios.get(CreateURL('JobTitle/GetJobTitles'), GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('admin/jobTitles', res.data)
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

    axios.get(CreateURL('Project/GetProjects'), GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('admin/projects', res.data)
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  getSuppliers: () => {
    store.set('app/isLoading', true)

    axios.get(CreateURL(`User/GetUsersByRoleId/${ROLE_IDS.SUPPLIER}`), GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('admin/suppliers', res.data)
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
