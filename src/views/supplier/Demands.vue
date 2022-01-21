<template>
  <v-container
    id="demands-view"
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

      <v-tab href="#newDemands">
        Yeni Talepler
        <v-icon>mdi-account-plus</v-icon>
      </v-tab>
    </v-tabs>

    <div class="py3" />

    <v-tabs-items v-model="currentTab">
      <v-tab-item value="newDemands">
        <new-demands />
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
  export default {
    name: 'Demands',
    data () {
      return { currentTab: 'newDemands' }
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
