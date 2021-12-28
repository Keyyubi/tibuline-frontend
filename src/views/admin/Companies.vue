<template>
  <v-container
    id="companies-view"
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

      <v-tab href="#companies">
        Şirketler
        <v-icon>mdi-domain</v-icon>
      </v-tab>
      <v-tab href="#newCompany">
        Yeni Şirket Oluştur
        <v-icon>mdi-book-plus-multiple</v-icon>
      </v-tab>
    </v-tabs>

    <div class="py3" />

    <v-tabs-items v-model="currentTab">
      <v-tab-item value="companies">
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
            :items="companies"
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
                    @click="editCompany(item)"
                  >
                    {{ item.id }}
                    <v-icon right>
                      mdi-arrow-right-bold
                    </v-icon>
                  </v-chip>
                </template>

                <v-card>
                  <v-card-title class="text-h5 primary white--text">
                    Şirketi Güncelle
                  </v-card-title>

                  <v-card-text>
                    <v-container class="py-3">
                      <v-form
                        ref="editForm"
                        v-model="editValid"
                        lazy-validation
                      >
                        <v-row>
                          <!-- Username -->
                          <v-col
                            cols="12"
                            md="4"
                          >
                            <v-text-field
                              v-model="selectedCompany.name"
                              label="Şirket Adı"
                              :rules="[v => !!v || 'Şirket adı boş geçilemez',]"
                              required
                            />
                          </v-col>

                          <!-- Email -->
                          <v-col
                            cols="12"
                            md="4"
                          >
                            <v-text-field
                              v-model="selectedCompany.email"
                              label="E-mail"
                              :rules="emailRules"
                              required
                            />
                          </v-col>

                          <!-- TCKN -->
                          <v-col
                            cols="12"
                            md="4"
                          >
                            <v-text-field
                              v-model="selectedCompany.tckN_VKN"
                              v-mask="'###########'"
                              label="TCKN / VKN"
                              :rules="tcnoRules"
                              required
                            />
                          </v-col>

                          <!-- Phone -->
                          <v-col
                            cols="12"
                            md="4"
                          >
                            <v-text-field
                              v-model="selectedCompany.phone"
                              v-mask="'(###) ### ####'"
                              label="Cep Telefonu"
                              append-icon="mdi-close"
                              prepend-icon="mdi-phone"
                              :rules="phoneRules"
                              required
                              @click:append="selectedCompany.phone = ''"
                            />
                          </v-col>

                          <!-- Address -->
                          <v-col
                            cols="12"
                            md="4"
                          >
                            <v-textarea
                              v-model="selectedCompany.address"
                              label="Adres"
                              rows="3"
                              required
                            />
                          </v-col>
                        </v-row>
                      </v-form>
                    </v-container>
                  </v-card-text>

                  <v-divider />

                  <!-- Card Actions -->
                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      color="primary"
                      depressed
                      @click="updateCompany()"
                    >
                      Güncelle
                    </v-btn>
                    <v-btn
                      color="error"
                      depressed
                      @click="closeDialog()"
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

      <v-tab-item value="newCompany">
        <v-container class="py-3">
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <v-row>
              <!-- Username -->
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="newCompany.name"
                  label="Şirket Adı"
                  :rules="[v => !!v || 'Şirket adı boş geçilemez',]"
                  required
                />
              </v-col>

              <!-- Email -->
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="newCompany.email"
                  label="E-mail"
                  :rules="emailRules"
                  required
                />
              </v-col>

              <!-- TCKN -->
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="newCompany.tckn_vkn"
                  v-mask="'###########'"
                  label="TCKN / VKN"
                  :rules="tcnoRules"
                  required
                />
              </v-col>

              <!-- Phone -->
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="newCompany.phone"
                  v-mask="'(###) ### ####'"
                  label="Cep Telefonu"
                  append-icon="mdi-close"
                  prepend-icon="mdi-phone"
                  :rules="phoneRules"
                  required
                  @click:append="newCompany.phone = ''"
                />
              </v-col>

              <!-- Address -->
              <v-col>
                <v-textarea
                  v-model="newCompany.address"
                  label="Adres"
                  rows="2"
                  required
                />
              </v-col>
            </v-row>

            <!-- Actions -->
            <v-row>
              <v-col cols="6">
                <v-btn
                  color="warning"
                  width="100%"
                  depressed
                  outlined
                  @click="reset()"
                >
                  Formu Temizle
                </v-btn>
              </v-col>
              <v-col
                cols="6"
                class="text-right"
              >
                <v-btn
                  color="primary"
                  width="100%"
                  depressed
                  @click="createCompany()"
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
    name: 'Companies',
    data () {
      return {
        valid: true,
        editValid: true,
        currentTab: 'companies',
        searchWord: '',
        dialog: false,
        selectedCompany: {},
        newCompany: {
          name: null,
          email: null,
          tckn_vkn: null,
          phone: null,
          address: null,
        },
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /.+@.+/.test(v) || 'E-mail must be valid',
        ],
        phoneRules: [
          v => !!v || 'Telefon numarası girmelisiniz',
          v => (v && v.length === 14) || 'Lütfen başında 0 olmadan 10 haneli olarak giriniz.',
          v => /^(\(5.)/.test(v) || 'Telefon numarası 5 ile başlamalıdır.',
        ],
        tcnoRules: [
          v => !!v || 'T.C. Kimlik Numarası giriniz.',
          v => (v && v.length === 11) || 'Kimlik numarası 11 haneli olmalıdır.',
          v => (() => {
            if (v) {
              const arr = Array.from(v)
              let res = 0
              for (let i = 0; i < arr.length - 1; i++) {
                res += Number(arr[i])
              }
              return (res % 10) === Number(arr[arr.length - 1])
            } else return true
          })() || 'Kimlik numarası geçersiz.',
        ],
        headers: [
          {
            text: 'Güncelle',
            align: 'start',
            value: 'id',
          },
          { text: 'Şirket', value: 'name' },
          { text: 'E-mail', value: 'email' },
          { text: 'Telefon', value: 'phone' },
          { text: 'Adres', value: 'address' },
          { text: 'TCKN / VKN', value: 'tckn_vkn' },
        ],
      }
    },
    computed: {
      ...get('app', ['responseMsg', 'isErrorMsg']),
      ...get('admin', ['companies', 'jobTitles', 'experienceSpans']),
    },
    mounted () {
      this.$store.dispatch('admin/getJobTitles')
      this.$store.dispatch('admin/getExperienceSpans')
      this.$store.dispatch('admin/getCompanies')
    },
    methods: {
      reset () {
        this.$refs.form.reset()
      },
      closeDialog () {
        this.dialog = false
        this.selectedCompany = {}
      },
      editCompany (item) {
        this.selectedCompany = item
        this.dialog = true
      },
      updateCompany () {
        if (this.$refs.editForm.validate()) {
          this.dialog = false
          this.$store.dispatch('admin/updateCompany', this.selectedCompany)
        }
      },
      createCompany () {
        if (this.$refs.form.validate()) {
          this.dialog = false
          this.$store.dispatch('admin/createCompany', this.newCompany)
          this.$refs.form.reset()
        }
      },
    },
  }
</script>

<style lang="scss" scoped></style>
