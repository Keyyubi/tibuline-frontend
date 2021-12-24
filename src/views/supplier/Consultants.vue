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

      <v-tab href="#consultants">
        Danışmanlar
        <v-icon>mdi-account-multiple</v-icon>
      </v-tab>

      <v-tab href="#newConsultant">
        Yeni Danışman
        <v-icon>mdi-account-plus</v-icon>
      </v-tab>
    </v-tabs>

    <div class="py3" />

    <v-tabs-items v-model="currentTab">
      <v-tab-item value="consultants">
        <unit-managers />
      </v-tab-item>

      <v-tab-item value="newConsultant">
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-container class="py-3">
            <v-row>
              <!-- Firstname -->
              <v-col
                cols="12"
                md="4"
              >
                <v-text-field
                  v-model="newConsultant.firstName"
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
                  v-model="newConsultant.lastName"
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
                  v-model="newConsultant.phone"
                  v-mask="'(###) ### ####'"
                  label="Cep Telefonu"
                  append-icon="mdi-close"
                  prepend-icon="mdi-phone"
                  :rules="phoneRules"
                  required
                  @click:append="newConsultant.phone = ''"
                />
              </v-col>

              <!-- Email -->
              <v-col
                cols="12"
                md="4"
              >
                <v-text-field
                  v-model="newConsultant.email"
                  label="E-mail"
                  :rules="emailRules"
                  required
                />
              </v-col>

              <!-- TCKN -->
              <v-col
                cols="12"
                md="4"
              >
                <v-text-field
                  v-model="newConsultant.TCKN"
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
                  v-model="newConsultant.companyId"
                  :items="companies"
                  item-text="label"
                  item-value="value"
                  label="Şirket"
                  :rules="[v => (!!v || v === 0) || 'Şirket seçmelisiniz']"
                  required
                />
              </v-col>

              <!-- Actions -->
              <v-col cols="6">
                <v-btn
                  color="warning"
                  width="100%"
                  depressed
                  outlined
                  @click="reset()"
                >
                  Formu Temizle
                </v-btn>
              </v-col>
              <v-col
                cols="6"
                class="text-right"
              >
                <v-btn
                  color="primary"
                  width="100%"
                  depressed
                  @click="createUser()"
                >
                  Oluştur
                </v-btn>
              </v-col>
            </v-row>

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
          </v-container>
        </v-form>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
  import { get } from 'vuex-pathify'
  export default {
    name: 'Consultants',
    data () {
      return {
        currentTab: 'users',
        valid: true,
        showPwd: true,
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /.+@.+/.test(v) || 'E-mail must be valid',
        ],
        passwordRules: [
          v => !!v || 'Şifre boş geçilemez',
          v =>
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*\\+\\.])(?=.{8,})/.test(v) ||
            'Şifre en az 8 karakter olup, büyük harf, küçük harf, rakam ve özel karakter içermelidir!',
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
            const arr = Array.from(v)
            let res = 0
            for (let i = 0; i < arr.length - 1; i++) {
              res += Number(arr[i])
            }
            return (res % 10) === Number(arr[arr.length - 1])
          })() || 'Kimlik numarası geçersiz.',
        ],
        newConsultant: {
          username: '',
          email: '',
          password: '',
          TCKN: '',
          phoneNumber: '',
          firstname: '',
          lastname: '',
          roleId: null,
          companyId: null,
        },
        roles: [
          { label: 'Tam yetkili', value: 99 },
          { label: 'Sistem yöneticisi', value: 0 },
          { label: 'Birim Müdürü', value: 1 },
          { label: 'Tedarikçi', value: 2 },
        ],
        companies: [
          { label: 'Tibula', value: 99 },
          { label: 'Garanti', value: 0 },
          { label: 'Akbank', value: 1 },
          { label: 'Mafre', value: 2 },
        ],
      }
    },
    computed: {
      ...get('user', ['user']),
      ...get('app', ['responseMsg', 'isErrorMsg']),
    },
    methods: {
      reset () {
        this.$refs.form.reset()
      },
      editRequest (id) {
        console.log('id', id)
      },
      showRequest (request) {
        this.selectedRequest = request
        this.selectedManager = request.unitManager.fullName
        this.dialog = true
      },
      createUser () {
        if (this.$refs.form.validate()) {
          this.$store.dispatch('admin/createUser', this.newConsultant)
        }
      },
    },
  }
</script>

<style lang="scss" scoped></style>
