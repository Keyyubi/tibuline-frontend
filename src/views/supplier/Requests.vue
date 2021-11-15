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

      <v-tab href="#newRequests">
        Yeni Talepler
        <v-icon>mdi-account-plus</v-icon>
      </v-tab>

      <v-tab href="#pendingRequests">
        Açık Talepler
        <v-icon>mdi-account-multiple</v-icon>
      </v-tab>
    </v-tabs>

    <div class="py3" />

    <v-tabs-items v-model="currentTab">
      <v-tab-item value="newRequests">
        <new-requests />
      </v-tab-item>

      <v-tab-item value="pendingRequests">
        <pending-requests />
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
  export default {
    name: 'Talepler',
    data () {
      return { currentTab: 'newRequests' }
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
