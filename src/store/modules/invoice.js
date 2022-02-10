import { make } from 'vuex-pathify'
import store from '../index'

// Data
const state = {
  invoices: [],
}

const mutations = make.mutations(state)

const actions = {
  async createInvoice (context, payload) {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')
    payload.formData.append('SupplierId', currUser.company.id)

    const path = await this.$api.invoice.upload(payload.formData)

    if (path) {
      payload.invoice.invoiceFilePath = path.data
      const res = await this.$api.invoice.create(payload.invoice)

      if (res) {
        store.set('invoice/invoices', [...store.get('invoice/invoices'), payload.invoice])
        const periodRes = await this.$api.activityPeriod.update(payload.period)

        if (periodRes) {
          try {
            const arr = store.get('activityPeriod/activityPeriods')
            const index = arr.findIndex(e => e.id === payload.period.id)
            arr[index] = payload.period
            store.set('activityPeriod/activityPeriods', [...arr])
          } catch (err) {
            console.log('Error on updating ActivityPeriod: ', err)
          }
          store.dispatch('app/showAlert', { message: 'Fatura başarıyla oluşturuldu ve ilgili aktivite dönemi güncellendi.', type: 'success' }, { root: true })
        } else {
          store.dispatch('app/showAlert', { message: 'Fatura başarıyla oluşturuldu fakat ilgili aktivite dönemi güncellenemedi.', type: 'error' }, { root: true })
        }
      } else {
        store.dispatch('app/showAlert', { message: 'Fatura dosyası başarıyla yüklendi fakat fatura oluşturulamadı.', type: 'error' }, { root: true })
      }
    } else {
      store.dispatch('app/showAlert', { message: 'Fatura dosyası yüklenemedi.', type: 'error' }, { root: true })
    }

    store.set('app/isLoading', false)
  },
  async updateInvoice (context, payload) {
    store.set('app/isLoading', true)

    const res = await this.$api.invoice.update(payload)
    if (res) {
      const arr = store.get('invoice/invoices')
      const index = arr.findIndex(e => e.id === payload.id)
      arr[index] = payload
      store.set('invoice/invoices', [...arr])
      store.dispatch('app/showAlert', { message: 'Başarıyla güncellendi.', type: 'success' }, { root: true })
    } else {
      store.dispatch('app/showAlert', { message: 'Bir hata oluştu.', type: 'error' }, { root: true })
    }

    store.set('app/isLoading', false)
  },
  async getInvoices () {
    store.set('app/isLoading', true)

    const res = await this.$api.invoice.get()

    store.set('invoice/invoices', res.data)
    store.set('app/isLoading', false)
  },
  async getInvoicesByAssignedTo () {
    store.set('app/isLoading', true)
    const { id } = store.get('user/user')

    const res = await this.$api.budget.getByParams({ url: 'AssignedTo', params: [id] })

    if (res) {
      store.set('budget/invoiceBudget', res.data[0])
    } else {
      store.dispatch('app/showAlert', { message: 'Projeler getirilirken bir hata oluştu.', type: 'error' }, { root: true })
    }

    store.set('app/isLoading', false)
  },
  async uploadInvoice (context, payload) {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')
    payload.formData.append('SupplierId', currUser.company.id)

    const path = await this.$api.invoice.upload(payload.formData)

    if (path) {
      payload.invoice.filePath = path
      const res = await this.$api.invoice.update(payload.invoice)

      if (res) {
        const arr = store.get('invoice/invoices')
        const index = arr.findIndex(e => e.id === payload.invoice.id)
        arr[index] = payload.invoice
        store.set('invoice/invoices', arr)
        store.dispatch('app/showAlert', { message: 'Başarıyla yüklendi.', type: 'success' }, { root: true })
      } else {
        store.dispatch('app/showAlert', { message: 'Dosya başarıyla yüklendi fakat sözleşme güncellenemedi.', type: 'error' }, { root: true })
      }
    } else {
      store.dispatch('app/showAlert', { message: 'Dosya yüklenemedi.', type: 'success' }, { root: true })
    }

    store.set('app/isLoading', false)
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
