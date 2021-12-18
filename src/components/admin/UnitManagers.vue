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
      :items="requests"
      :search="searchWord"
    >
      <template v-slot:item.id="{ item }">
        <v-dialog
          v-model="dialog"
          width="960"
          :retain-focus="false"
        >
          <!-- eslint-disable-next-line -->
          <template v-slot:activator="{ on, attrs }">
            <v-chip
              class="ma-2"
              color="primary"
              dark
              @click="showRequest(item)"
            >
              <b>{{ item.id }}</b>
              <v-icon right>
                mdi-arrow-right-bold
              </v-icon>
            </v-chip>
          </template>

          <v-card>
            <v-card-title class="text-h5 primary white--text">
              Talep Detayları
            </v-card-title>

            <v-card-text>
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

                  <!-- Supplier -->
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-select
                      v-model="selectedRequest.supplier"
                      :items="suppliers"
                      item-text="company"
                      item-value="id"
                      label="Tedarikçi Firma"
                      persistent-hint
                      return-object
                      single-line
                      @change="selectTarget('supplierId', selectedRequest.supplier)"
                    />
                  </v-col>

                  <!-- Cost Center -->
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-select
                      v-model="selectedRequest.costCenter"
                      :items="costCenters"
                      item-text="center"
                      item-value="abbr"
                      label="Masraf Merkezi"
                      return-object
                      @change="selectTarget('costCenterId', selectedRequest.costCenter)"
                    />
                  </v-col>

                  <!-- Job Title -->
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-select
                      v-model="selectedRequest.jobTitle"
                      :items="jobTitles"
                      item-text="title"
                      item-value="abbr"
                      label="Ünvan"
                      return-object
                      @change="selectTarget('jobTitleId', selectedRequest.jobTitle)"
                    />
                  </v-col>

                  <!-- Experience -->
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-select
                      v-model="selectedRequest.experience"
                      :items="experiences"
                      item-text="text"
                      item-value="id"
                      label="Tecrübe Aralığı"
                      return-object
                      @change="selectTarget('experienceId', selectedRequest.experience)"
                    />
                  </v-col>

                  <!-- Monthly Budget -->
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-text-field
                      color="purple"
                      disabled
                      label="Aylık Bütçe"
                      type="number"
                      :value="selectedRequest.monthlyBudget"
                    />
                  </v-col>

                  <!-- Starting Date -->
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-menu
                      ref="menu1"
                      v-model="selectedRequest.menu1"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="selectedRequest.startingDate"
                          label="Başlangıç Tarihi"
                          persistent-hint
                          prepend-icon="mdi-calendar"
                          v-bind="attrs"
                          v-on="on"
                        />
                      </template>
                      <v-date-picker
                        v-model="selectedRequest.startingDate"
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
                          v-model="selectedRequest.endingDate"
                          label="Bitiş Tarihi"
                          persistent-hint
                          prepend-icon="mdi-calendar"
                          v-bind="attrs"
                          v-on="on"
                        />
                      </template>
                      <v-date-picker
                        v-model="selectedRequest.endingDate"
                        no-title
                        @input="menu2 = false"
                      />
                    </v-menu>
                  </v-col>

                  <!-- Total Budget -->
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-text-field
                      color="purple"
                      disabled
                      label="Toplam Bütçe"
                      type="number"
                      :value="selectedRequest.totalBudget"
                    />
                  </v-col>

                  <!-- Project -->
                  <v-col
                    cols="6"
                    md="4"
                    class="text-right"
                  >
                    <v-select
                      v-model="selectedRequest.project"
                      :items="projects"
                      item-text="label"
                      item-value="code"
                      label="Hedef Proje"
                      return-object
                    />
                  </v-col>
                </v-row>
                <v-row align="center">
                  <v-divider class="mr-3" />Tedarikçi Bölümü<v-divider class="ml-3" />
                </v-row>
                <v-row class="mt-3">
                  <v-col
                    cols="12"
                    sm="6"
                    md="3"
                  >
                    <v-text-field
                      v-model="selectedConsultant"
                      label="Aday"
                      readonly
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-divider />

            <v-card-actions>
              <v-spacer />
              <v-btn
                color="primary"
                depressed
                @click="updateRequest"
              >
                Güncelle
              </v-btn>
              <v-btn
                color="error"
                depressed
                @click="dialog = false"
              >
                Vazgeç
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>

      <template v-slot:item.situation.label="{ item }">
        <v-chip
          :color="item.situation.id === 0 ? 'orange' : 'green'"
          dark
        >
          {{ item.situation.label }}
        </v-chip>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  export default {
    name: 'UnitManagers',
    data () {
      return {
        menu1: false,
        menu2: false,
        requestType: 'all',
        searchWord: '',
        dialog: false,
        selectedRequest: {},
        selectedConsultant: '',
        headers: [
          {
            text: 'Talep No.',
            align: 'start',
            value: 'id',
          },
          { text: 'Tedarikçi', value: 'supplier.title' },
          { text: 'Pozisyon', value: 'position.title' },
          { text: 'Aday', value: 'consultant.fullName' },
          { text: 'Talep Durumu', value: 'situation.label' },
        ],
        requests: [
          {
            id: 1,
            supplier: { id: 0, title: 'Tibula' },
            position: { id: 1, title: 'Sr. Software Developer' },
            consultant: { id: 0, fullName: 'Murathan Karayazi' },
            situation: { id: 0, label: 'Rezive Bekliyor' },
            project: { code: '001', label: 'Proje 1' },
            experience: { id: 0, text: '2-3 Yıl' },
            jobTitle: { id: 2, title: 'Senior Backend Developer', abbr: 'SRB' },
            costCenter: { id: 1, center: 'Masraf merkezi 2', abbr: 'MER1' },
            monthlyBudget: 16.606,
            totalBudget: '' + (Math.round((12 * 16.606) * 100) / 100),
            startingDate: '2021-11-10',
            endingDate: '2022-11-10',
          },
          {
            id: 2,
            supplier: { id: 0, title: 'Tibula' },
            position: { id: 1, title: 'Sr. Software Developer' },
            consultant: { id: 1, fullName: 'Furkan Reyhanlioglu' },
            situation: { id: 0, label: 'Rezive Bekliyor' },
            project: { code: '001', label: 'Proje 1' },
            experience: { id: 0, text: '2-3 Yıl' },
            jobTitle: { id: 2, title: 'Senior Backend Developer', abbr: 'SRB' },
            costCenter: { id: 1, center: 'Masraf merkezi 2', abbr: 'MER1' },
            monthlyBudget: 16.606,
            totalBudget: '' + (Math.round((12 * 16.606) * 100) / 100),
            startingDate: '2021-11-10',
            endingDate: '2022-11-10',
          },
          {
            id: 3,
            supplier: { id: 0, title: 'Tibula' },
            position: { id: 1, title: 'Sr. Software Developer' },
            consultant: { id: 0, fullName: 'Murathan Karayazi' },
            situation: { id: 1, label: 'Sözleşme Bekliyor' },
            project: { code: '001', label: 'Proje 1' },
            experience: { id: 0, text: '2-3 Yıl' },
            jobTitle: { id: 2, title: 'Senior Backend Developer', abbr: 'SRB' },
            costCenter: { id: 1, center: 'Masraf merkezi 2', abbr: 'MER1' },
            monthlyBudget: 16.606,
            totalBudget: '' + (Math.round((12 * 16.606) * 100) / 100),
            startingDate: '2021-11-10',
            endingDate: '2022-11-10',
          },
        ],
        suppliers: [
          { id: 0, company: 'Tibula', abbr: 'TBL' },
          { id: 1, company: 'Mirsis', abbr: 'MRS' },
          { id: 2, company: 'Netas', abbr: 'NE' },
        ],
        costCenters: [
          { id: 0, center: 'POS ve Üye işyerleri', abbr: 'POS' },
          { id: 1, center: 'Masraf merkezi 2', abbr: 'MER1' },
          { id: 2, center: 'Masraf merkezi 3', abbr: 'MER2' },
        ],
        jobTitles: [
          { id: 0, title: 'İş Analisti', abbr: 'BSA' },
          { id: 1, title: 'DevOps Uzmanı', abbr: 'DOPS' },
          { id: 2, title: 'Senior Backend Developer', abbr: 'SRB' },
          { id: 3, title: 'Junior Frontend Developer', abbr: 'JRF' },
        ],
        experiences: [
          { id: 0, text: '2-3 Yıl' },
          { id: 1, text: '3-5 Yıl' },
          { id: 2, text: '5-8 Yıl' },
          { id: 3, text: '8-12 Yıl' },
          { id: 4, text: '12+ Yıl' },
        ],
        projects: [
          { code: '001', label: 'Proje 1' },
          { code: '002', label: 'Proje 2' },
          { code: '003', label: 'Proje 3' },
          { code: '004', label: 'Proje 4' },
        ],
      }
    },
    methods: {
      editRequest (id) {
        console.log('id', id)
      },
      showRequest (request) {
        this.selectedRequest = request
        this.selectedConsultant = request.consultant.fullName
        this.dialog = true
      },
      selectTarget (target, obj) {
        // this.request[target] = obj.id
        console.log(target, obj)
      },
      updateRequest () {
        console.log('selected', this.selectedRequest)
      },
    },
  }
</script>

<style lang="scss" scoped></style>
