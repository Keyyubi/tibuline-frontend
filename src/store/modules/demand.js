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
    store.set('demand/isLoading', true)

    const res = await this.$api.demand.create(payload)

    if (res) {
      res.contract = null
      res.consultant = null
      store.set('demand/demands', [...store.get('demand/demands'), res])
      store.dispatch('app/showAlert', { message: 'Başarıyla oluşturuldu.', type: 'success' }, { root: true })
    } else {
      store.dispatch('app/showAlert', { message: 'Bir hata oluştu.', type: 'error' }, { root: true })
    }

    setTimeout(() => {
      store.set('app/isLoading', false)
      store.set('demand/isLoading', false)
    }, 1000)
  },
  async updateDemand (context, payload) {
    store.set('app/isLoading', true)
    store.set('demand/isLoading', true)
    const { olderContractId } = payload
    delete payload.olderContractId

    const url = `${trailingSlash(process.env.VUE_APP_ROOT_API)}api/Demand/UpdateDemand/${olderContractId || -1}`
    await axios.put(url, payload)
      .then(() => {
        const arr = store.get('demand/demands')
        const index = arr.findIndex(e => e.id === payload.id)
        arr[index] = payload

        store.set('demand/demands', arr)
        store.dispatch('app/showAlert', { message: 'Başarıyla güncellendi.', type: 'success' }, { root: true })
      })
      .catch(err => {
        console.log('Error: ', err)
        store.dispatch('app/showAlert', { message: 'Talep güncellenirken bir hata oluştu.', type: 'error' }, { root: true })
      })
      .finally(() => {
        store.set('demand/isLoading', false)
        store.set('app/isLoading', false)
      })
  },
  async getDemandsWithDetails (c, role) {
    store.set('app/isLoading', true)
    store.set('demand/isLoading', true)

    const currUser = store.get('user/user')
    const url = role === ROLES.UNIT_MANAGER
      ? `${trailingSlash(process.env.VUE_APP_ROOT_API)}api/Demand/GetDemandsByCreatedBy/${currUser.id}`
      : `${trailingSlash(process.env.VUE_APP_ROOT_API)}api/Demand/GetDemandsBySupplierId/${currUser.company.id}`

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

        store.set('demand/demands', demands)
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        setTimeout(() => {
          store.set('demand/isLoading', false)
          store.set('app/isLoading', false)
        }, 1500)
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
