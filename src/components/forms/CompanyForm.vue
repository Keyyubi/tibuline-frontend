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

          <!-- IsSupplier -->
          <v-col
            cols="12"
            md="3"
          >
            <v-checkbox
              v-model="company.isSupplier"
              :label="`Tedarikçi Firma: ${company.isSupplier ? 'Evet' : 'Hayır'}`"
              @change="company.dailyShiftHours = 0"
            />
          </v-col>

          <!-- DailyShiftHours -->
          <v-col
            cols="12"
            md="3"
          >
            <v-text-field
              v-model="company.dailyShiftHours"
              label="Günlük çalışma saati (İş günü)"
              append-icon="mdi-clock"
              type="number"
              min="0"
              max="24"
              :disabled="company.isSupplier"
            />
          </v-col>

          <!-- InvoiceType -->
          <v-col
            cols="12"
            md="3"
          >
            <v-select
              v-model="company.invoiceType"
              :items="billTypes"
              item-text="name"
              item-value="id"
              label="Faturalandırma Türü"
            />
          </v-col>

          <!-- File Directory Name -->
          <v-col
            cols="12"
            md="3"
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
            />
          </v-col>

          <!-- Address -->
          <v-col cols="12">
            <v-textarea
              v-model="company.address"
              label="Adres"
              rows="2"
              required
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
      company: { type: Object, default: null },
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
          this.company.invoiceType,
        ]

        if (!CheckIsNull(fields)) {
          const target = this.formType === 'create' ? 'company/createCompany' : 'company/updateCompany'
          this.$store.dispatch(target, this.company)
          this.reset()
          this.$emit('close-dialog')
        }
      },
    },
  }
</script>

<style lang="scss" scoped></style>
