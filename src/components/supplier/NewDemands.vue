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
          {{ DEMAND_STATUSES.find(e => e.status === item.demandStatus).label }}
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
              <!-- CreatedBy -->
              <v-col
                cols="12"
                md="4"
              >
                <v-select
                  v-model="selectedDemand.createdById"
                  :items="unitManagers"
                  :item-text="e => e.firstName + ' ' + e.lastName"
                  item-value="id"
                  label="Yönetici"
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

            <v-row
              class="my-3"
              align="center"
            >
              <v-divider class="mr-3" />Aday Bilgileri<v-divider class="ml-3" />
            </v-row>
            <v-row class="mt-3">
              <!-- Consultant -->
              <v-col>
                <v-autocomplete
                  ref="newConsultantSelect"
                  v-model="selectedDemand.consultantId"
                  :items="consultants"
                  :item-text="e => e.firstName + ' ' + e.lastName"
                  item-value="id"
                  label="Aday"
                >
                  <template v-slot:prepend-item>
                    <v-list-item
                      ripple
                      @click="createConsultant"
                    >
                      <v-list-item-action>
                        <v-icon color="success">
                          mdi-plus
                        </v-icon>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title>
                          Yeni Danışman Oluştur
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider class="mt-2" />
                  </template>
                </v-autocomplete>
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
            @click="updateDemand"
          >
            Güncelle
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

    <!-- New Consultant Dialog -->
    <v-dialog
      v-model="newConsultantDialog"
      persistent
      width="70%"
    >
      <v-card>
        <v-card-title class="text-h5 primary white--text">
          Yeni Aday Oluştur
          <v-spacer />
          <v-btn 
            depressed
            icon
            title="Kapat"
            @click="newConsultantDialog = false"
          >
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <consultant-form
            :consultant="newConsultant"
            @close-dialog="newConsultantDialog = false"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
  import { DEMAND_STATUSES } from '@/util/globals'
  import { get } from 'vuex-pathify'
  export default {
    name: 'NewDemands',
    data () {
      return {
        demandType: 'all',
        searchWord: '',
        dialog: false,
        selectedDemand: {},
        selectedConsultant: '',
        DEMAND_STATUSES,
        newConsultantDialog: false,
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
      ...get('user', ['user']),
      ...get('app', ['responseMsg', 'isErrorMsg']),
      ...get('admin', ['costCenters', 'projects']),
      ...get('supplier', ['unitManagers', 'demands', 'experienceSpans', 'jobTitles', 'consultants']),
    },
    mounted () {
      this.$store.dispatch('admin/getCostCenters')
      this.$store.dispatch('admin/getProjects')
      this.$store.dispatch('supplier/getJobTitles')
      this.$store.dispatch('supplier/getExperienceSpans')
      this.$store.dispatch('supplier/getDemands')
      this.$store.dispatch('supplier/getConsultants')
      this.$store.dispatch('supplier/getUnitManagers')
    },
    methods: {
      sleep (ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
      },
      editDemand (id) {
        console.log('id', id)
      },
      async showDemand (demand) {
        this.$store.dispatch('supplier/getJobTitles', demand.supplierCompanyId)
        this.$store.dispatch('supplier/getExperienceSpans', demand.supplierCompanyId)
        this.$store.dispatch('supplier/getBudgetPlans', demand.supplierCompanyId)

        await this.sleep(250)

        this.selectedDemand = { ...demand }
        this.dialog = true
      },
      selectTarget (target, id) {
        switch (target) {
          case 'supplier':
            this.$store.dispatch('supplier/getJobTitlesByCompany', id)
            this.$store.dispatch('supplier/getExperienceSpansByCompany', id)
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
        if (this.selectedDemand.constultantId) {
          this.selectedDemand.demandStatus = DEMAND_STATUSES.find(e => e.key === 'REPLIED').status
        }
        this.$store.dispatch('supplier/updateDemand', this.selectedDemand)
        this.dialog = false
      },
      closeDialog () {
        this.$store.dispatch('manager/getJobTitles')
        this.$store.dispatch('manager/getExperienceSpans')
        this.dialog = false
      },
      createConsultant () {
        console.log('new consultant')
        this.newConsultantDialog = true
        this.$refs.newConsultantSelect.blur()
      },
      getConsultantName (id) {
        if (id) {
          const result = this.consultants.find(consultant => consultant.id === id)
          return result.firstName + ' ' + result.lastName
        } else return 'Bulunamadı'
      },
      getProjectName (id) {
        if (id) {
          const result = this.projects.find(project => project.id === id)
          return result.name
        } else return 'Bulunamadı'
      },
      getJobTitleName (id) {
        if (id) {
          const result = this.jobTitles.find(jobTitle => jobTitle.id === id)
          return result.name
        } else return 'Bulunamadı'
      },
      getExperienceSpanName (id) {
        if (id) {
          const result = this.experienceSpans.find(experienceSpan => experienceSpan.id === id)
          return result.name
        } else return 'Bulunamadı'
      },
    },
  }
</script>

<style lang="scss" scoped></style>
