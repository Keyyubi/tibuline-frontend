<template>
  <v-form
    ref="form"
    v-model="valid"
  >
    <v-container class="py-3">
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

        <!-- Actions -->
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
            Oluştur
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
  </v-form>
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
      localeDate: null,
      RULES,
    }),
    computed: {
      ...get('app', ['responseMsg', 'isErrorMsg']),
      ...get('user', ['user']),
      ...get('supplier', ['jobTitles', 'experienceSpans', 'projects']),
    },
    mounted () {
      this.$store.dispatch('supplier/getJobTitles')
      this.$store.dispatch('supplier/getExperienceSpans')
      this.$store.dispatch('supplier/getProjects')

      this.consultant.companyId = this.user.companyId
    },
    methods: {
      save (date) {
        const arr = date.split('-')

        this.localeDate = `${arr[2]}/${arr[1]}/${arr[0]}`
        this.consultant.birthday = new Date(date).toISOString()
        this.$refs.menu.save(date)
      },
      createOrUpdateConsultant () {
        if (this.$refs.form.validate()) {
          const payload = { ...this.consultant }

          if (this.formType === 'create') {
            this.$store.dispatch('supplier/createConsultant', payload)
            this.clearForm()
          } else this.$store.dispatch('supplier/updateConsultant', payload)
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
