// Imports
import Vue from 'vue'
import Router from 'vue-router'
import { trailingSlash } from '@/util/helpers'
import {
  layout,
  route,
} from '@/util/routes'
import store from '@/store'

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
      route('Dashboard'),

      // Unit Manager Routes
      route('unit-manager/Demands', null, 'unit-manager/demands'),
      route('unit-manager/Contracts', null, 'unit-manager/contracts'),
      route('unit-manager/Projects', null, 'unit-manager/projects'),
      route('unit-manager/Consultants', null, 'unit-manager/consultants'),
      route('unit-manager/ActivitiesCosts', null, 'unit-manager/activities-costs'),
      route('unit-manager/Bills', null, 'unit-manager/bills'),

      // Supplier Routes
      route('supplier/Requests', null, 'supplier/requests'),
      route('supplier/AddActivity', null, 'supplier/add-activity'),
      route('supplier/Consultants', null, 'supplier/consultants'),

       // Admin Routes
       route('admin/Users', null, 'admin/users'),
       route('admin/Projects', null, 'admin/projects'),
       route('admin/Suppliers', null, 'admin/suppliers'),
       route('admin/CostCenters', null, 'admin/cost-centers'),
       route('admin/JobTitles', null, 'admin/job-titles'),
       route('admin/ExperienceSpans', null, 'admin/experience-spans'),
       route('admin/Budgets', null, 'admin/budgets'),
       route('admin/Companies', null, 'admin/companies'),

    ]),
    layout('Login', [
      route('Login', null, 'login'),
    ]),
  ],
})

router.beforeEach((to, from, next) => {
  const user = store.getters['user/user']

  if (to.path !== '/login/' && !user.isLogged) {
    return next({ path: '/login/' })
  } else {
    return to.path.endsWith('/') ? next() : next(trailingSlash(to.path))
  }
})

export default router
