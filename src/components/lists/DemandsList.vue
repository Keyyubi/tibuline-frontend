<template>
  <v-card>
    <v-card-title v-if="!isLoading">
      <v-text-field
        v-model="searchWord"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      />
    </v-card-title>

    <v-sheet
      v-if="isLoading"
      width="100%"
      height="400"
      class="d-flex justify-center align-center"
    >
      <v-progress-circular
        size="100"
        width="10"
        indeterminate
        color="primary"
      />
    </v-sheet>

    <v-data-table
      v-else
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

      <template v-slot:item.changable="{ item }">
        {{ getColumnLabel(item) }}
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
      <template v-slot:item.contract="{ item }">
        {{ getContractName(item) }}
      </template>
      <template v-slot:item.contract.startDate="{ item }">
        {{ getContractDate(item, 'start') }}
      </template>
      <template v-slot:item.contract.endDate="{ item }">
        {{ getContractDate(item, 'end') }}
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

    <!-- Demand Form Dialog -->
    <v-dialog
      v-model="dialog"
      width="960"
      persistent
    >
      <demand-form
        :form-type="demandFormType"
        :demand="selectedDemand"
        @close-dialog="dialog = false"
      />
    </v-dialog>
  </v-card>
</template>

<script>
  import { DEMAND_STATUS_LABELS as Labels, ROLES as Roles } from '@/util/globals'
  import { get } from 'vuex-pathify'
  export default {
    name: 'DemandsList',
    data () {
      return {
        demandFormType: 'update',
        searchWord: '',
        dialog: false,
        selectedDemand: {},
        Labels,
      }
    },
    computed: {
      ...get('user', ['user', 'users']),
      ...get('demand', ['demands', 'isLoading']),
      ...get('experienceSpan', ['experienceSpans']),
      ...get('jobTitle', ['jobTitles']),
      ...get('project', ['projects']),
      ...get('supplier', ['suppliers']),
      ...get('contract', ['contracts']),
      headers () {
        const arr = [
          {
            text: 'Talep No.',
            align: 'start',
            value: 'id',
            width: '130',
          },
          { text: 'text', value: 'changable', width: '250' },
          { text: 'Ünvan', value: 'jobTitleId', width: '200' },
          { text: 'Tecrübe', value: 'experienceSpanId', width: '120' },
          { text: 'Proje', value: 'projectId', width: '150' },
          { text: 'Sözleşme/Aday', value: 'contract', width: '200' },
          { text: 'Söz. Baş. Tar.', value: 'contract.startDate', width: '150' },
          { text: 'Söz. Bit. Tar.', value: 'contract.endDate', width: '150' },
          { text: 'Talep Durumu', value: 'demandStatus' },
        ]

        arr[1].text = this.user.roleId === Roles.UNIT_MANAGER ? 'Tedarikçi' : 'Yönetici'

        return arr
      },
    },
    mounted () {
      this.$store.dispatch('jobTitle/getJobTitles')
      this.$store.dispatch('experienceSpan/getExperienceSpans')
      if (this.user.roleId === Roles.UNIT_MANAGER) {
        this.$store.dispatch('project/getProjectsByAssignedTo')
        this.$store.dispatch('supplier/getSuppliers')
      } else if (this.user.roleId === Roles.SUPPLIER) {
        this.$store.dispatch('user/getUnitManagers')
        this.$store.dispatch('project/getProjects')
        this.$store.dispatch('consultant/getConsultants')
        this.$store.dispatch('contract/getContractsBySupplierId')
      }

      this.$store.dispatch('demand/getDemandsWithDetails', this.user.roleId)
    },
    methods: {
      showDemand (demand) {
        this.demandFormType = 'update'
        if (this.user.roleId === Roles.UNIT_MANAGER && demand.contractId) {
          this.demandFormType = 'approve'
        }
        this.selectedDemand = { ...demand }

        this.dialog = true
      },
      getColumnLabel (item) {
        try {
          if (this.user.roleId === Roles.UNIT_MANAGER) {
            const result = this.suppliers.find(supplier => supplier.id === item.supplierId)
            return result.name.slice(0, 30) + '...'
          } else if (this.user.roleId === Roles.SUPPLIER) {
            const result = this.users.find(manager => manager.id === item.createdById)
            return result.firstname + ' ' + result.lastname
          }
        } catch {
          return 'Bulunamadı'
        }
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
      getContractDate (item, type) {
        const { contract } = item
        if (contract) {
          const arr = type === 'starting' ? contract.startDate.split('T')[0].split('-') : contract.endDate.split('T')[0].split('-')
          return `${arr[2]}/${arr[1]}/${arr[0]}`
        } else {
          return ' - '
        }
      },
      getContractName (demand) {
        if (demand.contract !== null && demand.consultant !== null) {
          return demand.contract.id + ' - ' + demand.consultant.firstname + ' ' + demand.consultant.lastname
        } else {
          return ' - '
        }
      },
    },
  }
</script>

<style lang="scss" scoped></style>
