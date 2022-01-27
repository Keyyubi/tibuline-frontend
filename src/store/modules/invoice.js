import axios from 'axios'
import { make } from 'vuex-pathify'
import { CreateURL, GetPostHeaders } from '@/util/helpers'
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
    payload.formData.append('CompanyId', currUser.companyId)

    axios.post(CreateURL('Invoice/UploadInvoiceDocuments/upload'), payload.formData, {
      headers: {
        Authorization: `Bearer ${currUser.token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(({ data: res }) => {
        payload.invoice.invoiceFilePath = res.data

        axios.post(CreateURL('Invoce/SaveInvoice'), payload.invoice, GetPostHeaders(currUser.token))
        .then(({ data: createdInvoice }) => {
          store.set('invoice/invoices', [...store.get('invoice/invoices'), createdInvoice.data])
          store.dispatch('app/showAlert', { message: 'Fatura oluşturuldu.', type: 'success' }, { root: true })
        })
        .then(() => {
          const { length } = payload.activities
          for (let i = 0; i < length; i++) {
            store.dispatch('activity/updateActivity', payload.activities[i])
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

    axios.put(CreateURL('Invoice/UpdateInvoice'), payload, GetPostHeaders(store.get('user/user').token))
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
    const currUser = store.get('user/user')

    axios.get(CreateURL('Invoice/GetInvoices'), GetPostHeaders(currUser.token))
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

    axios.get(CreateURL(`Invoice/GetInvoicesByAssignedTo/${currUser.id}`), GetPostHeaders(currUser.token))
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
