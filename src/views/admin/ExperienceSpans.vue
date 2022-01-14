<template>
  <v-container
    id="experience-spans-view"
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

      <v-tab href="#experienceSpans">
        Tecrübe Aralıkları
        <v-icon>mdi-poll</v-icon>
      </v-tab>
      <v-tab href="#newExperinceSpan">
        Yeni Tercübe Aralığı
        <v-icon>mdi-plus-box-multiple</v-icon>
      </v-tab>
    </v-tabs>

    <div class="py3" />

    <v-tabs-items v-model="currentTab">
      <v-tab-item value="experienceSpans">
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
            :items="experienceSpans"
            :search="searchWord"
          >
            <!-- eslint-disable-next-line -->
            <template v-slot:item.id="{ item }">
              <v-chip
                class="ma-2"
                color="primary"
                dark
                @click="editExperienceSpan(item)"
              >
                <b>Güncelle</b>
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
          width="460"
          :retain-focus="false"
        >
          <v-card>
            <v-card-title class="text-h5 primary white--text">
              Tecrübe Aralığını Güncelle
            </v-card-title>

            <v-card-text>
              <v-container class="py-3">
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="selectedExperienceSpan.name"
                      label="Tecrübe Aralığı"
                    />
                  </v-col>
                  <v-col>
                    <v-autocomplete
                      v-model="selectedExperienceSpan.companyId"
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
            </v-card-text>

            <v-divider />

            <!-- Card Actions -->
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="primary"
                depressed
                @click="updateExperienceSpan"
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

      <v-tab-item value="newExperinceSpan">
        <v-container class="py-3">
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <v-row>
              <v-col
                cols="12"
                md="4"
              >
                <v-text-field
                  v-model="newExperienceSpan.name"
                  label="Tercübe Aralığı"
                  :rules="[v => !!v || 'Bu alan boş geçilemez.']"
                  required
                />
              </v-col>

              <v-col
                cols="12"
                md="4"
              >
                <v-autocomplete
                  v-model="newExperienceSpan.companyId"
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
                md="4"
              >
                <v-btn
                  class="my-2"
                  width="100%"
                  color="primary"
                  @click="createExperienceSpan()"
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
    name: 'ExperienceSpans',
    data () {
      return {
        valid: true,
        currentTab: 'experienceSpans',
        searchWord: '',
        dialog: false,
        selectedExperienceSpan: {},
        newExperienceSpan: { name: '', companyId: null },
        headers: [
          {
            text: 'İşlem',
            align: 'start',
            value: 'id',
          },
          { text: 'Tecrübe Aralığı', value: 'name' },
          { text: 'Şirket', value: 'companyId' },
        ],
      }
    },
    computed: {
      ...get('admin', ['companies', 'experienceSpans']),
    },
    mounted () {
      this.$store.dispatch('admin/getExperienceSpans')
      this.$store.dispatch('admin/getSupplierCompanies')
    },
    methods: {
      editExperienceSpan (item) {
        this.selectedExperienceSpan = { ...item }
        this.dialog = true
      },
      updateExperienceSpan () {
        this.dialog = false
        this.$store.dispatch('admin/updateExperienceSpan', this.selectedExperienceSpan)
      },
      createExperienceSpan () {
        if (this.$refs.form.validate()) {
          this.dialog = false
          this.$store.dispatch('admin/createExperienceSpan', this.newExperienceSpan)
          this.$refs.form.reset()
        }
      },
    },
  }
</script>

<style lang="scss" scoped></style>
