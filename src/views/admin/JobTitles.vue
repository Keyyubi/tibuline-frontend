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
            <!-- eslint-disable-next-line -->
            <template v-slot:item.companyId="{ item }">
              {{ companies.find(e => e.id === item.companyId) ? companies.find(e => e.id === item.companyId).name : 'Bulunamadı' }}
            </template>
          </v-data-table>
        </v-card>
        <v-dialog
          v-model="dialog"
          width="720"
          :retain-focus="false"
        >
          <v-card>
            <v-card-title class="text-h5 primary white--text">
              Ünvanı Güncelle
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
                        v-model="selectedJobTitle.abbreviation"
                        label="Kısaltma"
                        :rules="[
                          v => (!!v && v.length >= 3) || 'Kısaltma en az 3 karakter olmalıdır']"
                        required
                      />
                    </v-col>
                    <v-col>
                      <v-text-field
                        v-model="selectedJobTitle.name"
                        label="Ünvan"
                        :rules="[v => !!v || 'Bu alan boş geçilemez.']"
                        required
                      />
                    </v-col>
                    <v-col>
                      <v-autocomplete
                        v-model="selectedJobTitle.companyId"
                        :items="companies"
                        item-text="name"
                        item-value="id"
                        label="Şirket"
                        :rules="[v => v > 0 || 'Bu alan boş geçilemez.']"
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
      </v-tab-item>

      <v-tab-item value="newJobTitle">
        <v-container class="py-3">
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <v-row>
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="newJobTitle.abbreviation"
                  label="Kısaltma"
                  :rules="[
                    v => (!!v && v.length >= 3) || 'Kısaltma en az 3 karakter olmalıdır']"
                  required
                  @keyup="uppercase()"
                />
              </v-col>

              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="newJobTitle.name"
                  label="Ünvan"
                  :rules="[v => !!v || 'Bu alan boş geçilemez.']"
                  required
                />
              </v-col>

              <v-col
                cols="12"
                md="6"
              >
                <v-autocomplete
                  v-model="newJobTitle.companyId"
                  :items="companies"
                  item-text="name"
                  item-value="id"
                  label="Şirket"
                  :rules="[v => v > 0 || 'Bu alan boş geçilemez.']"
                  required
                />
              </v-col>

              <v-col
                cols="12"
                md="6"
              >
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
        editValid: true,
        currentTab: 'jobTitles',
        searchWord: '',
        dialog: false,
        selectedJobTitle: {},
        newJobTitle: { abbreviation: '', name: '', companyId: null },
        headers: [
          {
            text: 'Kısaltma',
            align: 'start',
            value: 'abbreviation',
          },
          { text: 'Ünvan', value: 'name' },
          { text: 'Şirket', value: 'companyId' },
        ],
      }
    },
    computed: {
      ...get('company', ['companies']),
      ...get('jobTitle', ['jobTitles']),
    },
    mounted () {
      this.$store.dispatch('jobTitle/getJobTitles')
      this.$store.dispatch('company/getSupplierCompanies')
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
        if (this.$refs.editForm.validate()) {
          this.dialog = false
          this.$store.dispatch('jobTitle/updateJobTitle', this.selectedJobTitle)
        }
      },
      createJobTitle () {
        if (this.$refs.form.validate()) {
          this.dialog = false
          this.$store.dispatch('jobTitle/createJobTitle', this.newJobTitle)
          this.$refs.form.reset()
        }
      },
    },
  }
</script>

<style lang="scss" scoped></style>
