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

      <v-tab href="#projects">
        Projeler
        <v-icon>mdi-folder-table-outline</v-icon>
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

          <v-data-table
            :headers="headers"
            :items="projects"
            :search="searchWord"
          >
            <template v-slot:item.id="{ item }">
              <v-chip
                class="ma-2"
                color="primary"
                dark
                @click="editProject(item.id)"
              >
                <b>{{ item.id }}</b>
                <v-icon right>
                  mdi-arrow-right-bold
                </v-icon>
              </v-chip>
            </template>
          </v-data-table>
        </v-card>
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
        requestType: 'all',
        searchWord: '',
        headers: [
          {
            text: 'Proje No.',
            align: 'start',
            value: 'id',
          },
          { text: 'Proje', value: 'label' },
          { text: 'Sorumlu Kişi', value: 'managingBy.fullName' },
        ],
        projects: [
          {
            id: 0,
            label: 'Proje 1',
            managingBy: { id: 0, fullName: 'Murathan Karayazi' },
          },
          {
            id: 1,
            label: 'Proje 2',
            managingBy: { id: 1, fullName: 'Furkan Reyhanlioglu' },
          },
          {
            id: 2,
            label: 'Proje 2',
            managingBy: { id: 0, fullName: 'Murathan Karayazi' },
          },
          {
            id: 3,
            label: 'Proje 3',
            managingBy: { id: 1, fullName: 'Furkan Reyhanlioglu' },
          },
        ],
      }
    },
    methods: {
      editProject (id) {
        console.log('id', id)
      },
    },
  }
</script>

<style lang="scss" scoped></style>
