<template>
  <v-card>
    <v-card-title
      v-if="formType !== 'create'"
      class="text-h5 primary white--text"
    >
      Proje Güncelle
    </v-card-title>

    <v-card-text>
      <v-container class="py-3">
        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="project.name"
              label="Proje Adı"
              :rules="[v => !!v || 'Proje adı boş geçilemez.']"
              required
            />
          </v-col>

          <!-- Cost Center -->
          <v-col cols="4">
            <v-select
              v-model="project.costCenterId"
              :items="costCenters"
              item-text="name"
              item-value="id"
              label="Masraf Merkezi"
              :rules="[v => v > 0 || 'Masraf merkezi seçiniz']"
              required
            />
          </v-col>

          <!-- Unit Manager -->
          <v-col
            v-if="user.roleId === Roles.ADMIN"
            cols="4"
          >
            <v-autocomplete
              v-model="project.assignedToId"
              :items="users"
              :item-text="item => item.firstname + ' ' + item.lastname"
              itemprop="firstname"
              item-value="id"
              label="Proje Sorumlusu"
              required
              :rules="[v => v > 0 || 'Proje sorumlusu seçiniz']"
            />
          </v-col>
          <v-col
            v-else
            cols="4"
          >
            <v-text-field
              :value="user.firstname + ' ' + user.lastname"
              label="Proje Sorumlusu"
              disabled
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
                  v-model="starting"
                  label="Başlangıç Tarihi"
                  persistent-hint
                  prepend-icon="mdi-calendar"
                  :rules="[v => !!v || 'Tarih boş geçilemez.']"
                  required
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="project.startDate"
                no-title
                @input="menu1 = false"
                @change="e => starting = getLocaleDate(e)"
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
                  v-model="ending"
                  label="Bitiş Tarihi"
                  persistent-hint
                  prepend-icon="mdi-calendar"
                  :rules="[v => !!v || 'Tarih boş geçilemez.']"
                  required
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="project.endDate"
                no-title
                @input="menu2 = false"
                @change="e => ending = getLocaleDate(e)"
              />
            </v-menu>
          </v-col>

          <!-- Budget -->
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="project.projectBudget"
              v-mask="currencyMask"
              append-icon="mdi-currency-try"
              label="Proje Bütçesi"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <v-divider />

    <!-- Card Actions -->
    <v-card-actions>
      <v-row>
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
            @click="updateProject"
          >
            {{ formType === 'create' ? 'Oluştur' : 'Güncelle' }}
          </v-btn>
        </v-col>
        <v-col
          v-if="formType !== 'create'"
          cols="6"
          class="text-right"
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
    </v-card-actions>
  </v-card>
</template>

<script>
  import { ROLE_IDS as Roles } from '@/util/globals'
  import { CheckIsNull } from '@/util/helpers'
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
    name: 'ProjectForm',
    props: {
      formType: { type: String, default: 'create' },
      project: { type: Object, default: null },
    },
    data () {
      return {
        currencyMask,
        menu1: false,
        menu2: false,
        starting: '',
        ending: '',
        Roles,
      }
    },
    computed: {
      ...get('user', ['user', 'users']),
      ...get('costCenter', ['costCenters']),
    },
    mounted () {
      this.$store.dispatch('company/getCompanies')
      if (this.user.roleId === Roles.UNIT_MANAGER) {
        this.project.assignedToId = this.user.id
      }
      if (this.formType === 'create') {
        this.project.createdBy = this.user.id
      } else {
        this.starting = this.getLocaleDate(this.project.startDate)
        this.ending = this.getLocaleDate(this.project.endDate)
      }
    },
    methods: {
      getLocaleDate (date) {
        const arr = date.split('T')[0].split('-')
        return `${arr[2]}/${arr[1]}/${arr[0]}`
      },
      reset () {
        this.project.name = ''
        this.project.createdBy = 0
        this.project.assignedToId = 0
        this.project.costCenterId = 0
        this.project.startDate = null
        this.project.endDate = null
        this.project.projectBudget = null
        this.project.projectStatus = 0
      },
      updateProject () {
        const fields = [
          this.project.name,
          this.project.createdBy,
          this.project.assignedToId,
          this.project.costCenterId,
          this.project.startDate,
          this.project.endDate,
        ]

        if (!CheckIsNull(fields)) {
          const target = this.formType === 'create' ? 'project/createProject' : 'project/updateProject'
          this.project.projectBudget = this.project.projectBudget.replace('.', '').replace(',', '.')
          this.$store.dispatch(target, this.project)
          this.reset()
          this.$emit('close-dialog')
        }
      },
    },
  }
</script>

<style lang="scss" scoped></style>
