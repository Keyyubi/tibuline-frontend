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
          {{ DEMAND_STATUSES.find(e => e.status === item.demandStatus).label }}
        </v-chip>
      </template>
    </v-data-table>
    <v-dialog
      v-model="dialog"
      width="960"
      persistent
    >
      <v-card>
        <v-card-title class="text-h5 primary white--text">
          Talep Detayları
        </v-card-title>

        <v-card-text>
          <v-container class="py-3">
            <v-row>
              <v-col
                cols="12"
                md="4"
              >
                <v-text-field
                  disabled
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
                  v-model="selectedDemand.supplierCompanyId"
                  :items="companies"
                  item-text="name"
                  item-value="id"
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
                  v-model="selectedDemand.costCenterId"
                  :items="costCenters"
                  item-text="name"
                  item-value="id"
                  label="Masraf Merkezi"
                />
              </v-col>

              <!-- Job Title -->
              <v-col
                cols="12"
                md="4"
              >
                <v-select
                  v-model="selectedDemand.jobTitleId"
                  :items="jobTitles"
                  item-text="name"
                  item-value="id"
                  label="Ünvan"
                />
              </v-col>

              <!-- Experience -->
              <v-col
                cols="12"
                md="4"
              >
                <v-select
                  v-model="selectedDemand.experienceSpanId"
                  :items="experienceSpans"
                  item-text="name"
                  item-value="id"
                  label="Tecrübe Aralığı"
                />
              </v-col>

              <!-- Project -->
              <v-col
                cols="6"
                md="4"
                class="text-right"
              >
                <v-select
                  v-model="selectedDemand.projectId"
                  :items="projects"
                  item-text="name"
                  item-value="id"
                  label="Proje"
                />
              </v-col>

              <!-- Monthly Budget -->
              <v-col
                cols="12"
                md="4"
              >
                <v-text-field
                  color="purple"
                  disabled
                  label="Aylık Bütçe"
                  type="number"
                  :value="selectedDemand.monthlyBudget"
                />
              </v-col>

              <!-- Total Budget -->
              <v-col
                cols="12"
                md="4"
              >
                <v-text-field
                  color="purple"
                  disabled
                  label="Toplam Bütçe"
                  type="number"
                  :value="selectedDemand.totalBudget"
                />
              </v-col>

              <!-- Starting Date -->
              <!-- <v-col
                cols="12"
                md="4"
              >
                <v-menu
                  ref="menu1"
                  v-model="selectedDemand.menu1"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="selectedDemand.startingDate"
                      label="Başlangıç Tarihi"
                      persistent-hint
                      prepend-icon="mdi-calendar"
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="selectedDemand.startingDate"
                    no-title
                    @input="menu1 = false"
                  />
                </v-menu>
              </v-col> -->

              <!-- Due Date -->
              <!-- <v-col
                cols="12"
                md="4"
              >
                <v-menu
                  ref="menu2"
                  v-model="menu2"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="selectedDemand.endingDate"
                      label="Bitiş Tarihi"
                      persistent-hint
                      prepend-icon="mdi-calendar"
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="selectedDemand.endingDate"
                    no-title
                    @input="menu2 = false"
                  />
                </v-menu>
              </v-col> -->
            </v-row>

            <v-row align="center">
              <v-divider class="mr-3" />Aday ve Sözleşme Bilgileri<v-divider class="ml-3" />
            </v-row>
            <v-row
              v-if="selectedDemand.consultantId && selectedDemand.consultantId > 0"
              class="mt-3"
            >
              <v-col
                cols="12"
                md="4"
              >
                <v-select
                  v-model="selectedDemand.consultantId"
                  :items="[demandedConsultant]"
                  :item-text="e => e.firstName + ' ' + e.lastName"
                  item-value="id"
                  label="Aday"
                  readonly
                />
              </v-col>
              <!-- Contract -1 -->
              <v-col
                cols="12"
                md="4"
              >
                <v-autocomplete
                  v-model="selectedDemand.contractId"
                  :items="contracts.filter(e => e.supplierCompanyId === selectedDemand.supplierCompanyId)"
                  :item-text="e => 'Talep No. - ' + e.orderNumber"
                  item-value="id"
                  append-icon="mdi-eye"
                  @click:append="openContract"
                  label="Sözleşme"
                />
              </v-col>
              <!-- Contract - 2 -->
              <v-col
                cols="12"
                md="4"
              >
                <v-text-field
                  label="İmzalı Sözleşme"
                  :value="demandedConsultant.contractFilePath || 'İmzalı sözleşme bulunmuyor'"
                  append-icon="mdi-eye"
                  @click:append="openSignedContract"
                  readonly
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            depressed
            :disabled="selectedDemand.demandStatus === DEMAND_STATUSES.find(e => e.key === 'COMPLITED').status"
            @click="updateDemand"
          >
            {{ selectedDemand.demandStatus === DEMAND_STATUSES.find(e => e.key === 'APPROVED').status ? 'Tamamla' : 'Güncelle'}}
          </v-btn>
          <v-btn
            color="error"
            depressed
            @click="closeDialog"
          >
            Vazgeç
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
  import { DEMAND_STATUSES } from '@/util/globals'
  import { get } from 'vuex-pathify'
  export default {
    name: 'AllDemands',
    data () {
      return {
        demandType: 'all',
        searchWord: '',
        contract: null,
        dialog: false,
        selectedDemand: {},
        DEMAND_STATUSES,
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
      ...get('manager', [
        'demands',
        'demandedConsultant',
        'costCenters',
        'experienceSpans',
        'jobTitles',
        'projects',
        'companies',
        'contracts',
      ]),
    },
    mounted () {
      this.$store.dispatch('manager/getSupplierCompanies')
      this.$store.dispatch('manager/getCostCenters')
      this.$store.dispatch('manager/getJobTitles')
      this.$store.dispatch('manager/getExperienceSpans')
      this.$store.dispatch('manager/getProjects')
      this.$store.dispatch('manager/getDemands')
      this.$store.dispatch('manager/getContracts')
    },
    methods: {
      openContract () {
        if (this.selectedDemand.contractId) {
          const { filePath } = this.contracts.find(e => e.id === this.selectedDemand.contractId)
          window.open(filePath, '_blank').focus()
        }
      },
      openSignedContract () {
        if (this.demandedConsultant.contractFilePath) {
          window.open(this.demandedConsultant.contractFilePath, '_blank').focus()
        }
      },
      sleep (ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
      },
      async showDemand (demand) {
        this.$store.dispatch('manager/getJobTitlesByCompany', demand.supplierCompanyId)
        this.$store.dispatch('manager/getExperienceSpansByCompany', demand.supplierCompanyId)
        this.$store.dispatch('manager/getBudgetPlansByCompany', demand.supplierCompanyId)
        if (demand.consultantId) {
          this.$store.dispatch('manager/getConsultantById', demand.consultantId)
        }
        await this.sleep(250)
        this.selectedDemand = { ...demand }
        this.dialog = true
      },
      selectTarget (target, id) {
        switch (target) {
          case 'supplier':
            this.$store.dispatch('manager/getJobTitlesByCompany', id)
            this.$store.dispatch('manager/getExperienceSpansByCompany', id)
            this.$store.dispatch('manager/getBudgetPlansByCompany', id)
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
      updateDemand () {
        const payload = { ...this.selectedDemand }
        let isAllowedToUpdate = true
        switch (payload.demandStatus) {
          case DEMAND_STATUSES.find(e => e.key === 'REPLIED').status:
            if (payload.consultantId && payload.contractId) {
              payload.demandStatus = DEMAND_STATUSES.find(e => e.key === 'PENDING').status
            }
            break
          case DEMAND_STATUSES.find(e => e.key === 'APPROVED').status:
            if (this.demandedConsultant.contractFilePath && this.demandedConsultant.contractFilePath.length > 0) {
              payload.consultantPayload = {
                id: payload.consultantId,
                unitManagerUserId: this.user.id,
                contractId: payload.contractId,
              }
              payload.demandStatus = DEMAND_STATUSES.find(e => e.key === 'COMPLITED').status
            }
            break
          default:
            isAllowedToUpdate = false
            break
        }

        if (isAllowedToUpdate) this.$store.dispatch('manager/updateDemand', payload)
        else this.$store.dispatch('app/showAlert', { message: 'Bir değişiklik yapılmadı.', type: 'info' })
        this.selectedDemand = {}
        this.dialog = false
      },
      closeDialog () {
        this.$store.dispatch('manager/getJobTitles')
        this.$store.dispatch('manager/getExperienceSpans')
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
