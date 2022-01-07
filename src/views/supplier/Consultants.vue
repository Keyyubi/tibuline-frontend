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

    <!-- Alert Message -->
    <v-row
      v-if="responseMsg.length > 0"
      justify="center"
    >
      <v-alert
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
          firstName: '',
          lastName: '',
          birthday: null,
          email: '',
          phone: '',
          tckn: '',
          isActive: true,
          projectId: 0,
          unitManagerUserId: '',
          contractId: 0,
          companyId: 0,
          jobTitleId: 0,
          experienceSpanId: 0,
        },
        RULES,
      }
    },
    computed: {
      ...get('user', ['user']),
      ...get('app', ['responseMsg', 'isErrorMsg']),
    },
  }
</script>

<style lang="scss" scoped></style>
