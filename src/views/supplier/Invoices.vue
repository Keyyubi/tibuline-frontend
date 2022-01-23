<template>
  <v-container
    id="invoices-view"
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

      <v-tab href="#newInvoice">
        Yeni Fatura
        <v-icon>mdi-account-plus</v-icon>
      </v-tab>
    </v-tabs>

    <div class="py3" />

    <v-tabs-items v-model="currentTab">
      <v-tab-item value="newInvoice">
        <v-container class="py-3">
          <v-row>
            <v-col
              cols="12"
              md="6"
            >
              <v-select
                v-model="selectedConsultant"
                :items="consultants"
                :item-text="e => e.firstName + ' ' + e.lastName"
                item-value="id"
                label="Aktitesi Onaylanan Danışmanlar"
                return-object
                @change="selectConsultant"
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-select
                v-model="selectedPeriod"
                :items="activityPeriods"
                :item-text="e => e.name.split('-')[1] + '/' + e.name.split('-')[0]"
                item-value="id"
                :disabled="!selectedConsultant"
                label="Danışmanın Onaylanan Dönemleri"
                return-object
                @change="selectPeriod"
              />
            </v-col>
            <v-col v-if="selectedConsultant && selectedPeriod">
              <v-textarea
                v-model="description"
                rows="8"
                label="Fatura açıklaması"
                placeholder="Fatura açıklaması"
              />
            </v-col>
          </v-row>
          <v-row
            class="my-3"
            align="center"
          >
            <v-divider class="mr-3" /><span class="grey--text">Bütçe</span><v-divider class="ml-3" />
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                :value="moneyMask(budgetObj.hourly)"
                label="Bütçe (Adam/Saat)"
                disabled
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                :value="moneyMask(budgetObj.daily)"
                label="Bütçe (Adam/Gün)"
                disabled
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                :value="moneyMask(budgetObj.monthly)"
                label="Bütçe (Adam/Ay)"
                disabled
              />
            </v-col>
          </v-row>

          <v-row
            class="my-3"
            align="center"
          >
            <v-divider class="mr-3" /><span class="grey--text">Fatura Özeti</span><v-divider class="ml-3" />
          </v-row>
          <v-row class="mb-5">
            <v-col
              cols="12"
              md="4"
            >
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>{{ user.company.name }}</v-list-item-title>
                  <v-list-item-subtitle>Şirket</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>{{ user.company.address }}</v-list-item-title>
                  <v-list-item-subtitle>Adres</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>{{ user.company.vkn }}</v-list-item-title>
                  <v-list-item-subtitle>Vergi Numarası</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>{{ user.company.vkn }}</v-list-item-title>
                  <v-list-item-subtitle>Vergi Numarası</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
            <v-col
              cols="12"
              md="2"
            >
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>{{ moneyMask(12343.2134) }}</v-list-item-title>
                  <v-list-item-subtitle>Tutar</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>{{ moneyMask(1034.2134) }}</v-list-item-title>
                  <v-list-item-subtitle>KDV</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>{{ moneyMask(13377.2134) }}</v-list-item-title>
                  <v-list-item-subtitle>Toplam Tutar</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-textarea
                v-model="description"
                rows="8"
                label="Fatura açıklaması"
                outlined
                disabled
              />
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
  import { ACTIVITY_STATUSES as Statuses } from '@/util/globals'
  import { get } from 'vuex-pathify'
  export default {
    name: 'Invoices',
    data () {
      return {
        currentTab: 'newDemands',
        selectedConsultant: null,
        selectedPeriod: null,
        description: '',

        InvoicePeriods: {
          supplierCompanyId: 1,
          customerCompanyId: 1,
          createdById: 1,
          description: '',
          period: '2022-01',
          consultantId: 1,
          invoiceDate: '2022-02-05',
          amount: 10000,
          taxAmount: 1800,
          totalAmount: 118000,
          isPaid: false,
        },
        // TEMP DaTAS
        budgetObj: {
          hourly: null,
          daily: null,
          monthly: null,
        }
      }
    },
    computed: {
      ...get('user', ['user']),
      ...get('consultant', ['consultants']),
      ...get('budget', ['budgets']),
      ...get('jobTitle', ['jobTitles']),
      ...get('experienceSpan', ['experienceSpans']),
      ...get('activity', ['activities']),
      ...get('activityPeriod', ['activityPeriods']),
    },
    mounted () {
      this.$store.dispatch('consultant/getConsultants')
    },
    methods: {
      selectConsultant () {
        const { id: consultantId, experienceSpanId, jobTitleId } = this.selectedConsultant
        this.budgetObj.hourly = null
        this.budgetObj.daily = null
        this.budgetObj.monthly = null
        this.description = ''

        this.$store.dispatch('activityPeriod/getActivityPeriodsByConsultantId', this.selectedConsultant.id)
        this.$store.dispatch('app/setLoading', true)
        setTimeout(() => {
          this.$store.dispatch('jobTitle/getJobTitleById', jobTitleId)
          this.$store.dispatch('experienceSpan/getExperienceSpanById', experienceSpanId)
          // this.$store.dispatch('budget/getBudgetsByParams', { consultantId, experienceSpanId, jobTitleId })
          this.$store.dispatch('budget/getBudgetsByCompanyId', this.user.companyId)
          this.$store.dispatch('app/setLoading', true)
        }, 500)

        // TEMP CODe
        setTimeout(() => {
          const budget = this.budgets.find(e => e.experienceSpanId === experienceSpanId && e.jobTitleId === jobTitleId)
          this.budgetObj.hourly = budget.monthlyBudget / 30 / 8
          this.budgetObj.daily = budget.monthlyBudget / 30
          this.budgetObj.monthly = budget.monthlyBudget
          this.$store.dispatch('app/setLoading', false)
        }, 500)
      },
      selectPeriod () {
        this.description = this.selectedConsultant.firstName.toUpperCase() + ' ' + this.selectedConsultant.lastName.toUpperCase() + '\n'
        this.description += this.jobTitles[0].name + ' - ' + this.experienceSpans[0].name + '\n\n'
        this.description += 'Dönem: ' + this.selectedPeriod.name.split('-')[1] + '/' + this.selectedPeriod.name.split('-')[0] + '\n'
        this.description += this.selectedPeriod.totalShiftHours + ' saat mesai - ' + this.selectedPeriod.totalOverShiftHours + ' fazla mesai'


        let str = `${this.selectedConsultant.firstName.toUpperCase()} ${this.selectedConsultant.lastName.toUpperCase()} - ${this.jobTitles[0].name} - ${this.experienceSpans[0].name}
        Dönem: ${this.selectedPeriod.name.split('-')[1]}/${this.selectedPeriod.name.split('-')[0]}
        ${this.selectedPeriod.totalShiftHours} saat mesai -
        ${this.selectedPeriod.totalOverShiftHours} fazla mesai
        `
      },
      updateActivities () {
        if (this.activities.length > 0) {
          const { length } = this.activities
          for (let i = 0; i < length; i++) {
            const element = { ...this.activities[i], activityStatus: Statuses.INVOICED }
            this.$store.dispatch('activity/updateActivity', element)
          }
        }
      },
      moneyMask (amount) {
        return amount ? new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount) : 'Bütçe bilgisi bulunmuyor'
      },
    },
  }
</script>

<style lang="scss" scoped>
.btn-group-row {
  display: flex;
  justify-content: center !important;
  align-items: center;
}
</style>
