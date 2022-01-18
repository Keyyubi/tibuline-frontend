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
          { text: 'Söz. Baş. Tar.', value: 'contractId' },
          { text: 'Söz. Bit. Tar.', value: 'contractId' },
          { text: 'Durumu', value: 'isActive' },
        ],
      }
    },
    computed: {
      ...get('consultant', ['consultants']),
      ...get('jobTitle', ['jobTitles']),
      ...get('experienceSpan', ['experienceSpans']),
      ...get('project', ['projects']),
      ...get('user', ['user', 'users']),
    },
    mounted () {
      console.log('user', this.user)
      if (this.user.roleId === Roles.UNIT_MANAGER) {
        this.$store.dispatch('consultant/getConsultantsByManagerId')
      } else {
        this.$store.dispatch('user/getUnitManagers')
        this.$store.dispatch('consultant/getConsultants')
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
      getProject (id) {
        const project = this.projects.find(e => e.id === id)
        return project ? project.name : 'Proje bulunmuyor.'
      },
      getContractStartDate (id) {
        const contract = this.contracts.find(e => e.id === id)
        return project ? project.name : 'Proje bulunmuyor.'
      },
      getContractEndDate (id) {
        const project = this.projects.find(e => e.id === id)
        return project ? project.name : 'Proje bulunmuyor.'
      },
    },
  }
</script>

<style lang="scss" scoped></style>
