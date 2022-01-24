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
      <template v-slot:item.username="{ item }">
        <v-chip
          class="ma-2"
          color="primary"
          dark
          @click="showUser(item)"
        >
          <b>{{ item.username }}</b>
          <v-icon right>
            mdi-arrow-right-bold
          </v-icon>
        </v-chip>
      </template>
      <template v-slot:item.companyId="{ item }">
        {{ getCompanyName(item.companyId) }}
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
            text: 'Kullanıcı Adı',
            align: 'start',
            value: 'username',
          },
          { text: 'Adı', value: 'firstname' },
          { text: 'Soyadı', value: 'lastname' },
          { text: 'Şirket', value: 'companyId' },
          { text: 'Telefon', value: 'phoneNumber' },
          { text: 'Email', value: 'email' },
        ],
        RULES,
      }
    },
    computed: {
      ...get('company', ['companies']),
      ...get('user', ['users']),
    },
    mounted () {
      this.$store.dispatch('company/getCompanies')
    },
    methods: {
      showUser (user) {
        this.selectedUser = { ...user }
        this.dialog = true
      },
      getCompanyName (id) {
        const company = this.companies.find(e => e.id === id)
        return company ? company.name : 'Şirket bilgisi bulunamadı.'
      },
    },
  }
</script>

<style lang="scss" scoped></style>
