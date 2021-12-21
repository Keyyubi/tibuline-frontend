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
                    @click="editJobTitle(item)"
                  >
                    <b>{{ item.abbreviation }}</b>
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
                            v-model="selectedJobTitle.abbreviation"
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
        <v-container class="py-3">
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model="newJobTitle.abbreviation"
                  label="Kısaltma"
                  :rules="[
                    v => (!!v && v.length >= 3) || 'Kısaltma en az 3 karakter olmalıdır']"
                  required
                  @keyup="uppercase()"
                />
              </v-col>

              <v-col cols="4">
                <v-text-field
                  v-model="newJobTitle.name"
                  label="Ünvan"
                  :rules="[v => !!v || 'Bu alan boş geçilemez.']"
                  required
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
    name: 'JobTitles',
    data () {
      return {
        valid: true,
        currentTab: 'jobTitles',
        searchWord: '',
        dialog: false,
        selectedJobTitle: {},
        newJobTitle: { abbreviation: '', name: '' },
        headers: [
          {
            text: 'Kısaltma',
            align: 'start',
            value: 'abbreviation',
          },
          { text: 'Ünvan', value: 'name' },
        ],
      }
    },
    computed: {
      ...get('app', ['responseMsg', 'isErrorMsg']),
      ...get('admin', ['jobTitles']),
    },
    mounted () {
      this.$store.dispatch('admin/getJobTitles')
    },
    methods: {
      uppercase () {
        this.newCostCenter.abbreviation = this.newCostCenter.abbreviation.toUpperCase()
      },
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
        if (this.$refs.form.validate()) {
          this.dialog = false
          this.$store.dispatch('admin/createJobTitle', this.newJobTitle)
          this.$refs.form.reset()
        }
      },
    },
  }
</script>

<style lang="scss" scoped></style>
