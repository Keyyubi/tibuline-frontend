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
        <user-form
          form-type="create"
          :user="newUser"
        />
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
  import { get } from 'vuex-pathify'
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
      }
    },
    computed: {
      ...get('user', ['user']),
    },
    mounted () {
      this.$store.dispatch('user/getUnitManagers')
    },
    methods: {
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
