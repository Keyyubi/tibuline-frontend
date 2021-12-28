import axios from 'axios'
import { make } from 'vuex-pathify'
import { CreateURL, GetPostHeaders } from '@/util/globals'
import store from '../index'

// Data
const state = {
  consultants: [],
  costCenters: [],
  experienceSpans: [],
  jobTitles: [],
  projects: [],
  activities: [],
  company: {},
}

const mutations = make.mutations(state)

const actions = {
  // Create Methods
  createActivity: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('Activity/SaveActivity'), payload, GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('supplier/activities', [...store.get('supplier/activities'), res.data])
        store.set('app/responseMsg', 'Başarıyla oluşturuldu.')
      })
      .catch(error => {
        console.log('Error', error)
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', 'Bir hata oluştu.')
      })
      .finally(() => {
        store.set('app/isLoading', false)
        setTimeout(() => {
          store.set('app/responseMsg', '')
          store.set('app/isErrorMsg', false)
        }, 2000)
      })
  },
  createConsultant: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('Consultant/SaveConsultant'), payload, GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('supplier/consultants', [...store.get('supplier/consultants'), res.data])
        store.set('app/responseMsg', 'Başarıyla oluşturuldu.')
      })
      .catch(error => {
        console.log('Error', error)
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', 'Bir hata oluştu.')
      })
      .finally(() => {
        store.set('app/isLoading', false)
        setTimeout(() => {
          store.set('app/responseMsg', '')
          store.set('app/isErrorMsg', false)
        }, 2000)
      })
  },
  // Update Methods
  updateActivity: (context, payload) => {
    store.set('app/isLoading', true)

    axios.put(CreateURL('Activity/UpdateActivity'), payload, GetPostHeaders(store.get('user/user').token))
      .then(() => {
        const arr = store.get('admin/activities')
        const index = arr.findIndex(e => e.id === payload.id)
        arr[index] = payload
        store.set('admin/activities', [...arr])
        store.set('app/responseMsg', 'Başarıyla oluşturuldu.')
      })
      .catch(error => {
        console.log('Error', error)
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', 'Bir hata oluştu.')
      })
      .finally(() => {
        store.set('app/isLoading', false)
        setTimeout(() => {
          store.set('app/responseMsg', '')
          store.set('app/isErrorMsg', false)
        }, 2000)
      })
  },
  // Get Methods
  getConsultants: () => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')

    axios.get(CreateURL(`Consultant/GetConsultantsByCompanyId/${currUser.companyId}`), GetPostHeaders(currUser.token))
      .then(({ data: res }) => {
        store.set('supplier/consultants', res.data)
      })
      .catch(error => {
        console.log('Error', error)
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', 'Bir hata oluştu.')
      })
      .finally(() => {
        store.set('app/isLoading', false)
        setTimeout(() => {
          store.set('app/responseMsg', '')
          store.set('app/isErrorMsg', false)
        }, 2000)
      })
  },
  getConsultantActivities: (context, consultantId) => {
    store.set('app/isLoading', true)

    // axios.get(CreateURL(`Consultant/GetActivitesByConsultantId/${consultantId}`), GetPostHeaders(store.get('user/user').token))
    axios.get(CreateURL('Activity/GetActivitys'), GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        const arr = res.data.map(e => {
          const name = `${e.shiftHours}s mesai ${e.overShiftHours ? ' - ' + e.overShiftHours + 's fazla mesai' : ''}`
          return {
            ...e,
            name,
            start: new Date(e.date),
            end: new Date(e.date),
            color: 'green',
            timed: false,
          }
        })
        console.log('arr', arr)
        store.set('supplier/activities', arr)
      })
      .catch(error => {
        console.log('Error', error)
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', 'Bir hata oluştu.')
      })
      .finally(() => {
        store.set('app/isLoading', false)
        setTimeout(() => {
          store.set('app/responseMsg', '')
          store.set('app/isErrorMsg', false)
        }, 2000)
      })
  },
  getExperienceSpans: () => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')

    axios.get(CreateURL(`ExperienceSpan/GetExperienceSpansByCompanyId/${currUser.companyId}`), GetPostHeaders(currUser.token))
      .then(({ data: res }) => {
        store.set('supplier/experienceSpans', res.data)
      })
      .catch(error => {
        console.log('Error', error)
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', 'Bir hata oluştu.')
      })
      .finally(() => {
        store.set('app/isLoading', false)
        setTimeout(() => {
          store.set('app/responseMsg', '')
          store.set('app/isErrorMsg', false)
        }, 2000)
      })
  },
  getJobTitles: () => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')

    axios.get(CreateURL(`JobTitle/GetJobTitlesByCompanyId/${currUser.companyId}`), GetPostHeaders(currUser.token))
      .then(({ data: res }) => {
        store.set('supplier/jobTitles', res.data)
      })
      .catch(error => {
        console.log('Error', error)
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', 'Bir hata oluştu.')
      })
      .finally(() => {
        store.set('app/isLoading', false)
        setTimeout(() => {
          store.set('app/responseMsg', '')
          store.set('app/isErrorMsg', false)
        }, 2000)
      })
  },
  getProjects: () => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')

    axios.get(CreateURL('Projects/GetProjects'), GetPostHeaders(currUser.token))
      .then(({ data: res }) => {
        store.set('supplier/projects', res.data)
      })
      .catch(error => {
        console.log('Error', error)
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', 'Bir hata oluştu.')
      })
      .finally(() => {
        store.set('app/isLoading', false)
        setTimeout(() => {
          store.set('app/responseMsg', '')
          store.set('app/isErrorMsg', false)
        }, 2000)
      })
  },
  // Delete methods
  deleteActivity: (context, id) => {
    store.set('app/isLoading', true)
    const currUser = store.get('user/user')
    console.log('id', id)

    axios.delete(CreateURL(`Activity/DeleteActivity/${id}`), GetPostHeaders(currUser.token))
      .then(() => {
        const arr = store.get('admin/activities')
        const index = arr.findIndex(e => e.id === id)
        arr.splice(index, 1)
        store.set('admin/activities', arr)
        store.set('app/responseMsg', 'Aktivite silindi.')
      })
      .catch(error => {
        console.log('Error', error)
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', 'Bir hata oluştu.')
      })
      .finally(() => {
        store.set('app/isLoading', false)
        setTimeout(() => {
          store.set('app/responseMsg', '')
          store.set('app/isErrorMsg', false)
        }, 2000)
      })
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
