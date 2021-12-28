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
        <supplier-consultants />
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

              <!-- Company -->
              <v-col
                cols="12"
                md="4"
              >
                <v-select
                  v-model="newConsultant.companyId"
                  :items="[user.company]"
                  item-text="name"
                  item-value="id"
                  label="Şirket"
                  disabled
                  required
                />
              </v-col>

              <!-- Phone -->
              <v-col
                cols="12"
                md="3"
              >
                <v-text-field
                  v-model="newConsultant.phone"
                  v-mask="'(###) ### ####'"
                  label="Cep Telefonu"
                  append-icon="mdi-close"
                  prepend-icon="mdi-phone"
                  :rules="rules.phoneRules"
                  required
                  @click:append="newConsultant.phone = ''"
                />
              </v-col>

              <!-- Email -->
              <v-col
                cols="12"
                md="3"
              >
                <v-text-field
                  v-model="newConsultant.email"
                  label="E-mail"
                  :rules="rules.emailRules"
                  required
                />
              </v-col>

              <!-- Birthday -->
              <v-col
                cols="12"
                md="3"
              >
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="localeDate"
                      label="Doğum Günü"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="date"
                    :max="`${new Date().getFullYear()}-12-31`"
                    min="1950-01-01"
                    @input="menu = false"
                    @change="save"
                  />
                </v-menu>
              </v-col>

              <!-- TCKN -->
              <v-col
                cols="12"
                md="3"
              >
                <v-text-field
                  v-model="newConsultant.TCKN"
                  v-mask="'###########'"
                  label="TCKN"
                  :rules="rules.tcnoRules"
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
                  @click="createConsultant()"
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
        currentTab: 'consultants',
        valid: true,
        menu: false,
        date: null,
        localeDate: null,
        newConsultant: {
          email: '',
          TCKN: '',
          phone: '',
          firstname: '',
          lastname: '',
          birthday: null,
          companyId: null,
        },
      }
    },
    computed: {
      ...get('user', ['user']),
      ...get('app', ['responseMsg', 'isErrorMsg', 'rules']),
    },
    mounted () {
      this.newConsultant.companyId = this.user.companyId
    },
    methods: {
      save (date) {
        const arr = date.split('-')
        this.localeDate = `${arr[2]}/${arr[1]}/${arr[0]}`
        this.newConsultant.birthday = new Date(date).toISOString()
        this.$refs.menu.save(date)
      },
      reset () {
        this.$refs.form.reset()
      },
      createConsultant () {
        if (this.$refs.form.validate()) {
          console.log('ok')
          const payload = { ...this.newConsultant }
          console.log('ok2')
          this.$store.dispatch('supplier/createConsultant', payload)
          this.reset()
        }
      },
    },
  }
</script>

<style lang="scss" scoped></style>
