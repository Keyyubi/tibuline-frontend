// Utilities
import { make } from 'vuex-pathify'
import axios from 'axios'
// Globals
import { IN_BROWSER, ROLES } from '@/util/globals'
import { CreateURL } from '@/util/helpers'
import store from '@/store/index'

// Router
import router from '../../router'

const image = require.context('../../assets', false, /\.jpg$/)

const state = {
  user: {},
  customerCompany: {},
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
    image('./image1.jpg'),
    image('./image2.jpg'),
    image('./image3.jpg'),
    image('./image4.jpg'),
    image('./image5.jpg'),
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
  login: ({ dispatch }, user) => {
    store.set('app/isLoading', true)
    axios.post(CreateURL('Auth/CreateToken'), { email: user.email, password: user.password })
    .then(({ data: res }) => {
      localStorage.setItem('jwt', res.data.accessToken)
      localStorage.setItem('rfrjwt', res.data.refreshToken)

      dispatch('getUser')
      router.push('/')
    })
    .catch(({ response }) => {
      localStorage.removeItem('jwt')
      store.set('user/user', {})

      //  ? ERROR HANDLING EXAMPLE
      //  * response has the all info about error. Like Status or Data
      const res = response.data
      store.set('app/alertMessage', res.error.errors[0])

      setTimeout(() => {
        store.set('app/isLoading', false)
        store.set('app/alertMessage', '')
      }, 2000)
    })
  },
  async getUser () {
    store.set('app/isLoading', true)
    axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('jwt')}`

    const res = await this.$api.user.get(false)

    if (res) {
      const user = { ...res.data }
      user.firstname = user.firstname || '-'
      user.lastname = user.lastname || '-'
      user.tckn = user.tckn || '-'
      user.phone = user.phone || '-'
      localStorage.setItem('tibuline@role', user.roleId)

      const customerCompany = await this.$api.company.get()
      if (customerCompany) {
        store.set('user/customerCompany', customerCompany.data[0])

        if (user.roleId !== ROLES.SUPPLIER) {
          user.company = customerCompany[0]
        } else {
          const supplier = await this.$api.supplier.getById(user.supplierId)
          user.company = { ...supplier.data }
        }

        store.set('user/user', user)
      } else {
        store.set('app/alertMessage', res)
      }
    }
    store.set('app/isLoading', false)
  },
  logout: () => {
    store.set('activity/activities', [])
    store.set('budget/budgets', [])
    store.set('budget/invoiceBudget', {})
    store.set('supplier/suppliers', [])
    store.set('consultant/consultants', [])
    store.set('contract/contracts', [])
    store.set('demand/demands', [])
    store.set('experience/experiences', [])
    store.set('jobTitle/jobTitles', [])
    store.set('project/projects', [])
    store.set('user/users', [])
    store.set('user/user', {})
    store.set('app/alertMessage', '')
    store.set('app/alertType', '')

    localStorage.removeItem('jwt')
    localStorage.removeItem('tibuline@role')

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

    axios.put(CreateURL('User/UpdateUser'), payload)
      .then(() => {
        const arr = store.get('user/users')
        const index = arr.findIndex(e => e.id === payload.id)
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
  updateUserAccount: (context, payload) => {
    store.set('app/isLoading', true)

    axios.put(CreateURL('User/UpdateUser'), payload)
      .then(() => {
        store.set('user/user', payload)
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
  updateCompany: (context, payload) => {
    store.set('app/isLoading', true)

    axios.put(CreateURL('Company/UpdateCompany'), payload)
      .then(() => {
        const user = store.get('user/user')
        user.company = payload
        store.set('user/user', user)
        store.set('user/customerCompany', payload)
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
  async getUnitManagers () {
    store.set('app/isLoading', true)

    const res = await this.$api.user.getByParams({ url: 'RoleId', params: [ROLES.UNIT_MANAGER] })
    store.set('user/users', res.data)

    store.set('app/isLoading', false)
  },
  async getSuppliers () {
    store.set('app/isLoading', true)

    const res = await this.$api.user.getByParams({ url: 'RoleId', params: [ROLES.SUPPLIER] })
    store.set('user/users', res.data)

    store.set('app/isLoading', false)
  },
  getCompanyDetails: (context, payload) => {
    store.set('app/isLoading', true)

    axios.get(CreateURL('Company/GetCompanies'))
      .then(({ data: res }) => {
        store.set('user/customerCompany', res.data[0])
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
