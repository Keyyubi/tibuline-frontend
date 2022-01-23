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
          <v-col cols="4">
            <v-autocomplete
              v-model="selectedCompany"
              :items="companies"
              item-text="name"
              item-value="id"
              label="Şirket"
              return-object
              @change="getCompanyItems"
            />
          </v-col>
          <v-col cols="4">
            <v-autocomplete
              v-model="budget.jobTitleId"
              :items="jobTitles"
              item-text="name"
              item-value="id"
              label="Ünvan"
            />
          </v-col>
          <v-col cols="4">
            <v-autocomplete
              v-model="budget.experienceSpanId"
              :items="experienceSpans"
              item-text="name"
              item-value="id"
              label="Tecrübe Aralığı"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            md="3"
          >
            <v-text-field
              v-model="budget.hourlyBudget"
              v-mask="currencyMask"
              prepend-icon="mdi-currency-try"
              label="Bütçe (Adam/Saat)"
              :disabled="!selectedCompany || selectedCompany.invoiceType != InvoiceTypes.HOURLY"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
          >
            <v-text-field
              v-model="budget.dailyBudget"
              v-mask="currencyMask"
              prepend-icon="mdi-currency-try"
              label="Bütçe (Adam/Gün)"
              :disabled="!selectedCompany || selectedCompany.invoiceType != InvoiceTypes.DAILY"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
          >
            <v-text-field
              v-model="budget.monthlyBudget"
              v-mask="currencyMask"
              prepend-icon="mdi-currency-try"
              label="Bütçe (Adam/Ay)"
              :disabled="!selectedCompany || selectedCompany.invoiceType != InvoiceTypes.MONTHLY"
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
      selectedCompany: null,
      currencyMask,
      InvoiceTypes,
    }),
    computed: {
      ...get('budget', ['budgets']),
      ...get('company', ['companies']),
      ...get('jobTitle', ['jobTitles']),
      ...get('experienceSpan', ['experienceSpans']),
    },
    methods: {
      moneyMask (amount) {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount)
      },
      getCompanyItems () {
        const { id } = this.selectedCompany
        this.$store.dispatch('jobTitle/getJobTitlesByCompanyId', id)
        this.$store.dispatch('experienceSpan/getExperienceSpansByCompanyId', id)
      },
      getInformattedMoney (value) {
        return Number(value.replaceAll('.', '').replaceAll(',', '.'))
      },
      reset () {
        this.selectedCompany = null
        this.budget.companyId = null
        this.budget.jobTitleId = null
        this.budget.experienceSpanId = null
        this.budget.hourlyBudget = 0
        this.budget.dailyBudget = 0
        this.budget.monthlyBudget = 0
        this.budget.totalBudget = 0
      },
      updateBudget () {
        const fields = [
          this.budget.companyId,
          this.budget.jobTitleId,
          this.budget.experienceSpanId,
        ]
        if (!CheckIsNull(fields)) {
          console.log('this.budget1', this.budget)
          this.budget.hourlyBudget = this.getInformattedMoney(this.budget.hourlyBudget)
          this.budget.dailyBudget = this.getInformattedMoney(this.budget.dailyBudget)
          this.budget.monthlyBudget = this.getInformattedMoney(this.budget.monthlyBudget)
          this.budget.totalBudget = this.getInformattedMoney(this.budget.totalBudget)
          console.log('this.budget2', this.budget)
          const target = this.formType === 'create' ? 'budget/createBudget' : 'budget/updateBudget'
          this.$store.dispatch(target, this.budget)
          this.reset()
          this.$emit('close-dialog')
        }
      },
    },
  }
</script>

<style lang="scss" scoped></style>
