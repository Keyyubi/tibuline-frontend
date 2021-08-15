<template>
  <v-container
    id="contracts-view"
    fluid
    tag="section"
  >
    <material-card
      color="primary"
      icon="mdi-text-box-plus-outline"
    >
      <template #title>
        Yeni Sözleşme Oluştur —
        <small class="text-body-1">Sözleşme Detaylarını Doldurun</small>
      </template>

      <v-form>
        <v-container class="py-0">
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
                v-model="expenseCenter"
                :items="expenseCenters"
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
              cols="12"
              class="text-right"
            >
              <v-text-field
                color="purple"
                label="Proje Adı"
              />
            </v-col>

            <v-col
              cols="12"
              class="text-right"
            >
              <v-btn
                color="primary"
                min-width="150"
              >
                Talep Oluştur
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </material-card>

    <div class="py-3" />

    <material-card
      icon="mdi-text-box-plus-outline"
      icon-small
      title="Sözleşmeler"
      color="accent"
    >
      <v-btn-toggle
        v-model="contractType"
        tile
        color="accent"
        group
        right
      >
        <v-btn
          small
          value="all"
        >
          Hepsi
        </v-btn>

        <v-btn
          small
          value="pending"
        >
          Revize Bekleyen
        </v-btn>

        <v-btn
          small
          value="ready"
        >
          Sözleşme Bekleyen
        </v-btn>
      </v-btn-toggle>

      <v-simple-table>
        <thead>
          <tr>
            <th class="primary--text">
              Talep No.
            </th>
            <th class="primary--text">
              Tedarikçi
            </th>
            <th class="primary--text">
              Pozisyon
            </th>
            <th class="primary--text">
              Aday
            </th>
            <th class="primary--text">
              Talep Durumu
            </th>
            <th class="primary--text">
              Revize Et
            </th>
            <th class="primary--text">
              Sözleşme Ekle
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(item, index) in contracts"
            :key="index + '_contract'"
          >
            <td>{{ item.contractId }}</td>
            <td>{{ item.supplier.title }}</td>
            <td>{{ item.pozition.title }}</td>
            <td>
              {{ item.candicate.firstName + ' ' + item.candicate.lastName }}
            </td>
            <td>
              <v-chip
                class="ma-2"
                :color="item.situation.id === 0 ? 'orange' : 'green'"
                text-color="white"
              >
                {{
                  item.situation.id === 0
                    ? 'Revize Bekliyor'
                    : 'Sözleşme Bekliyor'
                }}
                <v-icon
                  v-if="item.situation.id === 0"
                  right
                >
                  mdi-pencil
                </v-icon>
                <v-icon
                  v-else
                  right
                >
                  mdi-plus
                </v-icon>
              </v-chip>
            </td>
            <td>
              <v-btn
                class="mx-2"
                small
                depressed
                dark
                color="red"
                @click="editRequest(item.contractId)"
              >
                <v-icon dark>
                  mdi-pencil
                </v-icon>
              </v-btn>
            </td>
            <td>
              <v-btn
                class="mx-2"
                small
                depressed
                dark
                color="green"
                @click="addContract(item.contractId)"
              >
                <v-icon dark>
                  mdi-plus
                </v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </material-card>

    <div class="py-3" />
  </v-container>
</template>

<script>
  export default {
    name: 'ReadyContractsView',
    data () {
      return {
        menu1: false, // Staring Date Picker
        menu2: false, // Ending Date Picker
        supplier: { company: '', abbr: '' },
        expenseCenter: { center: '', abbr: '' },
        jobTitle: { title: '', abbr: '' },
        experience: { exp: '', value: '' },

        startingDate: null,
        endingDate: null,
        suppliers: [
          { company: 'Tibula', abbr: 'TBL' },
          { company: 'Mirsis', abbr: 'MRS' },
          { company: 'Netas', abbr: 'NE' },
        ],
        expenseCenters: [
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
        contractType: 'all',
        contracts: [
          {
            contractId: 1,
            supplier: { supplierId: 0, title: 'Tibula' },
            pozition: { id: 1, title: 'Sr. Software Developer' },
            candicate: { firstName: 'Murathan', lastName: 'Karayazi' },
            situation: { id: 0, label: 'Rezive Bekliyor' },
          },
          {
            contractId: 1,
            supplier: { supplierId: 0, title: 'Tibula' },
            pozition: { id: 1, title: 'Sr. Software Developer' },
            candicate: { firstName: 'Furkan', lastName: 'Reyhanlioglu' },
            situation: { id: 0, label: 'Rezive Bekliyor' },
          },
          {
            contractId: 1,
            supplier: { supplierId: 0, title: 'Tibula' },
            pozition: { id: 1, title: 'Sr. Software Developer' },
            candicate: { firstName: 'Murathan', lastName: 'Karayazi' },
            situation: { id: 1, label: 'Sözleşme Bekliyor' },
          },
        ],
      }
    },
    methods: {
      editRequest (id) {
        console.log('contractId - edit', id)
      },
      addContract (id) {
        console.log('contractId - add', id)
      },
    },
  }
</script>
