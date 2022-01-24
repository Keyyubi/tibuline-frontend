<template>
  <v-container
    id="cost-centers-view"
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

      <v-tab href="#costCenters">
        Masraf Merkezleri
        <v-icon>mdi-bank</v-icon>
      </v-tab>
      <v-tab href="#newCostCenter">
        Masraf Merkezi Oluştur
        <v-icon>mdi-bank-plus</v-icon>
      </v-tab>
    </v-tabs>

    <div class="py3" />

    <v-tabs-items v-model="currentTab">
      <v-tab-item value="costCenters">
        <v-card>
          <v-card-title>
            <v-text-field
              v-model="searchWord"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            />
          </v-card-title>

          <v-data-table
            :headers="headers"
            :items="costCenters"
            :search="searchWord"
          >
            <!-- eslint-disable-next-line -->
            <template v-slot:item.id="{ item }">
              <v-chip
                class="ma-2"
                color="primary"
                dark
                @click="showCostCenter(item)"
              >
                <b>Güncelle</b>
                <v-icon right>
                  mdi-arrow-right-bold
                </v-icon>
              </v-chip>
            </template>
          </v-data-table>
        </v-card>
        <v-dialog
          v-model="dialog"
          width="460"
          :retain-focus="false"
        >
          <v-card>
            <v-card-title class="text-h5 primary white--text">
              Masraf Merkezini Güncelle
            </v-card-title>

            <v-card-text>
              <v-form
                ref="editForm"
                v-model="editValid"
                lazy-validation
              >
                <v-container class="py-3">
                  <v-row>
                    <v-col>
                      <v-text-field
                        v-model="selectedCostCenter.abbreviation"
                        label="Kısaltma"
                        :rules="[
                          v => (!!v && v.length >= 3) || 'Kısaltma en az 3 karakter olmalıdır']"
                        required
                      />
                    </v-col>
                    <v-col>
                      <v-text-field
                        v-model="selectedCostCenter.name"
                        label="Masraf Merkezi"
                        :rules="[v => !!v || 'Bu alan boş geçilemez.']"
                        required
                      />
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-card-text>

            <v-divider />

            <!-- Card Actions -->
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="primary"
                depressed
                @click="updateCostCenter"
              >
                Güncelle
              </v-btn>
              <v-btn
                color="error"
                depressed
                @click="dialog = false"
              >
                Vazgeç
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-tab-item>

      <v-tab-item value="newCostCenter">
        <v-container class="py-3">
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model="newCostCenter.abbreviation"
                  label="Kısaltma"
                  :rules="[
                    v => (!!v && v.length >= 3) || 'Kısaltma en az 3 karakter olmalıdır']"
                  required
                  @keyup="uppercase()"
                />
              </v-col>

              <v-col cols="4">
                <v-text-field
                  v-model="newCostCenter.name"
                  label="Masraf Merkezi"
                  :rules="[v => !!v || 'Bu alan boş geçilemez.']"
                  required
                />
              </v-col>

              <v-col cols="4">
                <v-btn
                  class="my-2"
                  width="100%"
                  color="primary"
                  @click="createCostCenter()"
                >
                  Oluştur
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
  import { get } from 'vuex-pathify'
  export default {
    name: 'CostCenters',
    data () {
      return {
        valid: true,
        editValid: true,
        currentTab: 'costCenters',
        searchWord: '',
        dialog: false,
        selectedCostCenter: {},
        newCostCenter: { abbreviation: '', name: '' },
        headers: [
          {
            text: 'Güncelle',
            align: 'start',
            value: 'id',
          },
          { text: 'Kısaltma', value: 'abbreviation' },
          { text: 'Masraf Merkezi', value: 'name' },
        ],
      }
    },
    computed: {
      ...get('costCenter', ['costCenters']),
    },
    mounted () {
      this.$store.dispatch('costCenter/getCostCenters')
    },
    methods: {
      uppercase () {
        this.newCostCenter.abbreviation = this.newCostCenter.abbreviation.toUpperCase()
      },
      showCostCenter (item) {
        this.selectedCostCenter = { ...item }
        this.dialog = true
      },
      updateCostCenter () {
        if (this.$refs.editForm.validate()) {
          this.$store.dispatch('costCenter/updateCostCenter', this.selectedCostCenter)
          this.dialog = false
        }
      },
      createCostCenter () {
        if (this.$refs.form.validate()) {
          this.dialog = false
          this.$store.dispatch('costCenter/createCostCenter', this.newCostCenter)
          this.$refs.form.reset()
        }
      },
    },
  }
</script>

<style lang="scss" scoped></style>
