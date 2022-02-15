import axios from 'axios'
import { make } from 'vuex-pathify'
import { CreateURL } from '@/util/helpers'
import { ROLES } from '@/util/globals'
import store from '../index'
import { trailingSlash } from '../../util/helpers'

// Data
const state = {
  demands: [],
  isLoading: false,
}

const mutations = make.mutations(state)

const actions = {
  async createDemand (context, payload) {
    store.set('app/isLoading', true)

    const res = await this.$api.demand.create(payload)

    if (res) {
      store.set('demand/demands', [...store.get('demand/demands'), payload])
      store.dispatch('app/showAlert', { message: 'Başarıyla oluşturuldu.', type: 'success' }, { root: true })
    } else {
      store.dispatch('app/showAlert', { message: 'Bir hata oluştu.', type: 'error' }, { root: true })
    }

    store.set('app/isLoading', false)
  },
  async updateDemand (context, payload) {
    store.set('app/isLoading', true)
    const { olderContractId } = payload
    delete payload.olderContractId

    const url = `${trailingSlash(process.env.VUE_APP_ROOT_API)}/api/Demand/UpdateDemand/${olderContractId || -1}`
    await axios.put(url)
      .then(() => {
        const arr = store.get('demand/demands')
        const index = arr.findIndex(e => e.id === payload.id)
        arr[index] = payload
        store.set('demand/demands', [...arr])
        store.dispatch('app/showAlert', { message: 'Başarıyla güncellendi.', type: 'success' }, { root: true })
      })
      .catch(err => {
        console.log('Error: ', err)
        store.dispatch('app/showAlert', { message: 'Talep güncellenirken bir hata oluştu.', type: 'error' }, { root: true })
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  async getDemandsWithDetails (c, role) {
    store.set('app/isLoading', true)
    store.set('demand/isLoading', true)

    const currUser = store.get('user/user')
    const url = role === ROLES.UNIT_MANAGER
      ? `${trailingSlash(process.env.VUE_APP_ROOT_API)}/api/Demand/GetDemandsByCreatedBy/${currUser.id}`
      : `${trailingSlash(process.env.VUE_APP_ROOT_API)}/api/Demand/GetDemandsBySupplierId/${currUser.company.id}`

    await axios.get(url)
      .then(({ data: res }) => {
        const demands = [...res.data].map(el => {
          if (el.contractId) {
            el.olderContractId = el.contractId
            axios.get(CreateURL(`Contract/GetContractById/${el.contractId}`))
              .then(({ data: contract }) => {
                el.contract = contract.data
                axios.get(CreateURL(`Consultant/GetConsultantById/${contract.data.consultantId}`))
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

        return demands
      })
      .then(demands => {
        store.set('demand/demands', demands)
        setTimeout(() => {
          store.set('demand/isLoading', false)
        }, 1500)
      })
      .catch(error => {
        console.log('Error', error)
        store.set('demand/isLoading', false)
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  setLoading (c, payload) {
    store.set('demand/isLoading', payload)
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
