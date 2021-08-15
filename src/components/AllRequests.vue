<template>
  <material-card
    icon="mdi-account-multiple"
    icon-small
    title="Talepler"
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
</template>

<script>
  export default {
    data () {
      return {
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
        console.log('id', id)
      },
      addRequest (id) {
        console.log('id', id)
      },
    },
  }
</script>

<style></style>
