<template>
  <v-card>
    <v-card-title>
      <v-text-field
        v-model="searchWord"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      />
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="contracts"
      :search="searchWord"
    >
      <template v-slot:item.contractId="{ item }">
        <v-chip
          color="primary"
          dark
          @click="addContract(item.contractId)"
        >
          {{ item.contractId }}
        </v-chip>
      </template>

      <template v-slot:item.situation.label="{ item }">
        <v-chip
          :color="item.situation.id === 0 ? 'orange' : 'green'"
          dark
        >
          {{ item.situation.label }}
        </v-chip>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  export default {
    name: 'AllRequests',
    data () {
      return {
        requestType: 'all',
        searchWord: '',
        headers: [
          {
            text: 'Talep No.',
            align: 'start',
            value: 'contractId',
          },
          { text: 'Tedarikçi', value: 'supplier.title' },
          { text: 'Pozisyon', value: 'position.title' },
          { text: 'Aday', value: 'candicate.fullName' },
          { text: 'Talep Durumu', value: 'situation.label' },
        ],
        contracts: [
          {
            contractId: 1,
            supplier: { supplierId: 0, title: 'Tibula' },
            position: { id: 1, title: 'Sr. Software Developer' },
            candicate: { id: 0, fullName: 'Murathan Karayazi' },
            situation: { id: 0, label: 'Rezive Bekliyor' },
          },
          {
            contractId: 2,
            supplier: { supplierId: 0, title: 'Tibula' },
            position: { id: 1, title: 'Sr. Software Developer' },
            candicate: { id: 1, fullName: 'Furkan Reyhanlioglu' },
            situation: { id: 0, label: 'Rezive Bekliyor' },
          },
          {
            contractId: 3,
            supplier: { supplierId: 0, title: 'Tibula' },
            position: { id: 1, title: 'Sr. Software Developer' },
            candicate: { id: 0, fullName: 'Murathan Karayazi' },
            situation: { id: 1, label: 'Sözleşme Bekliyor' },
          },
        ],
      }
    },
    methods: {
      editRequest (id) {
        console.log('id', id)
      },
      addContract (id) {
        console.log('id', id)
      },
    },
  }
</script>

<style lang="scss" scoped></style>
