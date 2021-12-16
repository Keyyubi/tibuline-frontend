<template>
  <v-main>
    <v-container fluid>
      <router-view :key="$route.path" />
    </v-container>
    <v-snackbar
      v-model="errorSnack"
      top
      :timeout="2500"
      color="error"
    >
      {{ snackMessage}}
    </v-snackbar>
    <v-snackbar
      v-model="warningSnack"
      top
      :timeout="2500"
      color="warning"
    >
      {{ snackMessage}}
    </v-snackbar>
    <v-snackbar
      v-model="successSnack"
      top
      :timeout="2500"
      color="success"
    >
      {{ snackMessage}}
    </v-snackbar>
  </v-main>
</template>

<script>
  import { get } from 'vuex-pathify'
  export default {
    name: 'DefaultView',
    computed: {
      ...get('app', [
        'errorSnack',
        'successSnack',
        'warningSnack',
        'snackMessage']),
    },
  }
</script>
