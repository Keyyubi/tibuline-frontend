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
              <v-col md="3">
                <v-autocomplete
                  v-model="supplierFilter"
                  :items="suppliers"
                  item-text="name"
                  item-value="id"
                  label="Tedarikçi Ara"
                  @change="filterData('supplier')"
                />
              </v-col>
              <v-col md="3">
                <v-autocomplete
                  v-model="titleFilter"
                  :items="jobTitles"
                  item-text="name"
                  item-value="id"
                  label="Ünvan Ara"
                  @change="filterData('title')"
                />
              </v-col>
              <v-col md="3">
                <v-autocomplete
                  v-model="experienceFilter"
                  :items="experiences"
                  item-text="name"
                  item-value="id"
                  label="Tecrübe Aralığı Ara"
                  @change="filterData('experience')"
                />
              </v-col>
              <v-col
                align-self="center"
                md="3"
              >
                <v-btn
                  align-baseline
                  width="100%"
                  depressed
                  color="primary"
                  outlined
                  small
                  @click="filterData()"
                >
                  Sıfırla
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>

          <v-data-table
            :headers="headers"
            :items="items"
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
            <template v-slot:item.supplierId="{ item }">
              {{ getSupplierName(item.supplierId) }}
            </template>
            <!-- eslint-disable-next-line -->
            <template v-slot:item.jobTitleId="{ item }">
              {{ getJobTitleName(item.jobTitleId) }}
            </template>
            <!-- eslint-disable-next-line -->
            <template v-slot:item.experienceId="{ item }">
              {{ getExperienceName(item.experienceId) }}
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
        supplierFilter: '',
        titleFilter: '',
        experienceFilter: '',
        items: [],
        dialog: false,
        selectedBudget: {},
        newBudget: {
          supplierId: null,
          experienceId: null,
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
          { text: 'Şirket Adı', value: 'supplierId' },
          { text: 'Ünvan', value: 'jobTitleId' },
          { text: 'Tecrübe Aralığı', value: 'experienceId' },
          { text: 'Saatlik Bütçe', value: 'hourlyBudget' },
          { text: 'Günlük Bütçe', value: 'dailyBudget' },
          { text: 'Aylık Bütçe', value: 'monthlyBudget' },
          { text: 'Toplam Bütçe', value: 'totalBudget' },
        ],
      }
    },
    computed: {
      ...get('budget', ['budgets']),
      ...get('supplier', ['suppliers']),
      ...get('jobTitle', ['jobTitles']),
      ...get('experience', ['experiences']),
    },
    mounted () {
      this.$store.dispatch('supplier/getSuppliers')
      this.$store.dispatch('budget/getBudgets')
      this.$store.dispatch('jobTitle/getJobTitles')
      this.$store.dispatch('experience/getExperiences')
      setTimeout(() => {
        this.filterData()
      }, 500)
    },
    methods: {
      filterData (type) {
        switch (type) {
          case 'supplier':
            this.titleFilter = null
            this.experienceFilter = null
            this.items = this.budgets.filter(e => e.supplierId === this.supplierFilter)
            break
          case 'title':
            this.supplierFilter = null
            this.experienceFilter = null
            this.items = this.budgets.filter(e => e.jobTitleId === this.titleFilter)
            break
          case 'experience':
            this.titleFilter = null
            this.supplierFilter = null
            this.items = this.budgets.filter(e => e.experienceId === this.experienceFilter)
            break
          default:
            this.titleFilter = null
            this.experienceFilter = null
            this.supplierFilter = null
            this.items = this.budgets
            break
        }
      },
      getJobTitleName (id) {
        const result = this.jobTitles.find(jobTitle => jobTitle.id === id)
        if (result) return result.name
        else return 'Bulunamadı'
      },
      getExperienceName (id) {
        const result = this.experiences.find(experience => experience.id === id)
        if (result) return result.name
        else return 'Bulunamadı'
      },
      getSupplierName (id) {
        const result = this.suppliers.find(supplier => supplier.id === id)
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
