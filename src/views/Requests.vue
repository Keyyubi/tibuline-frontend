<template>
  <v-container
    id="requests-view"
    fluid
    tag="section"
  >
    <v-tabs
      v-model="currentTab"
      background-color="primary"
      centered
      dark
      icons-and-text
    >
      <v-tabs-slider />

      <v-tab href="#newRequest">
        Yeni Talep
        <v-icon>mdi-account-plus</v-icon>
      </v-tab>

      <v-tab href="#allRequests">
        Açık Talepler
        <v-icon>mdi-account-multiple</v-icon>
      </v-tab>
    </v-tabs>

    <div class="py3" />

    <v-tabs-items v-model="currentTab">
      <v-tab-item value="newRequest">
        <new-request />
      </v-tab-item>

      <v-tab-item value="allRequests">
        <all-requests />
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
  import NewRequest from '../components/NewRequest.vue'
  import AllRequests from '../components/AllRequests.vue'

  export default {
    name: 'UserProfileView',
    components: {
      NewRequest,
      AllRequests,
    },
    data () {
      return { currentTab: 'newRequest' }
    },
  }
</script>

<style lang="scss" scoped>
.btn-group-row {
  display: flex;
  justify-content: center !important;
  align-items: center;
}
</style>
