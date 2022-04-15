// Imports
import Vue from 'vue'
import Router from 'vue-router'
import { trailingSlash } from '@/util/helpers'
import {
  layout,
  route,
} from '@/util/routes'
import store from '@/store'
import { ROLES } from '../util/globals'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: (to, from, savedPosition) => {
    if (to.hash) return { selector: to.hash }
    if (savedPosition) return savedPosition

    return { x: 0, y: 0 }
  },
  routes: [
    layout('Default', [
      // Default Routes
      route('Dashboard'),
      route('Account', null, 'account'),
      route('Error', null, 'error'),

      // Unit Manager Routes
      route('unit-manager/Demands', null, 'unit-manager/demands', { manager: true }),
      route('unit-manager/Projects', { default: 'admin/Projects' }, 'unit-manager/projects', { manager: true }),
      route('unit-manager/Consultants', null, 'unit-manager/consultants', { manager: true }),
      route('unit-manager/ActivitiesCosts', null, 'unit-manager/activities-costs', { manager: true }),
      route('unit-manager/Budgets', null, 'unit-manager/budgets', { manager: true }),
      route('unit-manager/Invoices', null, 'unit-manager/invoices', { manager: true }),

      // Supplier Routes
      route('supplier/Demands', null, 'supplier/demands', { supplier: true }),
      route('supplier/AddActivity', null, 'supplier/add-activity', { supplier: true }),
      route('supplier/Consultants', null, 'supplier/consultants', { supplier: true }),
      route('supplier/Contracts', null, 'supplier/contracts', { supplier: true }),
      route('supplier/Invoices', null, 'supplier/invoices', { supplier: true }),

       // Admin Routes
       route('admin/Users', null, 'admin/users', { admin: true }),
       route('admin/Projects', null, 'admin/projects', { admin: true }),
       route('admin/Suppliers', null, 'admin/suppliers', { admin: true }),
       route('admin/CostCenters', null, 'admin/cost-centers', { admin: true }),
       route('admin/JobTitles', null, 'admin/job-titles', { admin: true }),
       route('admin/Experiences', null, 'admin/experience-spans', { admin: true }),
       route('admin/Budgets', null, 'admin/budgets', { admin: true }),
       route('admin/Invoices', null, 'admin/invoices', { admin: true }),
    ]),
    layout('Login', [
      route('Login', null, 'login'),
    ]),
  ],
})

router.beforeEach((to, from, next) => {
  store.set('app/alertMessage', '')
  if (localStorage.getItem('tibuline@jwt') === null) {
    if (to.path !== '/login/') {
      store.set('app/alertMessage', 'Tekrar giriş yapmalısınız.')
      store.set('app/alertType', 'error')
      setTimeout(() => {
        return next({ path: '/login/' })
      }, 2000)
    } else {
      next()
    }
  } else {
    const role = Number(localStorage.getItem('tibuline@role'))
    if (!store.get('user/user').id) {
      store.dispatch('user/getUser', { root: true })
    }

    if (to.matched.some(record => record.meta.manager)) {
      if (role === ROLES.UNIT_MANAGER) {
        return to.path.endsWith('/') ? next() : next(trailingSlash(to.path))
      } else {
        return next({ path: '/error/' })
      }
    } else if (to.matched.some(record => record.meta.supplier)) {
      if (role === ROLES.SUPPLIER) {
        return to.path.endsWith('/') ? next() : next(trailingSlash(to.path))
      } else {
        return next({ path: '/error/' })
      }
    } else if (to.matched.some(record => record.meta.admin)) {
      if (role === ROLES.ADMIN) {
        return to.path.endsWith('/') ? next() : next(trailingSlash(to.path))
      } else {
        return next({ path: '/error/' })
      }
    }
    return to.path.endsWith('/') ? next() : next(trailingSlash(to.path))
  }
})

export default router
