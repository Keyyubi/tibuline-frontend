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
    <v-data-table
      :headers="headers"
      :items="consultants"
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
          <b>{{ item.id }}</b>
          <v-icon right>
            mdi-arrow-right-bold
          </v-icon>
        </v-chip>
      </template>
      <template v-slot:item.firstName="{ item }">
        {{ item.firstName + ' ' + item.lastName }}
      </template>
      <template v-slot:item.unitManagerUserId="{ item }">
        {{ getUnitManagerName(item.unitManagerUserId) }}
      </template>
      <template v-slot:item.projectId="{ item }">
        {{ getProjectName(item.projectId) }}
      </template>
      <template v-slot:item.startDate="{ item }">
        {{ getLocaleDate(item.startDate) }}
      </template>
      <template v-slot:item.endDate="{ item }">
        {{ getLocaleDate(item.endDate) }}
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
  import { ROLE_IDS as Roles } from '@/util/globals'
  import { get } from 'vuex-pathify'
  export default {
    name: 'ConsultantsList',
    data () {
      return {
        searchWord: '',
        dialog: false,
        selectedConsultant: null,
        Roles,
        headers: [
          {
            text: 'Danışman No.',
            align: 'start',
            value: 'id',
          },
          { text: 'Ad Soyad', value: 'firstName' },
          { text: 'Yönetici', value: 'unitManagerUserId' },
          { text: 'Proje', value: 'projectId' },
          { text: 'Söz. Baş. Tar.', value: 'startDate' },
          { text: 'Söz. Bit. Tar.', value: 'endDate' },
          { text: 'Durumu', value: 'isActive' },
        ],
      }
    },
    computed: {
      ...get('consultant', ['consultants']),
      ...get('contract', ['contracts']),
      ...get('jobTitle', ['jobTitles']),
      ...get('experienceSpan', ['experienceSpans']),
      ...get('project', ['projects']),
      ...get('user', ['user', 'users']),
    },
    mounted () {
      if (this.user.roleId === Roles.UNIT_MANAGER) {
        this.$store.dispatch('consultant/getConsultantsByManagerId')
        this.$store.dispatch('project/getProjectsByAssignedTo')
      } else {
        this.$store.dispatch('user/getUnitManagers')
        this.$store.dispatch('consultant/getConsultants')
        this.$store.dispatch('project/getProjects')
      }
    },
    methods: {
      seeDetails (consultant) {
        this.selectedConsultant = { ...consultant }
        this.dialog = true
      },
      getUnitManagerName (id) {
        if (this.user.roleId === Roles.UNIT_MANAGER) {
          return this.user.firstName + ' ' + this.user.lastName
        } else {
          const user = this.users.find(e => e.id === id)
          return user ? user.firstName + ' ' + user.lastName : 'İsim bulunamadı.'
        }
      },
      getProjectName (id) {
        const project = this.projects.find(e => e.id === id)
        return project ? project.name : 'Proje bulunmuyor.'
      },
      getLocaleDate (date) {
        if (date) {
          const arr = date.split('T')[0].split('-')
          return `${arr[2]}/${arr[1]}/${arr[0]}`
        } else return 'Sözleşme bulunmuyor.'
      },
    },
  }
</script>

<style lang="scss" scoped></style>
