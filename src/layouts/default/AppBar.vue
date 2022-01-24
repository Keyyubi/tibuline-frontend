<template>
  <v-app-bar
    id="default-app-bar"
    app
    absolute
    class="v-bar--underline"
    color="transparent"
    :clipped-left="$vuetify.rtl"
    :clipped-right="!$vuetify.rtl"
    height="70"
    flat
  >
    <div
      v-if="alertMessage.length > 0"
      style="width: 100%; display: flex; justify-content: center; position: fixed; top: 0; left: 0; padding: 5px"
    >
      <!-- Alert Message -->
      <v-alert
        :type="alertType"
        shaped
        dense
        border="top"
        dismissible
        transition="scale-transition"
        @click="dismiss"
      >
        {{ alertMessage }}
      </v-alert>
    </div>
    <v-app-bar-nav-icon
      class="hidden-md-and-up"
      @click="drawer = !drawer"
    />

    <default-drawer-toggle class="hidden-sm-and-down" />

    <!-- <v-toolbar-title
      class="font-weight-light text-h5"
      v-text="name"
    /> -->

    <v-spacer />

    <!-- <default-search class="hidden-sm-and-down" /> -->

    <default-go-home />

    <default-notifications />

    <default-account />
  </v-app-bar>
</template>

<script>
  // Utilities
  import { get, sync } from 'vuex-pathify'

  export default {
    name: 'DefaultBar',

    components: {
      DefaultAccount: () => import(
        /* webpackChunkName: "default-account" */
        './widgets/Account'
      ),
      DefaultDrawerToggle: () => import(
        /* webpackChunkName: "default-drawer-toggle" */
        './widgets/DrawerToggle'
      ),
      DefaultGoHome: () => import(
        /* webpackChunkName: "default-go-home" */
        './widgets/GoHome'
      ),
      DefaultNotifications: () => import(
        /* webpackChunkName: "default-notifications" */
        './widgets/Notifications'
      ),
      // DefaultSearch: () => import(
      //   /* webpackChunkName: "default-search" */
      //   './widgets/Search'
      // ),
    },
    computed: {
      ...get('app', ['alertMessage', 'alertType']),
      ...sync('app', [
        'drawer',
        'mini',
      ]),
      name: get('route/name'),
    },
    methods: {
      dismiss () {
        setTimeout(() => {
          this.$store.dispatch('app/showAlert', { message: '', type: '' })
        }, 250)
      },
    },
  }
</script>
