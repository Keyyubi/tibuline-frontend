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
    to: '/supplier/requests',
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
    to: '/unit-manager/requests',
  },
  {
    title: 'Sözleşmeler',
    icon: 'mdi-file-document',
    to: '/unit-manager/contracts',
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
]

// Data
const state = {
  drawer: null,
  drawerImage: true,
  mini: false,
  isLoading: false,
  items: [],
  responseMsg: '',
  isErrorMsg: false,
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
  updateAlertMsg: (context, payload) => {
    context.commit('responseMsg', payload.message)
    context.commit('isErrorMsg', payload.isError)
    setTimeout(() => {
      context.commit('responseMsg', '')
    }, 2000)
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
