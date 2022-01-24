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
        <projects-list />
      </v-tab-item>

      <v-tab-item value="newProject">
        <project-form
          form-type="create"
          :project="newProject"
        />
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
  export default {
    name: 'Projects',
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
  }
</script>

<style lang="scss" scoped></style>
