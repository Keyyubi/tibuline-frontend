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
  {
    title: 'Projeler',
    icon: 'mdi-folder-table-outline',
    to: '/admin/projects',
  },
]

const rules = {
  emailRules: [
    v => !!v || 'E-mail is required',
    v => /.+@.+/.test(v) || 'E-mail must be valid',
  ],
  passwordRules: [
    v => !!v || 'Şifre boş geçilemez',
    v =>
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*\\+\\.])(?=.{8,})/.test(v) ||
      'Şifre en az 8 karakter olup, büyük harf, küçük harf, rakam ve özel karakter içermelidir!',
  ],
  phoneRules: [
    v => !!v || 'Telefon numarası girmelisiniz',
    v => (v && v.length === 14) || 'Lütfen başında 0 olmadan 10 haneli olarak giriniz.',
    v => /^(\(5.)/.test(v) || 'Telefon numarası 5 ile başlamalıdır.',
  ],
  tcnoRules: [
    v => !!v || 'T.C. Kimlik Numarası giriniz.',
    v => (v && v.length === 11) || 'Kimlik numarası 11 haneli olmalıdır.',
    v => (() => {
      const arr = Array.from(v)
      let res = 0
      for (let i = 0; i < arr.length - 1; i++) {
        res += Number(arr[i])
      }
      return (res % 10) === Number(arr[arr.length - 1])
    })() || 'Kimlik numarası geçersiz.',
  ],
}

// Data
const state = {
  drawer: null,
  drawerImage: true,
  mini: false,
  isLoading: false,
  items: [],
  responseMsg: '',
  isErrorMsg: false,
  rules,
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
      context.commit('isErrorMsg', false)
    }, 2000)
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
