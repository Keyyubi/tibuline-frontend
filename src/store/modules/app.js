// Pathify
import { make } from 'vuex-pathify'
import { ROLES } from '@/util/globals'

// Drawer Items
const items = [
  // SUPPLIER ITEMS
  {
    title: 'Dashboard',
    icon: 'mdi-view-dashboard',
    to: '/',
    role: ROLES.SUPPLIER,
  },
  {
    title: 'Talepler',
    icon: 'mdi-account-plus',
    to: '/supplier/demands',
    role: ROLES.SUPPLIER,
  },
  {
    title: 'Sözleşmeler',
    icon: 'mdi-file-document',
    to: '/supplier/contracts',
    role: ROLES.SUPPLIER,
  },
  {
    title: 'Danışmanlar',
    icon: 'mdi-account-group',
    to: '/supplier/consultants',
    role: ROLES.SUPPLIER,
  },
  {
    title: 'Aktivite Ekle',
    icon: 'mdi-check',
    to: '/supplier/add-activity',
    role: ROLES.SUPPLIER,
  },
  {
    title: 'Faturalar',
    icon: 'mdi-cash-register',
    to: '/supplier/invoices/',
    role: ROLES.SUPPLIER,
  },

  // MANAGER ITEMS
  {
    title: 'Dashboard',
    icon: 'mdi-view-dashboard',
    to: '/',
    role: ROLES.UNIT_MANAGER,
  },
  {
    title: 'Talepler',
    icon: 'mdi-account-plus',
    to: '/unit-manager/demands',
    role: ROLES.UNIT_MANAGER,
  },
  {
    title: 'Projeler',
    icon: 'mdi-folder-table-outline',
    to: '/unit-manager/projects',
    role: ROLES.UNIT_MANAGER,
  },
  {
    title: 'Danışmanlar',
    icon: 'mdi-account-group',
    to: '/unit-manager/consultants',
    role: ROLES.UNIT_MANAGER,
  },
  {
    title: 'Aktiviteler ve Masraflar',
    icon: 'mdi-file-document-multiple',
    to: '/unit-manager/activities-costs/',
    role: ROLES.UNIT_MANAGER,
  },
  {
    title: 'Faturalar',
    icon: 'mdi-check-decagram',
    to: '/unit-manager/invoices/',
    role: ROLES.UNIT_MANAGER,
  },

  // ADMIN ITEMS
  {
    title: 'Dashboard',
    icon: 'mdi-view-dashboard',
    to: '/',
    role: ROLES.ADMIN,
  },
  {
    title: 'Şirketler',
    icon: 'mdi-domain',
    to: '/admin/suppliers/',
    role: ROLES.ADMIN,
  },
  {
    title: 'Kullanıcılar',
    icon: 'mdi-account',
    to: '/admin/users',
    role: ROLES.ADMIN,
  },
  {
    title: 'Masraf Merkezleri',
    icon: 'mdi-bank',
    to: '/admin/cost-centers',
    role: ROLES.ADMIN,
  },
  {
    title: 'Ünvanlar',
    icon: 'mdi-subtitles',
    to: '/admin/job-titles',
    role: ROLES.ADMIN,
  },
  {
    title: 'Tecrübe Aralıkları',
    icon: 'mdi-poll',
    to: '/admin/experience-spans/',
    role: ROLES.ADMIN,
  },
  {
    title: 'Bütçeler',
    icon: 'mdi-currency-usd',
    to: '/admin/budgets/',
    role: ROLES.ADMIN,
  },
  {
    title: 'Projeler',
    icon: 'mdi-folder-table-outline',
    to: '/admin/projects',
    role: ROLES.ADMIN,
  },
  {
    title: 'Faturalar',
    icon: 'mdi-check-decagram',
    to: '/admin/invoices/',
    role: ROLES.ADMIN,
  },
]

// Data
const state = {
  drawer: null,
  drawerImage: true,
  mini: false,
  isLoading: false,
  items,
  alertMessage: '',
  alertType: '',
}

const mutations = make.mutations(state)

const actions = {
  ...make.actions(state),
  init: async ({ dispatch }) => {
    //
  },
  showAlert: (context, payload) => {
    // Alert Types =>  'success', 'info', 'warning', 'error'
    context.commit('alertMessage', payload.message)
    context.commit('alertType', payload.type)
  },
  hideAlert: ({ commit }) => {
    commit('alertMessage', '')
    commit('alertType', '')
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
