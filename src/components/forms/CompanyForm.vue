<template>
  <v-card>
    <v-card-title
      v-if="formType !== 'create'"
      class="text-h5 primary white--text"
    >
      Şirketi Güncelle
    </v-card-title>

    <v-card-text>
      <v-container class="py-3">
        <v-row>
          <!-- Username -->
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="company.name"
              label="Şirket Adı"
              :rules="[v => !!v || 'Şirket adı boş geçilemez',]"
              required
            />
          </v-col>

          <!-- Email -->
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="company.email"
              label="E-mail"
              :rules="RULES.EMAIL"
              required
            />
          </v-col>

          <!-- TCKN -->
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="company.vkn"
              v-mask="'##########'"
              label="VKN"
              :rules="RULES.VKN"
              required
            />
          </v-col>

          <!-- Phone -->
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="company.phone"
              v-mask="'(###) ### ####'"
              label="Cep Telefonu"
              append-icon="mdi-close"
              prepend-icon="mdi-phone"
              :rules="RULES.PHONE"
              required
              @click:append="company.phone = ''"
            />
          </v-col>

          <!-- Address -->
          <v-col cols="12">
            <v-textarea
              v-model="company.address"
              label="Adres"
              rows="1"
              required
            />
          </v-col>
        </v-row>

        <!-- Invoice and Documents info -->
        <v-row
          class="my-3"
          align="center"
        >
          <v-divider class="mr-3" />Fatura ve Dosyalama Bilgileri<v-divider class="ml-3" />
        </v-row>
        <v-row>
          <!-- IsSupplier -->
          <v-col
            cols="12"
            md="4"
          >
            <v-checkbox
              v-model="company.isSupplier"
              :label="`Tedarikçi Firma: ${company.isSupplier ? 'Evet' : 'Hayır'}`"
              @change="company.dailyShiftHours = 0"
            />
          </v-col>

          <!-- File Directory Name -->
          <v-col
            cols="12"
            md="4"
            class="d-flex justify-center align-center"
          >
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-information-outline
                </v-icon>
              </template>
              <span>Yüklenecek evrakların kaydedilmesi için oluşturulacak klasörün adı.</span>
            </v-tooltip>
            <v-text-field
              v-model="company.fileDirectory"
              label="Şirket Klasör Adı"
              required
            />
          </v-col>

          <!-- InvoiceType -->
          <v-col
            cols="12"
            md="4"
          >
            <v-select
              v-model="company.invoiceType"
              :items="billTypes"
              item-text="name"
              item-value="id"
              label="Faturalandırma Türü"
              :disabled="!company.isSupplier"
            />
          </v-col>
        </v-row>
        <v-row v-if="!company.isSupplier">
          <!-- DailyShiftHours -->
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="company.dailyShiftHours"
              label="Günlük çalışma saati (İş günü)"
              append-icon="mdi-clock"
              type="number"
              min="1"
              max="24"
            />
          </v-col>

          <!-- MonthlyWorkHours -->
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="company.monthlyWorkHours"
              label="Aylık çalışma saati (Max.)"
              append-icon="mdi-calendar-clock"
              type="number"
              min="1"
              max="300"
            />
          </v-col>

          <!-- OverShiftMultiplier -->
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="company.overtimeMultiplier"
              label="Fazla mesai çarpanı"
              append-icon="mdi-sort-clock-descending"
              type="number"
              min="1"
              max="10"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-divider />

    <!-- Card Actions -->
    <v-card-actions class="pa-4">
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
            @click="updateCompany"
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
  import { RULES } from '@/util/globals'
  import { CheckIsNull } from '@/util/helpers'
  export default {
    name: 'CompanyForm',
    props: {
      formType: { type: String, default: 'create' },
      company: {
        type: Object,
        default: () => {
          return {
            name: null,
            email: null,
            vkn: null,
            phone: null,
            address: null,
            invoiceType: null,
            dailyShiftHours: null,
            isSupplier: false,
            fileDirectory: null,
            overtimeMultiplier: null,
            monthlyWorkHours: null,
          }
        },
      },
    },
    data: () => ({
      billTypes: [
        { id: 0, name: 'Adam/Saat' },
        { id: 1, name: 'Adam/Gün' },
        { id: 2, name: 'Adam/Ay' },
      ],
      RULES,
    }),
    methods: {
      reset () {
        this.company.name = null
        this.company.email = null
        this.company.vkn = null
        this.company.phone = null
        this.company.address = null
        this.company.invoiceType = null
        this.company.dailyShiftHours = null
        this.company.isSupplier = null
      },
      updateCompany () {
        const fields = [
          this.company.name,
          this.company.email,
          this.company.vkn,
          this.company.phone,
          this.company.address,
          this.company.fileDirectory,
        ]

        if (this.company.isSupplier) {
          fields.push(this.company.invoiceType)
          this.company.dailyShiftHours = 0
          this.company.monthlyWorkHours = 0
          this.company.overtimeMultiplier = 0
        } else {
          this.company.invoiceType = 0
          fields.push(this.company.dailyShiftHours)
          fields.push(this.company.monthlyWorkHours)
          fields.push(this.company.overtimeMultiplier)
        }

        if (!CheckIsNull(fields)) {
          const target = this.formType === 'create' ? 'company/createCompany' : 'company/updateCompany'
          const payload = { ...this.company }

          this.$store.dispatch(target, payload)
          this.reset()
          this.$emit('close-dialog')
        }
      },
    },
  }
</script>

<style lang="scss" scoped></style>
