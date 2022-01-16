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
          @click="editContract(item)"
        >
          <b>{{ item.id }}</b>
          <v-icon right>
            mdi-arrow-right-bold
          </v-icon>
        </v-chip>
      </template>

      <template v-slot:item.consultantId="{ item }">
        {{ getConsultantName(item.consultantId) }}
      </template>

      <template v-slot:item.startDate="{ item }">
        {{ getLocaleDate(item.startDate) }}
      </template>
      <template v-slot:item.endDate="{ item }">
        {{ getLocaleDate(item.endDate) }}
      </template>

      <template v-slot:item.isActive="{ item }">
        <v-chip
          class="ma-2"
          :color="item.isActive ? 'green' : 'grey'"
          dark
        >
          {{ item.isActive ? 'Aktif' : 'Pasif' }}
        </v-chip>
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

    <!-- Edit Dialog -->
    <v-dialog
      v-model="editDialog"
      persistent
      width="75%"
    >
      <v-card>
        <v-card-title class="text-h5 primary white--text">
          Sözleşmeyi güncelle
        </v-card-title>
        <v-card-text>
          <contract-form
            form-type="update"
            :contract="selectedContract"
            @close-dialog="editDialog = false"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

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
        editDialog: false,
        selectedContract: null,
        selectedContractId: null,
        headers: [
          {
            text: 'Sözleşme No.',
            align: 'start',
            value: 'id',
          },
          { text: 'Aday', value: 'consultantId' },
          { text: 'Başl. Tar.', value: 'startDate' },
          { text: 'Bit. Tar.', value: 'endDate' },
          { text: 'Sözleşmeyi Sil', value: 'delete' },
        ],
      }
    },
    computed: {
      ...get('user', ['user']),
      ...get('supplier', ['contracts', 'consultants']),
    },
    mounted () {
      this.$store.dispatch('supplier/getContracts')
      this.$store.dispatch('manager/getConsultants')
    },
    methods: {
      editContract (item) {
        this.selectedContract = { ...item }
        this.editDialog = true
      },
      seeContract (item) {
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
      getLocaleDate (date) {
        const arr = date.split('T')[0].split('-')
        return `${arr[2]}/${arr[1]}/${arr[0]}`
      },
      getConsultantName (id) {
        if (id) {
          const consultant = this.consultants.find(e => e.id === id)
          return consultant ? consultant.firstName + ' ' + consultant.lastName : 'Aday ismi bulunamadı.'
        } return 'Bu aday bulunamadı.'
      },
    },
  }
</script>

<style lang="scss" scoped></style>
