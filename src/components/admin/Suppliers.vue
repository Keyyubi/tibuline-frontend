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
      :items="users"
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
              @click="showUser(item)"
            >
              <b>{{ item.username }}</b>
              <v-icon right>
                mdi-arrow-right-bold
              </v-icon>
            </v-chip>
          </template>

          <v-card>
            <v-card-title class="text-h5 primary white--text">
              Kullanıcı Güncelle
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
                      label="Kullanıcı Adı"
                      :value="item.userName"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-text-field
                      label="E-mail"
                      :value="item.email"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-text-field
                      label="Adı"
                      :value="item.firstName"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-text-field
                      label="Soyadı"
                      :value="item.lastName"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-text-field
                      disabled
                      label="TCKN"
                      :value="item.tckn"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-text-field
                      label="Telefon"
                      :value="item.phoneNumber"
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
                @click="updateUser"
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
        searchWord: '',
        dialog: false,
        selectedUser: {},
        headers: [
          {
            text: 'Kullanıcı Adı',
            align: 'start',
            value: 'username',
          },
          { text: 'Adı', value: 'firstName' },
          { text: 'Soyadı', value: 'lastName' },
          { text: 'Email', value: 'email' },
          { text: 'TCKN', value: 'tckn' },
          { text: 'Telefon', value: 'phoneNumber' },
        ],
      }
    },
    methods: {
      editUser (id) {
        console.log('id', id)
      },
      showUser (user) {
        this.selectedUser = user
        this.selectedConsultant = user.consultant.fullName
        this.dialog = true
      },
      selectTarget (target, obj) {
        // this.user[target] = obj.id
        console.log(target, obj)
      },
      updateUser () {
        console.log('selected', this.selectedUser)
      },
    },
  }
</script>
