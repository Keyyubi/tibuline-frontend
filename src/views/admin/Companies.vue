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
            <template v-slot:item.isSupplier="{ item }">
              <v-checkbox
                v-model="item.isSupplier"
                disabled
                :label="`${item.isSupplier ? 'Evet' : 'Hayır'}`"
              />
            </template>
          </v-data-table>
        </v-card>

        <!-- Edit Dialog -->
        <v-dialog
          v-model="dialog"
          width="960"
          :retain-focus="false"
        >
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
                        :rules="RULES.EMAIL"
                        required
                      />
                    </v-col>

                    <!-- TCKN -->
                    <v-col
                      cols="12"
                      md="4"
                    >
                      <v-text-field
                        v-model="selectedCompany.vkn"
                        v-mask="'##########'"
                        :rules="RULES.VKN"
                        label="VKN"
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
                        :rules="RULES.PHONE"
                        required
                        @click:append="selectedCompany.phone = ''"
                      />
                    </v-col>

                    <!-- IsSupplier -->
                    <v-col
                      cols="12"
                      md="4"
                    >
                      <v-checkbox
                        v-model="selectedCompany.isSupplier"
                        :label="`Tedarikçi Firma: ${selectedCompany.isSupplier ? 'Evet' : 'Hayır'}`"
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
                  :rules="RULES.EMAIL"
                  required
                />
              </v-col>

              <!-- TCKN -->
              <v-col
                cols="12"
                md="4"
              >
                <v-text-field
                  v-model="newCompany.vkn"
                  v-mask="'##########'"
                  label="VKN"
                  :rules="RULES.VKN"
                  required
                />
              </v-col>

              <!-- Phone -->
              <v-col
                cols="12"
                md="4"
              >
                <v-text-field
                  v-model="newCompany.phone"
                  v-mask="'(###) ### ####'"
                  label="Cep Telefonu"
                  append-icon="mdi-close"
                  prepend-icon="mdi-phone"
                  :rules="RULES.PHONE"
                  required
                  @click:append="newCompany.phone = ''"
                />
              </v-col>

              <!-- IsSupplier -->
              <v-col
                cols="12"
                md="4"
              >
                <v-checkbox
                  v-model="newCompany.isSupplier"
                  :label="`Tedarikçi Firma: ${newCompany.isSupplier ? 'Evet' : 'Hayır'}`"
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
        </v-container>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
  import { get } from 'vuex-pathify'
  import { RULES } from '@/util/globals'
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
          vkn: null,
          phone: null,
          address: null,
          isSupplier: false,
        },
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
          { text: 'VKN', value: 'vkn' },
          { text: 'Tedarikçi', value: 'isSupplier' },
        ],
        RULES,
      }
    },
    computed: {
      ...get('company', ['companies']),
      ...get('jobTitle', ['jobTitles']),
      ...get('experienceSpan', ['experienceSpans']),
    },
    mounted () {
      this.$store.dispatch('jobTitle/getJobTitles')
      this.$store.dispatch('experienceSpan/getExperienceSpans')
      this.$store.dispatch('company/getCompanies')
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
          this.$store.dispatch('company/updateCompany', this.selectedCompany)
        }
      },
      createCompany () {
        if (this.$refs.form.validate()) {
          this.dialog = false
          this.$store.dispatch('company/createCompany', this.newCompany)
          this.$refs.form.reset()
        }
      },
    },
  }
</script>

<style lang="scss" scoped></style>
