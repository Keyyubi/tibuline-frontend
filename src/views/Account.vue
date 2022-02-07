<template>
  <v-container
    id="budget-plans-view"
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

      <v-tab href="#user">
        Kullanıcı Bilgileri
        <v-icon>mdi-currency-usd</v-icon>
      </v-tab>
      <v-tab
        v-if="user.roleId === Roles.ADMIN"
        href="#company"
      >
        Şirket Bilgileri
        <v-icon>mdi-plus-box-multiple</v-icon>
      </v-tab>
    </v-tabs>

    <div class="py3" />

    <v-tabs-items v-model="currentTab">
      <v-tab-item value="user">
        <v-card>
          <v-card-text>
            <v-container class="my-4">
              <v-row>
                <!-- Username -->
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="user.username"
                    label="Kullanıcı Adı"
                    :rules="[v => !!v || 'Kullanıcı adı boş geçilemez',]"
                    @change="user.email = user.username + '@'"
                  />
                </v-col>

                <!-- Email -->
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="user.email"
                    label="E-mail"
                    :rules="Rules.EMAIL"
                  />
                </v-col>

                <!-- Password -->
                <!-- <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="user.password"
                    label="Şifre"
                    :append-icon="!showPwd ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="!showPwd ? 'password' : 'text'"
                    :rules="Rules.PASSWORD"
                    counter
                    @click:append="() => (showPwd = !showPwd)"
                  />
                </v-col> -->

                <!-- Firstname -->
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="user.firstname"
                    label="Adı"
                    :rules="[v => !!v || 'Ad boş geçilemez',]"
                  />
                </v-col>

                <!-- Lastname -->
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="user.lastname"
                    label="Soyadı"
                    :rules="[v => !!v || 'Soyad boş geçilemez',]"
                  />
                </v-col>

                <!-- Phone -->
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="user.phone"
                    v-mask="'(###) ### ####'"
                    label="Cep Telefonu"
                    append-icon="mdi-close"
                    prepend-icon="mdi-phone"
                    :rules="Rules.PHONE"
                    @click:append="user.phone = ''"
                  />
                </v-col>

                <!-- TCKN -->
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="user.tckn"
                    v-mask="'###########'"
                    label="TCKN"
                    :rules="Rules.TCNO"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn
              width="30%"
              class="white--text mr-3"
              color="primary"
              depressed
              @click="updateUser"
            >
              Güncelle
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-tab-item>

      <v-tab-item
        v-if="user.roleId === Roles.ADMIN"
        value="company"
      >
        <v-card>
          <v-card-text>
            <v-container class="py-3">
              <v-row>
                <!-- Company Name -->
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="user.company.name"
                    label="Şirket Adı"
                  />
                </v-col>

                <!-- Email -->
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="user.company.email"
                    label="E-mail"
                    :rules="Rules.EMAIL"
                  />
                </v-col>

                <!-- VKN -->
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="user.company.vkn"
                    v-mask="'##########'"
                    label="VKN"
                    :rules="Rules.VKN"
                  />
                </v-col>

                <!-- Phone -->
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="user.company.phone"
                    v-mask="'(###) ### ####'"
                    label="Cep Telefonu"
                    append-icon="mdi-close"
                    prepend-icon="mdi-phone"
                    :rules="Rules.PHONE"
                    @click:append="user.company.phone = ''"
                  />
                </v-col>

                <!-- Address -->
                <v-col cols="12">
                  <v-textarea
                    v-model="user.company.address"
                    label="Adres"
                    rows="1"
                  />
                </v-col>
              </v-row>

              <!-- Invoice and Documents info -->
              <v-row
                class="my-3"
                align="center"
              >
                <v-divider class="mr-3" />Fatura ve Dosyalama Bilgileri<v-divider class="ml-3" />
              </v-row>
              <v-row>
                <!-- DailyShiftHours -->
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="user.company.dailyShiftHours"
                    label="Günlük çalışma saati (İş günü)"
                    append-icon="mdi-clock"
                    type="number"
                    min="1"
                    max="24"
                  />
                </v-col>

                <!-- MonthlyShiftHours -->
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="user.company.monthlyShiftHours"
                    label="Aylık çalışma saati (Max.)"
                    append-icon="mdi-calendar-clock"
                    type="number"
                    min="1"
                    max="300"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn
              width="30%"
              class="white--text mr-3"
              color="primary"
              depressed
              @click="updateCompany"
            >
              Güncelle
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
  import { RULES as Rules, ROLES as Roles } from '@/util/globals'
  import { get } from 'vuex-pathify'
  export default {
    name: 'Account',
    data () {
      return {
        currentTab: 'budgets',
        searchWord: '',
        dialog: false,
        Roles,
        Rules,
      }
    },
    computed: {
      ...get('user', ['user']),
    },
    methods: {
      updateUser () {
        this.$store.dispatch('user/updateUserAccount', { ...this.user })
      },
      updateCompany () {
        this.$store.dispatch('user/updateCompany', { ...this.user.company })
      },
    },
  }
</script>

<style lang="scss" scoped></style>
