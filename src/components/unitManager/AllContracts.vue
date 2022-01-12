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
      <template v-slot:item.id="{ item }">
        <v-chip
          class="ma-2"
          color="primary"
          dark
          @click="seeContract(item)"
        >
          <b>{{ item.id }}</b>
          <v-icon right>
            mdi-arrow-right-bold
          </v-icon>
        </v-chip>
      </template>

      <template v-slot:item.supplierCompanyId="{ item }">
        {{ item.supplierCompanyId ? companies.find(e => e.id === item.supplierCompanyId).name : 'Bulunamadı' }}
      </template>

      <template v-slot:item.startDate="{ item }">
        {{ getComputedDate(item.startDate) }}
      </template>
      <template v-slot:item.endDate="{ item }">
        {{ getComputedDate(item.endDate) }}
      </template>
      <template v-slot:item.jobStartDate="{ item }">
        {{ getComputedDate(item.jobStartDate) }}
      </template>

      <template v-slot:item.contractStatus="{ item }">
        <v-chip
          class="ma-2"
          :color="item.contractStatus ? 'green' : 'grey'"
          dark
        >
          {{ item.contractStatus ? 'Aktif' : 'Pasif' }}
        </v-chip>
        <!-- <v-switch
          v-model="item.contractStatus"
          @change="editContract(item)"
        >
          <template v-slot:label>
            {{ item.contractStatus ? 'Aktif' : 'Pasif' }}
          </template>
        </v-switch> -->
      </template>

      <template v-slot:item.delete="{ item }">
        <v-chip
          class="ma-2"
          color="primary"
          dark
          @click="deleteContract(item.id)"
        >
          <b>Sil</b>
          <v-icon right>
            mdi-trash-can-outline
          </v-icon>
        </v-chip>
      </template>
    </v-data-table>

    <!-- Confirmation dialog -->
    <v-dialog
      v-model="dialog"
      persistent
      width="460"
    >
      <v-card>
        <v-card-title class="text-h5 primary white--text">
          Onay
        </v-card-title>
        <v-card-text class="text-h5 py-3">
          <v-icon
            class="mr-4"
            large
          >
            mdi-alert
          </v-icon>
          <b>{{ selectedContractId }}</b> numaralı sözleşme silinecektir. Onaylıyor musunuz?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            class="white--text mr-3"
            color="green"
            depressed
            small
            @click="confirm"
          >
            Onayla
          </v-btn>
          <v-btn
            color="error"
            dark
            depressed
            small
            @click="closeDialog"
          >
            Vazgeç
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
  import { get } from 'vuex-pathify'
  export default {
    name: 'AllContracts',
    data () {
      return {
        requestType: 'all',
        searchWord: '',
        dialog: false,
        selectedContract: null,
        selectedContractId: null,
        headers: [
          {
            text: 'Sözleşme No.',
            align: 'start',
            value: 'id',
          },
          { text: 'Tedarikçi', value: 'supplierCompanyId' },
          { text: 'Başl. Tar.', value: 'startDate' },
          { text: 'Bit. Tar.', value: 'endDate' },
          { text: 'İş Başl. Tar.', value: 'jobStartDate' },
          { text: 'Sözleşme Durumu', value: 'contractStatus' },
          { text: 'Sözleşmeyi Sil', value: 'delete' },
        ],
      }
    },
    computed: {
      ...get('manager', ['contracts', 'companies']),
    },
    mounted () {
      this.$store.dispatch('manager/getContracts')
      this.$store.dispatch('manager/getSupplierCompanies')
    },
    methods: {
      editContract (item) {
        console.log('id', item)
      },
      seeContract (item) {
        console.log('file', item.filePath)
        window.open(item.filePath, '_blank').focus()
      },
      deleteContract (id) {
        console.log('id', id)
        this.selectedContractId = id
        this.dialog = true
      },
      confirm () {
        this.$store.dispatch('manager/deleteContract', this.selectedContractId)
      },
      closeDialog () {
        this.selectedContractId = null
        this.dialog = false
      },
      getComputedDate (date) {
        const arr = date.split('T')[0].split('-')
        return `${arr[2]}/${arr[1]}/${arr[0]}`
      },
    },
  }
</script>

<style lang="scss" scoped></style>
