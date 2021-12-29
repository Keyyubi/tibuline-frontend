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
        <consultant-form :consultant="newConsultant" />
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
  import { get } from 'vuex-pathify'
  import { RULES } from '@/util/globals'
  export default {
    name: 'Consultants',
    data () {
      return {
        currentTab: 'consultants',
        newConsultant: {
          email: '',
          TCKN: '',
          phone: '',
          firstname: '',
          lastname: '',
          birthday: null,
          companyId: null,
        },
        RULES,
      }
    },
    computed: {
      ...get('user', ['user']),
      ...get('app', ['responseMsg', 'isErrorMsg']),
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
          // const payload = { ...this.newConsultant }
          // this.$store.dispatch('supplier/createConsultant', payload)
          console.log('this.user', this.user)
          this.$refs.form.reset()
          this.newConsultant.companyId = this.user.companyId
          this.date = null
        }
      },
    },
  }
</script>

<style lang="scss" scoped></style>
