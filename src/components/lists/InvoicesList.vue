<template>
  <v-card>
    <v-card-title>
      <v-row>
        <v-col md="3">
          <v-autocomplete
            v-model="consultantFilter"
            :items="consultants"
            :item-text="e => e.firstname + ' ' + e.lastname"
            item-value="id"
            label="Danışman Filtrele"
            @change="filterData('consultant')"
          />
        </v-col>
        <v-col md="3">
          <v-autocomplete
            v-model="managerFilter"
            :items="users"
            :item-text="e => e.firstname + ' ' + e.lastname"
            item-value="id"
            label="Yönetici Filtrele"
            @change="filterData('manager')"
          />
        </v-col>
        <v-col md="3">
          <v-autocomplete
            v-model="periodFilter"
            :items="activityPeriods"
            item-text="name"
            item-value="name"
            label="Dönem Filtrele"
            @change="filterData('period')"
          />
        </v-col>
        <v-col
          align-self="center"
          md="3"
        >
          <v-btn
            align-baseline
            width="100%"
            depressed
            color="primary"
            outlined
            small
            @click="filterData()"
          >
            Sıfırla
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="items"
    >
      <!-- eslint-disable-next-line -->
      <template v-slot:item.invoiceNo="{ item }">
        <v-chip
          class="ma-2"
          color="primary"
          dark
          @click="showInvoice(item)"
        >
          <b>{{ item.invoiceNo || 'BOŞ' }}</b>
          <v-icon right>
            mdi-arrow-right-bold
          </v-icon>
        </v-chip>
      </template>
      <template v-slot:item.consultantId="{ item }">
        {{ getConsultantName(item.consultantId) }}
      </template>
      <template v-slot:item.unitManagerUserId="{ item }">
        {{ getUnitManagerName(item.unitManagerUserId) }}
      </template>
      <template v-slot:item.invoiceDate="{ item }">
        {{ getLocaleDate(item.invoiceDate) }}
      </template>
      <template v-slot:item.description="{ item }">
        {{ getDescription(item.description) }}
      </template>
      <template v-slot:item.amount="{ item }">
        {{ moneyMask(item.amount) }}
      </template>
      <template v-slot:item.taxAmount="{ item }">
        {{ moneyMask(item.taxAmount) }}
      </template>
      <template v-slot:item.totalAmount="{ item }">
        {{ moneyMask(item.totalAmount) }}
      </template>

      <!-- eslint-disable-next-line -->
      <template v-slot:item.isPaid="{ item }">
        <v-chip
          :color="item.isPaid ? 'green' : 'grey'"
          dark
        >
          {{ item.isPaid ? 'Aktif' : 'Pasif' }}
        </v-chip>
      </template>
    </v-data-table>

    <v-dialog
      v-model="dialog"
      width="75%"
      :retain-focus="false"
      offset-x
    >
      <v-card v-if="selectedInvoice !== null">
        <v-card-title class="text-h5 primary white--text">
          Fatura Detayı
        </v-card-title>

        <v-card-text class="py-0">
          <v-container class="mt-2">
            <v-row class="mb-5">
              <v-col
                cols="12"
                md="4"
              >
                <v-list-item two-line>
                  <v-list-item-content>
                    <v-list-item-title>{{ selectedInvoice.supplier.name }}</v-list-item-title>
                    <v-list-item-subtitle>Şirket</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item two-line>
                  <v-list-item-content>
                    <v-list-item-title>{{ selectedInvoice.supplier.address }}</v-list-item-title>
                    <v-list-item-subtitle>Adres</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item two-line>
                  <v-list-item-content>
                    <v-list-item-title>{{ selectedInvoice.supplier.vkn }}</v-list-item-title>
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
                    <v-list-item-title>{{ moneyMask(selectedInvoice.amount) }}</v-list-item-title>
                    <v-list-item-subtitle>Tutar</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item two-line>
                  <v-list-item-content>
                    <v-list-item-title>{{ moneyMask(selectedInvoice.taxAmount) }}</v-list-item-title>
                    <v-list-item-subtitle>KDV</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item two-line>
                  <v-list-item-content>
                    <v-list-item-title>{{ moneyMask(selectedInvoice.totalAmount) }}</v-list-item-title>
                    <v-list-item-subtitle>Toplam Tutar</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col
                cols="12"
                md="6"
              >
                <v-textarea
                  v-model="selectedInvoice.description"
                  rows="8"
                  label="Fatura açıklaması"
                  outlined
                  disabled
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-btn
            class="white--text mr-3"
            :color="selectedInvoice.invoiceFilePath ? 'primary' : 'grey'"
            depressed
            outlined
            @click="showInvoiceFile"
          >
            Faturayı görüntüle
          </v-btn>
          <v-spacer />
          <v-btn
            class="white--text mr-3"
            color="green"
            depressed
            :disabled="selectedInvoice.isPaid"
            @click="payInvoice"
          >
            {{ selectedInvoice.isPaid ? 'Ödeme yapıldı' : 'Faturayı Öde' }}
          </v-btn>
          <v-btn
            color="error"
            dark
            depressed
            @click="closeDialog()"
          >
            Vazgeç
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
  import { get } from 'vuex-pathify'
  export default {
    name: 'InvoicesList',
    data () {
      return {
        searchWord: '',
        dialog: false,
        items: [],
        consultantFilter: '',
        managerFilter: '',
        periodFilter: '',
        selectedInvoice: null,
        headers: [
          {
            text: 'Fatura No.',
            align: 'start',
            value: 'invoiceNo',
            width: '150',
          },
          { text: 'Fatura Tar.', value: 'invoiceDate', width: '150' },
          { text: 'Danışman', value: 'consultantId', width: '250' },
          { text: 'Yönetici', value: 'unitManagerUserId', width: '250' },
          { text: 'Dönem', value: 'period', width: '120' },
          { text: 'Açıklama', value: 'description', width: '250' },
          { text: 'Tutar', value: 'amount', width: '150' },
          { text: 'KDV tutarı', value: 'taxAmount', width: '150' },
          { text: 'TOPLAM', value: 'totalAmount', width: '150' },
        ],
      }
    },
    computed: {
      ...get('user', ['user', 'users']),
      ...get('consultant', ['consultants']),
      ...get('supplier', ['suppliers']),
      ...get('invoice', ['invoices']),
      ...get('activityPeriod', ['activityPeriods']),
    },
    mounted () {
      this.$store.dispatch('consultant/getAllConsultants')
      this.$store.dispatch('supplier/getSuppliers')
      this.$store.dispatch('user/getUnitManagers')
      this.$store.dispatch('invoice/getInvoices')
      this.$store.dispatch('activityPeriod/getActivityPeriods')

      setTimeout(() => {
        this.filterData()
      }, 500)
    },
    methods: {
      filterData (type) {
        switch (type) {
          case 'consultant':
            this.items = this.invoices.filter(e => e.consultantId === this.consultantFilter)
            break
          case 'manager':
            this.items = this.invoices.filter(e => e.unitManagerUserId === this.managerFilter)
            break
          case 'period':
            this.items = this.invoices.filter(e => e.period === this.periodFilter)
            break
          default:
            this.consultantFilter = null
            this.managerFilter = null
            this.periodFilter = null
            this.items = this.invoices
            break
        }
      },
      showInvoice (invoice) {
        const supplier = this.suppliers.find(e => e.id === invoice.supplierId)
        this.selectedInvoice = { ...invoice, supplier }
        this.dialog = true
      },
      showInvoiceFile () {
        if (this.selectedInvoice && this.selectedInvoice.invoiceFilePath) {
          window.open(this.selectedInvoice.invoiceFilePath, '_blank').focus()
        } else {
          this.$store.dispatch('app/showAlert', { message: 'Fatura dosyası bulunmuyor.', type: 'warning' })
        }
      },
      payInvoice () {
        console.log('invoice', this.selectedInvoice)
      },
      closeDialog () {
        this.selectedInvoice = null
        this.dialog = false
      },
      moneyMask (amount) {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount)
      },
      getSupplierName (id) {
        const supplier = this.suppliers.find(e => e.id === id)
        console.log('comp', supplier)
        return supplier ? supplier.name : 'Şirket bilgisi bulunamadı.'
      },
      getUnitManagerName (id) {
        const user = this.users.find(e => e.id === id)
        return user ? user.firstname + ' ' + user.lastname : 'İsim bulunamadı.'
      },
      getConsultantName (id) {
        const consultant = this.consultants.find(e => e.id === id)
        return consultant ? consultant.firstname + ' ' + consultant.lastname : 'İsim bulunamadı.'
      },
      getLocaleDate (date) {
        if (date) {
          const arr = date.split('T')[0].split('-')
          return `${arr[2]}/${arr[1]}/${arr[0]}`
        } else return ' - '
      },
      getDescription (desc) {
        return desc && desc.length > 30 ? desc.slice(0, 30) + '...' : desc
      },
    },
  }
</script>

<style lang="scss" scoped></style>
