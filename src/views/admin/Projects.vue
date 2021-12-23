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

      <v-tab href="#projects">
        Projeler
        <v-icon>mdi-poll</v-icon>
      </v-tab>
      <v-tab href="#newProject">
        Yeni Proje Oluştur
        <v-icon>mdi-plus-box-multiple</v-icon>
      </v-tab>
    </v-tabs>

    <div class="py3" />

    <v-tabs-items v-model="currentTab">
      <v-tab-item value="projects">
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
            :items="projects"
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
                    @click="editProject(item)"
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
                            v-model="selectedProject.projectTime"
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
                      @click="updateProject"
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

      <v-tab-item value="newProject">
        <v-container class="py-3">
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="newProject.projectTime"
                  label="Tercübe Aralığı"
                  :rules="[v => !!v || 'Bu alan boş geçilemez.']"
                  required
                />
              </v-col>

              <v-col cols="6">
                <v-btn
                  class="my-2"
                  width="100%"
                  color="primary"
                  @click="createProject()"
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
    name: 'Projects',
    data () {
      return {
        valid: true,
        currentTab: 'projects',
        searchWord: '',
        dialog: false,
        selectedProject: {},
        newProject: { projectTime: '' },
        headers: [
          {
            text: 'İşlem',
            align: 'start',
            value: 'id',
          },
          { text: 'Tecrübe Aralığı', value: 'projectTime' },
        ],
      }
    },
    computed: {
      ...get('app', ['responseMsg', 'isErrorMsg']),
      ...get('admin', ['projects']),
    },
    mounted () {
      this.$store.dispatch('admin/getProjects')
    },
    methods: {
      editProject (item) {
        this.selectedProject = { ...item }
        this.dialog = true
      },
      updateProject () {
        this.dialog = false
        this.$store.dispatch('admin/updateProject', this.selectedProject)
      },
      createProject () {
        if (this.$refs.form.validate()) {
          this.dialog = false
          this.$store.dispatch('admin/createProject', this.newProject)
          this.$refs.form.reset()
        }
      },
    },
  }
</script>

<style lang="scss" scoped></style>
