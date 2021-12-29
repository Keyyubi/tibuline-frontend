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
      :items="costs"
      :search="searchWord"
    >
      <template v-slot:item.id="{ item }">
        <v-chip
          class="ma-2"
          color="primary"
          dark
          @click="seeDetails(item)"
        >
          <b>{{ item.id }}</b>
          <v-icon right>
            mdi-arrow-right-bold
          </v-icon>
        </v-chip>
      </template>
    </v-data-table>

    <v-dialog
      v-model="dialog"
      width="50%"
    >
      <v-card>
        <v-card-title class="text-h5 white--text primary">
          Masraf Detayı
        </v-card-title>

        <v-card-text>
          <v-container class="mt-3">
            <v-row>
              <v-col
                lg="6"
                md="6"
                sm="12"
              >
                <v-row class="my-2">
                  <v-text-field
                    :value="selectedCost.id"
                    label="Masraf No"
                    readonly
                  />
                </v-row>
                <v-row class="my-2">
                  <v-text-field
                    :value="selectedCost.costCenter"
                    label="Masraf Merkezi"
                    readonly
                  />
                </v-row>
                <v-row class="my-2">
                  <v-text-field
                    :value="selectedCost.header"
                    label="Başlık"
                    readonly
                  />
                </v-row>
                <v-row class="my-2">
                  <v-text-field
                    :value="selectedCost.billDate"
                    label="Fiş Tarihi"
                    readonly
                  />
                </v-row>
                <v-row class="my-2">
                  <v-text-field
                    :value="selectedCost.billNumber"
                    label="Fiş Numarası"
                    readonly
                  />
                </v-row>
                <v-row class="my-2">
                  <v-text-field
                    :value="selectedCost.cost"
                    label="Tutar"
                    readonly
                  />
                </v-row>
              </v-col>
              <v-spacer />
              <v-col
                class="d-flex justify-center justify-center"
                lg="6"
                md="6"
                sm="12"
              >
                <v-img
                  class="mt-2"
                  :lazy-src="selectedCost.imgUrl"
                  max-height="500"
                  max-width="300"
                  :src="selectedCost.imgUrl"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
  export default {
    name: 'Costs',
    data () {
      return {
        searchWord: '',
        dialog: false,
        selectedCost: {},
        headers: [
          {
            text: 'Masraf No.',
            align: 'start',
            value: 'id',
          },
          { text: 'Masraf Merkezi', value: 'costCenter.center' },
          { text: 'Başlık', value: 'header' },
          { text: 'Fiş Tarihi', value: 'billDate' },
          { text: 'Tutar (₺)', value: 'cost' },
        ],
        costs: [
          {
            id: '135723',
            costCenter: { id: 0, center: 'POS ve Üye işyerleri', abbr: 'POS' },
            header: 'Dinner',
            description: 'Meeting dinner with customers',
            billNumber: '135723',
            billDate: '02/03/2020',
            cost: '223,05 ₺',
            imgUrl: 'https://via.placeholder.com/400',
          },
          {
            id: '135724',
            costCenter: { id: 0, center: 'POS ve Üye işyerleri', abbr: 'POS' },
            header: 'Dinner',
            description: 'Meeting dinner with customers',
            billNumber: '135724',
            billDate: '02/03/2020',
            cost: '503,00 ₺',
            imgUrl: 'https://via.placeholder.com/400',
          },
          {
            id: '135725',
            costCenter: { id: 0, center: 'POS ve Üye işyerleri', abbr: 'POS' },
            header: 'Dinner',
            description: 'Meeting dinner with customers',
            billNumber: '135725',
            billDate: '02/03/2020',
            cost: '1.502,00 ₺',
            imgUrl: 'https://via.placeholder.com/400',
          },
          {
            id: '135726',
            costCenter: { id: 0, center: 'POS ve Üye işyerleri', abbr: 'POS' },
            header: 'Dinner',
            description: 'Meeting dinner with customers',
            billNumber: '135726',
            billDate: '02/03/2020',
            cost: '430,77 ₺',
            imgUrl: 'https://via.placeholder.com/400',
          },
        ],
      }
    },
    methods: {
      seeDetails (obj) {
        this.dialog = true
        this.selectedCost = obj
        this.selectedCost.costCenter = obj.costCenter.center
      },
    },
  }
</script>

<style lang="scss" scoped></style>
