<template>
  <v-container class="py-3">
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
          v-model="consultant.firstname"
          label="Adı"
          :rules="[v => !!v || 'Ad boş geçilemez',]"
          required
          :disabled="user.roleId !== Roles.SUPPLIER"
        />
      </v-col>

      <!-- Lastname -->
      <v-col
        cols="12"
        md="4"
      >
        <v-text-field
          v-model="consultant.lastname"
          label="Soyadı"
          :rules="[v => !!v || 'Soyad boş geçilemez',]"
          required
          :disabled="user.roleId !== Roles.SUPPLIER"
        />
      </v-col>

      <!-- Supplier -->
      <v-col
        cols="12"
        md="4"
      >
        <v-select
          v-if="user.roleId !== Roles.SUPPLIER"
          v-model="consultant.supplierId"
          :items="suppliers"
          item-text="name"
          item-value="id"
          label="Şirket"
          disabled
        />
        <v-text-field
          v-else
          :value="user.company.name"
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
          :disabled="user.roleId !== Roles.SUPPLIER"
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
          :disabled="user.roleId !== Roles.SUPPLIER"
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
              :disabled="user.roleId !== Roles.SUPPLIER"
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
          :disabled="user.roleId !== Roles.SUPPLIER"
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
          :disabled="user.roleId !== Roles.SUPPLIER"
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
          :item-text="e => e.firstname + ' ' + e.lastname"
          item-value="id"
          label="Yöneticisi"
          :disabled="user.roleId !== Roles.SUPPLIER"
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
          :disabled="user.roleId !== Roles.SUPPLIER"
        />
      </v-col>

      <!-- Experience -->
      <v-col
        cols="12"
        md="4"
      >
        <v-select
          v-model="consultant.experienceId"
          :items="experiences"
          item-text="name"
          item-value="id"
          label="Tecrübe Aralığı"
          :disabled="user.roleId !== Roles.SUPPLIER"
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
          :disabled="user.roleId !== Roles.SUPPLIER"
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
        Kişisel Evrakları:
        <v-btn-toggle
          tile
          color="primary"
          group
        >
          <v-btn
            color="primary"
            depressed
            outlined
            :disabled="!consultant.filePath"
            @click="listDialog = true"
          >
            {{ !consultant.filePath ? 'Kişisel evrakları bulunmuyor' : 'Görüntüle' }}
          </v-btn>
          <v-btn
            v-if="user.roleId === Roles.SUPPLIER"
            color="primary"
            depressed
            outlined
            @click="dialog = true"
          >
            Yükle
          </v-btn>
        </v-btn-toggle>
      </v-col>

      <!-- Contract Document -->
      <v-col
        cols="12"
        md="6"
      >
        Sözleşme Evrakı:
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
            @click="showFile(consultant.contractFilePath)"
          >
            {{ !consultant.contractFilePath ? 'Sözleşme evrakı bulunmuyor' : 'Görüntüle' }}
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

    <!-- Personal Documents -->
    <v-dialog
      v-model="dialog"
      persistent
      width="460"
    >
      <v-card>
        <v-card-title class="text-h5 primary white--text">
          Personel Evrakları Yükle
        </v-card-title>
        <v-card-text>
          <v-file-input
            v-model="files"
            label="Kişisel Evrakları"
            accept="image/*, .pdf"
            counter
            multiple
            show-size
            small-chips
            :disabled="user.roleId !== Roles.SUPPLIER"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            width="50%"
            depressed
            small
            @click="uploadFiles"
          >
            Yükle
          </v-btn>
          <v-btn
            color="error"
            width="50%"
            depressed
            small
            @click="closeUploadDialog()"
          >
            Vazgeç
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Personal Files Show -->
    <v-dialog
      v-model="listDialog"
      width="460"
    >
      <v-card>
        <v-card-title class="text-h5 primary white--text">
          Personel Evrakları
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item-group>
              <v-list-item
                v-for="(item, i) in consultant.personalFiles"
                :key="i"
              >
                <v-list-item-avatar
                  tile
                  size="62"
                >
                  <v-img :src="item" />
                </v-list-item-avatar>
                <v-list-item-content @click="showFile(item)">
                  <v-list-item-title v-text="'Dosya ' + (i + 1)" />
                </v-list-item-content>
                <v-list-item-action @click="deleteFile(item)">
                  <v-icon>mdi-close</v-icon>
                </v-list-item-action>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn
            color="error"
            width="100%"
            depressed
            small
            @click="listDialog = false"
          >
            Kapat
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import { RULES, ROLES as Roles } from '@/util/globals'
  import { CheckIsNull } from '@/util/helpers'
  import { get } from 'vuex-pathify'
  export default {
    name: 'ConsultantForm',
    props: {
      formType: { type: String, default: 'create' },
      consultant: {
        type: Object,
        default: () => {
          return {
            firstname: '',
            lastname: '',
            birthday: null,
            email: '',
            phone: '',
            tckn: '',
            isActive: false,
            projectId: null,
            unitManagerUserId: null,
            contractId: 0,
            supplierId: 0,
            jobTitleId: 0,
            experienceId: 0,
            personalFiles: '',
          }
        },
      },
    },
    data: () => ({
      menu: false,
      date: null,
      files: [],
      localeDate: null,
      dialog: false,
      listDialog: false,
      dialogType: '',
      Roles,
      RULES,
    }),
    computed: {
      ...get('user', ['user', 'users']),
      ...get('supplier', ['suppliers']),
      ...get('jobTitle', ['jobTitles']),
      ...get('experience', ['experiences']),
      ...get('project', ['projects']),
    },
    mounted () {
      this.$store.dispatch('user/getUnitManagers')
      this.$store.dispatch('jobTitle/getJobTitles')
      this.$store.dispatch('experience/getExperiences')
      this.$store.dispatch('project/getProjects')

      if (this.formType !== 'create') {
        const arr = this.consultant.birthday.split('T')[0].split('-')
        this.localeDate = `${arr[2]}/${arr[1]}/${arr[0]}`
      } else {
        this.consultant.supplierId = this.user.company.id
      }
    },
    methods: {
      save (date) {
        const arr = date.split('-')

        this.localeDate = `${arr[2]}/${arr[1]}/${arr[0]}`
        this.consultant.birthday = new Date(date).toISOString()
        this.$refs.menu.save(date)
      },
      showFile (filePath) {
        window.open(filePath, '_blank').focus()
      },
      closeUploadDialog () {
        this.files = []
        this.dialog = false
      },
      uploadFiles () {
        if (this.files.length) {
          const formData = new FormData()
          for (let i = 0; i < this.files.length; i++) {
            formData.append('files', this.files[i], this.files[i].name)
          }

          this.$store.dispatch('consultant/uploadFiles', { formData, sending: this.consultant })
          this.closeUploadDialog()
          this.$emit('close-dialog')
        }
      },
      createOrUpdateConsultant () {
        const fields = [
          this.consultant.firstname,
          this.consultant.lastname,
          this.consultant.birthday,
          this.consultant.email,
          this.consultant.phone,
          this.consultant.tckn,
          this.consultant.supplierId,
          this.consultant.jobTitleId,
          this.consultant.experienceId,
        ]
        if (!CheckIsNull(fields) && this.consultant.jobTitleId !== 0 && this.consultant.experienceId !== 0) {
          const payload = { ...this.consultant }

          if (this.formType === 'create') {
            this.$store.dispatch('consultant/createConsultant', payload)
          } else this.$store.dispatch('consultant/updateConsultant', payload)
          this.$emit('close-dialog')
        } else {
          this.$store.dispatch('app/showAlert', { message: 'Lütfen tüm zorunlu alanları doldurduğunuzdan emin olunuz.', type: 'warning' })
        }
      },
      reset () {
        this.consultant.email = this.consultant.phone = this.consultant.tckn = ''
        this.consultant.firstname = this.consultant.lastname = ''
        this.consultant.birthday = this.localeDate = this.date = null
        this.consultant.projectId = this.consultant.unitManagerUserId = null
        this.consultant.jobTitleId = this.consultant.experienceId = null
      },
      deleteFile (path) {
        if (path && path.length > 0) {
          const payload = { ...this.consultant }
          payload.personalFiles = payload.personalFiles.filter(e => e !== path)
          payload.filePath = payload.personalFiles.join()

          // this.$store.dispatch('consultant/updateConsultant', payload)
          this.$store.dispatch('consultant/deletePersonalFile', path)
          this.dialog = false
          this.$emit('close-dialog')
        }
      },
    },
  }
</script>

<style lang="scss" scoped></style>
