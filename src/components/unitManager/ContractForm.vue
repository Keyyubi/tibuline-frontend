<template>
  <v-container class="py-3">
    <v-row>
      <!-- Supplier Company -->
      <v-col
        cols="12"
        md="4"
      >
        <v-autocomplete
          v-model="contract.supplierCompanyId"
          :items="companies"
          item-text="name"
          item-value="id"
          label="Şirket"
        />
      </v-col>


      <!-- Consultant -->
      <v-col
        cols="12"
        md="4"
      >
        <v-autocomplete
          v-model="contract.supplierCompanyId"
          :items="companies"
          item-text="name"
          item-value="id"
          label="Danisman"
        />
      </v-col>

      <!-- StartDate -->
      <v-col
        cols="12"
        md="4"
      >
        <v-menu
          ref="menu1"
          v-model="menu1"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="starting"
              label="Başlangıç Tarihi"
              persistent-hint
              prepend-icon="mdi-calendar"
              v-bind="attrs"
              v-on="on"
            />
          </template>
          <v-date-picker
            v-model="contract.startDate"
            no-title
            @input="menu1 = false"
            @change="e => starting = getComputedDate(e)"
          />
        </v-menu>
      </v-col>

      <!-- EndDate -->
      <v-col
        cols="12"
        md="4"
      >
        <v-menu
          ref="menu2"
          v-model="menu2"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="ending"
              label="Bitiş Tarihi"
              persistent-hint
              prepend-icon="mdi-calendar"
              v-bind="attrs"
              v-on="on"
            />
          </template>
          <v-date-picker
            v-model="contract.endDate"
            no-title
            @input="menu2 = false"
            @change="e => ending = getComputedDate(e)"
          />
        </v-menu>
      </v-col>

      <v-col
        cols="12"
        md="4"
      >
        <v-file-input
          v-model="contractDocument"
          chips
          label="Sözleşme Yükle"
        />
      </v-col>
    </v-row>

    <!-- Actions -->
    <v-row class="my-3">
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
          @click="createOrUpdateContract()"
        >
          {{ formType === 'create' ? 'Oluştur' : 'Güncelle' }}
        </v-btn>
      </v-col>
      <v-col
        v-if="formType !== 'create'"
        cols="6"
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
  </v-container>
</template>

<script>
  import { get } from 'vuex-pathify'
  export default {
    name: 'ContractForm',
    props: {
      formType: { type: String, default: 'create' },
      contract: { type: Object, default: null },
    },
    data: () => ({
      contractDocument: null,
      menu1: false,
      menu2: false,
      menu3: false,
      file: null,
      date: null,
      starting: null,
      ending: null,
      jobStarting: null,
    }),
    computed: {
      ...get('user', ['user']),
      ...get('manager', ['companies']),
    },
    mounted () {
      this.$store.dispatch('manager/getSupplierCompanies')

      this.contract.createdById = this.user.id
    },
    methods: {
      save (date) {
        const arr = date.split('-')

        this.localeDate = `${arr[2]}/${arr[1]}/${arr[0]}`
        this.contract.birthday = new Date(date).toISOString()
        this.$refs.menu.save(date)
      },
      getComputedDate (date) {
        const arr = date.split('T')[0].split('-')
        return `${arr[2]}/${arr[1]}/${arr[0]}`
      },
      createDocument () {
        const formData = new FormData()
        formData.append('files', this.file)

        this.$store.dispatch('manager/uploadDocument', formData)
      },
      createOrUpdateContract () {
        let isNull = false
        const arr = [
          this.contract.contractStatus,
          this.contract.filePath,
          this.contract.startDate,
          this.contract.endDate,
          this.contract.jobStartDate,
          this.contract.supplierCompanyId,
        ]
        arr.forEach(e => { if (!e) isNull = true })

        if (!isNull) {
          const sending = { ...this.contract }

          if (this.formType === 'create') {
            const formData = new FormData()
            formData.append('files', this.contractDocument)
            this.$store.dispatch('manager/createContract', { formData, sending })
            this.clearForm()
          } else this.$store.dispatch('manager/updateContract', sending)
          this.$emit('close-dialog')
        } else {
          this.$store.dispatch('app/showAlert', { message: 'Lütfen tüm alanları doldurunuz.', type: 'warning' })
        }
      },
      clearForm () {
        this.contract.contractStatus = 0
        this.contract.filePath = null
        this.contract.startDate = null
        this.contract.endDate = null
        this.contract.jobStartDate = null
        this.contract.supplierCompanyId = null
      },
    },
  }
</script>

<style lang="scss" scoped></style>
