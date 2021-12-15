// Utilities
import { make } from 'vuex-pathify'
import axios from 'axios'
// Globals
import { IN_BROWSER, postData, getData } from '@/util/globals'
// import { use } from 'vue/types/umd'

// dummy data
import { users } from '../dummy/dummy'

const state = {
  user: {},
  dark: false,
  drawer: {
    image: 0,
    gradient: 0,
    mini: false,
  },
  gradients: [
    'rgba(0, 0, 0, .7), rgba(0, 0, 0, .7)',
    'rgba(228, 226, 226, 1), rgba(255, 255, 255, 0.7)',
    'rgba(244, 67, 54, .8), rgba(244, 67, 54, .8)',
  ],
  images: [
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
    let jwt = ''
    // const tokenn = 'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImNkYzBhY2FiLWYyOWMtNDRiYi1iN2NlLWQwZWFiYTdjYTM1MSIsImVtYWlsIjoiYUBhLmNvbSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJhZG1pbiIsImp0aSI6IjM2MmE0MDA5LWYyMmYtNDFhZi1hZDYzLTNjZTczNTQ1ODA4MyIsImF1ZCI6Ind3dy5hdXRoc2VydmVyLmNvbSIsIm5iZiI6MTYzOTU3OTc0NiwiZXhwIjoxNjM5NTgwMDQ2LCJpc3MiOiJ3d3cuYXV0aHNlcnZlci5jb20ifQ.0yxyiwKb216ZetA38j0bdGX74q5T2RMRXZ9A-YhEPYo'

    // getData('http://37.9.203.118:4647/api/User', tokenn)

    postData('http://37.9.203.118:4647/api/Auth/CreateToken', { email: user.email, password: user.password })
    .then(res => {
      jwt = res.data.accessToken
      console.log('data', jwt) // JSON data parsed by `data.json()` call
    })

    axios.get('http://37.9.203.118:4647/api/User', {
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-type': 'application/json',
      },
    })
    .then((res) => {
      console.log(res.data)
    })
    .catch((error) => {
      console.error(error)
    })

    const checkUser = users.find(e => e.email === user.email && e.password === user.password)

    context.dispatch('app/updateItems', checkUser.roleId, { root: true })

    if (checkUser) {
      checkUser.isLogged = true
      context.commit('user', checkUser)
    } else context.commit('user', {})
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
