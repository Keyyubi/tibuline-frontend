<template>
  <v-card>
    <v-card-title
      v-if="formType !== 'create'"
      class="text-h5 primary white--text"
    >
      Bütçe Planını Güncelle
    </v-card-title>

    <v-card-text v-if="budget !== null">
      <v-container class="py-3">
        <v-row>
          <!-- Company -->
          <v-col cols="4">
            <v-autocomplete
              v-model="budget.companyId"
              :items="companies.filter(e => e.isSupplier === true)"
              item-text="name"
              item-value="id"
              label="Şirket"
              :disabled="formType !== 'create'"
            />
          </v-col>

          <!-- JobTitle -->
          <v-col cols="4">
            <v-autocomplete
              v-model="budget.jobTitleId"
              :items="jobTitles.filter(e => e.companyId === budget.companyId)"
              item-text="name"
              item-value="id"
              label="Ünvan"
            />
          </v-col>

          <!-- ExperienceSpan -->
          <v-col cols="4">
            <v-autocomplete
              v-model="budget.experienceSpanId"
              :items="experienceSpans.filter(e => e.companyId === budget.companyId)"
              item-text="name"
              item-value="id"
              label="Tecrübe Aralığı"
            />
          </v-col>
        </v-row>

        <!-- Budget -->
        <v-row>
          <v-col
            cols="12"
            md="3"
          >
            <v-text-field
              v-model="hourly"
              prepend-icon="mdi-currency-try"
              label="Bütçe (Adam/Saat)"
              :disabled="invoiceType !== InvoiceTypes.HOURLY"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
          >
            <v-text-field
              v-model="daily"
              prepend-icon="mdi-currency-try"
              label="Bütçe (Adam/Gün)"
              :disabled="invoiceType !== InvoiceTypes.DAILY"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
          >
            <v-text-field
              v-model="monthly"
              clearable
              prepend-icon="mdi-currency-try"
              label="Bütçe (Adam/Ay)"
              :disabled="invoiceType !== InvoiceTypes.MONTHLY"
              @keypress="isValidNum"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
          >
            <v-text-field
              v-model="budget.totalBudget"
              v-mask="currencyMask"
              prepend-icon="mdi-currency-try"
              label="Toplam Bütçe"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-divider />

    <!-- Card Actions -->
    <v-card-actions>
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
            @click="updateBudget"
          >
            {{ formType === 'create' ? 'Oluştur' : 'Güncelle' }}
          </v-btn>
        </v-col>
        <v-col
          v-if="formType !== 'create'"
          cols="6"
          class="text-right"
        >
          <v-btn
            color="error"
            width="100%"
            depressed
            @click="$emit('close-dialog')"
          >
            Vazgeç
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
  import { INVOICE_TYPES as InvoiceTypes } from '@/util/globals'
  import { CheckIsNull } from '@/util/helpers'
  import { get } from 'vuex-pathify'
  import createNumberMask from 'text-mask-addons/dist/createNumberMask'
  const currencyMask = createNumberMask({
    prefix: '',
    allowDecimal: true,
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: '.',
    decimalSymbol: ',',
    allowNegative: false,
  })
  export default {
    name: 'BudgetForm',
    props: {
      formType: { type: String, default: 'create' },
      budget: { type: Object, default: null },
    },
    data: () => ({
      billTypes: [
        { id: 0, name: 'Adam/Saat' },
        { id: 1, name: 'Adam/Gün' },
        { id: 2, name: 'Adam/Ay' },
      ],
      currencyMask,
      InvoiceTypes,
    }),
    computed: {
      ...get('user', ['user']),
      ...get('budget', ['budgets']),
      ...get('company', ['companies']),
      ...get('jobTitle', ['jobTitles']),
      ...get('experienceSpan', ['experienceSpans']),
      invoiceType () {
        if (this.budget.companyId) {
          const company = this.companies.find(e => e.id === this.budget.companyId)
          return company.invoiceType
        } else return null
      },
      hourly: {
        get: function () {
          return new Intl.NumberFormat('tr-TR').format(this.budget.hourlyBudget)
        },
        // setter
        set: function (newValue) {
          if (newValue && newValue.length > 0) {
            const amount = this.unmaskMoney(newValue)
            this.budget.hourlyBudget = Math.round(amount * 100) / 100
            this.budget.dailyBudget = Math.round(amount * this.user.company.dailyShiftHours * 100) / 100
            this.budget.monthlyBudget = Math.round(amount * this.user.company.monthlyWorkHours * 100) / 100
          }
        },
      },
      daily: {
        get: function () {
          return new Intl.NumberFormat('tr-TR').format(this.budget.dailyBudget)
        },
        // setter
        set: function (newValue) {
          if (newValue && newValue.length > 0) {
            const amount = this.unmaskMoney(newValue)
            this.budget.dailyBudget = Math.round(amount * 100) / 100
            this.budget.hourlyBudget = Math.round(amount / this.user.company.dailyShiftHours * 100) / 100
            this.budget.monthlyBudget = Math.round(amount * (this.user.company.monthlyWorkHours / this.user.company.dailyShiftHours) * 100) / 100
          }
        },
      },
      monthly: {
        get: function () {
          return new Intl.NumberFormat('tr-TR').format(this.budget.monthlyBudget)
        },
        // setter
        set: function (newValue) {
          if (newValue && newValue.length > 0) {
            const amount = this.unmaskMoney(newValue)
            this.budget.monthlyBudget = Math.round(amount * 100) / 100
            this.budget.hourlyBudget = Math.round(amount / this.user.company.monthlyWorkHours * 100) / 100
            this.budget.dailyBudget = Math.round(amount / (this.user.company.monthlyWorkHours / this.user.company.dailyShiftHours) * 100) / 100
          }
        },
      },
    },
    methods: {
      moneyMask (amount) {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount)
      },
      unmaskMoney (formattedAmount) {
        return Number(formattedAmount.replaceAll('.', '').replaceAll(',', '.'))
      },
      updateBudget () {
        const fields = [
          this.budget.companyId,
          this.budget.jobTitleId,
          this.budget.experienceSpanId,
          this.budget.hourlyBudget,
          this.budget.dailyBudget,
          this.budget.monthlyBudget,
        ]
        if (!CheckIsNull(fields)) {
          const target = this.formType === 'create' ? 'budget/createBudget' : 'budget/updateBudget'
          this.$store.dispatch(target, this.budget)
          this.$emit('close-dialog')
        }
      },
      getCompanyInvoiceType () {
        if (this.budget.companyId) {
          const company = this.companies.find(e => e.id === this.budget.companyId)
          return company.invoiceType
        } else return null
      },
      isValidNum (evt) {
        evt = (evt) || window.event
        const charCode = (evt.which) ? evt.which : evt.keyCode
        if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 44) {
          evt.preventDefault()
        } else if (this.monthly.length > 0 && this.monthly.includes(',') && this.monthly.split(',')[1].length === 2) {
          evt.preventDefault()
        } else return true
      },
    },
  }
</script>

<style lang="scss" scoped></style>
