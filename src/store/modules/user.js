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
    const local = localStorage.getItem('vuetify@user') || '{}'
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

    localStorage.setItem('vuetify@user', JSON.stringify(state))
  },
  login: (context, user) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('/Auth/CreateToken'), { email: user.email, password: user.password })
    .then(({ data: res }) => res.data.accessToken)
    .then(token => {
      //* ONYL FOR USE IN DEVELOPMENT
      // const devUser = {
      //   email: 'admin@tibula.com',
      //   firstName: 'Admin',
      //   id: '387186b7-c953-4e3c-a2a4-b578d66e37aa',
      //   isLogged: 'ru',
      //   lastName: 'Tibuline',
      //   roleId: -1,
      //   token,
      //   userName: 'superuser',
      // }
      // if (user.email === 'admin@tibula.com') devUser.roleId = 0
      // else if (user.email === 'manager@tibula.com') devUser.roleId = 1
      // else if (user.email === 'supplier@tibula.com') devUser.roleId = 2
      // context.commit('user', devUser)
      // context.dispatch('app/updateItems', devUser.roleId, { root: true })
      // router.push('/')
      //* END OF DEVELOPMENT USAGE */

      axios.get(CreateURL('/User/GetUser'), GetPostHeaders(token))
      .then(({ data: res }) => {
        const currUser = {
          ...res.data,
          isLogged: true,
          token,
        }
        context.commit('user', currUser)
        context.dispatch('app/updateItems', currUser.roleId, { root: true })
        router.push('/')
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
