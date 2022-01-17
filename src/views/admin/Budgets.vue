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

      <v-tab href="#budgets">
        Bütçe Planları
        <v-icon>mdi-currency-usd</v-icon>
      </v-tab>
      <v-tab href="#newBudget">
        Yeni Bütçe Planı Oluştur
        <v-icon>mdi-plus-box-multiple</v-icon>
      </v-tab>
    </v-tabs>

    <div class="py3" />

    <v-tabs-items v-model="currentTab">
      <v-tab-item value="budgets">
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
            :items="budgets"
            :search="searchWord"
          >
            <!-- eslint-disable-next-line -->
            <template v-slot:item.id="{ item }">
              <v-chip
                class="ma-2"
                color="primary"
                dark
                @click="editBudget(item)"
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
                      v-model="selectedBudget.companyId"
                      :items="companies"
                      item-text="name"
                      item-value="id"
                      label="Şirket"
                    />
                  </v-col>
                  <v-col cols="4">
                    <v-autocomplete
                      v-model="selectedBudget.jobTitleId"
                      :items="jobTitles"
                      item-text="name"
                      item-value="id"
                      label="Ünvan"
                    />
                  </v-col>
                  <v-col cols="4">
                    <v-autocomplete
                      v-model="selectedBudget.experienceSpanId"
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
                      v-model="selectedBudget.monthlyBudget"
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
                      v-model="selectedBudget.monthlyBudget"
                      type="number"
                      required
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="10">
                    <v-subheader>Toplam Bütçe (min: 1.000,00₺, max: 100.000,00₺)</v-subheader>
                    <v-slider
                      v-model="selectedBudget.totalBudget"
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
                      v-model="selectedBudget.totalBudget"
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
                @click="updateBudget()"
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

      <v-tab-item value="newBudget">
        <v-container class="py-3">
          <v-row>
            <v-col cols="4">
              <v-autocomplete
                v-model="newBudget.companyId"
                :items="companies"
                item-text="name"
                item-value="id"
                label="Şirket"
                :error-messages="companyError"
                @change="getCompanyItems"
              />
            </v-col>
            <v-col cols="4">
              <v-autocomplete
                v-model="newBudget.jobTitleId"
                :items="jobTitles"
                item-text="name"
                item-value="id"
                label="Ünvan"
                :error-messages="jobTitleError"
                :disabled="newBudget.companyId == null"
              />
            </v-col>
            <v-col cols="4">
              <v-autocomplete
                v-model="newBudget.experienceSpanId"
                :items="experienceSpans"
                item-text="name"
                item-value="id"
                label="Tecrübe Aralığı"
                :error-messages="expSpanError"
                :disabled="newBudget.companyId == null"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="10">
              <v-subheader>Aylık Bütçe (min: 1.000,00₺, max: 100.000,00₺)</v-subheader>
              <v-slider
                v-model="newBudget.monthlyBudget"
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
                v-model="newBudget.monthlyBudget"
                type="number"
                required
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="10">
              <v-subheader>Toplam Bütçe (min: 1.000,00₺, max: 100.000,00₺)</v-subheader>
              <v-slider
                v-model="newBudget.totalBudget"
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
                v-model="newBudget.totalBudget"
                type="number"
                required
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="8">
              <v-subheader>Saatlik Bütçe (Aylık 180 saat olarak hesaplanmıştır.): {{ Math.round((newBudget.monthlyBudget / 180) * 100) / 100 }} ₺</v-subheader>
            </v-col>
            <v-col cols="4">
              <v-btn
                class="my-2"
                width="100%"
                color="primary"
                @click="createBudget()"
              >
                Oluştur
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
  import { get } from 'vuex-pathify'
  export default {
    name: 'Budgets',
    data () {
      return {
        currentTab: 'budgets',
        searchWord: '',
        dialog: false,
        companyError: '',
        jobTitleError: '',
        expSpanError: '',
        selectedBudget: {},
        newBudget: {
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
      ...get('budget', ['budgets']),
      ...get('company', ['companies']),
      ...get('jobTitle', ['jobTitles']),
      ...get('experienceSpan', ['experienceSpans']),
    },
    mounted () {
      this.$store.dispatch('company/getCompanies')
      this.$store.dispatch('budget/getBudgets')
    },
    methods: {
      setBudget (type) {
        if (type === 'monthly') {
          this.newBudget.monthlyBudget = Math.round((this.newBudget.totalBudget / 12) * 100) / 100
        } else {
          this.newBudget.totalBudget = Math.round((this.newBudget.monthlyBudget * 12) * 100) / 100
        }
      },
      setEditBudget (type) {
        if (type === 'monthly') {
          this.selectedBudget.monthlyBudget = Math.round((this.selectedBudget.totalBudget / 12) * 100) / 100
        } else {
          this.selectedBudget.totalBudget = Math.round((this.selectedBudget.monthlyBudget * 12) * 100) / 100
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
      editBudget (item) {
        this.selectedBudget = item
        this.dialog = true
      },
      updateBudget () {
        this.dialog = false
        this.$store.dispatch('budget/updateBudget', this.selec)
      },
      createBudget () {
        if (!this.newBudget.companyId) {
          this.companyError = 'Şirket seçmelisiniz.'
          return
        } else this.companyError = ''
        if (!this.newBudget.jobTitleId) {
          this.jobTitleError = 'Ünvan seçmelisiniz.'
          return
        } else this.jobTitleError = ''
        if (!this.newBudget.experienceSpanId) {
          this.expSpanError = 'Tecrübe aralığı seçmelisiniz.'
          return
        } else this.expSpanError = ''
        console.log('newBudget', this.newBudget)
        this.dialog = false
        const payload = { ...this.newBudget }
        this.$store.dispatch('budget/createBudget', payload)
        Object.keys(this.newBudget).forEach(e => { this.newBudget[e] = null })
      },
      getCompanyItems () {
        this.$store.dispatch('jobTitle/getJobTitlesByCompanyId', this.newBudget.companyId)
        this.$store.dispatch('experienceSpan/getExperienceSpansByCompanyId', this.newBudget.companyId)
      },
    },
  }
</script>

<style lang="scss" scoped></style>
