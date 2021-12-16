<template>
  <v-app>
    <v-overlay
      style="z-index: 99"
      :value="isLoading"
    >
      <v-progress-circular
        :size="70"
        :width="5"
        color="primary"
        indeterminate
      />
    </v-overlay>
    <default-bar />

    <default-drawer />

    <default-view />

    <default-footer />

    <default-settings />
  </v-app>
</template>

<script>
  import { get } from 'vuex-pathify'
  export default {
    name: 'DefaultLayout',

    components: {
      DefaultBar: () => import(
        /* webpackChunkName: "default-app-bar" */
        './AppBar'
      ),
      DefaultDrawer: () => import(
        /* webpackChunkName: "default-drawer" */
        './Drawer'
      ),
      DefaultFooter: () => import(
        /* webpackChunkName: "default-footer" */
        './Footer'
      ),
      DefaultSettings: () => import(
        /* webpackChunkName: "default-settings" */
        './Settings'
      ),
      DefaultView: () => import(
        /* webpackChunkName: "default-view" */
        './View'
      ),
    },
    computed: {
      ...get('app', ['isLoading']),
    },
  }
</script>
