<template>
  <v-container>
    <v-tabs
      v-model="currentTab"
      background-color="primary"
      centered
      dark
      icons-and-text
    >
      <v-tabs-slider />

      <v-tab href="#addProject">
        Yeni Proje Oluştur
        <v-icon>mdi-folder-plus</v-icon>
      </v-tab>

      <v-tab href="#projects">
        Projeler
        <v-icon>mdi-folder-table-outline</v-icon>
      </v-tab>
    </v-tabs>

    <div class="py3" />

    <v-tabs-items v-model="currentTab">
      <v-tab-item value="addProject">
        <new-project />
      </v-tab-item>

      <v-tab-item value="projects">
        <all-projects />
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
  export default {
    name: 'Projects',
    data () {
      return {
        currentTab: '',
      }
    },
  }
</script>
