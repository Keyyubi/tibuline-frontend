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
            <template v-slot:item.abbreviation="{ item }">
              <v-dialog
                v-model="dialog"
                width="460"
                :retain-focus="false"
              >
                <!-- eslint-disable-next-line -->
                <template v-slot:activator="{ on, attrs }">
                  <v-chip
                    class="ma-2"
                    color="primary"
                    dark
                    @click="editCostCenter(item)"
                  >
                    <b>{{ item.abbreviation }}</b>
                    <v-icon right>
                      mdi-arrow-right-bold
                    </v-icon>
                  </v-chip>
                </template>

                <v-card>
                  <v-card-title class="text-h5 primary white--text">
                    Masraf Merkezini Güncelle
                  </v-card-title>

                  <v-card-text>
                    <v-container class="py-3">
                      <v-row>
                        <v-col>
                          <v-text-field
                            v-model="selectedCostCenter.abbreviation"
                            label="Kısaltma"
                          />
                        </v-col>
                        <v-col>
                          <v-text-field
                            v-model="selectedCostCenter.name"
                            label="Masraf Merkezi"
                          />
                        </v-col>
                      </v-row>
                    </v-container>
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
            </template>
          </v-data-table>
        </v-card>
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

          <!-- Alert Message -->
          <v-row justify="center">
            <v-alert
              v-if="responseMsg.length > 0"
              :color="isErrorMsg ? 'error' : 'success'"
              dark
              border="top"
              :icon="isErrorMsg ? 'mdi-alert' : 'mdi-check-circle'"
              transition="scale-transition"
            >
              {{ responseMsg }}
            </v-alert>
          </v-row>
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
        currentTab: 'costCenters',
        searchWord: '',
        dialog: false,
        selectedCostCenter: {},
        newCostCenter: { abbreviation: '', name: '' },
        headers: [
          {
            text: 'Kısaltma',
            align: 'start',
            value: 'abbreviation',
          },
          { text: 'Masraf Merkezi', value: 'name' },
        ],
      }
    },
    computed: {
      ...get('app', ['responseMsg', 'isErrorMsg']),
      ...get('admin', ['costCenters']),
    },
    mounted () {
      this.$store.dispatch('admin/getCostCenters')
    },
    methods: {
      uppercase () {
        this.newCostCenter.abbreviation = this.newCostCenter.abbreviation.toUpperCase()
      },
      editCostCenter (item) {
        this.selectedCostCenter = { ...item }
        this.dialog = true
      },
      updateCostCenter () {
        this.dialog = false
        this.$store.dispatch('admin/updateCostCenter', this.selectedCostCenter)
      },
      createCostCenter () {
        if (this.$refs.form.validate()) {
          this.dialog = false
          this.$store.dispatch('admin/createCostCenter', this.newCostCenter)
          this.$refs.form.reset()
        }
      },
    },
  }
</script>

<style lang="scss" scoped></style>
