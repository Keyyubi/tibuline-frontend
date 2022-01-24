<template>
  <v-container
    id="companies-view"
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

      <v-tab href="#companies">
        Şirketler
        <v-icon>mdi-domain</v-icon>
      </v-tab>
      <v-tab href="#newCompany">
        Yeni Şirket Oluştur
        <v-icon>mdi-book-plus-multiple</v-icon>
      </v-tab>
    </v-tabs>

    <div class="py3" />

    <v-tabs-items v-model="currentTab">
      <v-tab-item value="companies">
        <v-card>
          <v-card-title>
            <v-row>
              <v-text-field
                v-model="searchWord"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              />
            </v-row>
          </v-card-title>

          <v-data-table
            :headers="headers"
            :items="companies"
            :search="searchWord"
          >
            <!-- eslint-disable-next-line -->
            <template v-slot:item.id="{ item }">
              <v-chip
                class="ma-2"
                color="primary"
                dark
                @click="showCompany(item)"
              >
                Güncelle
                <v-icon right>
                  mdi-arrow-right-bold
                </v-icon>
              </v-chip>
            </template>
            <template v-slot:item.isSupplier="{ item }">
              <div style="width: 100%; padding-left: 15%;">
                <v-icon>
                  {{ item.isSupplier ? 'mdi-check' : 'mdi-close' }}
                </v-icon>
              </div>
            </template>
          </v-data-table>
        </v-card>

        <!-- Edit Dialog -->
        <v-dialog
          v-model="dialog"
          width="960"
          :retain-focus="false"
        >
          <company-form
            form-type="update"
            :company="selectedCompany"
            @close-dialog="dialog = false"
          />
        </v-dialog>
      </v-tab-item>

      <v-tab-item value="newCompany">
        <company-form
          form-type="create"
          :company="newCompany"
        />
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
  import { get } from 'vuex-pathify'
  export default {
    name: 'Companies',
    data () {
      return {
        currentTab: 'companies',
        searchWord: '',
        dialog: false,
        selectedCompany: {},
        newCompany: {
          name: null,
          email: null,
          vkn: null,
          phone: null,
          address: null,
          invoiceType: null,
          dailyShiftHours: null,
          isSupplier: false,
        },
        headers: [
          {
            text: 'Güncelle',
            align: 'start',
            value: 'id',
          },
          { text: 'Şirket', value: 'name' },
          { text: 'E-mail', value: 'email' },
          { text: 'Telefon', value: 'phone' },
          { text: 'Adres', value: 'address' },
          { text: 'VKN', value: 'vkn' },
          { text: 'Tedarikçi', value: 'isSupplier' },
        ],
      }
    },
    computed: {
      ...get('company', ['companies']),
    },
    mounted () {
      this.$store.dispatch('company/getCompanies')
    },
    methods: {
      closeDialog () {
        this.dialog = false
        this.selectedCompany = {}
      },
      showCompany (item) {
        this.selectedCompany = { ...item }
        this.dialog = true
      },
    },
  }
</script>

<style lang="scss" scoped></style>
