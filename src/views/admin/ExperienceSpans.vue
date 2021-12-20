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
                    @click="editExperienceSpan(item)"
                  >
                    <b>Güncelle</b>
                    <v-icon right>
                      mdi-arrow-right-bold
                    </v-icon>
                  </v-chip>
                </template>

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
            </template>
          </v-data-table>
        </v-card>
      </v-tab-item>

      <v-tab-item value="newExperinceSpan">
        <v-form>
          <v-container class="py-3">
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="newExperienceSpan.name"
                  label="Tercübe Aralığı"
                />
              </v-col>

              <v-col cols="6">
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
          </v-container>
        </v-form>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
  export default {
    name: 'ExperienceSpans',
    data () {
      return {
        currentTab: 'experienceSpans',
        searchWord: '',
        dialog: false,
        selectedExperienceSpan: {},
        newExperienceSpan: { name: '' },
        headers: [
          {
            text: 'İşlem',
            align: 'start',
            value: 'id',
          },
          { text: 'Tecrübe Aralığı', value: 'name' },
        ],
        experienceSpans: [
          { id: 0, name: '2-3 Yıl' },
          { id: 1, name: '3-5 Yıl' },
          { id: 2, name: '5-8 Yıl' },
          { id: 3, name: '8-12 Yıl' },
          { id: 4, name: '12+ Yıl' },
        ],
      }
    },
    methods: {
      editExperienceSpan (item) {
        this.selectedExperienceSpan = { ...item }
        this.dialog = true
      },
      updateExperienceSpan () {
        console.log('selected', this.selectedExperienceSpan)
        this.dialog = false
        this.$store.commit('app/isLoading', true)
        setTimeout(() => {
          this.$store.commit('app/isLoading', false)
        }, 1500)
      },
      createExperienceSpan () {
        console.log('selected', this.newExperienceSpan)
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
