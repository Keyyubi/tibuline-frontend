<template>
  <v-card>
    <v-card-title
      v-if="formType !== 'create'"
      class="text-h5 primary white--text"
    >
      Bütçe Planını Güncelle
    </v-card-title>

    <v-card-text>
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
              :items="jobTitles.filter(e => e.id === budget.companyId)"
              item-text="name"
              item-value="id"
              label="Ünvan"
            />
          </v-col>

          <!-- ExperienceSpan -->
          <v-col cols="4">
            <v-autocomplete
              v-model="budget.experienceSpanId"
              :items="experienceSpans.filter(e => e.id === budget.companyId)"
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
            @click="closeForm()"
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
            const str = newValue.replaceAll('.', '').replaceAll(',', '.')
            this.budget.hourlyBudget = Number(str)
          }
        },
      },
      daily: {
        get: function () {
          return new Intl.NumberFormat('tr-TR').format(this.budget.daily)
        },
        // setter
        set: function (newValue) {
          if (newValue && newValue.length > 0) {
            const str = newValue.replaceAll('.', '').replaceAll(',', '.')
            this.budget.daily = Number(str)
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
            const str = newValue.replaceAll('.', '').replaceAll(',', '.')
            this.budget.monthlyBudget = Number(str)
          }
        },
      },
    },
    methods: {
      moneyMask (amount) {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount)
      },
      getInformattedMoney (value) {
        return Number(value.replaceAll('.', '').replaceAll(',', '.'))
      },
      reset () {
        this.budget.companyId = null
        this.budget.jobTitleId = null
        this.budget.experienceSpanId = null
        this.hourly = null
        this.daily = null
      },
      updateBudget () {
        const fields = [
          this.budget.companyId,
          this.budget.jobTitleId,
          this.budget.experienceSpanId,
        ]
        if (!CheckIsNull(fields)) {
          this.budget.hourlyBudget = this.getInformattedMoney(this.budget.hourlyBudget)
          this.budget.dailyBudget = this.getInformattedMoney(this.budget.dailyBudget)
          this.budget.monthlyBudget = this.getInformattedMoney(this.budget.monthlyBudget)
          this.budget.totalBudget = this.getInformattedMoney(this.budget.totalBudget)

          const target = this.formType === 'create' ? 'budget/createBudget' : 'budget/updateBudget'
          this.$store.dispatch(target, this.budget)
          this.reset()
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
      closeForm () {
        this.reset()
        this.$emit('close-dialog')
      },
    },
  }
</script>

<style lang="scss" scoped></style>
