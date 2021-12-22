import axios from 'axios'
import { make } from 'vuex-pathify'
import { CreateURL, GetPostHeaders } from '@/util/globals'
import store from '../index'

// Data
const state = {
  unitManagers: [],
  suppliers: [],
  costCenters: [],
  experienceSpans: [],
  jobTitles: [],
  projects: [],
  budgetPlans: [
    {
        id: 1,
        companyId: 0,
        experienceSpanId: 1,
        jobTitleId: 1,
        monthlyBudget: 11000.55,
        totalBudget: 132000.50,
    },
    {
        id: 2,
        companyId: 2,
        experienceSpanId: 1,
        jobTitleId: 1,
        monthlyBudget: 11000.55,
        totalBudget: 132000.50,
    },
    {
        id: 3,
        companyId: 1,
        experienceSpanId: 1,
        jobTitleId: 1,
        monthlyBudget: 11000.55,
        totalBudget: 132000.50,
    },
    {
        id: 4,
        companyId: 2,
        experienceSpanId: 1,
        jobTitleId: 1,
        monthlyBudget: 11000.55,
        totalBudget: 132000.50,
    },
    {
        id: 5,
        companyId: 5,
        experienceSpanId: 1,
        jobTitleId: 1,
        monthlyBudget: 11000.55,
        totalBudget: 132000.50,
    },
    {
        id: 6,
        companyId: 2,
        experienceSpanId: 1,
        jobTitleId: 1,
        monthlyBudget: 11000.55,
        totalBudget: 132000.50,
    },
    {
        id: 7,
        companyId: 4,
        experienceSpanId: 1,
        jobTitleId: 1,
        monthlyBudget: 11000.55,
        totalBudget: 132000.50,
    },
    {
        id: 8,
        companyId: 2,
        experienceSpanId: 1,
        jobTitleId: 1,
        monthlyBudget: 11000.55,
        totalBudget: 132000.50,
    },
    {
        id: 9,
        companyId: 3,
        experienceSpanId: 1,
        jobTitleId: 1,
        monthlyBudget: 11000.55,
        totalBudget: 132000.50,
    },
  ],
  companies: [{
    id: 1,
    name: 'Zoomlounge',
    address: '4568 Lakeland Terrace',
    city: 'Caleta Olivia',
    postalCode: '9011',
    country: 'Argentina',
    vkn: '12341234122',
  }, {
    id: 2,
    name: 'Tagtune',
    address: '91 Redwing Street',
    city: 'San Pedro',
    country: 'Bolivia',
    vkn: '12341234122',
  }, {
    id: 3,
    name: 'Kamba',
    address: '1084 Butternut Lane',
    city: 'Äänekoski',
    postalCode: '44150',
    country: 'Finland',
    vkn: '12341234122',
  }, {
    id: 4,
    name: 'Realmix',
    address: '79244 Ridgeview Park',
    city: 'Zuya',
    country: 'Ukraine',
    vkn: '12341234122',
  }, {
    id: 5,
    name: 'Pixonyx',
    address: '0887 Roxbury Parkway',
    city: 'Suwałki',
    postalCode: '16-433',
    country: 'Poland',
    vkn: '12341234122',
  }, {
    id: 6,
    name: 'Topicstorm',
    address: '0 Nova Junction',
    city: 'Mokronog',
    postalCode: '8230',
    country: 'Slovenia',
    vkn: '12341234122',
  }, {
    id: 7,
    name: 'Jaxspan',
    address: '04909 Oak Point',
    city: 'Yanaoca',
    country: 'Peru',
    vkn: '12341234122',
  }, {
    id: 8,
    name: 'Skinix',
    address: '589 Southridge Center',
    city: 'Chengxi',
    country: 'China',
    vkn: '12341234122',
  }, {
    id: 9,
    name: 'Tanoodle',
    address: '88 Mockingbird Lane',
    city: 'Balbagay',
    country: 'China',
    vkn: '12341234122',
  }, {
    id: 10,
    name: 'Skinte',
    address: '7408 Gina Circle',
    city: 'Pagedangan',
    country: 'Indonesia',
    vkn: '12341234122',
  }, {
    id: 11,
    name: 'Quinu',
    address: '4286 Mosinee Junction',
    city: 'Hinigaran',
    postalCode: '4026',
    country: 'Philippines',
    vkn: '12341234122',
  }, {
    id: 12,
    name: 'Blogtag',
    address: '8 Grayhawk Crossing',
    city: 'Duozhu',
    country: 'China',
    vkn: '12341234122',
  }, {
    id: 13,
    name: 'Yakijo',
    address: '263 Parkside Center',
    city: 'New Hyde Park',
    state: 'New York',
    postalCode: '11044',
    country: 'United States',
    vkn: '12341234122',
  }],
}

const mutations = make.mutations(state)

const actions = {
  // Create Methods
  createUser: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('User'), payload)
      .then(res => {
        store.set('app/isErrorMsg', false)
        store.set('app/responseMsg', 'Kullanıcı başarıyla oluşturuldu.')
      })
      .catch(({ response }) => {
        const { errors } = response.data.error
        const msg = errors.join(' ')
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', msg)
      })
      .finally(() => {
        store.set('app/isLoading', false)
        setTimeout(() => {
          store.set('app/responseMsg', '')
        }, 2000)
      })
  },
  createCostCenter: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('CostCenter'), payload, GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('admin/costCenters', [...store.get('admin/costCenters'), res.data])
        store.set('app/responseMsg', 'Başarıyla oluşturuldu.')
      })
      .catch(({ response }) => {
        const { errors } = response.data.error
        const msg = errors.join(' ')
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', msg)
      })
      .finally(() => {
        store.set('app/isLoading', false)
        setTimeout(() => {
          store.set('app/responseMsg', '')
        }, 2000)
      })
  },
  createExperienceSpan: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('ExperienceSpan'), payload, GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('admin/experienceSpans', [...store.get('admin/experienceSpans'), res.data])
        store.set('app/responseMsg', 'Başarıyla oluşturuldu.')
      })
      .catch(({ response }) => {
        // ? AXIOS ERROR HANDLING EXAMPLE
        // if (error.response) {
        //   // Request made and server responded
        //   console.log(error.response.data)
        //   console.log(error.response.status)
        //   console.log(error.response.headers)
        // } else if (error.request) {
        //   // The request was made but no response was received
        //   console.log(error.request)
        // } else {
        //   // Something happened in setting up the request that triggered an Error
        //   console.log('Error', error.message)
        // }
        // ? END OF EXAMPLE

        const { errors } = response.data.error
        const msg = errors.join(' ')
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', msg)
      })
      .finally(() => {
        store.set('app/isLoading', false)
        setTimeout(() => {
          store.set('app/responseMsg', '')
        }, 2000)
      })
  },
  createJobTitle: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('JobTitle'), payload, GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('admin/jobTitles', [...store.get('admin/jobTitles'), res.data])
        store.set('app/responseMsg', 'Başarıyla oluşturuldu.')
      })
      .catch(({ response }) => {
        const { errors } = response.data.error
        const msg = errors.join(' ')
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', msg)
      })
      .finally(() => {
        store.set('app/isLoading', false)
        setTimeout(() => {
          store.set('app/responseMsg', '')
        }, 2000)
      })
  },
  createProject: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('JobTitle'), payload, GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('admin/jobTitles', [...store.get('admin/jobTitles'), res.data])
        store.set('app/responseMsg', 'Başarıyla oluşturuldu.')
      })
      .catch(({ response }) => {
        const { errors } = response.data.error
        const msg = errors.join(' ')
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', msg)
      })
      .finally(() => {
        store.set('app/isLoading', false)
        setTimeout(() => {
          store.set('app/responseMsg', '')
        }, 2000)
      })
  },
  createBudgetPlan: (context, payload) => {
    store.set('app/isLoading', true)

    axios.post(CreateURL('BudgetCalculation'), payload, GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('admin/jobTitles', [...store.get('admin/budgetPlans'), res.data])
        store.set('app/responseMsg', 'Başarıyla oluşturuldu.')
      })
      .catch(({ response }) => {
        const { errors } = response.data.error
        const msg = errors.join(' ')
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', msg)
      })
      .finally(() => {
        store.set('app/isLoading', false)
        setTimeout(() => {
          store.set('app/responseMsg', '')
        }, 2000)
      })
  },
  getUnitManagers: () => {
    store.set('app/isLoading', true)

    axios.get(CreateURL('User/UnitManagers'))
      .then(({ data: res }) => {
        store.set('admin/unitManagers', res.data)
      })
      .catch(({ response }) => {
        const { errors } = response.data.error
        const msg = errors.join(' ')
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', msg)
      })
      .finally(() => {
        store.set('app/isLoading', false)
        setTimeout(() => {
          store.set('app/responseMsg', '')
        }, 2000)
      })
  },
  getSuppliers: () => {
    store.set('app/isLoading', true)

    axios.get(CreateURL('User/Suppliers'))
      .then(({ data: res }) => {
        store.set('admin/unitManagers', res.data)
      })
      .catch(({ response }) => {
        const { errors } = response.data.error
        const msg = errors.join(' ')
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', msg)
      })
      .finally(() => {
        store.set('app/isLoading', false)
        setTimeout(() => {
          store.set('app/responseMsg', '')
        }, 2000)
      })
  },
  getCostCenters: () => {
    store.set('app/isLoading', true)

    axios.get(CreateURL('CostCenter'), GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('admin/costCenters', res.data)
      })
      .catch(({ response }) => {
        const { errors } = response.data.error
        const msg = errors.join(' ')
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', msg)
      })
      .finally(() => {
        store.set('app/isLoading', false)
        setTimeout(() => {
          store.set('app/responseMsg', '')
        }, 2000)
      })
  },
  getExperienceSpans: () => {
    store.set('app/isLoading', true)

    axios.get(CreateURL('ExperienceSpan'), GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('admin/experienceSpans', res.data)
      })
      .catch(({ response }) => {
        const { errors } = response.data.error
        const msg = errors.join(' ')
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', msg)
      })
      .finally(() => {
        store.set('app/isLoading', false)
        setTimeout(() => {
          store.set('app/responseMsg', '')
        }, 2000)
      })
  },
  getJobTitles: () => {
    store.set('app/isLoading', true)

    axios.get(CreateURL('JobTitle'), GetPostHeaders(store.get('user/user').token))
      .then(({ data: res }) => {
        store.set('admin/jobTitles', res.data)
      })
      .catch(({ response }) => {
        const { errors } = response.data.error
        const msg = errors.join(' ')
        store.set('app/isErrorMsg', true)
        store.set('app/responseMsg', msg)
      })
      .finally(() => {
        store.set('app/isLoading', false)
        setTimeout(() => {
          store.set('app/responseMsg', '')
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
