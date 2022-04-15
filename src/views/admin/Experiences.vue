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

      <v-tab href="#experiences">
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
      <v-tab-item value="experiences">
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
            :items="experiences"
            :search="searchWord"
          >
            <!-- eslint-disable-next-line -->
            <template v-slot:item.id="{ item }">
              <v-chip
                class="ma-2"
                color="primary"
                dark
                @click="editExperience(item)"
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
              Tecrübe Aralığını Güncelle
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
                        v-model="selectedExperience.name"
                        label="Tecrübe Aralığı"
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
                @click="updateExperience"
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
                md="6"
              >
                <v-text-field
                  v-model="newExperience.name"
                  label="Tercübe Aralığı"
                  :rules="[v => !!v || 'Bu alan boş geçilemez.']"
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
                  @click="createExperience()"
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
    name: 'Experiences',
    data () {
      return {
        valid: true,
        editValid: true,
        currentTab: 'experiences',
        searchWord: '',
        dialog: false,
        selectedExperience: {},
        newExperience: { name: '' },
        headers: [
          {
            text: 'İşlem',
            align: 'start',
            value: 'id',
          },
          { text: 'Tecrübe Aralığı', value: 'name' },
        ],
      }
    },
    computed: {
      ...get('experience', ['experiences']),
    },
    mounted () {
      this.$store.dispatch('experience/getExperiences')
    },
    methods: {
      editExperience (item) {
        this.selectedExperience = { ...item }
        this.dialog = true
      },
      updateExperience () {
        if (this.$refs.editForm.validate()) {
          this.dialog = false
          this.$store.dispatch('experience/updateExperience', this.selectedExperience)
        }
      },
      createExperience () {
        if (this.$refs.form.validate()) {
          this.dialog = false
          this.$store.dispatch('experience/createExperience', this.newExperience)
          this.$refs.form.reset()
        }
      },
    },
  }
</script>

<style lang="scss" scoped></style>
