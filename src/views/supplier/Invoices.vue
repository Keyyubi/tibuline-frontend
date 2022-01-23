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
                :items="consultants.filter(e => e.isActive === true)"
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
              md="6"
            >
              <v-list-item three-line>
                <v-list-item-content>
                  <v-list-item-title>{{ selectedConsultant ? selectedConsultant.firstName + ' ' + selectedConsultant.lastName : 'Danışman' }}</v-list-item-title>
                  <v-list-item-subtitle>{{ (experienceSpans && experienceSpans.length > 0) ? experienceSpans[0].name : 'Tecrübe Aralığı' }}</v-list-item-subtitle>
                  <v-list-item-subtitle>{{ (jobTitles && jobTitles.length > 0) ? jobTitles[0].name : 'Ünvan' }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
            <v-col
              v-if="user.company.invoiceType === InvoiceTypes.HOURLY"
              cols="12"
              md="6"
            >
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>{{ invoiceBudget ? moneyMask(invoiceBudget.hourlyBudget) : 'Bütçe bilgisi bulunmuyor' }}</v-list-item-title>
                  <v-list-item-subtitle>Bütçe (Adam/Saat)</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
            <v-col
              v-if="user.company.invoiceType === InvoiceTypes.DAILY"
              cols="12"
              md="6"
            >
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>{{ invoiceBudget ? moneyMask(invoiceBudget.dailyBudget) : 'Bütçe bilgisi bulunmuyor' }}</v-list-item-title>
                  <v-list-item-subtitle>Bütçe (Adam/Gün)</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
            <v-col
              v-if="user.company.invoiceType === InvoiceTypes.MONTHLY"
              cols="12"
              md="6"
            >
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>{{ invoiceBudget ? moneyMask(invoiceBudget.monthlyBudget) : 'Bütçe bilgisi bulunmuyor' }}</v-list-item-title>
                  <v-list-item-subtitle>Bütçe (Adam/Ay)</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
          </v-row>

          <v-row
            v-if="selectedPeriod"
            class="my-3"
            align="center"
          >
            <v-divider class="mr-3" /><span class="grey--text">Fatura Özeti</span><v-divider class="ml-3" />
          </v-row>
          <v-row
            v-if="selectedPeriod"
            class="mb-5"
          >
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
                  <v-list-item-title>{{ moneyMask(newInvoice.amount) }}</v-list-item-title>
                  <v-list-item-subtitle>Tutar</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>{{ moneyMask(newInvoice.taxAmount) }}</v-list-item-title>
                  <v-list-item-subtitle>KDV</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>{{ moneyMask(newInvoice.totalAmount) }}</v-list-item-title>
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

          <!-- Actions -->
          <v-row>
            <v-col
              v-if="formType === 'create'"
              cols="6"
            >
              <v-btn
                color="warning"
                width="100%"
                depressed
                outlined
                @click="reset()"
              >
                Formu Temizle
              </v-btn>
            </v-col>
            <v-col
              cols="6"
              class="text-right"
            >
              <v-btn
                color="primary"
                width="100%"
                depressed
                @click="confirmationDialog = true"
              >
                Oluştur
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
        <!-- Confirmation dialog -->
        <v-dialog
          v-model="confirmationDialog"
          persistent
          width="460"
        >
          <v-card>
            <v-card-title class="text-h5 primary white--text">
              Onay
            </v-card-title>
            <v-card-text class="text-h5 py-3">
              <v-icon large>
                mdi-alert
              </v-icon>
              Fatura oluşturulacaktır ve sonrasında seçilen döneme ait aktivitiler güncelleneme yapılamayacaktır. Onaylıyor musunuz?
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                class="white--text mr-3"
                color="green"
                depressed
                small
                @click="createInvoice"
              >
                Onayla
              </v-btn>
              <v-btn
                color="error"
                dark
                depressed
                small
                @click="confirmationDialog = false"
              >
                Vazgeç
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
  import { ACTIVITY_STATUSES as Statuses, INVOICE_TYPES as InvoiceTypes } from '@/util/globals'
  import { CheckIsNull } from '@/util/helpers'
  import { get } from 'vuex-pathify'
  export default {
    name: 'Invoices',
    data () {
      return {
        currentTab: 'newDemands',
        selectedConsultant: null,
        selectedPeriod: null,
        description: '',
        confirmationDialog: false,

        newInvoice: {
          supplierCompanyId: null,
          customerCompanyId: null,
          createdById: null,
          description: null,
          period: null,
          consultantId: null,
          invoiceDate: null,
          amount: 0,
          taxAmount: 0,
          totalAmount: 0,
          isPaid: false,
        },
        InvoiceTypes,
      }
    },
    computed: {
      ...get('user', ['user']),
      ...get('consultant', ['consultants']),
      ...get('budget', ['invoiceBudget']),
      ...get('jobTitle', ['jobTitles']),
      ...get('experienceSpan', ['experienceSpans']),
      ...get('activity', ['activities']),
      ...get('activityPeriod', ['activityPeriods']),
    },
    mounted () {
      this.$store.dispatch('consultant/getConsultants')
      this.newInvoice.supplierCompanyId = this.user.company.id
      this.newInvoice.createdById = this.user.id
    },
    beforeDestroy () {
      this.$store.dispatch('experienceSpan/resetStore')
      this.$store.dispatch('jobTitle/resetStore')
      this.$store.dispatch('budget/resetStore')
    },
    methods: {
      selectConsultant () {
        this.$store.dispatch('experienceSpan/resetStore')
        this.$store.dispatch('jobTitle/resetStore')
        this.$store.dispatch('budget/resetStore')

        const { companyId, experienceSpanId, jobTitleId } = this.selectedConsultant
        this.description = ''
        this.selectedPeriod = null

        this.$store.dispatch('activityPeriod/getActivityPeriodsByConsultantId', this.selectedConsultant.id)

        this.$store.dispatch('app/setLoading', true)
        setTimeout(() => {
          this.$store.dispatch('jobTitle/getJobTitleById', jobTitleId)
          this.$store.dispatch('experienceSpan/getExperienceSpanById', experienceSpanId)
          this.$store.dispatch('budget/getBudgetsByParams', { companyId, experienceSpanId, jobTitleId })
          this.$store.dispatch('app/setLoading', false)
        }, 500)
      },
      selectPeriod () {
        this.description = this.selectedConsultant.firstName.toUpperCase() + ' ' + this.selectedConsultant.lastName.toUpperCase() + '\n'
        this.description += this.jobTitles[0].name + ' - ' + this.experienceSpans[0].name + '\n\n'
        this.description += 'Dönem: ' + this.selectedPeriod.name.split('-')[1] + '/' + this.selectedPeriod.name.split('-')[0] + '\n'
        this.description += this.selectedPeriod.totalShiftHours + ' saat mesai - ' + this.selectedPeriod.totalOverShiftHours + ' fazla mesai'

        if (this.invoiceBudget) {
          switch (this.user.company.invoiceType) {
            case this.InvoiceTypes.HOURLY:
              this.newInvoice.amount = this.invoiceBudget.hourlyBudget
              this.newInvoice.taxAmount = this.invoiceBudget.hourlyBudget * 0.18
              break
            case this.InvoiceTypes.DAILY:
              this.newInvoice.amount = this.invoiceBudget.dailyBudget
              this.newInvoice.taxAmount = this.invoiceBudget.dailyBudget * 0.18
              break
            case this.InvoiceTypes.MONTHLY:
              this.newInvoice.amount = this.invoiceBudget.monthlyBudget
              this.newInvoice.taxAmount = this.invoiceBudget.monthlyBudget * 0.18
              break
          }
          this.newInvoice.totalAmount = this.newInvoice.amount + this.newInvoice.taxAmount
        } else {
          this.newInvoice.amount = 0
          this.newInvoice.taxAmount = 0
          this.newInvoice.totalAmount = 0
        }
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
      createInvoice () {
        this.newInvoice.description = this.description
        this.newInvoice.period = this.selectedPeriod.name
        this.newInvoice.consultantId = this.selectedConsultant.id
        this.newInvoice.invoiceDate = new Date()

        const fields = [
          this.newInvoice.supplierCompanyId,
          this.newInvoice.customerCompanyId,
          this.newInvoice.createdById,
          this.newInvoice.description,
          this.newInvoice.period,
          this.newInvoice.consultantId,
          this.newInvoice.invoiceDate,
          this.newInvoice.amount,
          this.newInvoice.taxAmount,
          this.newInvoice.totalAmount,
          this.newInvoice.isPaid,
        ]

        if (!CheckIsNull(fields)) {
          const payload = { ...this.newInvoice }
          this.$store.dispatch('invoice/createInvoice', payload)
        } else {
          this.$store.dispatch('app/showAlert', { message: 'Bir hata oluştu.', type: 'error' })
        }
        this.confirmationDialog = false
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
