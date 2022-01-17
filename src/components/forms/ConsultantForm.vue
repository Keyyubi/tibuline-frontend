<template>
  <v-container class="py-3">
    <v-form
      ref="form"
      v-model="valid"
    >
      <v-row
        class="my-3"
        align="center"
      >
        <v-divider class="mr-3" /><span class="grey--text">Kişisel Bilgileri</span><v-divider class="ml-3" />
      </v-row>
      <v-row>
        <!-- Firstname -->
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="consultant.firstName"
            label="Adı"
            :rules="[v => !!v || 'Ad boş geçilemez',]"
            required
          />
        </v-col>

        <!-- Lastname -->
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="consultant.lastName"
            label="Soyadı"
            :rules="[v => !!v || 'Soyad boş geçilemez',]"
            required
          />
        </v-col>

        <!-- Company -->
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="consultant.companyId"
            :items="[user.company]"
            item-text="name"
            item-value="id"
            label="Şirket"
            disabled
          />
        </v-col>

        <!-- Phone -->
        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            v-model="consultant.phone"
            v-mask="'(###) ### ####'"
            label="Cep Telefonu"
            append-icon="mdi-close"
            prepend-icon="mdi-phone"
            :rules="RULES.PHONE"
            required
            @click:append="consultant.phone = ''"
          />
        </v-col>

        <!-- Email -->
        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            v-model="consultant.email"
            label="E-mail"
            :rules="RULES.EMAIL"
            required
          />
        </v-col>

        <!-- Birthday -->
        <v-col
          cols="12"
          md="3"
        >
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="localeDate"
                label="Doğum Günü"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="date"
              :max="`${new Date().getFullYear()}-12-31`"
              min="1950-01-01"
              @input="menu = false"
              @change="save"
            />
          </v-menu>
        </v-col>

        <!-- TCKN -->
        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            v-model="consultant.tckn"
            v-mask="'###########'"
            label="TCKN"
            :rules="RULES.TCNO"
            required
          />
        </v-col>
      </v-row>

      <v-row
        class="my-3"
        align="center"
      >
        <v-divider class="mr-3" /><span class="grey--text">Şirket Bilgileri</span><v-divider class="ml-3" />
      </v-row>
      <v-row class="mb-3">
        <!-- Project -->
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="consultant.projectId"
            :items="projects"
            item-text="name"
            item-value="id"
            label="Projesi"
          />
        </v-col>

        <!-- Unit Manager -->
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="consultant.unitManagerUserId"
            :items="users"
            :item-text="e => e.firstName + ' ' + e.lastName"
            item-value="id"
            label="Yöneticisi"
          />
        </v-col>

        <!-- JobTitle -->
        <v-col
          cols="12"
          md="4"
        >
          <v-autocomplete
            v-model="consultant.jobTitleId"
            :items="jobTitles"
            :item-text="e => e.abbreviation + ' - ' + e.name"
            item-value="id"
            label="Ünvanı"
          />
        </v-col>

        <!-- ExperienceSpan -->
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="consultant.experienceSpanId"
            :items="experienceSpans"
            item-text="name"
            item-value="id"
            label="Tecrübe Aralığı"
          />
        </v-col>

        <!-- isActive -->
        <v-col
          cols="12"
          md="3"
        >
          <v-checkbox
            v-model="consultant.isActive"
            :label="`Aktif Danışman: ${consultant.isActive ? 'Evet' : 'Hayır'}`"
          />
        </v-col>
      </v-row>

      <v-row
        class="my-3"
        align="center"
      >
        <v-divider class="mr-3" /><span class="grey--text">Evrakları</span><v-divider class="ml-3" />
      </v-row>
      <v-row class="mb-3">
        <!-- Personal Documents -->
        <v-col
          cols="12"
          md="6"
        >
          <v-file-input
            v-model="files"
            label="Kişisel Evrakları"
            accept="image/*, .pdf"
            counter
            multiple
            show-size
            small-chips
          />
        </v-col>

        <!-- Contract -->
        <v-col
          cols="12"
          md="6"
        >
          İmzalı Sözleşme:
          <v-btn-toggle
            tile
            color="primary"
            group
          >
            <v-btn
              color="primary"
              depressed
              outlined
              :disabled="!consultant.contractFilePath"
              @click="showContract"
            >
              Görüntüle
            </v-btn>
            <v-btn
              color="primary"
              depressed
              outlined
              :disabled="consultant.contractFilePath"
              @click="contractDialog = true"
            >
              Yükle
            </v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>

      <!-- Actions -->
      <v-row class="my-3">
        <v-col
          v-if="formType === 'create'"
          cols="6"
        >
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
            @click="createOrUpdateConsultant()"
          >
            {{ formType === 'create' ? 'Oluştur' : 'Güncelle' }}
          </v-btn>
        </v-col>
        <v-col
          v-if="formType !== 'create'"
          cols="6"
        >
          <v-btn
            color="error"
            width="100%"
            depressed
            @click="$emit('close-dialog')"
          >
            Vazgeç
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-dialog
      v-model="contractDialog"
      persistent
    >
      <v-card>
        <v-card-title>
          İmzalı Sözleşme Yükle
        </v-card-title>
        <v-card-text>
          <v-file-input
            v-model="contractDocument"
            chips
            label="Sözleşme"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            width="50%"
            depressed
            small
            @click="uploadContract"
          >
            Yükle
          </v-btn>
          <v-btn
            color="error"
            width="50%"
            depressed
            small
            @click="contractDialog = false"
          >
            Vazgeç
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import { get } from 'vuex-pathify'
  import { RULES } from '@/util/globals'
  export default {
    name: 'ConsultantForm',
    props: {
      formType: { type: String, default: 'create' },
      consultant: { type: Object, default: null },
    },
    data: () => ({
      valid: false,
      menu: false,
      date: null,
      files: [],
      localeDate: null,
      contractDialog: false,
      contractDocument: null,
      RULES,
    }),
    computed: {
      ...get('user', ['user', 'users']),
      ...get('jobTitle', ['jobTitles']),
      ...get('experienceSpan', ['experienceSpans']),
      ...get('project', ['projects']),
    },
    mounted () {
      this.$store.dispatch('jobTitle/getJobTitles')
      this.$store.dispatch('user/getUnitManagers')
      this.$store.dispatch('experienceSpan/getExperienceSpans')
      this.$store.dispatch('project/getProjects')

      this.consultant.companyId = this.user.companyId

      if (this.formType !== 'create') {
        const arr = this.consultant.birthday.split('T')[0].split('-')
        this.localeDate = `${arr[2]}/${arr[1]}/${arr[0]}`
      }
    },
    methods: {
      save (date) {
        const arr = date.split('-')

        this.localeDate = `${arr[2]}/${arr[1]}/${arr[0]}`
        this.consultant.birthday = new Date(date).toISOString()
        this.$refs.menu.save(date)
      },
      showContract () {
        console.log('contract doc', this.consultant.contractFilePath)
        if (this.consultant.contractFilePath) {
          window.open(this.consultant.contractFilePath, '_blank').focus()
        }
      },
      uploadContract () {
        if (this.contractDocument !== null) {
          const formData = new FormData()
          formData.append('files', this.contractDocument)
          this.$store.dispatch('contract/uploadContract', { formData, sending: this.consultant })
          this.contractDialog = false
        }
      },
      createOrUpdateConsultant () {
        if (this.$refs.form.validate()) {
          const payload = { ...this.consultant }

          if (this.formType === 'create') {
            this.$store.dispatch('consultant/createConsultant', payload)
            this.clearForm()
          } else this.$store.dispatch('consultant/updateConsultant', payload)
          this.$emit('close-dialog')
        }
      },
      clearForm () {
        this.consultant.email = this.consultant.phone = this.consultant.TCKN = ''
        this.consultant.firstName = this.consultant.lastName = ''
        this.consultant.birthday = this.localeDate = this.date = null
        this.$refs.form.resetValidation()
      },
    },
  }
</script>

<style lang="scss" scoped></style>
