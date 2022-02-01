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
                @click="showBudget(item)"
              >
                <b>Güncelle</b>
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

            <!-- eslint-disable-next-line -->
            <template v-slot:item.hourlyBudget="{ item }">
              {{ moneyMask(item.hourlyBudget) }}
            </template><!-- eslint-disable-next-line -->
            <template v-slot:item.dailyBudget="{ item }">
              {{ moneyMask(item.dailyBudget) }}
            </template><!-- eslint-disable-next-line -->
            <template v-slot:item.monthlyBudget="{ item }">
              {{ moneyMask(item.monthlyBudget) }}
            </template><!-- eslint-disable-next-line -->
            <template v-slot:item.totalBudget="{ item }">
              {{ moneyMask(item.totalBudget) }}
            </template>
          </v-data-table>
        </v-card>
        <v-dialog
          v-model="dialog"
          width="720"
          :retain-focus="false"
        >
          <budget-form
            form-type="update"
            :budget="selectedBudget"
            @close-dialog="closeUpdatePopup()"
          />
        </v-dialog>
      </v-tab-item>

      <v-tab-item value="newBudget">
        <budget-form
          form-type="create"
          :budget="newBudget"
        />
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
        selectedBudget: {},
        newBudget: {
          companyId: null,
          experienceSpanId: null,
          jobTitleId: null,
          hourlyBudget: 0,
          dailyBudget: 0,
          monthlyBudget: 0,
          totalBudget: 0,
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
          { text: 'Saatlik Bütçe', value: 'hourlyBudget' },
          { text: 'Günlük Bütçe', value: 'dailyBudget' },
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
      this.$store.dispatch('jobTitle/getJobTitles')
      this.$store.dispatch('experienceSpan/getExperienceSpans')
    },
    methods: {
      getJobTitleName (id) {
        const result = this.jobTitles.find(jobTitle => jobTitle.id === id)
        if (result) return result.name
        else return 'Bulunamadı'
      },
      getExperienceSpanName (id) {
        const result = this.experienceSpans.find(experienceSpan => experienceSpan.id === id)
        if (result) return result.name
        else return 'Bulunamadı'
      },
      getCompanyName (id) {
        const result = this.companies.find(company => company.id === id)
        if (result) return result.name
        else return 'Bulunamadı'
      },
      moneyMask (amount) {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount)
      },
      showBudget (item) {
        this.selectedBudget = { ...item }
        this.dialog = true
      },
      closeUpdatePopup () {
        this.selectedBudget = null
        this.dialog = false
      },
    },
  }
</script>

<style lang="scss" scoped></style>
