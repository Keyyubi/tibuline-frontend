<template>
  <v-container
    id="contracts-view"
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

      <v-tab href="#allContracts">
        Oluşturulan Sözleşmeler
        <v-icon>mdi-text-box-multiple-outline</v-icon>
      </v-tab>

      <v-tab href="#newContract">
        Yeni Sözleşme
        <v-icon>mdi-text-box-plus-outline</v-icon>
      </v-tab>
    </v-tabs>

    <div class="py3" />

    <v-tabs-items v-model="currentTab">
      <v-tab-item value="allContracts">
        <all-contracts />
      </v-tab-item>

      <v-tab-item value="newContract">
        <contract-form :contract="newContract" />
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
  export default {
    name: 'ContractsView',
    data () {
      return {
        currentTab: 'allContracts',
        menu1: false, // Staring Date Picker
        menu2: false, // Ending Date Picker
        contractUpload: null,

        newContract: {
          consultantId: null,
          isActive: false,
          filePath: null,
          startDate: null,
          endDate: null,
          supplierCompanyId: null,
        },
      }
    },
    methods: {
      createContract () {
        console.log(this.contractUpload)
        const formData = new FormData()
        console.log(this.contractUpload[0])
        formData.append('image', this.contractUpload[0])
        this.$store.dispatch('contract/createContract', formData)
      },
    },
  }
</script>
