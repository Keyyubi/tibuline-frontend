<template>
  <div
    v-if="alertMessage.length > 0"
    style="width: auto; display: flex; justify-content: center; position: fixed; top: 10px; left: 44%; padding: 5px; z-index: 100;"
  >
    <!-- Alert Message -->
    <v-alert
      :type="alertType"
      dense
      border="top"
      dismissible
      transition="scale-transition"
      @click="dismiss"
    >
      {{ alertMessage }}
    </v-alert>
  </div>
</template>

<script>
  import { get } from 'vuex-pathify'
  export default {
    name: 'DefaultGoHome',
    computed: {
      ...get('app', ['alertMessage', 'alertType']),
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

<style scoped>
.alert-box {
  width: 100%;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  padding: 5px;
  z-index: 100;
}
</style>
