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
      :items="demands"
      :search="searchWord"
    >
      <!-- eslint-disable -->
      <template v-slot:item.id="{ item }">
        <v-chip
          class="ma-2"
          color="primary"
          dark
          @click="showDemand(item)"
        >
          <b>{{ item.id }}</b>
          <v-icon right>
            mdi-arrow-right-bold
          </v-icon>
        </v-chip>
      </template>

      <template v-slot:item.supplierCompanyId="{ item }">
        {{ getSupplierName(item.supplierCompanyId) }}
      </template>
      <template v-slot:item.jobTitleId="{ item }">
        {{ getJobTitleName(item.jobTitleId) }}
      </template>
      <template v-slot:item.experienceSpanId="{ item }">
        {{ getExperienceSpanName(item.experienceSpanId) }}
      </template>
      <template v-slot:item.projectId="{ item }">
        {{ getProjectName(item.projectId) }}
      </template>
      <template v-slot:item.consultantId="{ item }">
        {{ getConsultantName(item.consultantId) }}
      </template>

      <template v-slot:item.demandStatus="{ item }">
        <v-chip
          :color="item.demandStatus === 0 ? 'orange' : 'green'"
          dark
        >
          {{ Labels[item.demandStatus] }}
        </v-chip>
      </template>
    </v-data-table>
    <v-dialog
      v-model="dialog"
      width="960"
      persistent
    >
      <demand-form
        :formType="demandFormType"
        :demand="selectedDemand"
        @close-dialog="closeDialog()"
      />
    </v-dialog>
  </v-card>
</template>

<script>
  import { DEMAND_STATUSES as Statuses, DEMAND_STATUS_LABELS as Labels } from '@/util/globals'
  import { get } from 'vuex-pathify'
  export default {
    name: 'AllDemands',
    data () {
      return {
        demandFormType: 'update',
        searchWord: '',
        contract: null,
        dialog: false,
        selectedDemand: {},
        Statuses,
        Labels,
        headers: [
          {
            text: 'Talep No.',
            align: 'start',
            value: 'id',
          },
          { text: 'Tedarikçi', value: 'supplierCompanyId' },
          { text: 'Ünvan', value: 'jobTitleId' },
          { text: 'Tecrübe Aralığı', value: 'experienceSpanId' },
          { text: 'Proje', value: 'projectId' },
          { text: 'Talep Durumu', value: 'demandStatus' },
        ],
      }
    },
    computed: {
      ...get('user', ['user']),
      ...get('demand', ['demands']),
      ...get('experienceSpan', ['experienceSpans']),
      ...get('jobTitle', ['jobTitles']),
      ...get('project', ['projects']),
      ...get('company', ['companies']),
      ...get('contract', ['contracts']),
    },
    mounted () {
      this.$store.dispatch('company/getSupplierCompanies')
      this.$store.dispatch('costCenter/getCostCenters') // For Demand-Form
      this.$store.dispatch('jobTitle/getJobTitles')
      this.$store.dispatch('experienceSpan/getExperienceSpans')
      this.$store.dispatch('project/getProjectsByAssignedTo')
      this.$store.dispatch('demand/getDemandsByCreatedBy')
    },
    methods: {
      sleep (ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
      },
      async showDemand (demand) {
        this.$store.dispatch('demand/getDemandDetailsForManager', demand)
        this.demandFormType = demand.contractId ? 'approve' : 'update'
        this.selectedDemand = { ...demand }

        this.dialog = true
      },
      closeDialog () {
        this.$store.dispatch('jobTitle/getJobTitles')
        this.$store.dispatch('experienceSpan/getExperienceSpans')
        this.dialog = false
      },
      getSupplierName (id) {
        if (id && this.companies && this.companies.length > 0) {
          const result = this.companies.find(supplier => supplier.id === id)
          return result ? result.name : 'Bulunamadı'
        } else return 'Bulunamadı'
      },
      getProjectName (id) {
        if (id && this.projects && this.projects.length > 0) {
          const result = this.projects.find(project => project.id === id)
          return result ? result.name : 'Bulunamadı'
        } else return 'Bulunamadı'
      },
      getJobTitleName (id) {
        if (id && this.jobTitles && this.jobTitles.length > 0) {
          const result = this.jobTitles.find(jobTitle => jobTitle.id === id)
          return result ? result.name : 'Bulunamadı'
        } else return 'Bulunamadı'
      },
      getExperienceSpanName (id) {
        if (id && this.experienceSpans && this.experienceSpans.length > 0) {
          const result = this.experienceSpans.find(experienceSpan => experienceSpan.id === id)
          return result ? result.name : 'Bulunamadı'
        } else return 'Bulunamadı'
      },
    },
  }
</script>

<style lang="scss" scoped></style>
