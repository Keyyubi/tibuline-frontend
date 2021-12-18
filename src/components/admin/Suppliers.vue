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
      <template v-slot:item.username="{ item }">
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
              <b>{{ item.username }}</b>
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
                      label="Adı"
                      :value="item.firstName"
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
    name: 'Suppliers',
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
            text: 'Kullanıcı Adı',
            align: 'start',
            value: 'username',
          },
          { text: 'Adı', value: 'firstName' },
          { text: 'Soyadı', value: 'lastName' },
          { text: 'Email', value: 'email' },
        ],
        requests: [
          {
            username: 'User Name',
            firstName: 'Murathan',
            lastName: 'Karayazi',
            email: 'email@test.com',
          },
          {
            username: 'User Name',
            firstName: 'Furkan',
            lastName: 'Reyhanlioglu',
            email: 'email@test.com',
          },
          {
            username: 'User Name',
            firstName: 'Murathan',
            lastName: 'Karayazi',
            email: 'email@test.com',
          },
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
