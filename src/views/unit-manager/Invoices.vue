<template>
  <v-container
    id="invoices-view"
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

      <v-tab href="#allInvoices">
        Faturalar
        <v-icon>mdi-account-group</v-icon>
      </v-tab>
    </v-tabs>

    <div class="py3" />

    <v-tabs-items v-model="currentTab">
      <v-tab-item value="allInvoices">
        <invoices-list />
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
  export default {
    name: 'InvoicesUnitManager',
    data () {
      return {
        currentTab: 'allInvoices',
      }
    },
  }
</script>
