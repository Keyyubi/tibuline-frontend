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
      :items="consultants"
      :search="searchWord"
    >
      <!-- eslint-disable-next-line -->
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

      <!-- eslint-disable-next-line -->
      <template v-slot:item.isActive="{ item }">
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
  import { get } from 'vuex-pathify'
  export default {
    name: 'SupplierConsultants',
    data () {
      return {
        searchWord: '',
        headers: [
          {
            text: 'Danışman No.',
            align: 'start',
            value: 'id',
          },
          { text: 'Ad', value: 'firstname' },
          { text: 'soyad', value: 'lastname' },
          { text: 'Yönetici', value: 'manager.fullName' },
          { text: 'Durumu', value: 'isActive' },
        ],
      }
    },
    computed: {
      ...get('supplier', ['consultants']),
    },
    mounted () {
      this.$store.dispatch('supplier/getConsultants')
    },
    methods: {
      seeDetails (id) {
        console.log('id', id)
      },
    },
  }
</script>

<style lang="scss" scoped></style>
