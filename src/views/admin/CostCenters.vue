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
            <template v-slot:item.abbr="{ item }">
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
                    <b>{{ item.abbr }}</b>
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
                            v-model="selectedCostCenter.abbr"
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
        <v-form>
          <v-container class="py-3">
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model="newCostCenter.abbr"
                  label="Kısaltma"
                />
              </v-col>

              <v-col cols="4">
                <v-text-field
                  v-model="newCostCenter.name"
                  label="Masraf Merkezi"
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
          </v-container>
        </v-form>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
  export default {
    name: 'CostCenters',
    data () {
      return {
        currentTab: 'costCenters',
        searchWord: '',
        dialog: false,
        selectedCostCenter: {},
        newCostCenter: { abbr: '', name: '' },
        headers: [
          {
            text: 'Kısaltma',
            align: 'start',
            value: 'abbr',
          },
          { text: 'Masraf Merkezi', value: 'name' },
        ],
        costCenters: [
          { id: 0, name: 'POS ve Üye işyerleri', abbr: 'POS' },
          { id: 1, name: 'Masraf merkezi 2', abbr: 'MER1' },
          { id: 2, name: 'Masraf merkezi 3', abbr: 'MER2' },
          { id: 10, name: 'POS ve Üye işyerleri', abbr: 'POS' },
          { id: 11, name: 'Masraf merkezi 2', abbr: 'MER1' },
          { id: 12, name: 'Masraf merkezi 3', abbr: 'MER2' },
          { id: 20, name: 'POS ve Üye işyerleri', abbr: 'POS' },
          { id: 21, name: 'Masraf merkezi 2', abbr: 'MER1' },
          { id: 22, name: 'Masraf merkezi 3', abbr: 'MER2' },
          { id: 30, name: 'POS ve Üye işyerleri', abbr: 'POS' },
          { id: 31, name: 'Masraf merkezi 2', abbr: 'MER1' },
          { id: 32, name: 'Masraf merkezi 3', abbr: 'MER2' },
        ],
      }
    },
    methods: {
      editCostCenter (item) {
        this.selectedCostCenter = { ...item }
        this.dialog = true
      },
      updateCostCenter () {
        console.log('selected', this.selectedCostCenter)
        this.dialog = false
        this.$store.commit('app/isLoading', true)
        setTimeout(() => {
          this.$store.commit('app/isLoading', false)
        }, 1500)
      },
      createCostCenter () {
        console.log('selected', this.newCostCenter)
        this.dialog = false
        this.$store.commit('app/isLoading', true)
        setTimeout(() => {
          this.$store.commit('app/isLoading', false)
        }, 1500)
      },
    },
  }
</script>

<style lang="scss" scoped></style>
