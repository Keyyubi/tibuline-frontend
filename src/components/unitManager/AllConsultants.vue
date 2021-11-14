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
      :items="allConsultants"
      :search="searchWord"
    >
      <template v-slot:item.id="{ item }">
        <v-chip
          class="ma-2"
          color="primary"
          dark
          @click="seeDetails(item.id)"
        >
          <b>{{ item.id }}</b>
          <v-icon right>
            mdi-arrow-right-bold
          </v-icon>
        </v-chip>
      </template>

      <template v-slot:item.situation="{ item }">
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
    name: 'AllConsultants',
    data () {
      return {
        searchWord: '',
        headers: [
          {
            text: 'Danışman No.',
            align: 'start',
            value: 'id',
          },
          { text: 'Ad Soyad', value: 'fullName' },
          { text: 'Proje', value: 'project.label' },
          { text: 'Yönetici', value: 'manager.fullName' },
          { text: 'Masraf Merkezi', value: 'costCenter.center' },
          { text: 'Başl. Tar.', value: 'startingDate' },
          { text: 'Bit. Tar.', value: 'endingDate' },
          { text: 'Durumu', value: 'situation' },
        ],
        consultants: [
          {
            id: '135723',
            firstName: 'Murathan',
            lastName: 'Karayazi',
            project: { id: '12321', label: 'Proje 1' },
            manager: { id: '321', firstName: 'Fatih', lastName: 'Cigeroglu' },
            costCenter: { id: 0, center: 'POS ve Üye işyerleri', abbr: 'POS' },
            startingDate: '02/03/2020',
            endingDate: '03/03/2021',
            situation: { id: 0, label: 'Aktif' },
          },
          {
            id: '135724',
            firstName: 'Busra',
            lastName: 'Yargi',
            project: { id: '12321', label: 'Proje 1' },
            manager: { id: '321', firstName: 'Nazan', lastName: 'Yagan' },
            costCenter: { id: 0, center: 'Masraf Merkezi 4', abbr: 'MM4' },
            startingDate: '12/01/2020',
            endingDate: '30/04/2024',
            situation: { id: 0, label: 'Aktif' },
          },
          {
            id: '135725',
            firstName: 'Murathan',
            lastName: 'Karayazi',
            project: { id: '12321', label: 'Proje 1' },
            manager: { id: '321', firstName: 'Fatih', lastName: 'Cigeroglu' },
            costCenter: { id: 0, center: 'POS ve Üye işyerleri', abbr: 'POS' },
            startingDate: '02/03/2020',
            endingDate: '03/03/2020',
            situation: { id: 1, label: 'Pasif' },
          },
          {
            id: '135726',
            firstName: 'Furkan',
            lastName: 'Reyhanlioglu',
            project: { id: '12321', label: 'Proje 1' },
            manager: { id: '321', firstName: 'Fatih', lastName: 'Cigeroglu' },
            costCenter: { id: 0, center: 'POS ve Üye işyerleri', abbr: 'POS' },
            startingDate: '02/03/2020',
            endingDate: '03/03/2021',
            situation: { id: 0, label: 'Aktif' },
          },
        ],
      }
    },
    computed: {
      allConsultants () {
        return this.consultants.map(e => {
          e.fullName = e.firstName + ' ' + e.lastName
          e.manager.fullName = e.manager.firstName + ' ' + e.manager.lastName
          switch (e.situation.id) {
            case 0:
              e.situation.color = 'green'
              break
            case 1:
              e.situation.color = '#aaa'
              break
          }
          return e
        })
      },
    },
    methods: {
      seeDetails (id) {
        console.log('id', id)
      },
    },
  }
</script>

<style lang="scss" scoped></style>
