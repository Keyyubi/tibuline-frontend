<template>
  <v-container
    id="suppliers-view"
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

      <v-tab href="#suppliers">
        Şirketler
        <v-icon>mdi-domain</v-icon>
      </v-tab>
      <v-tab href="#newSupplier">
        Yeni Şirket Oluştur
        <v-icon>mdi-book-plus-multiple</v-icon>
      </v-tab>
    </v-tabs>

    <div class="py3" />

    <v-tabs-items v-model="currentTab">
      <v-tab-item value="suppliers">
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
            :items="suppliers"
            :search="searchWord"
          >
            <!-- eslint-disable-next-line -->
            <template v-slot:item.id="{ item }">
              <v-chip
                class="ma-2"
                color="primary"
                dark
                @click="showSupplier(item)"
              >
                <b>Güncelle</b>
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
          <supplier-form
            form-type="update"
            :supplier="selectedSupplier"
            @close-dialog="dialog = false"
          />
        </v-dialog>
      </v-tab-item>

      <v-tab-item value="newSupplier">
        <supplier-form />
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
  import { get } from 'vuex-pathify'
  export default {
    name: 'Suppliers',
    data () {
      return {
        currentTab: 'suppliers',
        searchWord: '',
        dialog: false,
        selectedSupplier: {},
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
      ...get('supplier', ['suppliers']),
    },
    mounted () {
      this.$store.dispatch('supplier/getSuppliers')
    },
    methods: {
      closeDialog () {
        this.dialog = false
        this.selectedSupplier = {}
      },
      showSupplier (item) {
        this.selectedSupplier = { ...item }
        this.dialog = true
      },
    },
  }
</script>

<style lang="scss" scoped></style>
