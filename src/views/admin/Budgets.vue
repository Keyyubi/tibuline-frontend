<template>
  <v-container
    id="budget-plans-view"
    fluid
    tag="section"
  >
    <v-tabs
      v-model="currentTab"
      background-color="primary"
      centered
      dark
      icons-and-text
    >
      <v-tabs-slider />

      <v-tab href="#budgetPlans">
        Bütçe Planları
        <v-icon>mdi-currency-usd</v-icon>
      </v-tab>
      <v-tab href="#newBudgetPlan">
        Yeni Bütçe Planı Oluştur
        <v-icon>mdi-plus-box-multiple</v-icon>
      </v-tab>
    </v-tabs>

    <div class="py3" />

    <v-tabs-items v-model="currentTab">
      <v-tab-item value="budgetPlans">
        <v-card>
          <v-card-title>
            <v-row>
              <v-text-field
                v-model="searchWord"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              />
            </v-row>
          </v-card-title>

          <v-data-table
            :headers="headers"
            :items="budgetPlans"
            :search="searchWord"
          >
            <!-- eslint-disable-next-line -->
            <template v-slot:item.id="{ item }">
              <v-chip
                class="ma-2"
                color="primary"
                dark
                @click="editBudgetPlan(item)"
              >
                {{ item.id }}
                <v-icon right>
                  mdi-arrow-right-bold
                </v-icon>
              </v-chip>
            </template>

            <!-- eslint-disable-next-line -->
            <template v-slot:item.companyId="{ item }">
              {{ getCompanyName(item.companyId) }}
            </template>

            <!-- eslint-disable-next-line -->
            <template v-slot:item.jobTitleId="{ item }">
              {{ getJobTitleName(item.jobTitleId) }}
            </template>

            <!-- eslint-disable-next-line -->
            <template v-slot:item.experienceSpanId="{ item }">
              {{ getExperienceSpanName(item.experienceSpanId) }}
            </template>
          </v-data-table>
        </v-card>
        <v-dialog
          v-model="dialog"
          width="720"
          :retain-focus="false"
        >
          <v-card>
            <v-card-title class="text-h5 primary white--text">
              Bütçe Planını Güncelle
            </v-card-title>

            <v-card-text>
              <v-container class="py-3">
                <v-row>
                  <v-col cols="4">
                    <v-autocomplete
                      v-model="selectedBudgetPlan.companyId"
                      :items="companies"
                      item-text="name"
                      item-value="id"
                      label="Şirket"
                    />
                  </v-col>
                  <v-col cols="4">
                    <v-autocomplete
                      v-model="selectedBudgetPlan.jobTitleId"
                      :items="jobTitles"
                      item-text="name"
                      item-value="id"
                      label="Ünvan"
                    />
                  </v-col>
                  <v-col cols="4">
                    <v-autocomplete
                      v-model="selectedBudgetPlan.experienceSpanId"
                      :items="experienceSpans"
                      item-text="name"
                      item-value="id"
                      label="Tecrübe Aralığı"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="10">
                    <v-subheader>Aylık Bütçe (min: 1.000,00₺, max: 100.000,00₺)</v-subheader>
                    <v-slider
                      v-model="selectedBudgetPlan.monthlyBudget"
                      :min="1000"
                      :max="100000.00"
                      append-icon="mdi-plus"
                      prepend-icon="mdi-minus"
                      @change="setEditBudget('total')"
                    />
                  </v-col>
                  <v-col
                    cols="2"
                    class="mt-4"
                  >
                    <v-text-field
                      v-model="selectedBudgetPlan.monthlyBudget"
                      type="number"
                      required
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="10">
                    <v-subheader>Toplam Bütçe (min: 1.000,00₺, max: 100.000,00₺)</v-subheader>
                    <v-slider
                      v-model="selectedBudgetPlan.totalBudget"
                      :min="12000"
                      :max="1200000.00"
                      append-icon="mdi-plus"
                      prepend-icon="mdi-minus"
                      @change="setEditBudget('monthly')"
                    />
                  </v-col>
                  <v-col
                    cols="2"
                    class="mt-4"
                  >
                    <v-text-field
                      v-model="selectedBudgetPlan.totalBudget"
                      type="number"
                      required
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-divider />

            <!-- Card Actions -->
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="primary"
                depressed
                @click="updateBudgetPlan()"
              >
                Güncelle
              </v-btn>
              <v-btn
                color="error"
                depressed
                @click="dialog = false"
              >
                Vazgeç
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-tab-item>

      <v-tab-item value="newBudgetPlan">
        <v-container class="py-3">
          <v-row>
            <v-col cols="4">
              <v-autocomplete
                v-model="newBudgetPlan.companyId"
                :items="companies"
                item-text="name"
                item-value="id"
                label="Şirket"
                :error-messages="companyError"
              />
            </v-col>
            <v-col cols="4">
              <v-autocomplete
                v-model="newBudgetPlan.jobTitleId"
                :items="jobTitles"
                item-text="name"
                item-value="id"
                label="Ünvan"
                :error-messages="jobTitleError"
              />
            </v-col>
            <v-col cols="4">
              <v-autocomplete
                v-model="newBudgetPlan.experienceSpanId"
                :items="experienceSpans"
                item-text="name"
                item-value="id"
                label="Tecrübe Aralığı"
                :error-messages="expSpanError"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="10">
              <v-subheader>Aylık Bütçe (min: 1.000,00₺, max: 100.000,00₺)</v-subheader>
              <v-slider
                v-model="newBudgetPlan.monthlyBudget"
                :step="0.5"
                :min="1000"
                :max="100000.00"
                append-icon="mdi-plus"
                prepend-icon="mdi-minus"
                @change="setBudget('total')"
              />
            </v-col>
            <v-col
              cols="2"
              class="mt-4"
            >
              <v-text-field
                v-model="newBudgetPlan.monthlyBudget"
                type="number"
                required
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="10">
              <v-subheader>Toplam Bütçe (min: 1.000,00₺, max: 100.000,00₺)</v-subheader>
              <v-slider
                v-model="newBudgetPlan.totalBudget"
                :step="0.5"
                :min="12000"
                :max="1200000.00"
                append-icon="mdi-plus"
                prepend-icon="mdi-minus"
                @change="setBudget('monthly')"
              />
            </v-col>
            <v-col
              cols="2"
              class="mt-4"
            >
              <v-text-field
                v-model="newBudgetPlan.totalBudget"
                type="number"
                required
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="8">
              <v-subheader>Saatlik Bütçe (Aylık 180 saat olarak hesaplanmıştır.): {{ Math.round((newBudgetPlan.monthlyBudget / 180) * 100) / 100 }} ₺</v-subheader>
            </v-col>
            <v-col cols="4">
              <v-btn
                class="my-2"
                width="100%"
                color="primary"
                @click="createBudgetPlan()"
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
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
  import { get } from 'vuex-pathify'
  export default {
    name: 'BudgetPlans',
    data () {
      return {
        currentTab: 'budgetPlans',
        searchWord: '',
        dialog: false,
        companyError: '',
        jobTitleError: '',
        expSpanError: '',
        selectedBudgetPlan: {},
        newBudgetPlan: {
          companyId: null,
          experienceSpanId: null,
          jobTitleId: null,
          monthlyBudget: null,
          totalBudget: null,
        },
        headers: [
          {
            text: 'Güncelle',
            align: 'start',
            value: 'id',
          },
          { text: 'Şirket Adı', value: 'companyId' },
          { text: 'Ünvan', value: 'jobTitleId' },
          { text: 'Tecrübe Aralığı', value: 'experienceSpanId' },
          { text: 'Aylık Bütçe', value: 'monthlyBudget' },
          { text: 'Toplam Bütçe', value: 'totalBudget' },
        ],
      }
    },
    computed: {
      ...get('app', ['responseMsg', 'isErrorMsg']),
      ...get('admin', ['budgetPlans', 'companies', 'jobTitles', 'experienceSpans']),
    },
    mounted () {
      this.$store.dispatch('admin/getCompanies')
      this.$store.dispatch('admin/getJobTitles')
      this.$store.dispatch('admin/getExperienceSpans')
      this.$store.dispatch('admin/getBudgetPlans')
    },
    methods: {
      setBudget (type) {
        if (type === 'monthly') {
          this.newBudgetPlan.monthlyBudget = Math.round((this.newBudgetPlan.totalBudget / 12) * 100) / 100
        } else {
          this.newBudgetPlan.totalBudget = Math.round((this.newBudgetPlan.monthlyBudget * 12) * 100) / 100
        }
      },
      setEditBudget (type) {
        if (type === 'monthly') {
          this.selectedBudgetPlan.monthlyBudget = Math.round((this.selectedBudgetPlan.totalBudget / 12) * 100) / 100
        } else {
          this.selectedBudgetPlan.totalBudget = Math.round((this.selectedBudgetPlan.monthlyBudget * 12) * 100) / 100
        }
      },
      getJobTitleName (id) {
        const result = this.jobTitles.find(jobTitle => jobTitle.id === id)
        if (result) return result.name
        else return 'Bulunamadi'
      },
      getExperienceSpanName (id) {
        const result = this.experienceSpans.find(experienceSpan => experienceSpan.id === id)
        if (result) return result.name
        else return 'Bulunamadi'
      },
      getCompanyName (id) {
        const result = this.companies.find(company => company.id === id)
        if (result) return result.name
        else return 'Bulunamadi'
      },
      editBudgetPlan (item) {
        this.selectedBudgetPlan = item
        this.dialog = true
      },
      updateBudgetPlan () {
        this.dialog = false
        this.$store.dispatch('admin/updateBudgetPlan', this.selectedBudgetPlan)
      },
      createBudgetPlan () {
        if (!this.newBudgetPlan.companyId) {
          this.companyError = 'Şirket seçmelisiniz.'
          return
        } else this.companyError = ''
        if (!this.newBudgetPlan.jobTitleId) {
          this.jobTitleError = 'Ünvan seçmelisiniz.'
          return
        } else this.jobTitleError = ''
        if (!this.newBudgetPlan.experienceSpanId) {
          this.expSpanError = 'Tecrübe aralığı seçmelisiniz.'
          return
        } else this.expSpanError = ''
        console.log('newBudget', this.newBudgetPlan)
        this.dialog = false
        const payload = { ...this.newBudgetPlan }
        this.$store.dispatch('admin/createBudgetPlan', payload)
        Object.keys(this.newBudgetPlan).forEach(e => { this.newBudgetPlan[e] = null })
      },
    },
  }
</script>

<style lang="scss" scoped></style>
