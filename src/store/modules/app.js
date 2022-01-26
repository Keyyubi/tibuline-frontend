// Pathify
import { make } from 'vuex-pathify'
import { ROLE_IDS } from '@/util/globals'

const supplierItems = [
  {
    title: 'Dashboard',
    icon: 'mdi-view-dashboard',
    to: '/',
  },
  {
    title: 'Talepler',
    icon: 'mdi-account-plus',
    to: '/supplier/demands',
  },
  {
    title: 'Sözleşmeler',
    icon: 'mdi-file-document',
    to: '/supplier/contracts',
  },
  {
    title: 'Danışmanlar',
    icon: 'mdi-account-group',
    to: '/supplier/consultants',
  },
  {
    title: 'Aktivite Ekle',
    icon: 'mdi-check',
    to: '/supplier/add-activity',
  },
  {
    title: 'Faturalar',
    icon: 'mdi-cash-register',
    to: '/supplier/invoices/',
  },
]

const managerItems = [
  {
    title: 'Dashboard',
    icon: 'mdi-view-dashboard',
    to: '/',
  },
  {
    title: 'Talepler',
    icon: 'mdi-account-plus',
    to: '/unit-manager/demands',
  },
  {
    title: 'Projeler',
    icon: 'mdi-folder-table-outline',
    to: '/unit-manager/projects',
  },
  {
    title: 'Danışmanlar',
    icon: 'mdi-account-group',
    to: '/unit-manager/consultants',
  },
  {
    title: 'Aktiviteler ve Masraflar',
    icon: 'mdi-file-document-multiple',
    to: '/unit-manager/activities-costs/',
  },
  {
    title: 'Fatura Onayı',
    icon: 'mdi-check-decagram',
    to: '/unit-manager/bills/',
  },
]

const adminItems = [
  {
    title: 'Dashboard',
    icon: 'mdi-view-dashboard',
    to: '/',
  },
  {
    title: 'Şirketler',
    icon: 'mdi-domain',
    to: '/admin/companies/',
  },
  {
    title: 'Kullanıcılar',
    icon: 'mdi-account',
    to: '/admin/users',
  },
  {
    title: 'Masraf Merkezleri',
    icon: 'mdi-bank',
    to: '/admin/cost-centers',
  },
  {
    title: 'Ünvanlar',
    icon: 'mdi-subtitles',
    to: '/admin/job-titles',
  },
  {
    title: 'Tecrübe Aralıkları',
    icon: 'mdi-poll',
    to: '/admin/experience-spans/',
  },
  {
    title: 'Bütçeler',
    icon: 'mdi-currency-usd',
    to: '/admin/budgets/',
  },
  {
    title: 'Projeler',
    icon: 'mdi-folder-table-outline',
    to: '/admin/projects',
  },
]

// Data
const state = {
  drawer: null,
  drawerImage: true,
  mini: false,
  isLoading: false,
  items: [],
  alertMessage: '',
  alertType: '',
}

const mutations = make.mutations(state)

const actions = {
  ...make.actions(state),
  init: async ({ dispatch }) => {
    //
  },
  updateItems: (context, roleId) => {
    switch (roleId) {
      case ROLE_IDS.SUPPLIER:
        context.commit('items', supplierItems)
        break
      case ROLE_IDS.UNIT_MANAGER:
        context.commit('items', managerItems)
        break
      case ROLE_IDS.ADMIN:
        context.commit('items', adminItems)
        break
      default:
        context.commit('items', supplierItems)
        break
    }
  },
  showAlert: (context, payload) => {
    // Alert Types =>  'success', 'info', 'warning', 'error'
    context.commit('alertMessage', payload.message)
    context.commit('alertType', payload.type)
  },
  hideAlert: () => {
    setTimeout(() => {
      this.$store.dispatch('app/showAlert', { message: '', type: '' })
    }, 3000)
  },
  setLoading: (context, payload) => {
    context.commit('isLoading', payload)
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
