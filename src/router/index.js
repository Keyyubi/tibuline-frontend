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

      // Requests
      route('unit-manager/Requests', null, '/unit-manager/requests'),

      // Contracts
      route('unit-manager/Contracts', null, 'unit-manager/contracts'),

      // Projects
      route('unit-manager/Projects', null, 'unit-manager/projects'),

      // Consultants
      route('unit-manager/Consultants', null, 'unit-manager/consultants'),

      // ActivitiesCosts
      route('unit-manager/ActivitiesCosts', null, 'unit-manager/activities-costs'),

      // Bill Approvment
      route('unit-manager/Bills', null, 'unit-manager/bills'),

      // Add Activity
      route('AddActivity', null, 'add-activity'),
    ]),
    layout('Login', [
      route('Login', null, 'login'),
    ]),
  ],
})

router.beforeEach((to, from, next) => {
  const user = store.getters['user/user']

  if (to.name !== 'Login' && !user.isLogged) {
    return next({ path: 'login' })
  } else {
    return to.path.endsWith('/') ? next() : next(trailingSlash(to.path))
  }
})

export default router
