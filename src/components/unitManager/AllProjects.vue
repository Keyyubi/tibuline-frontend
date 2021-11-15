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
      :items="formattedProjects"
      :search="searchWord"
    >
      <template v-slot:item.id="{ item }">
        <v-chip
          class="ma-2"
          color="primary"
          dark
          @click="editProject(item.id)"
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
    name: 'AllProjects',
    data () {
      return {
        searchWord: '',
        headers: [
          {
            text: 'Proje No.',
            align: 'start',
            value: 'id',
          },
          { text: 'Proje', value: 'label' },
          { text: 'Sorumlu Kişi', value: 'managingBy.fullName' },
          { text: 'Masraf Merkezi', value: 'costCenter.center' },
          { text: 'Proje', value: 'label' },
          { text: 'Başl. Tar.', value: 'startingDate' },
          { text: 'Bit. Tar.', value: 'endingDate' },
          { text: 'Durumu', value: 'situation' },
        ],
        projects: [
          {
            id: 0,
            label: 'Proje 1',
            managingBy: { id: 0, fullName: 'Fatih Cigeroglu' },
            costCenter: { id: 0, center: 'POS ve Üye işyerleri', abbr: 'POS' },
            startingDate: '02/08/2021',
            endingDate: '12/02/2021',
            situation: { id: 7, label: 'Başlamadı' },
          },
          {
            id: 1,
            label: 'Proje 2',
            managingBy: { id: 1, fullName: 'Nazan Yagan' },
            costCenter: { id: 0, center: 'POS ve Üye işyerleri', abbr: 'POS' },
            startingDate: '02/08/2021',
            endingDate: '12/02/2021',
            situation: { id: 8, label: 'Devam Ediyor' },
          },
          {
            id: 2,
            label: 'Proje 2',
            managingBy: { id: 0, fullName: 'Fatih Cigeroglu' },
            costCenter: { id: 1, center: 'Masraf merkezi 2', abbr: 'MER1' },
            startingDate: '02/08/2021',
            endingDate: '12/02/2021',
            situation: { id: 9, label: 'İptal Edildi' },
          },
          {
            id: 3,
            label: 'Proje 3',
            managingBy: { id: 1, fullName: 'Nazan Yagan' },
            costCenter: { id: 2, center: 'Masraf merkezi 3', abbr: 'MER2' },
            startingDate: '02/08/2021',
            endingDate: '12/02/2021',
            situation: { id: 10, label: 'Bitti' },
          },
        ],
      }
    },
    computed: {
      formattedProjects () {
        return this.projects.map(e => {
          switch (e.situation.id) {
            case 7:
              e.situation.color = 'yellow'
              break
            case 8:
              e.situation.color = 'orange'
              break
            case 9:
              e.situation.color = 'error'
              break
            case 10:
              e.situation.color = 'success'
              break

            default:
              break
          }

          const formatDate = date => {
            const dt = new Date(date)
            return dt.getDay() + '/' + dt.getMonth() + '/' + dt.getFullYear()
          }

          e.startingDate = formatDate(e.startingDate)
          e.endingDate = formatDate(e.endingDate)

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
