import axios from 'axios'
import { make } from 'vuex-pathify'
import { CreateURL, GetPostHeaders, ROLE_IDS } from '@/util/globals'
import store from '../index'

// Data
const state = {
  activities: [],
  company: {},
  consultants: [],
  costCenters: [],
  experienceSpans: [],
  unitManagers: [],
  jobTitles: [],
  projects: [],
}

const mutations = make.mutations(state)

const actions = {
  // Create Methods
  createActivity: (context, payload) => {
    axios.post(CreateURL('Activity/SaveActivity'), payload, GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('app/responseMsg', 'Başarıyla oluşturuldu.')
      })
      .catch(error => {
        console.log('Error', error)
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', 'Bir hata oluştu.')
      })
      .finally(() => {
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
    axios.put(CreateURL('Activity/UpdateActivity'), payload, GetPostHeaders(store.get('user/user').token))
      .then(() => {
        store.set('app/responseMsg', 'Başarıyla oluşturuldu.')
      })
      .catch(error => {
        console.log('Error', error)
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', 'Bir hata oluştu.')
      })
      .finally(() => {
        setTimeout(() => {
          store.set('app/responseMsg', '')
          store.set('app/isErrorMsg', false)
        }, 2000)
      })
  },
  updateConsultant: (context, payload) => {
    axios.put(CreateURL('Consultant/UpdateConsultant'), payload, GetPostHeaders(store.get('user/user').token))
      .then(() => {
        store.set('app/responseMsg', 'Başarıyla güncellendi.')
      })
      .catch(error => {
        console.log('Error', error)
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', 'Bir hata oluştu.')
      })
      .finally(() => {
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
  getConsultantActivities: (context, payload) => {
    store.set('app/isLoading', true)

    axios.get(CreateURL(`Activity/GetActivitiesByConsultantIdAndYearMonth/${payload.consultantId}/${payload.yearMonth}`), GetPostHeaders(store.get('user/user').token))
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

    axios.get(CreateURL('Project/GetProjects'), GetPostHeaders(currUser.token))
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
  getUnitManagers: () => {
    store.set('app/isLoading', true)

    axios.get(CreateURL(`User/GetUsersByRoleId/${ROLE_IDS.UNIT_MANAGER}`), GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('supplier/unitManagers', res.data)
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
    const currUser = store.get('user/user')

    axios.delete(CreateURL(`Activity/DeleteActivity/${id}`), GetPostHeaders(currUser.token))
      .then(() => {
        store.set('app/responseMsg', 'Aktivite silindi.')
      })
      .catch(error => {
        console.log('Error', error)
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', 'Bir hata oluştu.')
      })
      .finally(() => {
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
