// Utilities
import { make } from 'vuex-pathify'
import axios from 'axios'
// Globals
import { IN_BROWSER, CreateURL, GetPostHeaders } from '@/util/globals'
import store from '@/store/index'

// Router
import router from '../../router'

const state = {
  user: {},
  dark: false,
  drawer: {
    image: 1,
    gradient: 0,
    mini: false,
  },
  gradients: [
    'rgba(0, 0, 0, .7), rgba(0, 0, 0, .7)',
    'rgba(228, 226, 226, 1), rgba(255, 255, 255, 0.7)',
    'rgba(244, 67, 54, .8), rgba(244, 67, 54, .8)',
  ],
  images: [
    '../../assets/lock.jpg',
    'https://demos.creative-tim.com/material-dashboard-pro/assets/img/sidebar-1.jpg',
    'https://demos.creative-tim.com/material-dashboard-pro/assets/img/sidebar-2.jpg',
    'https://demos.creative-tim.com/material-dashboard-pro/assets/img/sidebar-3.jpg',
    'https://demos.creative-tim.com/material-dashboard-pro/assets/img/sidebar-4.jpg',
  ],
  notifications: [],
  rtl: false,
}

const mutations = make.mutations(state)

const actions = {
  fetch: ({ commit }) => {
    const local = localStorage.getItem('tibuline@user') || '{}'
    const user = JSON.parse(local)

    for (const key in user) {
      commit(key, user[key])
    }

    if (user.dark === undefined) {
      commit('dark', window.matchMedia('(prefers-color-scheme: dark)'))
    }
  },
  update: ({ state }) => {
    if (!IN_BROWSER) return

    localStorage.setItem('tibuline@user', JSON.stringify(state))
  },
  login: (context, user) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('/Auth/CreateToken'), { email: user.email, password: user.password })
    .then(({ data: res }) => res.data.accessToken)
    .then(token => {
      axios.get(CreateURL('/User/GetUser'), GetPostHeaders(token))
      .then(({ data: res }) => {
        return {
          ...res.data,
          isLogged: true,
          token,
        }
      })
      .then(loggedUser => {
        axios.get(CreateURL(`/Company/GetCompanyById/${loggedUser.companyId}`), GetPostHeaders(loggedUser.token))
        .then(({ data: res }) => {
          loggedUser = {
            ...loggedUser,
            company: res.data,
          }
          context.commit('user', loggedUser)
          context.dispatch('app/updateItems', loggedUser.roleId, { root: true })
          router.push('/')
        })
      })
    })
    .catch((error) => {
      context.commit('user', {})
      console.error('Error on login', error)
    })
    .finally(() => setTimeout(() => {
        store.set('app/isLoading', false)
      }, 1500))
  },
  logout: ({ commit }) => {
    commit('user', {})
    router.push('/login/')
  },
}

const getters = {
  dark: (state, getters) => {
    return (
      state.dark ||
      getters.gradient.indexOf('255, 255, 255') === -1
    )
  },
  gradient: state => {
    return state.gradients[state.drawer.gradient]
  },
  image: state => {
    return state.drawer.image === '' ? state.drawer.image : state.images[state.drawer.image]
  },
  user: state => state.user,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
