import axios from 'axios'
import { make } from 'vuex-pathify'
import { CreateURL, GetPostHeaders } from '@/util/helpers'
import store from '../index'

// Data
const state = {
  demands: [],
}

const mutations = make.mutations(state)

const actions = {
  // Create Methods
  createDemand: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('Demand/SaveDemand'), payload, GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('demand/demands', [...store.get('demand/demands'), res.data])
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
        const arr = store.get('demand/demands')
        const index = arr.findIndex(e => e.id === payload.id)
        arr[index] = payload
        store.set('demand/demands', [...arr])
        store.dispatch('app/showAlert', { message: 'Başarıyla güncellendi.', type: 'success' }, { root: true })
      })
      .catch(error => {
        console.log('Error', error)
        store.dispatch('app/showAlert', { message: 'Bir hata oluştu.', type: 'error' }, { root: true })
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  getDemands: () => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')

    axios.get(CreateURL('Demand/GetDemands'), GetPostHeaders(currUser.token))
      .then(({ data: res }) => {
        store.set('demand/demands', res.data)
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  getDemandsByCreatedBy: () => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')

    axios.get(CreateURL(`Demand/GetDemandsByCreatedBy/${currUser.id}`), GetPostHeaders(currUser.token))
      .then(({ data: res }) => {
        store.set('demand/demands', res.data)
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  getDemandsBySupplierCompany: () => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')

    axios.get(CreateURL(`Demand/GetDemandsBySupplierCompany/${currUser.companyId}`), GetPostHeaders(currUser.token))
      .then(({ data: res }) => {
        store.set('demand/demands', res.data)
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  getDemandDetailsForManager: (c, demand) => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')

    axios.get(CreateURL(`JobTitle/GetJobTitlesByCompanyId/${demand.supplierCompanyId}`), GetPostHeaders(currUser.token))
      .then(({ data: jobTitles }) => {
        store.set('jobTitle/jobTitles', jobTitles.data)
        axios.get(CreateURL(`ExperienceSpan/GetExperienceSpansByCompanyId/${demand.supplierCompanyId}`), GetPostHeaders(currUser.token))
          .then(({ data: experienceSpans }) => {
            store.set('experienceSpan/experienceSpans', experienceSpans.data)
            axios.get(CreateURL(`Budget/GetBudgetsByCompanyId/${demand.supplierCompanyId}`), GetPostHeaders(currUser.token))
              .then(({ data: budgets }) => {
                store.set('budget/budgets', budgets.data)
                if (demand.contractId) {
                  axios.get(CreateURL(`Contract/GetContractById/${demand.contractId}`), GetPostHeaders(currUser.token))
                    .then(({ data: contract }) => {
                      store.set('contract/contracts', [contract.data])
                      axios.get(CreateURL(`Consultant/GetConsultantById/${contract.data.consultantId}`), GetPostHeaders(currUser.token))
                        .then(({ data: consultant }) => {
                          store.set('consultant/consultants', [consultant.data])
                        })
                    })
                } else {
                  store.set('contract/contracts', [])
                  store.set('consultant/consultants', [])
                }
              })
          })
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
