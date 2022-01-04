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

    <!-- Alert Message -->
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
</template>

<script>
  import { get } from 'vuex-pathify'
  export default {
    name: 'NewDemand',
    data () {
      return {
        popup: null,
        monthlyBudget: '',
        totalBudget: '',
        demand: {
          createdById: null,
          costCenterId: 0,
          supplierCompanyId: 0,
          jobTitleId: 0,
          experienceSpanId: 0,
          monthlyBudget: 0,
          totalBudget: 0,
          projectId: 0,
          demandStatus: 0,
        },
      }
    },
    computed: {
      ...get('user', ['user']),
      ...get('app', ['responseMsg', 'isErrorMsg']),
      ...get('manager', ['costCenters', 'experienceSpans', 'jobTitles', 'projects', 'companies', 'budgets']),
    },
    mounted () {
      this.$store.dispatch('manager/getCostCenters')
      this.$store.dispatch('manager/getProjects')
      this.$store.dispatch('manager/getSupplierCompanies')
      this.demand.createdById = this.user.id
    },
    methods: {
      createDemand () {
        const fields = ['costCenterId', 'supplierCompanyId', 'jobTitleId', 'experienceSpanId', 'projectId']
        let isFilled = true
        fields.forEach(e => {
          if (isFilled && isFilled !== 0) {
            isFilled = this.demand[e]
          } else isFilled = false
        })

        if (!isFilled) {
          this.$store.dispatch('app/updateAlertMsg', { message: 'Lütfen tüm alanları doldurduğunuzdan emin olunuz.', isError: true })
        } else {
          this.$store.dispatch('manager/createDemand', this.demand)
        }
      },
      selectTarget (target, id) {
        switch (target) {
          case 'supplier':
            this.$store.dispatch('manager/getJobTitles', id)
            this.$store.dispatch('manager/getExperienceSpans', id)
            this.$store.dispatch('manager/getBudgetPlans', id)
            break
          case 'jobTitle':
            this.calculateBudget()
            break
          case 'experienceSpan':
            this.calculateBudget()
            break
          default:
            break
        }
      },
      calculateBudget () {
        if (this.demand.supplierCompanyId && this.demand.jobTitleId && this.demand.experienceSpanId) {
          const budget = this.budgets.find(e => {
            return e.experienceSpanId === this.demand.experienceSpanId && e.jobTitleId === this.demand.jobTitleId
          })
          if (budget) {
            this.demand.monthlyBudget = budget.monthlyBudget
            this.demand.totalBudget = budget.totalBudget
          } else {
            this.demand.monthlyBudget = 0
            this.demand.totalBudget = 0
          }
        }
      },
      moneyMask (amount) {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount)
      },
    },
  }
</script>

<style lang="scss" scoped></style>
