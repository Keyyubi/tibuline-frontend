<template>
  <v-container
    id="users-view"
    fluid
    tag="section"
  >
    <v-tabs
      v-model="currentTab"
      background-color="primary"
      centered
      dark
      icons-and-text
      @change="changeTab"
    >
      <v-tabs-slider />

      <v-tab href="#managers">
        Birim Müdürleri
        <v-icon>mdi-account-multiple</v-icon>
      </v-tab>

      <v-tab href="#suppliers">
        Tedarikçiler
        <v-icon>mdi-account-multiple-plus-outline</v-icon>
      </v-tab>

      <v-tab href="#newUser">
        Yeni Kullanıcı
        <v-icon>mdi-account-plus</v-icon>
      </v-tab>
    </v-tabs>

    <div class="py3" />

    <v-tabs-items v-model="currentTab">
      <v-tab-item value="managers">
        <users-list role="unitManagers" />
      </v-tab-item>

      <v-tab-item value="suppliers">
        <users-list role="suppliers" />
      </v-tab-item>

      <v-tab-item value="newUser">
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-container class="my-4">
            <v-row>
              <!-- Username -->
              <v-col
                cols="12"
                md="4"
              >
                <v-text-field
                  v-model="newUser.username"
                  label="Kullanıcı Adı"
                  :rules="[v => !!v || 'Kullanıcı adı boş geçilemez',]"
                  required
                  @change="newUser.email = newUser.username + '@'"
                />
              </v-col>

              <!-- Email -->
              <v-col
                cols="12"
                md="4"
              >
                <v-text-field
                  v-model="newUser.email"
                  label="E-mail"
                  :rules="RULES.EMAIL"
                  required
                />
              </v-col>

              <!-- Password -->
              <v-col
                cols="12"
                md="4"
              >
                <v-text-field
                  v-model="newUser.password"
                  label="Şifre"
                  :append-icon="!showPwd ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="!showPwd ? 'password' : 'text'"
                  :rules="RULES.PASSWORD"
                  counter
                  required
                  @click:append="() => (showPwd = !showPwd)"
                />
              </v-col>

              <!-- Role -->
              <v-col
                cols="12"
                md="4"
              >
                <v-select
                  v-model="newUser.roleId"
                  :items="roles"
                  item-text="label"
                  item-value="value"
                  label="Kullanıcı Rolü"
                  :rules="[v => (!!v || v === 0) || 'Rol seçmelisiniz']"
                  required
                />
              </v-col>

              <!-- Firstname -->
              <v-col
                cols="12"
                md="4"
              >
                <v-text-field
                  v-model="newUser.firstName"
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
                  v-model="newUser.lastName"
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
                  v-model="newUser.phone"
                  v-mask="'(###) ### ####'"
                  label="Cep Telefonu"
                  append-icon="mdi-close"
                  prepend-icon="mdi-phone"
                  :rules="RULES.PHONE"
                  required
                  @click:append="newUser.phone = ''"
                />
              </v-col>

              <!-- TCKN -->
              <v-col
                cols="12"
                md="4"
              >
                <v-text-field
                  v-model="newUser.TCKN"
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
                  v-model="newUser.companyId"
                  :items="companies.filter(e => e.isSupplier === (newUser.roleId === 2))"
                  item-text="name"
                  item-value="id"
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
          </v-container>
        </v-form>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
  import { get } from 'vuex-pathify'
  import { RULES } from '@/util/globals'
  export default {
    name: 'Users',
    data () {
      return {
        currentTab: 'managers',
        valid: true,
        showPwd: true,
        newUser: {
          username: '',
          email: '',
          password: '',
          TCKN: '',
          phone: '',
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
        RULES,
      }
    },
    computed: {
      ...get('user', ['user']),
      ...get('company', ['companies']),
    },
    mounted () {
      this.$store.dispatch('company/getCompanies')
      this.$store.dispatch('user/getUnitManagers')
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
          const payload = { ...this.newUser }
          this.$store.dispatch('user/createUser', payload)
          this.reset()
        }
      },
      changeTab () {
        if (this.currentTab === 'suppliers') {
          this.$store.dispatch('user/getSuppliers')
        } else {
          this.$store.dispatch('user/getUnitManagers')
        }
      },
    },
  }
</script>

<style lang="scss" scoped></style>
