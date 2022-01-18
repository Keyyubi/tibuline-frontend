<template>
  <v-card>
    <v-card-title
      v-if="formType !== 'create'"
      class="text-h5 primary white--text"
    >
      Talep Güncelle
    </v-card-title>

    <v-card-text>
      <v-container class="py-3">
        <v-row>
          <!-- CreatedBy -->
          <v-col
            cols="12"
            md="4"
          >
            <v-select
              v-model="demand.createdById"
              :items="users"
              :item-text="e => e.firstName + ' ' + e.lastName"
              item-value="id"
              label="Yönetici"
              disabled
            />
          </v-col>

          <!-- Supplier -->
          <v-col
            v-if="user.roleId !== Roles.SUPPLIER"
            cols="12"
            md="4"
          >
            <v-select
              v-model="demand.supplierCompanyId"
              :items="companies"
              item-text="name"
              item-value="id"
              label="Tedarikçi Firma"
              :readonly="demand.demandStatus !== Statuses.CREATED"
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
              :readonly="demand.demandStatus !== Statuses.CREATED"
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
              :readonly="demand.demandStatus !== Statuses.CREATED"
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
              :readonly="demand.demandStatus !== Statuses.CREATED"
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
              :readonly="demand.demandStatus !== Statuses.CREATED"
              @change="selectTarget('projectId', demand.projectId)"
            />
          </v-col>
        </v-row>

        <!-- Budgets -->
        <v-row
          class="my-3"
          align="center"
        >
          <v-divider class="mr-3" />Bütçe Bilgileri<v-divider class="ml-3" />
        </v-row>
        <v-row v-if="demand.monthlyBudget && demand.totalBudget">
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
        </v-row>
        <v-row v-else>
          <v-col>
            <v-subheader class="px-0">
              Bütçe bilgisi bulunmuyor.
            </v-subheader>
          </v-col>
        </v-row>

        <v-row
          v-if="formType !== 'create'"
          class="my-3"
          align="center"
        >
          <v-divider class="mr-3" />Aday ve Sözleşme Bilgileri<v-divider class="ml-3" />
        </v-row>
        <v-row
          v-if="formType !== 'create'"
          class="mt-3"
        >
          <!-- Contracts -->
          <v-col
            cols="12"
            md="4"
          >
            <v-autocomplete
              v-if="user.roleId === Roles.SUPPLIER"
              v-model="demand.contractId"
              :items="contracts"
              :item-text="e => getContractName(e)"
              item-value="id"
              label="Sözleşme"
              @change="selectedContract = contracts.find(e => e.id === demand.contractId)"
            />
            <v-text-field
              v-else
              label="Sözleşme"
              :value="selectedContract ? getContractName(selectedContract) : 'Sözleşme bulunmuyor..'"
              readonly
            />
          </v-col>

          <!-- Starting Date -->
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              :value="selectedContract ? getLocaleDate(selectedContract.startDate) : 'Sözleşme seçilmedi..'"
              label="Sözleşme Başl. Tar."
              prepend-icon="mdi-calendar"
              disabled
            />
          </v-col>

          <!-- Due Date -->
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              :value="selectedContract ? getLocaleDate(selectedContract.endDate) : 'Sözleşme seçilmedi..'"
              label="Sözleşme Bit. Tar."
              prepend-icon="mdi-calendar"
              disabled
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <v-divider />

    <v-card-actions>
      <v-spacer />
      <v-btn
        v-if="formType === 'create'"
        color="primary"
        depressed
        :disabled="demand.demandStatus === Statuses.COMPLITED"
        @click="createDemand"
      >
        Oluştur
      </v-btn>
      <v-btn
        v-else
        color="primary"
        depressed
        :disabled="demand.demandStatus === Statuses.COMPLITED"
        @click="updateDemand"
      >
        {{ demand.demandStatus === Statuses.CREATED ? 'Güncelle' : (formType === 'update' ? 'Onaya Gönder' : 'Onayla') }}
      </v-btn>
      <v-btn
        color="error"
        depressed
        @click="$emit('close-dialog')"
      >
        Vazgeç
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import { DEMAND_STATUSES as Statuses, CheckIsNull, ROLE_IDS as Roles } from '@/util/globals'
  import { get } from 'vuex-pathify'
  export default {
    name: 'DemandForm',
    props: {
      formType: { type: String, default: 'create' },
      demand: { type: Object, default: null },
    },
    data: () => ({
      selectedContract: null,
      Statuses,
      Roles,
    }),
    computed: {
      ...get('user', ['user', 'users']),
      ...get('budget', ['budgets']),
      ...get('company', ['companies']),
      ...get('consultant', ['consultants']),
      ...get('contract', ['contracts']),
      ...get('costCenter', ['costCenters']),
      ...get('demand', ['demands']),
      ...get('experienceSpan', ['experienceSpans']),
      ...get('jobTitle', ['jobTitles']),
      ...get('project', ['projects']),
    },
    mounted () {
      this.$store.dispatch('user/getUnitManagers')

      if (this.formType === 'create') {
        this.demand.createdById = this.user.id
      } else if (this.formType !== 'create' && this.demand.contractId) {
        this.selectedContract = this.contracts.find(e => e.id === this.demand.contractId)
      }
    },
    methods: {
      getLocaleDate (date) {
        const arr = date.split('T')[0].split('-')
        return `${arr[2]}/${arr[1]}/${arr[0]}`
      },
      getContractName (item) {
        const consultant = this.consultants.find(e => e.id === item.consultantId)
        const res = 'Söz. No. ' + item.id + ' - ' + consultant.firstName + ' ' + consultant.lastName
        return res
      },
      moneyMask (amount) {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount)
      },
      // FormType === 'create'
      createDemand () {
        const arr = [
          this.demand.costCenterId,
          this.demand.supplierCompanyId,
          this.demand.jobTitleId,
          this.demand.experienceSpanId,
          this.demand.projectId,
        ]

        if (CheckIsNull(arr)) {
          this.$store.dispatch('app/showAlert', { message: 'Lütfen tüm alanları doldurduğunuzdan emin olunuz.', type: 'warning' })
        } else {
          this.demand.demandStatus = Statuses.CREATED
          this.$store.dispatch('demand/createDemand', this.demand)
          this.$emit('close-dialog')
        }
      },
      selectTarget (target, id) {
        switch (target) {
          case 'supplier':
            this.$store.dispatch('jobTitle/getJobTitlesByCompanyId', id)
            this.$store.dispatch('experienceSpan/getExperienceSpansByCompanyId', id)
            this.$store.dispatch('budget/getBudgetsByCompanyId', id)
            this.calculateBudget()
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
        } else {
          this.demand.monthlyBudget = 0
          this.demand.totalBudget = 0
        }
      },
      // FormType === 'update'
      updateDemand () {
        const payload = { ...this.demand }

        if (this.formType === 'approve') {
          payload.demandStatus = Statuses.COMPLITED
          this.$store.dispatch('demand/completeDemand', payload)
        } else {
          if (payload.contractId) {
            payload.demandStatus = this.selectedContract.filePath ? Statuses.REPLIED_WITH_CONTRACT : Statuses.REPLIED
          }
          this.$store.dispatch('demand/updateDemand', payload)
        }

        this.$emit('close-dialog')
      },
      compliteDemand () {

      },
    },
  }
</script>

<style lang="scss" scoped></style>
