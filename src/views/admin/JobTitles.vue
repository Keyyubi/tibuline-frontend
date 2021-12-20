<template>
  <v-container
    id="job-titles-view"
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

      <v-tab href="#jobTitles">
        Ünvanlar
        <v-icon>mdi-subtitles</v-icon>
      </v-tab>
      <v-tab href="#newJobTitle">
        Yeni Ünvan Oluştur
        <v-icon>mdi-card-plus-outline</v-icon>
      </v-tab>
    </v-tabs>

    <div class="py3" />

    <v-tabs-items v-model="currentTab">
      <v-tab-item value="jobTitles">
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
            :items="jobTitles"
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
                    @click="editJobTitle(item)"
                  >
                    <b>{{ item.abbr }}</b>
                    <v-icon right>
                      mdi-arrow-right-bold
                    </v-icon>
                  </v-chip>
                </template>

                <v-card>
                  <v-card-title class="text-h5 primary white--text">
                    Ünvanı Güncelle
                  </v-card-title>

                  <v-card-text>
                    <v-container class="py-3">
                      <v-row>
                        <v-col>
                          <v-text-field
                            v-model="selectedJobTitle.abbr"
                            label="Kısaltma"
                          />
                        </v-col>
                        <v-col>
                          <v-text-field
                            v-model="selectedJobTitle.name"
                            label="Ünvan"
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
                      @click="updateJobTitle"
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

      <v-tab-item value="newJobTitle">
        <v-form>
          <v-container class="py-3">
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model="newJobTitle.abbr"
                  label="Kısaltma"
                />
              </v-col>

              <v-col cols="4">
                <v-text-field
                  v-model="newJobTitle.name"
                  label="Ünvan"
                />
              </v-col>

              <v-col cols="4">
                <v-btn
                  class="my-2"
                  width="100%"
                  color="primary"
                  @click="createJobTitle()"
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
    name: 'JobTitles',
    data () {
      return {
        currentTab: 'jobTitles',
        searchWord: '',
        dialog: false,
        selectedJobTitle: {},
        newJobTitle: { abbr: '', name: '' },
        headers: [
          {
            text: 'Kısaltma',
            align: 'start',
            value: 'abbr',
          },
          { text: 'Ünvan', value: 'name' },
        ],
        jobTitles: [
          { id: 0, name: 'İş Analisti', abbr: 'BSA' },
          { id: 1, name: 'DevOps Uzmanı', abbr: 'DOPS' },
          { id: 2, name: 'Senior Backend Developer', abbr: 'SRB' },
          { id: 3, name: 'Junior Frontend Developer', abbr: 'JRF' },
          { id: 10, name: 'İş Analisti', abbr: 'BSA' },
          { id: 11, name: 'DevOps Uzmanı', abbr: 'DOPS' },
          { id: 12, name: 'Senior Backend Developer', abbr: 'SRB' },
          { id: 13, name: 'Junior Frontend Developer', abbr: 'JRF' },
        ],
      }
    },
    methods: {
      editJobTitle (item) {
        this.selectedJobTitle = { ...item }
        this.dialog = true
      },
      updateJobTitle () {
        console.log('selected', this.selectedJobTitle)
        this.dialog = false
        this.$store.commit('app/isLoading', true)
        setTimeout(() => {
          this.$store.commit('app/isLoading', false)
        }, 1500)
      },
      createJobTitle () {
        console.log('selected', this.newJobTitle)
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
