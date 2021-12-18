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
        <unit-managers />
      </v-tab-item>

      <v-tab-item value="suppliers">
        <suppliers />
      </v-tab-item>

      <v-tab-item value="newUser">
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-container class="py-3">
            <v-row>
              <!-- Email -->
              <v-col
                cols="12"
                md="4"
              >
                <v-text-field
                  v-model="newUser.email"
                  label="E-mail"
                  :rules="emailRules"
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
                  :rules="passwordRules"
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
                <v-radio-group
                  v-model="newUser.roleId"
                  messages="Kullanıcı Rolü"
                  row
                  :rules="[v => !!v || 'Rol seçmelisiniz']"
                  required
                >
                  <v-radio
                    label="Birim Müdürü"
                    :value="roles.UNIT_MANAGER"
                  />
                  <v-radio
                    label="Tedarikçi"
                    :value="roles.SUPPLIER"
                  />
                </v-radio-group>
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
  import { ROLE_IDS } from '@/util/globals'
  export default {
    name: 'Users',
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
        newUser: {
          email: '',
          password: '',
          firstname: '',
          lastname: '',
          roleId: null,
        },
        roles: { ...ROLE_IDS },
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
          this.$store.dispatch('admin/createUser', this.newUser)
        }
      },
    },
  }
</script>

<style lang="scss" scoped></style>
