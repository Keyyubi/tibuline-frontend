<template>
  <v-form>
    <v-container class="py-3">
      <v-row>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            disabled
            color="purple"
            label="Birim Müdürü"
            value="Fatih Cigeroglu"
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="supplier"
            :hint="`${supplier.company}, ${supplier.abbr}`"
            :items="suppliers"
            item-text="company"
            item-value="abbr"
            label="Tedarikçi Firma"
            persistent-hint
            return-object
            single-line
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="costCenter"
            :items="costCenters"
            item-text="center"
            item-value="abbr"
            label="Masraf Merkezi"
            return-object
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="jobTitle"
            :items="jobTitles"
            item-text="title"
            item-value="abbr"
            label="Ünvan"
            return-object
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="experience"
            :items="experiences"
            item-text="exp"
            item-value="value"
            label="Tecrübe Aralığı"
            return-object
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            color="purple"
            disabled
            label="Aylık Bütçe"
            type="number"
            value="16.606"
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
                v-model="startingDate"
                label="Başlangıç Tarihi"
                persistent-hint
                prepend-icon="mdi-calendar"
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="startingDate"
              no-title
              @input="menu1 = false"
            />
          </v-menu>
        </v-col>

        <!-- Due Date -->
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
                v-model="endingDate"
                label="Bitiş Tarihi"
                persistent-hint
                prepend-icon="mdi-calendar"
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="endingDate"
              no-title
              @input="menu2 = false"
            />
          </v-menu>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            color="purple"
            disabled
            label="Toplam Bütçe"
            type="number"
            value="16.606"
          />
        </v-col>

        <v-col
          cols="6"
          md="4"
          class="text-right"
        >
          <v-select
            v-model="project"
            :items="projects"
            item-text="label"
            item-value="code"
            label="Hedef Proje"
            return-object
          />
        </v-col>

        <v-col
          cols="3"
          md="4"
          class="text-right"
        >
          <v-btn
            color="primary"
            width="100%"
            x-large
            depressed
          >
            Oluştur
          </v-btn>
        </v-col>

        <v-col
          cols="3"
          md="4"
          class="text-right"
        >
          <v-btn
            x-large
            color="error"
            width="100%"
            depressed
            @click="popup = false"
          >
            Vazgeç
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
  export default {
    name: 'NewRequest',
    data () {
      return {
        popup: null,
        menu1: false, // Staring Date Picker
        menu2: false, // Ending Date Picker
        supplier: { company: '', abbr: '' },
        costCenter: { center: '', abbr: '' },
        jobTitle: { title: '', abbr: '' },
        experience: { exp: '', value: '' },
        project: { code: '', label: '' },
        startingDate: null,
        endingDate: null,
        suppliers: [
          { company: 'Tibula', abbr: 'TBL' },
          { company: 'Mirsis', abbr: 'MRS' },
          { company: 'Netas', abbr: 'NE' },
        ],
        costCenters: [
          { center: 'POS ve Üye işyerleri', abbr: 'POS' },
          { center: 'Masraf merkezi 2', abbr: 'MER1' },
          { center: 'Masraf merkezi 3', abbr: 'MER2' },
        ],
        jobTitles: [
          { title: 'İş Analisti', abbr: 'BSA' },
          { title: 'DevOps Uzmanı', abbr: 'DOPS' },
          { title: 'Senior Backend Developer', abbr: 'SRB' },
          { title: 'Junior Frontend Developer', abbr: 'JRF' },
        ],
        experiences: [
          { exp: '2-3 Yıl', value: 0 },
          { exp: '3-5 Yıl', value: 1 },
          { exp: '5-8 Yıl', value: 2 },
          { exp: '8-12 Yıl', value: 3 },
          { exp: '12+ Yıl', value: 4 },
        ],
        projects: [
          { code: '001', label: 'Proje 1' },
          { code: '002', label: 'Proje 2' },
          { code: '003', label: 'Proje 3' },
          { code: '004', label: 'Proje 4' },
        ],
      }
    },
  }
</script>

<style lang="scss" scoped></style>
