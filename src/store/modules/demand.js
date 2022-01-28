import axios from 'axios'
import { make } from 'vuex-pathify'
import { CreateURL, GetPostHeaders } from '@/util/helpers'
import { ROLE_IDS } from '@/util/globals'
import store from '../index'

// Data
const state = {
  demands: [],
  isLoading: false,
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
  getDemandsWithDetails: (c, role) => {
    store.set('app/isLoading', true)
    store.set('demand/isLoading', true)

    const currUser = store.get('user/user')
    const url = role === ROLE_IDS.UNIT_MANAGER
      ? CreateURL(`Demand/GetDemandsByCreatedBy/${currUser.id}`)
      : CreateURL(`Demand/GetDemandsBySupplierCompany/${currUser.companyId}`)

    axios.get(url, GetPostHeaders(currUser.token))
      .then(({ data: res }) => {
        const demands = [...res.data].map(el => {
          if (el.contractId) {
            axios.get(CreateURL(`Contract/GetContractById/${el.contractId}`), GetPostHeaders(currUser.token))
              .then(({ data: contract }) => {
                el.contract = contract.data
                axios.get(CreateURL(`Consultant/GetConsultantById/${contract.data.consultantId}`), GetPostHeaders(currUser.token))
                  .then(({ data: consultant }) => {
                    el.consultant = consultant.data
                  })
              })
          } else {
            el.contract = null
            el.consultant = null
          }
          return el
        })
        store.set('demand/demands', demands)
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        setTimeout(() => {
          store.set('demand/isLoading', false)
          store.set('app/isLoading', false)
        }, 1000)
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
