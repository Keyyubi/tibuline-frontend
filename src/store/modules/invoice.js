import axios from 'axios'
import { make } from 'vuex-pathify'
import { CreateURL } from '@/util/helpers'
import store from '../index'

// Data
const state = {
  invoices: [],
}

const mutations = make.mutations(state)

const actions = {
  // Create Methods
  createInvoice: (context, payload) => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')
    payload.formData.append('SupplierId', currUser.company.id)

    axios.post(CreateURL('Invoice/UploadInvoiceDocuments/upload'), payload.formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(({ data: res }) => {
        payload.invoice.invoiceFilePath = res.data

        axios.post(CreateURL('Invoice/SaveInvoice'), payload.invoice)
        .then(({ data: createdInvoice }) => {
          store.set('invoice/invoices', [...store.get('invoice/invoices'), createdInvoice.data])
          setTimeout(() => {
            store.dispatch('app/showAlert', { message: 'Fatura oluşturuldu.', type: 'success' }, { root: true })
          }, 750)
        })
        .then(() => {
          store.dispatch('activityPeriod/updateActivityPeriod', payload.period)
        })
        .then(() => {
          const { length } = payload.activities
          for (let i = 0; i < length; i++) {
            axios.put(CreateURL('Activity/UpdateActivity'), payload.activities[i])
          }
        })
      })
      .catch(error => {
        console.log('Error', error)
        store.dispatch('app/showAlert', { message: 'Fatura oluşturulamadı.', type: 'error' }, { root: true })
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  updateInvoice: (context, payload) => {
    store.set('app/isLoading', true)

    axios.put(CreateURL('Invoice/UpdateInvoice'), payload)
      .then(() => {
        const arr = store.get('invoice/invoices')
        const index = arr.findIndex(e => e.id === payload.id)
        arr[index] = payload
        store.set('invoice/invoices', [...arr])
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
  getInvoices: () => {
    store.set('app/isLoading', true)

    axios.get(CreateURL('Invoice/GetInvoices'))
      .then(({ data: res }) => {
        store.set('invoice/invoices', res.data)
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  getInvoicesByAssignedTo: () => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')

    axios.get(CreateURL(`Invoice/GetInvoicesByAssignedTo/${currUser.id}`))
      .then(({ data: res }) => {
        store.set('invoice/invoices', res.data)
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
