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

      <v-tab href="#invoice">
        Yeni Fatura
        <v-icon>mdi-account-plus</v-icon>
      </v-tab>
    </v-tabs>

    <div class="py3" />

    <v-tabs-items v-model="currentTab">
      <v-tab-item value="invoice">
        <v-container class="py-3">
          <v-row>
            <!-- Unit Manager -->
            <v-col
              cols="12"
              md="3"
            >
              <v-autocomplete
                v-model="invoice.unitManagerUserId"
                :items="users"
                :item-text="e => e.firstname + ' ' + e.lastname"
                item-value="id"
                label="Müşteri"
              />
            </v-col>

            <!-- Consultant -->
            <v-col
              cols="12"
              md="3"
            >
              <v-autocomplete
                v-model="selectedConsultant"
                :items="consultants.filter(e => e.isActive === true && e.unitManagerUserId === invoice.unitManagerUserId)"
                :item-text="e => e.firstname + ' ' + e.lastname"
                item-value="id"
                label="Aktivitesi Onaylanan Danışmanlar"
                return-object
                @change="selectConsultant"
              />
            </v-col>

            <!-- Period -->
            <v-col
              cols="12"
              md="3"
            >
              <v-select
                v-model="selectedPeriod"
                :items="activityPeriods.filter(e => e.isInvoiced === false)"
                :item-text="e => e.name.split('-')[1] + '/' + e.name.split('-')[0]"
                item-value="id"
                :disabled="!selectedConsultant"
                label="Danışmanın Onaylanan Dönemleri"
                return-object
                @change="selectPeriod"
              />
            </v-col>

            <!-- File Upload -->
            <v-col
              cols="12"
              md="3"
            >
              <v-file-input
                v-model="invoiceFile"
                small-chips
                label="Fatura (PDF)"
                accept=".pdf"
                :disabled="!selectedPeriod"
              />
            </v-col>

            <!-- Description -->
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
                  <v-list-item-title>{{ selectedConsultant ? selectedConsultant.firstname + ' ' + selectedConsultant.lastname : 'Danışman' }}</v-list-item-title>
                  <v-list-item-subtitle>{{ (experiences && experiences.length > 0) ? experiences[0].name : 'Tecrübe Aralığı' }}</v-list-item-subtitle>
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
                  <v-list-item-title>{{ invoiceBudget ? moneyMask(invoiceBudget.hourlyBudget || 0) : 'Bütçe bilgisi bulunmuyor' }}</v-list-item-title>
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
                  <v-list-item-title>{{ invoiceBudget ? moneyMask(invoiceBudget.dailyBudget || 0) : 'Bütçe bilgisi bulunmuyor' }}</v-list-item-title>
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
                  <v-list-item-title>{{ invoiceBudget ? moneyMask(invoiceBudget.monthlyBudget || 0) : 'Bütçe bilgisi bulunmuyor' }}</v-list-item-title>
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
            <span class="grey--text">Fatura Özeti</span>
            <v-divider class="mx-3" />
            <v-switch
              v-model="letSystemCalculate"
              :label="`${letSystemCalculate ? 'Sistem hesaplasın' : 'Kendim giriş yapacağım'}`"
              color="primary"
              class="my-0"
              hide-details
            />
          </v-row>

          <!-- Self Calculation -->
          <v-row
            v-if="selectedPeriod && !letSystemCalculate"
            class="mb-5"
          >
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                v-model="invoiceAmount"
                prepend-icon="mdi-currency-try"
                clearable
                label="Tutar"
                @keypress="isValidNum(invoiceAmount, ...arguments)"
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                v-model="invoiceTaxAmount"
                prepend-icon="mdi-currency-try"
                clearable
                label="KDV Tutarı"
                @keypress="isValidNum(invoiceTaxAmount, ...arguments)"
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                v-model="invoiceTotalAmount"
                prepend-icon="mdi-currency-try"
                clearable
                label="Toplam Tutar"
                @keypress="isValidNum(invoiceTotalAmount, ...arguments)"
              />
            </v-col>
          </v-row>

          <!-- Invoice Summary -->
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
                  <v-list-item-title>{{ moneyMask(invoice.amount) }}</v-list-item-title>
                  <v-list-item-subtitle>Tutar</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>{{ moneyMask(invoice.taxAmount) }}</v-list-item-title>
                  <v-list-item-subtitle>KDV</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>{{ moneyMask(invoice.totalAmount) }}</v-list-item-title>
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
              cols="6"
            >
              <v-btn
                color="warning"
                width="100%"
                depressed
                outlined
                @click="resetForm()"
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
  import { INVOICE_TYPES as InvoiceTypes } from '@/util/globals'
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
        invoiceFile: null,
        letSystemCalculate: true,

        invoice: {
          unitManagerUserId: null,
          supplierSupplierId: null,
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
      ...get('user', ['user', 'users', 'customerCompany']),
      ...get('consultant', ['consultants']),
      ...get('budget', ['invoiceBudget']),
      ...get('jobTitle', ['jobTitles']),
      ...get('experience', ['experiences']),
      ...get('activity', ['activities']),
      ...get('supplier', ['companies']),
      ...get('activityPeriod', ['activityPeriods']),
      invoiceAmount: {
        get: function () {
          return new Intl.NumberFormat('tr-TR').format(this.invoice.amount)
        },
        // setter
        set: function (newValue) {
          if (newValue && newValue.length > 0) {
            const amount = this.unmaskMoney(newValue)
            this.invoice.amount = Math.round(amount * 100) / 100
          }
        },
      },
      invoiceTaxAmount: {
        get: function () {
          return new Intl.NumberFormat('tr-TR').format(this.invoice.taxAmount)
        },
        // setter
        set: function (newValue) {
          if (newValue && newValue.length > 0) {
            const amount = this.unmaskMoney(newValue)
            this.invoice.taxAmount = Math.round(amount * 100) / 100
          }
        },
      },
      invoiceTotalAmount: {
        get: function () {
          return new Intl.NumberFormat('tr-TR').format(this.invoice.totalAmount)
        },
        // setter
        set: function (newValue) {
          if (newValue && newValue.length > 0) {
            const amount = this.unmaskMoney(newValue)
            this.invoice.totalAmount = Math.round(amount * 100) / 100
          }
        },
      },
    },
    mounted () {
      this.$store.dispatch('consultant/getConsultants')
      this.$store.dispatch('user/getUnitManagers')
      this.$store.dispatch('user/getCompanyDetails')
      this.invoice.supplierId = this.user.company.id
      this.invoice.createdById = this.user.id
    },
    methods: {
      moneyMask (amount) {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount)
      },
      unmaskMoney (formattedAmount) {
        return Number(formattedAmount.replaceAll('.', '').replaceAll(',', '.'))
      },
      isValidNum (target, evt) {
        evt = (evt) || window.event
        const charCode = (evt.which) ? evt.which : evt.keyCode
        if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 44) {
          evt.preventDefault()
        } else if (target.length > 0 && target.includes(',') && target.split(',')[1].length === 2) {
          evt.preventDefault()
        } else return true
      },
      selectConsultant () {
        this.$store.dispatch('experience/resetStore')
        this.$store.dispatch('jobTitle/resetStore')
        this.$store.dispatch('budget/resetStore')

        const { supplierId, experienceId, jobTitleId } = this.selectedConsultant
        this.description = ''
        this.selectedPeriod = null

        this.$store.dispatch('activityPeriod/getActivityPeriodsByConsultantId', this.selectedConsultant.id)

        this.$store.dispatch('app/setLoading', true)
        setTimeout(() => {
          this.$store.dispatch('jobTitle/getJobTitleById', jobTitleId)
          this.$store.dispatch('experience/getExperienceById', experienceId)
          this.$store.dispatch('budget/getBudgetsByParams', { supplierId, experienceId, jobTitleId })
          this.$store.dispatch('app/setLoading', false)
        }, 500)
      },
      selectPeriod () {
        this.description = this.selectedConsultant.firstname.toUpperCase() + ' ' + this.selectedConsultant.lastname.toUpperCase() + '\n'
        this.description += this.jobTitles[0].name + ' - ' + this.experiences[0].name + '\n\n'
        this.description += 'Dönem: ' + this.selectedPeriod.name.split('-')[1] + '/' + this.selectedPeriod.name.split('-')[0] + '\n'

        const shiftHours = this.selectedPeriod.totalShiftHours
        const dayOffHours = this.selectedPeriod.dayOffHours

        let days = 0

        if (this.invoiceBudget) {
          switch (this.user.company.invoiceType) {
            case this.InvoiceTypes.HOURLY:
              this.description += shiftHours + ' saat mesai - '

              this.invoice.amount = this.invoiceBudget.hourlyBudget * shiftHours
              break
            case this.InvoiceTypes.DAILY:
              days = Math.round(shiftHours / this.customerCompany.dailyShiftHours)
              this.invoice.amount = this.invoiceBudget.dailyBudget * days

              this.description += `${days} gün mesai -`
              break
            case this.InvoiceTypes.MONTHLY:
              this.description += '1 ay mesai - '
              this.invoice.amount = this.invoiceBudget.monthlyBudget
              break
          }

          const overshiftAmount = this.invoiceBudget.hourlyBudget * this.selectedPeriod.totalOverShiftHours * this.user.company.overtimeMultiplier

          this.description += this.moneyMask(this.invoice.amount) + '\n'

          if (overshiftAmount > 0) {
            this.description += this.selectedPeriod.totalOverShiftHours + 'saat fazla mesai - ' + this.moneyMask(overshiftAmount) + '\n'
          }

          if (dayOffHours > 0 && this.user.company.invoiceType === this.InvoiceTypes.MONTHLY) {
            const dayOffAmount = this.invoiceBudget.hourlyBudget * this.selectedPeriod.dayOffHours
            this.description += `${dayOffHours} saat izin (- ${this.moneyMask(dayOffHours * this.invoiceBudget.hourlyBudget)})`
            this.invoice.amount -= dayOffAmount
          }

          this.invoice.amount += overshiftAmount
          this.invoice.amount = Math.round(this.invoice.amount * 100) / 100
          this.invoice.taxAmount = this.invoice.amount * 0.18
          this.invoice.totalAmount = this.invoice.amount + this.invoice.taxAmount
        } else {
          this.invoice.amount = 0
          this.invoice.taxAmount = 0
          this.invoice.totalAmount = 0
        }
      },
      createInvoice () {
        this.invoice.description = this.description
        this.invoice.period = this.selectedPeriod.name
        this.invoice.consultantId = this.selectedConsultant.id
        this.invoice.invoiceDate = new Date().toISOString()
        this.invoice.customerCompanyId = this.customerCompany.id

        const fields = [
          this.invoice.supplierId,
          this.invoice.unitManagerUserId,
          this.invoice.createdById,
          this.invoice.description,
          this.invoice.period,
          this.invoice.consultantId,
          this.invoice.invoiceDate,
          this.invoice.amount,
          this.invoice.taxAmount,
          this.invoice.totalAmount,
        ]

        if (!this.invoiceFile) {
          this.$store.dispatch('app/showAlert', { message: 'Lütfen fatura dosyasını yükleyiniz.', type: 'warning' })
          this.confirmationDialog = false
          return
        }

        if (!CheckIsNull(fields)) {
          const formData = new FormData()
          formData.append('files', this.invoiceFile, this.invoiceFile.name)

          const payload = { ...this.invoice }
          this.selectedPeriod.isInvoiced = true

          this.$store.dispatch('invoice/createInvoice', { invoice: payload, formData, period: this.selectedPeriod })
          this.resetForm()
        } else {
          this.$store.dispatch('app/showAlert', { message: 'Lütfen bütün alanları doldurunuz.', type: 'warning' })
        }
        this.confirmationDialog = false
      },
      resetForm () {
        this.invoice = {
          unitManagerUserId: null,
          supplierCompanyId: null,
          createdById: null,
          description: null,
          period: null,
          consultantId: null,
          invoiceDate: null,
          amount: 0,
          taxAmount: 0,
          totalAmount: 0,
          isPaid: false,
        }
        this.invoiceFile = null
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
