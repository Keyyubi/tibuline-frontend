<template>
  <v-container
    id="projects-view"
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
              <v-chip
                class="ma-2"
                color="primary"
                dark
                @click="seeDetails(item)"
              >
                <b>Güncelle</b>
                <v-icon right>
                  mdi-arrow-right-bold
                </v-icon>
              </v-chip>
            </template>

            <!-- eslint-disable-next-line -->
            <template v-slot:item.startDate="{ item }">
              {{ getComputedDate(item.startDate) }}
            </template>
            <!-- eslint-disable-next-line -->
            <template v-slot:item.endDate="{ item }">
              {{ getComputedDate(item.endDate) }}
            </template>
            <!-- eslint-disable-next-line -->
            <template v-slot:item.assignedTo="{ item }">
              {{ getProjectManager(item.assignedTo) }}
            </template>
            <!-- eslint-disable-next-line -->
            <template v-slot:item.projectBudget="{ item }">
              {{ moneyMask(item.projectBudget) }}
            </template>
          </v-data-table>
        </v-card>

        <!-- EDIT DIALOG -->
        <v-dialog
          v-model="dialog"
          width="960"
          :retain-focus="false"
        >
          <v-card>
            <v-form
              ref="form"
              v-model="valid2"
              lazy-validation
            >
              <v-card-title class="text-h5 primary white--text">
                Proje Güncelle
              </v-card-title>

              <v-card-text>
                <v-container class="py-3">
                  <v-row>
                    <v-col cols="4">
                      <v-text-field
                        v-model="selectedProject.name"
                        label="Proje Adı"
                        :rules="[v => !!v || 'Bu alan boş geçilemez.']"
                        required
                      />
                    </v-col>

                    <!-- Cost Center -->
                    <v-col cols="4">
                      <v-select
                        v-model="selectedProject.costCenterId"
                        :items="costCenters"
                        item-text="name"
                        item-value="id"
                        label="Masraf Merkezi"
                      />
                    </v-col>

                    <!-- Unit Manager -->
                    <v-col cols="4">
                      <v-select
                        v-model="selectedProject.assignedTo"
                        :items="unitManagers"
                        :item-text="e => e.firstName + ' ' + e.lastName"
                        item-value="id"
                        label="Proje Sorumlusu"
                      />
                    </v-col>

                    <!-- Starting Date -->
                    <v-col
                      cols="12"
                      md="4"
                    >
                      <v-menu
                        ref="menu3"
                        v-model="menu3"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="selectedProject.starting"
                            label="Başlangıç Tarihi"
                            persistent-hint
                            prepend-icon="mdi-calendar"
                            v-bind="attrs"
                            v-on="on"
                          />
                        </template>
                        <v-date-picker
                          v-model="selectedProject.startDate"
                          no-title
                          @input="menu3 = false"
                          @change="e => selectedProject.starting = getComputedDate(e)"
                        />
                      </v-menu>
                    </v-col>

                    <!-- End Date -->
                    <v-col
                      cols="12"
                      md="4"
                    >
                      <v-menu
                        ref="menu4"
                        v-model="menu4"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="selectedProject.ending"
                            label="Bitiş Tarihi"
                            persistent-hint
                            prepend-icon="mdi-calendar"
                            v-bind="attrs"
                            v-on="on"
                          />
                        </template>
                        <v-date-picker
                          v-model="selectedProject.endDate"
                          no-title
                          @input="menu4 = false"
                          @change="e => selectedProject.ending = getComputedDate(e)"
                        />
                      </v-menu>
                    </v-col>

                    <!-- Budget -->
                    <v-col
                      cols="12"
                      md="4"
                    >
                      <v-text-field
                        v-model="selectedProject.projectBudget"
                        v-mask="currencyMask"
                        append-icon="mdi-currency-try"
                        label="Proje Bütçesi"
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
            </v-form>
          </v-card>
        </v-dialog>
        <!-- END OF EDIT DIALOG -->
      </v-tab-item>

      <v-tab-item value="newProject">
        <v-container class="py-3">
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model="newProject.name"
                  label="Proje Adı"
                  :rules="[v => !!v || 'Bu alan boş geçilemez.']"
                  required
                />
              </v-col>

              <!-- Cost Center -->
              <v-col cols="4">
                <v-select
                  v-model="newProject.costCenterId"
                  :items="costCenters"
                  item-text="name"
                  item-value="id"
                  label="Masraf Merkezi"
                />
              </v-col>

              <!-- Unit Manager -->
              <v-col cols="4">
                <v-autocomplete
                  v-model="newProject.assignedTo"
                  :items="unitManagers"
                  :item-text="item => item.firstName + ' ' + item.lastName"
                  itemprop="firstName"
                  item-value="id"
                  label="Proje Sorumlusu"
                />
              </v-col>

              <!-- Starting Date -->
              <v-col
                cols="12"
                md="4"
              >
                <v-menu
                  ref="menu1"
                  v-model="menu1"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="newProject.startDate"
                      label="Başlangıç Tarihi"
                      persistent-hint
                      prepend-icon="mdi-calendar"
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="newProject.startDate"
                    no-title
                    @input="menu1 = false"
                  />
                </v-menu>
              </v-col>

              <!-- End Date -->
              <v-col
                cols="12"
                md="4"
              >
                <v-menu
                  ref="menu2"
                  v-model="menu2"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="newProject.endDate"
                      label="Bitiş Tarihi"
                      persistent-hint
                      prepend-icon="mdi-calendar"
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="newProject.endDate"
                    no-title
                    @input="menu2 = false"
                  />
                </v-menu>
              </v-col>

              <!-- Budget -->
              <v-col
                cols="12"
                md="4"
              >
                <v-text-field
                  v-model="newProject.projectBudget"
                  v-mask="currencyMask"
                  append-icon="mdi-currency-try"
                  label="Proje Bütçesi"
                  required
                />
              </v-col>

              <v-col cols="12">
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
  import createNumberMask from 'text-mask-addons/dist/createNumberMask'
  const currencyMask = createNumberMask({
    prefix: '',
    allowDecimal: true,
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: '.',
    decimalSymbol: ',',
    allowNegative: false,
  })
  export default {
    name: 'Projects',
    data () {
      return {
        menu1: false,
        menu2: false,
        menu3: false,
        menu4: false,
        valid: true,
        valid2: true,
        currencyMask,
        currentTab: 'projects',
        searchWord: '',
        dialog: false,
        selectedProject: {},
        newProject: {
          name: '',
          createdBy: 0,
          assignedTo: 0,
          costCenterId: 0,
          startDate: null,
          endDate: null,
          projectBudget: null,
          projectStatus: 0,
        },
        headers: [
          {
            text: 'Güncelle',
            align: 'start',
            value: 'id',
          },
          { text: 'Proje', value: 'name' },
          { text: 'Sorumlusu', value: 'assignedTo' },
          { text: 'Baş. Tar.', value: 'startDate' },
          { text: 'Bit. Tar.', value: 'endDate' },
          { text: 'Bütçesi', value: 'projectBudget' },
        ],
      }
    },
    computed: {
      ...get('app', ['responseMsg', 'isErrorMsg']),
      ...get('user', ['user']),
      ...get('admin', ['projects', 'unitManagers', 'costCenters']),
    },
    mounted () {
      this.$store.dispatch('admin/getProjects')
      this.$store.dispatch('admin/getCostCenters')
      this.$store.dispatch('admin/getUnitManagers')
    },
    methods: {
      seeDetails (item) {
        this.selectedProject = item
        this.selectedProject.starting = this.getComputedDate(item.startDate)
        this.selectedProject.ending = this.getComputedDate(item.endDate)
        this.dialog = true
      },
      updateProject () {
        this.dialog = false
        this.$store.dispatch('admin/updateProject', this.selectedProject)
      },
      createProject () {
        if (this.$refs.form.validate()) {
          const payload = { ...this.newProject }
          payload.projectBudget = payload.projectBudget.replace('.', '').replace(',', '.')
          payload.createdBy = this.user.id
          this.dialog = false
          this.$store.dispatch('admin/createProject', payload)
          this.$refs.form.reset()
        }
      },
      getProjectManager (id) {
        if (id) {
          const user = this.unitManagers.find(e => e.id === id)
          return user.firstName + ' ' + user.lastName
        } else {
          return 'Atama yapılmadı'
        }
      },
      getComputedDate (date) {
        const arr = date.split('T')[0].split('-')
        return `${arr[2]}/${arr[1]}/${arr[0]}`
      },
      moneyMask (money) {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(money)
      },
    },
  }
</script>

<style lang="scss" scoped></style>
