<template>
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

    <v-sheet
      v-if="isLoading"
      width="100%"
      height="400"
      class="d-flex justify-center align-center"
    >
      <v-progress-circular
        size="100"
        width="10"
        indeterminate
        color="primary"
      />
    </v-sheet>

    <v-data-table
      v-else
      :headers="headers"
      :items="consultants"
      :search="searchWord"
    >
      <!-- eslint-disable-next-line -->
      <template v-slot:item.firstname="{ item }">
        <v-chip
          class="ma-2"
          color="primary"
          dark
          @click="showConsultant(item.id)"
        >
          <b>{{ item.firstname + ' ' + item.lastname }}</b>
          <v-icon right>
            mdi-arrow-right-bold
          </v-icon>
        </v-chip>
      </template>
      <template v-slot:item.titleAndExp="{ item }">
        {{ getTitleAndExp(item) }}
      </template>
      <template v-slot:item.changable="{ item }">
        {{ getColumnLabel(item) }}
      </template>
      <template v-slot:item.projectId="{ item }">
        {{ getProjectName(item.projectId) }}
      </template>
      <template v-slot:item.titleAndSpan="{ item }">
        {{ getTitleAndExp(item) }}
      </template>
      <template v-slot:item.startDate="{ item }">
        {{ getLocaleDate(item.startDate) }}
      </template>
      <template v-slot:item.endDate="{ item }">
        {{ getLocaleDate(item.endDate) }}
      </template>
      <template v-slot:item.birthday="{ item }">
        {{ getLocaleDate(item.birthday) }}
      </template>

      <!-- eslint-disable-next-line -->
      <template v-slot:item.isActive="{ item }">
        <v-chip
          :color="item.isActive ? 'green' : 'grey'"
          dark
        >
          {{ item.isActive ? 'Aktif' : 'Pasif' }}
        </v-chip>
      </template>
    </v-data-table>

    <v-dialog
      v-model="dialog"
      width="70%"
      :retain-focus="false"
      offset-x
    >
      <v-card>
        <v-card-title class="text-h5 primary white--text">
          Danışman Güncelle
        </v-card-title>

        <v-card-text>
          <consultant-form
            form-type="update"
            :consultant="selectedConsultant"
            @close-dialog="dialog = false"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
  import { ROLES as Roles } from '@/util/globals'
  import { get } from 'vuex-pathify'
  export default {
    name: 'ConsultantsList',
    data () {
      return {
        searchWord: '',
        dialog: false,
        selectedConsultant: null,
        Roles,
      }
    },
    computed: {
      ...get('user', ['user', 'users']),
      ...get('consultant', ['consultants', 'isLoading']),
      ...get('supplier', ['suppliers']),
      ...get('jobTitle', ['jobTitles']),
      ...get('experience', ['experiences']),
      ...get('project', ['projects']),
      headers () {
        const arr = [
          {
            text: 'Danışman',
            align: 'start',
            value: 'firstname',
          },
          { text: 'Ünvan / Tecrübe', value: 'titleAndExp', width: '250' },
          { text: 'text', value: 'changable', width: '250' },
          { text: 'Proje', value: 'projectId', width: '150' },
          { text: 'Söz. Baş. Tar.', value: 'startDate', width: '150' },
          { text: 'Söz. Bit. Tar.', value: 'endDate', width: '150' },
          { text: 'E-mail', value: 'email' },
          { text: 'Telefon', value: 'phone', width: '150' },
          { text: 'Doğum Tar.', value: 'birthday', width: '150' },
          { text: 'Durum', value: 'isActive', width: '120' },
        ]

        arr[2].text = this.user.roleId === Roles.UNIT_MANAGER ? 'Tedarikçi' : 'Yönetici'

        return arr
      },
    },
    async mounted () {
      // To be sure current user update at store
      this.$store.dispatch('consultant/setLoading', true)
      await new Promise(resolve => setTimeout(resolve, 1000))

      this.$store.dispatch('jobTitle/getJobTitles')
      this.$store.dispatch('experience/getExperiences')
      if (this.user.roleId === Roles.UNIT_MANAGER) {
        this.$store.dispatch('consultant/getConsultantsByManagerId')
        this.$store.dispatch('project/getProjectsByAssignedTo')
        this.$store.dispatch('supplier/getSuppliers')
      } else {
        this.$store.dispatch('user/getUnitManagers')
        this.$store.dispatch('consultant/getConsultants')
        this.$store.dispatch('project/getProjects')
      }
    },
    methods: {
      showConsultant (id) {
        const consultant = this.consultants.find(e => e.id === id)
        this.selectedConsultant = { ...consultant }
        this.selectedConsultant.personalFiles = consultant.filePath ? consultant.filePath.split(',') : []
        this.dialog = true
      },
      getUnitManagerName (id) {
        if (this.user.roleId === Roles.UNIT_MANAGER) {
          return this.user.firstname + ' ' + this.user.lastname
        } else {
          const user = this.users.find(e => e.id === id)
          return user ? user.firstname + ' ' + user.lastname : 'İsim bulunamadı.'
        }
      },
      getProjectName (id) {
        try {
          const project = this.projects.find(e => e.id === id)
          return project.name.length > 30 ? project.name.slice(0, 30) + '...' : project.name
        } catch {
          return ' - '
        }
      },
      getLocaleDate (date) {
        if (date) {
          const arr = date.split('T')[0].split('-')
          return `${arr[2]}/${arr[1]}/${arr[0]}`
        } else return ' - '
      },
      getTitleAndExp (consultant) {
        try {
          const exp = this.experiences.find(e => e.id === consultant.experienceId)
          const title = this.jobTitles.find(e => e.id === consultant.jobTitleId)
          return title.name + ' / ' + exp.name
        } catch {
          return 'Hatalı Bilgi'
        }
      },
      getColumnLabel (item) {
        try {
          if (this.user.roleId === Roles.UNIT_MANAGER) {
            const result = this.suppliers.find(supplier => supplier.id === item.supplierId)
            return result.name.length > 30 ? result.name.slice(0, 30) + '...' : result.name
          } else {
            const result = this.users.find(manager => manager.id === item.unitManagerUserId)
            return result.firstname + ' ' + result.lastname
          }
        } catch {
          return 'Bulunmuyor'
        }
      },
    },
  }
</script>

<style lang="scss" scoped></style>
