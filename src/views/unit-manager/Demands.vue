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
        <demands-list />
      </v-tab-item>
      <v-tab-item value="newDemand">
        <demand-form
          form-type="create"
          :demand="newDemand"
        />
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
  import DemandForm from '../../components/forms/DemandForm.vue'
  export default {
    name: 'Demands',
    components: { DemandForm },
    data () {
      return {
        currentTab: 'allDemand',
        newDemand: {
          createdById: null,
          costCenterId: null,
          supplierCompanyId: null,
          jobTitleId: null,
          experienceSpanId: null,
          monthlyBudget: null,
          totalBudget: null,
          projectId: null,
          demandStatus: null,
        },
      }
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
