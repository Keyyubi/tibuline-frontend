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

      <v-tab href="#allDemands">
        Açık Talepler
        <v-icon>mdi-account-multiple</v-icon>
      </v-tab>

      <v-tab href="#newDemand">
        Yeni Talep
        <v-icon>mdi-account-plus</v-icon>
      </v-tab>
    </v-tabs>

    <div class="py3" />

    <v-tabs-items v-model="currentTab">
      <v-tab-item value="allDemands">
        <all-demands />
      </v-tab-item>
      <v-tab-item value="newDemand">
        <new-demand />
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
  export default {
    name: 'Demands',
    data () {
      return { currentTab: 'allDemand' }
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
