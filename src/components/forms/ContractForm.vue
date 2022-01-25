<template>
  <v-container class="py-3">
    <v-row>
      <!-- Supplier Company -->
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          :value="user.company.name"
          label="Şirket"
          disabled
        />
      </v-col>

      <!-- Consultant -->
      <v-col
        cols="12"
        md="6"
      >
        <v-autocomplete
          v-model="contract.consultantId"
          :items="consultants"
          :item-text="e => e.firstname + ' ' + e.lastname"
          item-value="id"
          label="Danışman"
        />
      </v-col>

      <!-- StartDate -->
      <v-col
        cols="12"
        :md="formType === 'create' ? '6' : '4'"
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
            @change="selectStartDate"
          />
        </v-menu>
      </v-col>

      <!-- EndDate -->
      <v-col
        cols="12"
        :md="formType === 'create' ? '6' : '4'"
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
            @change="e => ending = getLocaleDate(e)"
          />
        </v-menu>
      </v-col>

      <!-- Contract File -->
      <v-col
        v-if="formType !== 'create'"
        cols="12"
        md="4"
      >
        Sözleşme:
        <v-btn-toggle
          tile
          color="primary"
          group
        >
          <v-btn
            color="primary"
            depressed
            outlined
            :disabled="!(contract.filePath && contract.filePath.length > 0) "
            @click="showContract"
          >
            Görüntüle
          </v-btn>
          <v-btn
            color="primary"
            depressed
            outlined
            :disabled="(contract.filePath && contract.filePath.length > 0) "
            @click="contractDialog = true"
          >
            Yükle
          </v-btn>
        </v-btn-toggle>
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
          @click="clearForm()"
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

    <!-- ContractFile dialog -->
    <v-dialog
      v-model="contractDialog"
      persistent
      width="460"
    >
      <v-card>
        <v-card-title class="text-h5 primary white--text">
          Sözleşme Yükle
        </v-card-title>
        <v-card-text>
          <v-file-input
            v-model="contractDocument"
            chips
            label="Sözleşme"
            accept="image/*, .pdf"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            width="50%"
            depressed
            small
            @click="uploadContract"
          >
            Yükle
          </v-btn>
          <v-btn
            color="error"
            width="50%"
            depressed
            small
            @click="contractDialog = false"
          >
            Vazgeç
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      contractDialog: false,
      menu1: false,
      menu2: false,
      file: null,
      date: null,
      starting: null,
      ending: null,
    }),
    computed: {
      ...get('user', ['user']),
      ...get('consultant', ['consultants']),
    },
    mounted () {
      this.$store.dispatch('consultant/getConsultants')

      this.contract.supplierCompanyId = this.user.company.id

      if (this.formType !== 'create') {
        this.starting = this.getLocaleDate(this.contract.startDate)
        this.ending = this.getLocaleDate(this.contract.endDate)
      }
    },
    methods: {
      selectStartDate () {
        this.starting = this.getLocaleDate(this.contract.startDate)

        if (this.formType === 'create') {
          const str = this.contract.startDate.split('-')
          str[0] = Number(str[0]) + 1
          this.contract.endDate = str.join('-')
          this.ending = this.getLocaleDate(this.contract.endDate)
        }
      },
      getLocaleDate (date) {
        const arr = date.split('T')[0].split('-')
        return `${arr[2]}/${arr[1]}/${arr[0]}`
      },
      createOrUpdateContract () {
        let isNull = false
        const arr = [
          this.contract.startDate,
          this.contract.endDate,
          this.contract.consultantId,
        ]
        arr.forEach(e => { if (!e) isNull = true })

        if (!isNull) {
          const payload = { ...this.contract }

          this.formType === 'create'
            ? this.$store.dispatch('contract/createContract', payload)
            : this.$store.dispatch('contract/updateContract', payload)

          this.clearForm()
          this.$emit('close-dialog')
        } else {
          this.$store.dispatch('app/showAlert', { message: 'Lütfen tüm alanları doldurunuz.', type: 'warning' })
        }
      },
      showContract () {
        if (this.contract.filePath) {
          window.open(this.contract.filePath, '_blank').focus()
        }
      },
      uploadContract () {
        if (this.contractDocument !== null) {
          const formData = new FormData()
          formData.append('files', this.contractDocument)
          this.$store.dispatch('contract/uploadContract', { formData, id: this.contract.id })
          this.contractDialog = false
          this.$emit('close-dialog')
        }
      },
      clearForm () {
        this.contract.filePath = null
        this.contract.startDate = null
        this.contract.endDate = null
      },
    },
  }
</script>

<style lang="scss" scoped></style>
