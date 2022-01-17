<template>
  <v-container class="py-3">
    <v-row>
      <v-col
        cols="12"
        md="4"
      >
        <v-text-field
          disabled
          color="purple"
          label="Birim Müdürü"
          :value="user.firstName + ' ' + user.lastName"
        />
      </v-col>

      <!-- Supplier -->
      <v-col
        cols="12"
        md="4"
      >
        <v-select
          v-model="demand.supplierCompanyId"
          :items="companies"
          item-text="name"
          item-value="id"
          label="Tedarikçi Firma"
          @change="selectTarget('supplier', demand.supplierCompanyId)"
        />
      </v-col>

      <!-- Cost Center -->
      <v-col
        cols="12"
        md="4"
      >
        <v-select
          v-model="demand.costCenterId"
          :items="costCenters"
          item-text="name"
          item-value="id"
          label="Masraf Merkezi"
          @change="selectTarget('costCenter', demand.costCenterId)"
        />
      </v-col>

      <!-- Job Title -->
      <v-col
        cols="12"
        md="4"
      >
        <v-select
          v-model="demand.jobTitleId"
          :items="jobTitles"
          item-text="name"
          item-value="id"
          label="Ünvan"
          @change="selectTarget('jobTitle', demand.jobTitleId)"
        />
      </v-col>

      <!-- Experience -->
      <v-col
        cols="12"
        md="4"
      >
        <v-select
          v-model="demand.experienceSpanId"
          :items="experienceSpans"
          item-text="name"
          item-value="id"
          label="Tecrübe Aralığı"
          @change="selectTarget('experienceSpan', demand.experienceSpanId)"
        />
      </v-col>

      <!-- Project -->
      <v-col
        cols="6"
        md="4"
        class="text-right"
      >
        <v-select
          v-model="demand.projectId"
          :items="projects"
          item-text="name"
          item-value="id"
          label="Proje"
          @change="selectTarget('projectId', demand.projectId)"
        />
      </v-col>
    </v-row>

    <!-- Budgets -->
    <v-row>
      <v-col
        cols="6"
        md="4"
      >
        <v-subheader class="px-0">
          Aylık Bütçe: {{ moneyMask(demand.monthlyBudget) }}
        </v-subheader>
      </v-col>
      <v-col
        cols="6"
        md="4"
      >
        <v-subheader class="px-0">
          Toplam Bütçe: {{ moneyMask(demand.totalBudget) }}
        </v-subheader>
      </v-col>
      <v-spacer />
      <v-col
        cols="12"
        md="4"
        class="text-right"
      >
        <v-btn
          color="primary"
          width="100%"
          x-large
          depressed
          @click="createDemand"
        >
          Oluştur
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { DEMAND_STATUSES as Statuses } from '@/util/globals'
  import { get } from 'vuex-pathify'
  export default {
    name: 'NewDemand',
    data () {
      return {
        Statuses,
        demand: {
          createdById: null,
          costCenterId: null,
          supplierCompanyId: null,
          jobTitleId: null,
          experienceSpanId: null,
          monthlyBudget: null,
          totalBudget: null,
          projectId: null,
          demandStatus: null,
        },
      }
    },
    computed: {
      ...get('user', ['user']),
    },
    mounted () {
      this.$store.dispatch('costCenter/getCostCenters')
      this.$store.dispatch('projects/getProjects')
      this.$store.dispatch('user/getSupplierCompanies')
    },
  }
</script>

<style lang="scss" scoped></style>
