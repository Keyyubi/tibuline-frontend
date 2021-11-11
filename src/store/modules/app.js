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
    to: '/requests',
  },
  {
    title: 'Aktivite Ekle',
    icon: 'mdi-check',
    to: '/add-activity',
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
    to: '/requests',
  },
  {
    title: 'Sözleşmeler',
    icon: 'mdi-file-document',
    to: '/contracts',
  },
  {
    title: 'Projeler',
    icon: 'mdi-folder-table-outline',
    to: '/projects',
  },
  {
    title: 'Danışmanlar',
    icon: 'mdi-account-group',
    to: '/consultants',
  },
  {
    title: 'Aktiviteler ve Masraflar',
    icon: 'mdi-file-document-multiple',
    to: '/activities-costs/',
  },
  {
    title: 'Fatura Onayı',
    icon: 'mdi-check-decagram',
    to: '/bills/',
  },
]

// Data
const state = {
  drawer: null,
  drawerImage: true,
  mini: false,
  items: [],
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
      default:
        break
    }
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
