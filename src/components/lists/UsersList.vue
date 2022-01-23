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
      <template v-slot:item.userName="{ item }">
        <v-chip
          class="ma-2"
          color="primary"
          dark
          @click="seeDetails(item)"
        >
          <b>{{ item.userName }}</b>
          <v-icon right>
            mdi-arrow-right-bold
          </v-icon>
        </v-chip>
      </template>
      <template v-slot:item.companyId="{ item }">
        {{ companies.find(e => e.id === item.companyId).name }}
      </template>
    </v-data-table>

    <v-dialog
      v-model="dialog"
      width="960"
      :retain-focus="false"
    >
      <v-card>
        <v-card-title class="text-h5 primary white--text">
          Kullanıcı Güncelle
        </v-card-title>

        <v-card-text>
          <v-container class="py-3">
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
            >
              <v-row>
                <!-- Username -->
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="selectedUser.userName"
                    label="Kullanıcı Adı"
                    :rules="[v => !!v || 'Kullanıcı adı boş geçilemez',]"
                    required
                  />
                </v-col>

                <!-- Email -->
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="selectedUser.email"
                    label="E-mail"
                    :rules="RULES.EMAIL"
                    required
                  />
                </v-col>

                <!-- Firstname -->
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="selectedUser.firstName"
                    label="Adı"
                    :rules="[v => !!v || 'Ad boş geçilemez',]"
                    required
                  />
                </v-col>

                <!-- Lastname -->
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="selectedUser.lastName"
                    label="Soyadı"
                    :rules="[v => !!v || 'Soyad boş geçilemez',]"
                    required
                  />
                </v-col>

                <!-- Phone -->
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="selectedUser.phoneNumber"
                    v-mask="'(###) ### ####'"
                    label="Cep Telefonu"
                    append-icon="mdi-close"
                    prepend-icon="mdi-phone"
                    :rules="RULES.PHONE"
                    required
                    @click:append="selectedUser.phoneNumber = ''"
                  />
                </v-col>

                <!-- TCKN -->
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="selectedUser.tckn"
                    v-mask="'###########'"
                    label="TCKN"
                    :rules="RULES.TCNO"
                    required
                  />
                </v-col>

                <!-- Company -->
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-select
                    v-model="selectedUser.companyId"
                    :items="companies"
                    item-text="name"
                    item-value="id"
                    label="Şirket"
                    :rules="[v => (!!v || v === 0) || 'Şirket seçmelisiniz']"
                    required
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>

        <v-divider />

        <!-- Card Actions -->
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="success"
            depressed
            @click="updateUser"
          >
            Güncelle
          </v-btn>
          <v-btn
            color="error"
            depressed
            @click="dialog = false"
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
            value: 'userName',
          },
          { text: 'Adı', value: 'firstName' },
          { text: 'Soyadı', value: 'lastName' },
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
      seeDetails (user) {
        this.selectedUser = user
        this.dialog = true
      },
      updateUser () {
        if (this.$refs.form.validate()) {
          this.dialog = false
          this.$store.dispatch('user/updateUser', this.selectedUser)
        }
      },
    },
  }
</script>

<style lang="scss" scoped></style>
