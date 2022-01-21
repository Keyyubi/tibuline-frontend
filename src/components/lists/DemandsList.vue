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
  import {
    DEMAND_STATUSES as Statuses,
    DEMAND_STATUS_LABELS as Labels,
    ROLE_IDS as Roles,
  } from '@/util/globals'
  import { get } from 'vuex-pathify'
  export default {
    name: 'ConsultantsList',
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
          { text: 'Sözleşme', value: 'contractId' },
          { text: 'Baş. Tar.', value: 'consultantId' },
          { text: 'Bit. Tar.', value: 'consultantId' },
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
      this.$store.dispatch('demand/getDemands')
      this.$store.dispatch('contract/getContracts')

      // Only For UnitManager side
      this.$store.dispatch('project/getProjectsByAssignedTo')

      // Only For Supplier side
      this.$store.dispatch('project/getProjectsById')
      this.$store.dispatch('demand/getDemandsByCompanyId')
      this.$store.dispatch('user/getUnitManagers')
      this.$store.dispatch('consultant/getConsultants')

      this.$store.dispatch('contract/getContracts')
    },
    methods: {
      async showDemand (demand) {
        if (this.user.roleId === Roles.UNIT_MANAGER) {
          this.$store.dispatch('jobTitle/getJobTitlesByCompanyId', demand.supplierCompanyId)
          this.$store.dispatch('experienceSpan/getExperienceSpansByCompanyId', demand.supplierCompanyId)
          this.$store.dispatch('budget/getBudgetsByCompanyId', demand.supplierCompanyId)

          await this.sleep(250)

          const contract = this.contracts.find(e => e.id === demand.contractId)
          if (contract) this.$store.dispatch('consultant/getConsultantById', contract.consultantId)
          this.demandFormType = demand.contractId ? 'approve' : 'update'
          this.selectedDemand = { ...demand }
        }
        this.dialog = true
      },
      getConsultantName (id) {
        if (id) {
          const result = this.consultants.find(consultant => consultant.id === id)
          return result ? result.firstName + ' ' + result.lastName : 'Bulunamadı'
        } else return 'Bulunamadı'
      },
      getProjectName (id) {
        if (id) {
          const result = this.projects.find(project => project.id === id)
          return result ? result.name : 'Bulunamadı'
        } else return 'Bulunamadı'
      },
      getJobTitleName (id) {
        if (id) {
          const result = this.jobTitles.find(jobTitle => jobTitle.id === id)
          return result ? result.name : 'Bulunamadı'
        } else return 'Bulunamadı'
      },
      getExperienceSpanName (id) {
        if (id) {
          const result = this.experienceSpans.find(experienceSpan => experienceSpan.id === id)
          return result ? result.name : 'Bulunamadı'
        } else return 'Bulunamadı'
      },
      getContractName (item) {
        const consultant = this.consultants.find(e => e.id === item.consultantId)
        const res = 'Söz. No. ' + item.id + ' - ' + consultant.firstName + ' ' + consultant.lastName
        return res
      },
      getLocaleDate (date) {
        const arr = date.split('T')[0].split('-')
        return `${arr[2]}/${arr[1]}/${arr[0]}`
      },
      getUnitManagerName (id) {
        if (this.user.roleId === Roles.UNIT_MANAGER) {
          return this.user.firstName + ' ' + this.user.lastName
        } else {
          const user = this.users.find(e => e.id === id)
          return user ? user.firstName + ' ' + user.lastName : 'İsim bulunamadı.'
        }
      },
      getContractStartDate (id) {
        const contract = this.contracts.find(e => e.id === id)
        return contract ? contract.name : 'Proje bulunmuyor.'
      },
      getContractEndDate (id) {
        const project = this.projects.find(e => e.id === id)
        return project ? project.name : 'Proje bulunmuyor.'
      },
    },
  }
</script>

<style lang="scss" scoped></style>
