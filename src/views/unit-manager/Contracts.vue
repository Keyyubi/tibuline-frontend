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

      <v-tab href="#newContract">
        Yeni Sözleşme
        <v-icon>mdi-text-box-plus-outline</v-icon>
      </v-tab>

      <v-tab href="#allContracts">
        Oluşturulan Sözleşmeler
        <v-icon>mdi-text-box-multiple-outline</v-icon>
      </v-tab>
    </v-tabs>

    <div class="py3" />

    <v-tabs-items v-model="currentTab">
      <v-tab-item value="newContract">
        <v-form>
          <v-container class="py-3">
            <v-row>
              <v-col cols="3">
                <v-text-field
                  disabled
                  color="purple"
                  label="Birim Müdürü"
                  value="Fatih Cigeroglu"
                />
              </v-col>

              <v-col cols="3">
                <v-select
                  v-model="contract"
                  :items="contracts"
                  item-text="orderNo"
                  item-value="contractId"
                  label="Talep No. veya Sipariş No."
                  return-object
                />
              </v-col>

              <v-col cols="3">
                <v-file-input
                  v-model="contractUpload"
                  chips
                  multiple
                  label="Sözleşme Yükle"
                />
              </v-col>

              <v-col cols="3">
                <v-btn
                  class="my-2"
                  width="100%"
                  color="primary"
                  @click="createContract()"
                >
                  Oluştur
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-tab-item>

      <v-tab-item value="allContracts">
        <all-contracts />
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
  export default {
    name: 'ContractsView',
    data () {
      return {
        currentTab: '',
        menu1: false, // Staring Date Picker
        menu2: false, // Ending Date Picker
        contractUpload: null,
        contract: { contractId: '', orderNo: '' },
        supplier: { company: '', abbr: '' },
        expenseCenter: { center: '', abbr: '' },
        jobTitle: { title: '', abbr: '' },
        experience: { exp: '', value: '' },

        startingDate: null,
        endingDate: null,
        suppliers: [
          { company: 'Tibula', abbr: 'TBL' },
          { company: 'Mirsis', abbr: 'MRS' },
          { company: 'Netas', abbr: 'NE' },
        ],
        expenseCenters: [
          { center: 'POS ve Üye işyerleri', abbr: 'POS' },
          { center: 'Masraf merkezi 2', abbr: 'MER1' },
          { center: 'Masraf merkezi 3', abbr: 'MER2' },
        ],

        jobTitles: [
          { title: 'İş Analisti', abbr: 'BSA' },
          { title: 'DevOps Uzmanı', abbr: 'DOPS' },
          { title: 'Senior Backend Developer', abbr: 'SRB' },
          { title: 'Junior Frontend Developer', abbr: 'JRF' },
        ],
        experiences: [
          { exp: '2-3 Yıl', value: 0 },
          { exp: '3-5 Yıl', value: 1 },
          { exp: '5-8 Yıl', value: 2 },
          { exp: '8-12 Yıl', value: 3 },
          { exp: '12+ Yıl', value: 4 },
        ],
        contractType: 'all',
        contracts: [
          {
            contractId: 1,
            orderNo: '12432240',
            supplier: { supplierId: 0, title: 'Tibula' },
            pozition: { id: 1, title: 'Sr. Software Developer' },
            consultant: { firstName: 'Murathan', lastName: 'Karayazi' },
            situation: { id: 0, label: 'Rezive Bekliyor' },
          },
          {
            contractId: 2,
            orderNo: '12432241',
            supplier: { supplierId: 0, title: 'Tibula' },
            pozition: { id: 1, title: 'Sr. Software Developer' },
            consultant: { firstName: 'Furkan', lastName: 'Reyhanlioglu' },
            situation: { id: 0, label: 'Rezive Bekliyor' },
          },
          {
            contractId: 3,
            orderNo: '12432242',
            supplier: { supplierId: 0, title: 'Tibula' },
            pozition: { id: 1, title: 'Sr. Software Developer' },
            consultant: { firstName: 'Murathan', lastName: 'Karayazi' },
            situation: { id: 1, label: 'Sözleşme Bekliyor' },
          },
        ],
      }
    },
    methods: {
      createContract () {
        console.log(this.contractUpload)
      },
    },
  }
</script>
