// Pathify
import { make } from 'vuex-pathify'

// Data
const state = {
  drawer: null,
  drawerImage: true,
  mini: false,
  items: [
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
      to: '/components/notifications/',
    },
  ],
}

const mutations = make.mutations(state)

const actions = {
  ...make.actions(state),
  init: async ({ dispatch }) => {
    //
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
