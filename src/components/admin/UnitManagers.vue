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
      :items="unitManagers"
      :search="searchWord"
    >
      <template v-slot:item.userName="{ item }">
        <v-dialog
          v-model="dialog"
          width="960"
          :retain-focus="false"
          offset-x
        >
          <!-- eslint-disable-next-line -->
          <template v-slot:activator="{ on, attrs }">
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
                        :rules="emailRules"
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
                        v-model="selectedUser.phone"
                        v-mask="'(###) ### ####'"
                        label="Cep Telefonu"
                        append-icon="mdi-close"
                        prepend-icon="mdi-phone"
                        :rules="phoneRules"
                        required
                        @click:append="selectedUser.phone = ''"
                      />
                    </v-col>

                    <!-- TCKN -->
                    <v-col
                      cols="12"
                      md="4"
                    >
                      <v-text-field
                        v-model="selectedUser.TCKN"
                        v-mask="'###########'"
                        label="TCKN"
                        :rules="tcnoRules"
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
      </template>
      <template v-slot:item.companyId="{ item }">
        {{ companies.find(e => e.id === item.companyId).name }}
      </template>
    </v-data-table>

    <!-- Alert Message -->
    <v-row justify="center">
      <v-alert
        v-if="responseMsg.length > 0"
        :color="isErrorMsg ? 'error' : 'success'"
        dark
        border="top"
        :icon="isErrorMsg ? 'mdi-alert' : 'mdi-check-circle'"
        transition="scale-transition"
      >
        {{ responseMsg }}
      </v-alert>
    </v-row>
  </v-card>
</template>

<script>
  import { get } from 'vuex-pathify'
  export default {
    name: 'UnitManagers',
    data () {
      return {
        valid: false,
        searchWord: '',
        dialog: false,
        selectedUser: {},
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /.+@.+/.test(v) || 'E-mail must be valid',
        ],
        phoneRules: [
          v => !!v || 'Telefon numarası girmelisiniz',
          v => (v && v.length === 14) || 'Lütfen başında 0 olmadan 10 haneli olarak giriniz.',
          v => /^(\(5.)/.test(v) || 'Telefon numarası 5 ile başlamalıdır.',
        ],
        tcnoRules: [
          v => !!v || 'T.C. Kimlik Numarası giriniz.',
          v => (v && v.length === 11) || 'Kimlik numarası 11 haneli olmalıdır.',
          v => (() => {
            if (v) {
              const arr = Array.from(v)
              let res = 0
              for (let i = 0; i < arr.length - 1; i++) {
                res += Number(arr[i])
              }
              return (res % 10) === Number(arr[arr.length - 1])
            } else return true
          })() || 'Kimlik numarası geçersiz.',
        ],
        headers: [
          {
            text: 'Kullanıcı Adı',
            align: 'start',
            value: 'userName',
          },
          { text: 'Adı', value: 'firstName' },
          { text: 'Soyadı', value: 'lastName' },
          { text: 'Şirket', value: 'companyId' },
          { text: 'Telefon', value: 'phone' },
          { text: 'Email', value: 'email' },
        ],
      }
    },
    computed: {
      ...get('app', ['responseMsg', 'isErrorMsg']),
      ...get('admin', ['companies', 'unitManagers']),
    },
    mounted () {
      this.$store.dispatch('admin/getUnitManagers')
    },
    methods: {
      seeDetails (user) {
        this.selectedUser = user
        this.dialog = true
      },
      updateUser () {
        this.$store.dispatch('admin/updateUser', this.selectedUser)
      },
    },
  }
</script>

<style lang="scss" scoped></style>
