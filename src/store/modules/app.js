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
        context.commit('items', supplierItems)
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
