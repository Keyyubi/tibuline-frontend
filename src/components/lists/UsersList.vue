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
      :items="users"
      :search="searchWord"
    >
      <template v-slot:item.id="{ item }">
        <v-chip
          class="ma-2"
          color="primary"
          dark
          @click="showUser(item)"
        >
          <b>Güncelle</b>
          <v-icon right>
            mdi-arrow-right-bold
          </v-icon>
        </v-chip>
      </template>
      <template v-slot:item.supplierId="{ item }">
        {{ getSupplierName(item.supplierId) }}
      </template>
    </v-data-table>

    <v-dialog
      v-model="dialog"
      width="960"
      :retain-focus="false"
    >
      <user-form
        form-type="update"
        :user="selectedUser"
        @close-dialog="dialog = false"
      />
    </v-dialog>
  </v-card>
</template>

<script>
  import { get } from 'vuex-pathify'
  import { RULES } from '@/util/globals'
  export default {
    name: 'UsersList',
    props: {
      role: { type: String },
    },
    data () {
      return {
        valid: false,
        searchWord: '',
        dialog: false,
        selectedUser: {},
        headers: [
          {
            text: 'Güncelle',
            align: 'start',
            value: 'id',
          },
          { text: 'Kullanıcı Adı', value: 'username' },
          { text: 'Adı', value: 'firstname' },
          { text: 'Soyadı', value: 'lastname' },
          { text: 'Şirket', value: 'supplierId' },
          { text: 'Telefon', value: 'phoneNumber' },
          { text: 'Email', value: 'email' },
        ],
        RULES,
      }
    },
    computed: {
      ...get('supplier', ['suppliers']),
      ...get('user', ['users']),
    },
    mounted () {
      this.$store.dispatch('supplier/getSuppliers')
    },
    methods: {
      showUser (user) {
        this.selectedUser = { ...user }
        this.dialog = true
      },
      getSupplierName (id) {
        const supplier = this.companies.find(e => e.id === id)
        return supplier ? supplier.name : 'Şirket bilgisi bulunamadı.'
      },
    },
  }
</script>

<style lang="scss" scoped></style>
