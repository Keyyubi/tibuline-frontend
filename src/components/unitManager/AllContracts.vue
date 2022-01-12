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
      :items="coloredContracts"
      :search="searchWord"
    >
      <template v-slot:item.orderNo="{ item }">
        <v-chip
          class="ma-2"
          color="primary"
          dark
          @click="addContract(item.orderNo)"
        >
          <b>{{ item.orderNo }}</b>
          <v-icon right>
            mdi-arrow-right-bold
          </v-icon>
        </v-chip>
      </template>

      <template v-slot:item.situation.label="{ item }">
        <v-chip
          :color="item.situation.color"
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
    name: 'AllContracts',
    data () {
      return {
        requestType: 'all',
        searchWord: '',
        headers: [
          {
            text: 'Sipariş No.',
            align: 'start',
            value: 'orderNo',
          },
          { text: 'Tedarikçi', value: 'supplier.title' },
          { text: 'Pozisyon', value: 'position.title' },
          { text: 'Aday', value: 'consultant.fullName' },
          { text: 'Proje', value: 'project.label' },
          { text: 'Talep Durumu', value: 'situation.label' },
        ],
        contracts: [
          {
            contractId: 0,
            orderNo: '123043',
            project: { id: 0, label: 'Proje 1' },
            supplier: { supplierId: 0, title: 'Tibula' },
            position: { id: 1, title: 'Sr. Software Developer' },
            consultant: { id: 0, fullName: 'Murathan Karayazi' },
            situation: { id: 0, label: 'Rezive Bekliyor' },
          },
          {
            contractId: 1,
            orderNo: '123044',
            project: { id: 0, label: 'Proje 2' },
            supplier: { supplierId: 0, title: 'Tibula' },
            position: { id: 1, title: 'Sr. Software Developer' },
            consultant: { id: 1, fullName: 'Furkan Reyhanlioglu' },
            situation: { id: 2, label: 'Hukuk Dpt.' },
          },
          {
            contractId: 2,
            orderNo: '123045',
            project: { id: 0, label: 'Proje 2' },
            supplier: { supplierId: 0, title: 'Tibula' },
            position: { id: 1, title: 'Sr. Software Developer' },
            consultant: { id: 0, fullName: 'Murathan Karayazi' },
            situation: { id: 3, label: 'Satın Alma Dpt.' },
          },
          {
            contractId: 3,
            orderNo: '123044',
            project: { id: 0, label: 'Proje 3' },
            supplier: { supplierId: 0, title: 'Tibula' },
            position: { id: 1, title: 'Sr. Software Developer' },
            consultant: { id: 1, fullName: 'Furkan Reyhanlioglu' },
            situation: { id: 4, label: 'Onaylandı' },
          },
        ],
      }
    },
    computed: {
      coloredContracts () {
        return this.contracts.map(e => {
          switch (e.situation.id) {
            case 0:
              e.situation.color = 'red'
              break
            case 2:
              e.situation.color = 'orange'
              break
            case 3:
              e.situation.color = 'blue'
              break
            case 4:
              e.situation.color = 'green'
              break

            default:
              break
          }
          return e
        })
      },
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
