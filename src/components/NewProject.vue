<template>
  <v-form>
    <v-container class="py-3">
      <v-row>
        <v-col cols="3">
          <v-text-field
            disabled
            color="purple"
            label="Birim Müdürü"
            value="Fatih Cigeroglu"
          />
        </v-col>

        <v-col cols="3">
          <v-select
            v-model="newProject.costCenter"
            :items="costCenters"
            item-text="center"
            item-value="id"
            label="Masraf Merkezi"
            return-object
          />
        </v-col>

        <v-col cols="3">
          <v-menu
            ref="startDateOpened"
            v-model="startDateOpened"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="newProject.startingDate"
                label="Başlangıç Tarihi"
                persistent-hint
                prepend-icon="mdi-calendar"
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="newProject.startingDate"
              no-title
              @input="startDateOpened = false"
            />
          </v-menu>
        </v-col>

        <v-col cols="3">
          <v-menu
            ref="endDateOpened"
            v-model="endDateOpened"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="newProject.endingDate"
                label="Bitiş Tarihi"
                persistent-hint
                prepend-icon="mdi-calendar"
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="newProject.endingDate"
              no-title
              @input="endDateOpened = false"
            />
          </v-menu>
        </v-col>

        <v-col cols="3">
          <v-btn
            class="my-2"
            width="100%"
            color="primary"
            @click="createProject()"
          >
            Oluştur
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
  export default {
    name: 'NewProject',
    data () {
      return {
        popup: null,
        startDateOpened: false, // Staring Date Picker
        endDateOpened: false, // Ending Date Picker

        costCenters: [
          { id: 0, center: 'POS ve Üye işyerleri', abbr: 'POS' },
          { id: 1, center: 'Masraf merkezi 2', abbr: 'MER1' },
          { id: 2, center: 'Masraf merkezi 3', abbr: 'MER2' },
        ],
        newProject: {
          label: '',
          costCenter: { id: '', center: '' },
          startingDate: '',
          endingDate: '',
        },
      }
    },
    methods: {
      createProject () {
        console.log('creating project')
      },
      editProject (id) {
        console.log('id', id)
      },
    },
  }
</script>

<style lang="scss" scoped></style>
