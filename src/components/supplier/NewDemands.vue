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

      <!-- eslint-disable -->
      <template v-slot:item.demandStatus="{ item }">
        <v-chip
          :color="item.demandStatus === 0 ? 'orange' : 'green'"
          dark
        >
          {{ Labels[item.demandStatus] }}
        </v-chip>
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

    <!-- Demand Form Dialog -->
    <v-dialog
      v-model="dialog"
      width="960"
      persistent
    >
      <demand-form
        form-type="update"
        :demand="selectedDemand"
        @close-dialog="dialog = false"
      />
    </v-dialog>
  </v-card>
</template>

<script>
  import { DEMAND_STATUS_LABELS as Labels } from '@/util/globals'
  import { get } from 'vuex-pathify'
  export default {
    name: 'NewDemands',
    data () {
      return {
        searchWord: '',
        dialog: false,
        selectedDemand: {},
        Labels,
        headers: [
          {
            text: 'Talep No.',
            align: 'start',
            value: 'id',
          },
          { text: 'Ünvan', value: 'jobTitleId' },
          { text: 'Tecrübe Aralığı', value: 'experienceSpanId' },
          { text: 'Proje', value: 'projectId' },
          { text: 'Aday', value: 'consultantId' },
          { text: 'Talep Durumu', value: 'demandStatus' },
        ],
      }
    },
    computed: {
      ...get('user', ['user', 'users']),
      ...get('costCenter', ['costCenters']),
      ...get('project', ['projects']),
      ...get('demand', ['demands']),
      ...get('experienceSpan', ['experienceSpans']),
      ...get('jobTitle', ['jobTitles']),
      ...get('consultant', ['consultants']),
    },
    mounted () {
      this.$store.dispatch('costCenter/getCostCenters')
      this.$store.dispatch('project/getProjects')
      this.$store.dispatch('jobTitle/getJobTitles')
      this.$store.dispatch('experienceSpan/getExperienceSpans')
      this.$store.dispatch('demand/getDemandsBySupplierCompany')
      this.$store.dispatch('consultant/getConsultants')
      this.$store.dispatch('user/getUnitManagers')
      this.$store.dispatch('contract/getContracts')
    },
    methods: {
      getConsultantName (id) {
        if (id) {
          const result = this.consultants.find(consultant => consultant.id === id)
          return result ? result.firstname + ' ' + result.lastname : 'Bulunamadı'
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
      getLocaleDate (date) {
        const arr = date.split('T')[0].split('-')
        return `${arr[2]}/${arr[1]}/${arr[0]}`
      },
      showDemand (item) {
        this.selectedDemand = { ...item }
        this.dialog = true
      },
    },
  }
</script>

<style lang="scss" scoped></style>
