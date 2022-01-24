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
      :items="projects"
      :search="searchWord"
    >
      <!-- eslint-disable-next-line -->
      <template v-slot:item.id="{ item }">
        <v-chip
          class="ma-2"
          color="primary"
          dark
          @click="showProject(item)"
        >
          <b>Güncelle</b>
          <v-icon right>
            mdi-arrow-right-bold
          </v-icon>
        </v-chip>
      </template>

      <!-- eslint-disable-next-line -->
      <template v-slot:item.startDate="{ item }">
        {{ getLocaleDate(item.startDate) }}
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.endDate="{ item }">
        {{ getLocaleDate(item.endDate) }}
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.assignedToId="{ item }">
        {{ getProjectManager(item.assignedToId) }}
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.projectBudget="{ item }">
        {{ moneyMask(item.projectBudget) }}
      </template>
    </v-data-table>

    <v-dialog
      v-model="dialog"
      width="960"
      :retain-focus="false"
    >
      <user-form
        form-type="update"
        :user="selectedUser"
        @close-dialog="dialog = false"
      />
    </v-dialog>
  </v-card>
</template>

<script>
  import { ROLE_IDS as Roles } from '@/util/globals'
  import { get } from 'vuex-pathify'
  export default {
    name: 'UsersList',
    data () {
      return {
        valid: false,
        searchWord: '',
        dialog: false,
        selectedUser: {},
        headers: [
          {
            text: 'Güncelle',
            align: 'start',
            value: 'id',
          },
          { text: 'Proje', value: 'name' },
          { text: 'Sorumlusu', value: 'assignedToId' },
          { text: 'Baş. Tar.', value: 'startDate' },
          { text: 'Bit. Tar.', value: 'endDate' },
          { text: 'Bütçesi', value: 'projectBudget' },
        ],
      }
    },
    computed: {
      ...get('user', ['user', 'users']),
      ...get('project', ['projects']),
      ...get('costCenter', ['costCenters']),
    },
    mounted () {
      this.$store.dispatch('costCenter/getCostCenters')
      if (this.user.roleId === Roles.UNIT_MANAGER) {
        this.$store.dispatch('project/getProjectsByAssignedTo')
      } else {
        this.$store.dispatch('user/getUnitManagers')
        this.$store.dispatch('project/getProjects')
      }
    },
    methods: {
      showUser (project) {
        this.selectedUser = { ...project }
        this.dialog = true
      },
      getProjectManager (id) {
        if (this.user.roleId === Roles.ADMIN) {
          if (id && id.length > 0) {
            const manager = this.users.find(e => e.id === id)
            return manager ? manager.firstname + ' ' + manager.lastname : 'Atama yapılmadı'
          } else return 'Atama yapılmadı'
        } else {
          return this.user.firstname + ' ' + this.user.lastname
        }
      },
      getLocaleDate (date) {
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
