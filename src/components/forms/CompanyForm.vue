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
              v-model="supplier.name"
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
              v-model="supplier.email"
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
              v-model="supplier.vkn"
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
              v-model="supplier.phone"
              v-mask="'(###) ### ####'"
              label="Cep Telefonu"
              append-icon="mdi-close"
              prepend-icon="mdi-phone"
              :rules="RULES.PHONE"
              required
              @click:append="supplier.phone = ''"
            />
          </v-col>

          <!-- Address -->
          <v-col cols="12">
            <v-textarea
              v-model="supplier.address"
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
              v-model="supplier.fileDirectory"
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
              v-model="supplier.invoiceType"
              :items="billTypes"
              item-text="name"
              item-value="id"
              label="Faturalandırma Türü"
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
            @click="updateSupplier"
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
    name: 'SupplierForm',
    props: {
      formType: { type: String, default: 'create' },
      supplier: {
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
        this.supplier.name = null
        this.supplier.email = null
        this.supplier.vkn = null
        this.supplier.phone = null
        this.supplier.address = null
        this.supplier.invoiceType = null
        this.supplier.dailyShiftHours = null
        this.supplier.isSupplier = false
      },
      updateSupplier () {
        const fields = [
          this.supplier.name,
          this.supplier.email,
          this.supplier.vkn,
          this.supplier.phone,
          this.supplier.address,
          this.supplier.fileDirectory,
        ]

        if (this.supplier.isSupplier) {
          fields.push(this.supplier.invoiceType)
          this.supplier.dailyShiftHours = 0
          this.supplier.monthlyWorkHours = 0
          this.supplier.overtimeMultiplier = 0
        } else {
          this.supplier.invoiceType = 0
          fields.push(this.supplier.dailyShiftHours)
          fields.push(this.supplier.monthlyWorkHours)
          fields.push(this.supplier.overtimeMultiplier)
        }

        if (!CheckIsNull(fields)) {
          const target = this.formType === 'create' ? 'supplier/createSupplier' : 'supplier/updateSupplier'
          const payload = { ...this.supplier }

          this.$store.dispatch(target, payload)
          this.reset()
          this.$emit('close-dialog')
        }
      },
    },
  }
</script>

<style lang="scss" scoped></style>
