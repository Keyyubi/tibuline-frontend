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
              v-if="user.roleId === Roles.SUPPLIER"
              v-model="demand.createdById"
              :items="users"
              :item-text="e => e.firstname + ' ' + e.lastname"
              item-value="id"
              label="Yönetici"
              disabled
            />
            <v-text-field
              v-else
              :value="user.firstname + ' ' + user.lastname"
              label="Yönetici"
              disabled
            />
          </v-col>

          <!-- Supplier -->
          <v-col
            cols="12"
            md="4"
          >
            <v-select
              v-if="user.roleId !== Roles.SUPPLIER"
              v-model="demand.supplierId"
              :items="suppliers"
              item-text="name"
              item-value="id"
              label="Tedarikçi Firma"
              @change="selectTarget('supplier', demand.supplierId)"
            />
            <v-text-field
              v-else
              :value="user.company.name"
              label="Tedarikçi Firma"
              disabled
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
              v-model="demand.experienceId"
              :items="experiences"
              item-text="name"
              item-value="id"
              label="Tecrübe Aralığı"
              @change="selectTarget('experience', demand.experienceId)"
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

        <!-- Consultant and Contract Info -->
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
              :items="filteredContracts"
              item-text="name"
              item-value="id"
              label="Sözleşme"
            />
            <v-text-field
              v-else
              label="Sözleşme"
              :value="demand.contract.name"
              readonly
            />
          </v-col>

          <!-- Starting Date -->
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              :value="getContractDate('starting')"
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
              :value="getContractDate()"
              label="Sözleşme Bit. Tar."
              prepend-icon="mdi-calendar"
              disabled
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <v-divider />

    <!-- Actions -->
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
  import { DEMAND_STATUSES as Statuses, ROLES as Roles, CONTRACT_STATUSES as cStatuses } from '@/util/globals'
  import { CheckIsNull } from '@/util/helpers'
  import { get } from 'vuex-pathify'
  export default {
    name: 'DemandForm',
    props: {
      formType: { type: String, default: 'create' },
      demand: { type: Object, default: null },
    },
    data: () => ({
      Statuses,
      cStatuses,
      Roles,
    }),
    computed: {
      ...get('user', ['user', 'users']),
      ...get('budget', ['budgets']),
      ...get('supplier', ['suppliers']),
      ...get('consultant', ['consultants']),
      ...get('contract', ['contracts']),
      ...get('costCenter', ['costCenters']),
      ...get('experience', ['experiences']),
      ...get('jobTitle', ['jobTitles']),
      ...get('project', ['projects']),
      filteredContracts () {
        const arr = this.contracts.filter(e => e.contractStatus !== cStatuses.IN_USE)
        if (this.demand.contractId) {
          const first = this.contracts.find(e => e.id === this.demand.contractId)

          if (first) {
            arr.unshift(first)
          }
        }

        return arr
      },
    },
    mounted () {
      this.$store.dispatch('costCenter/getCostCenters')
      this.$store.dispatch('jobTitle/getJobTitles')
      this.$store.dispatch('experience/getExperiences')

      if (this.formType === 'create') {
        this.demand.createdById = this.user.id
      } else if (this.user.roleId === Roles.SUPPLIER) {
        this.$store.dispatch('user/getUnitManagers')
      }
    },
    methods: {
      getContractDate (type) {
        const contract = (this.user.roleId === Roles.UNIT_MANAGER && this.demand.contractId)
          ? this.demand.contract : this.contracts.find(e => e.id === this.demand.contractId)

        if (contract) {
          const arr = type === 'starting' ? contract.startDate.split('T')[0].split('-') : contract.endDate.split('T')[0].split('-')
          return `${arr[2]}/${arr[1]}/${arr[0]}`
        } else {
          return 'Sözleşme bulunmuyor.'
        }
      },
      moneyMask (amount) {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount)
      },
      // FormType === 'create'
      createDemand () {
        const arr = [
          this.demand.costCenterId,
          this.demand.supplierId,
          this.demand.jobTitleId,
          this.demand.experienceId,
          this.demand.projectId,
        ]

        if (!CheckIsNull(arr)) {
          this.demand.demandStatus = Statuses.CREATED
          this.$store.dispatch('demand/createDemand', this.demand)
          this.$emit('close-dialog')
        } else {
          this.$store.dispatch('app/showAlert', { message: 'Lütfen tüm alanları doldurduğunuzdan emin olunuz.', type: 'warning' })
        }
      },
      selectTarget (target, id) {
        switch (target) {
          case 'supplier':
            this.$store.dispatch('budget/getBudgetsBySupplierId', id)
            this.calculateBudget()
            break
          case 'jobTitle':
            this.calculateBudget()
            break
          case 'experience':
            this.calculateBudget()
            break
          default:
            break
        }
      },
      calculateBudget () {
        if (this.demand.supplierId && this.demand.jobTitleId && this.demand.experienceId) {
          const budget = this.budgets.find(e => {
            return e.experienceId === this.demand.experienceId && e.jobTitleId === this.demand.jobTitleId
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
        payload.olderContractId = payload.olderContractId || -1

        if (this.formType === 'approve') {
          payload.demandStatus = Statuses.COMPLITED
        } else if (this.user.roleId === Roles.SUPPLIER && payload.contractId) {
          payload.demandStatus = Statuses.REPLIED
        }

        this.$store.dispatch('demand/updateDemand', payload)
        this.$emit('close-dialog')
      },
    },
  }
</script>

<style lang="scss" scoped></style>
