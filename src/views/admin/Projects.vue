<template>
  <v-container
    id="projects-view"
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

      <v-tab href="#projects">
        Projeler
        <v-icon>mdi-poll</v-icon>
      </v-tab>
      <v-tab href="#newProject">
        Yeni Proje Oluştur
        <v-icon>mdi-plus-box-multiple</v-icon>
      </v-tab>
    </v-tabs>

    <div class="py3" />

    <v-tabs-items v-model="currentTab">
      <v-tab-item value="projects">
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

          <projects-list />
        </v-card>

        <!-- EDIT DIALOG -->
        <v-dialog
          v-model="dialog"
          width="960"
          :retain-focus="false"
        >
          <project-from
            form-type="update"
            :project="selectedProject"
            @close-dialog="dialog = false"
          />
        </v-dialog>
        <!-- END OF EDIT DIALOG -->
      </v-tab-item>

      <v-tab-item value="newProject">
        <project-from
          form-type="create"
          :project="newProject"
        />
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
  import { get } from 'vuex-pathify'
  import ProjectsList from '../../components/lists/ProjectsList.vue'
  export default {
    name: 'Projects',
    components: { ProjectsList },
    data () {
      return {
        currentTab: 'projects',
        searchWord: '',
        dialog: false,
        newProject: {
          name: '',
          createdBy: 0,
          assignedToId: 0,
          costCenterId: 0,
          startDate: null,
          endDate: null,
          projectBudget: null,
          projectStatus: 0,
        },
      }
    },
    computed: {
      ...get('user', ['user', 'users']),
      ...get('project', ['projects']),
      ...get('costCenter', ['costCenters']),
    },
    mounted () {
      this.$store.dispatch('project/getProjects')
      this.$store.dispatch('costCenter/getCostCenters')
      this.$store.dispatch('user/getUnitManagers')
    },
  }
</script>

<style lang="scss" scoped></style>
