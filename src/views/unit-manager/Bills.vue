<template>
  <v-container
    id="consultants-view"
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

      <v-tab href="#bills">
        Faturalar
        <v-icon>mdi-check-decagram</v-icon>
      </v-tab>
    </v-tabs>

    <div class="py3" />

    <v-tabs-items v-model="currentTab">
      <v-tab-item value="bills">
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
            :items="bills"
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
            <template v-slot:item.approveDeny="{ item }">
              <v-container>
                <v-btn
                  class="mx-2 white--text"
                  color="green"
                  fab
                  small
                  depressed
                  @click="approveBill(item)"
                >
                  <v-icon dark>
                    mdi-check
                  </v-icon>
                </v-btn>

                <v-dialog
                  v-model="dialog"
                  persistent
                  max-width="600px"
                >
                  <template>
                    <v-btn
                      class="mx-2 white--text"
                      color="error"
                      fab
                      small
                      depressed
                      @click="denyPopup(item)"
                    >
                      <v-icon dark>
                        mdi-close
                      </v-icon>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title class="text-h5 primary white--text">
                      Red Nedeni
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col>
                            <v-textarea
                              outlined
                              name="input-7-4"
                              label="Reason of deny"
                              placeholder="Please enter the reason of deny"
                              messages="Cannot be empty"
                              :value="reasonOfDeny"
                            />
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn
                        color="green"
                        text
                        @click="dialog = false"
                      >
                        Send
                      </v-btn>
                      <v-btn
                        color="error"
                        text
                        @click="dialog = false"
                      >
                        Cancel
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-container>
            </template>
          </v-data-table>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
  export default {
    name: 'ContractsView',
    data () {
      return {
        currentTab: 'bills',
        searchWord: '',
        reasonOfDeny: '',
        dialog: false,
        headers: [
          {
            text: 'Fatura No.',
            align: 'start',
            value: 'billNumber',
          },
          { text: 'Sipariş No.', value: 'orderNo' },
          { text: 'Masraf Merkezi', value: 'costCenter.center' },
          { text: 'Tedarikçi', value: 'supplier.title' },
          { text: 'Fatura Tarihi', value: 'billDate' },
          { text: 'Tutar', value: 'billCost' },
          { text: 'Onay / Red', align: 'center', value: 'approveDeny' },
        ],
        bills: [
          {
            id: '431231',
            billNumber: '124322',
            orderNo: '212',
            billDate: '02/03/2020',
            billCost: '12.432,43 ₺',
            supplier: { supplierId: 0, title: 'Tibula' },
            costCenter: { id: 0, center: 'POS ve Üye işyerleri', abbr: 'POS' },
          },
          {
            id: '431232',
            billNumber: '124323',
            orderNo: '213',
            billDate: '02/03/2020',
            billCost: '12.432,43 ₺',
            supplier: { supplierId: 0, title: 'Tibula' },
            costCenter: { id: 0, center: 'POS ve Üye işyerleri', abbr: 'POS' },
          },
          {
            id: '431233',
            billNumber: '124342',
            orderNo: '214',
            billDate: '02/03/2020',
            billCost: '12.432,43 ₺',
            supplier: { supplierId: 0, title: 'Tibula' },
            costCenter: { id: 0, center: 'POS ve Üye işyerleri', abbr: 'POS' },
          },
          {
            id: '431234',
            billNumber: '124325',
            orderNo: '215',
            billDate: '02/03/2020',
            billCost: '12.432,43 ₺',
            supplier: { supplierId: 0, title: 'Tibula' },
            costCenter: { id: 0, center: 'POS ve Üye işyerleri', abbr: 'POS' },
          },
          {
            id: '431235',
            billNumber: '124326',
            orderNo: '216',
            billDate: '02/03/2020',
            billCost: '12.432,43 ₺',
            supplier: { supplierId: 0, title: 'Tibula' },
            costCenter: { id: 0, center: 'POS ve Üye işyerleri', abbr: 'POS' },
          },
        ],
      }
    },
    methods: {
      seeDetails (id) {
        console.log('id', id)
      },
      approveBill (bill) {
        console.log('bill', bill)
      },
      denyPopup (bill) {
        this.dialog = true
        console.log('bill', bill)
      },
    },
  }
</script>
