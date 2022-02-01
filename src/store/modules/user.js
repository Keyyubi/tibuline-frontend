// Utilities
import { make } from 'vuex-pathify'
import axios from 'axios'
// Globals
import { IN_BROWSER, ROLE_IDS } from '@/util/globals'
import { CreateURL, GetPostHeaders } from '@/util/helpers'
import store from '@/store/index'

// Router
import router from '../../router'

const state = {
  user: {},
  users: [],
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
          store.set('user/user', loggedUser)
          context.dispatch('app/updateItems', loggedUser.roleId, { root: true })
          store.set('app/alertMessage', '')
          router.push('/')
        })
      })
    })
    .catch(({ response }) => {
      store.set('user/user', {})

      //  ? ERROR HANDLING EXAMPLE
      //  * response has the all info about error. Like Status or Data
      const res = response.data
      store.set('app/alertMessage', res.error.errors[0])
    })
    .finally(() => setTimeout(() => {
        store.set('app/isLoading', false)
      }, 2000))
  },
  logout: () => {
    store.set('activity/activities', [])
    store.set('budget/budgets', [])
    store.set('budget/invoiceBudget', {})
    store.set('company/companies', [])
    store.set('consultant/consultants', [])
    store.set('contract/contracts', [])
    store.set('demand/demands', [])
    store.set('experienceSpan/experienceSpans', [])
    store.set('jobTitle/jobTitles', [])
    store.set('project/projects', [])
    store.set('user/users', [])
    store.set('user/user', {})
    store.set('app/items', [])
    store.set('app/alertMessage', '')
    store.set('app/alertType', '')

    router.push('/login/')
  },
  createUser: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('User/CreateUser'), payload)
      .then(() => {
        store.dispatch('app/showAlert', { message: 'Kullanıcı başarıyla oluşturuldu.', type: 'success' }, { root: true })
      })
      .catch(error => {
        console.log('Error', error)
        store.dispatch('app/showAlert', { message: 'Bir hata oluştu.', type: 'error' }, { root: true })
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  updateUser: (context, payload) => {
    store.set('app/isLoading', true)

    axios.put(CreateURL('User/UpdateUser'), payload, GetPostHeaders(store.get('user/user').token))
      .then(() => {
        const arr = store.get('user/users')
        const index = arr.findIndex(e => e.id === payload.id)
        console.log('paylo', payload)
        arr[index] = payload

        store.set('user/users', arr)
        store.dispatch('app/showAlert', { message: 'Başarıyla güncellendi.', type: 'success' }, { root: true })
      })
      .catch(error => {
        console.log('Error', error)
        store.dispatch('app/showAlert', { message: 'Bir hata oluştu.', type: 'error' }, { root: true })
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  getUnitManagers: () => {
    store.set('app/isLoading', true)

    axios.get(CreateURL(`User/GetUsersByRoleId/${ROLE_IDS.UNIT_MANAGER}`), GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('user/users', res.data)
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
  },
  getSuppliers: () => {
    store.set('app/isLoading', true)

    axios.get(CreateURL(`User/GetUsersByRoleId/${ROLE_IDS.SUPPLIER}`), GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('user/users', res.data)
      })
      .catch(error => {
        console.log('Error', error)
      })
      .finally(() => {
        store.set('app/isLoading', false)
      })
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
