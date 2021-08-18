<template>
  <v-container
    id="requests-view"
    fluid
    tag="section"
  >
    <material-card
      icon="mdi-account-multiple"
      icon-small
      title="Talepler"
      color="primary"
    >
      <v-row
        class="justify-xs"
        justify-xl="space-between"
        justify-lg="space-between"
        justify-md="space-around"
        justify-sm="center"
      >
        <v-col
          cols="4"
          align-self="center"
        >
          <v-btn-toggle
            v-model="requestType"
            tile
            color="primary"
            group
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
        </v-col>

        <v-col cols="2">
          <new-request />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <all-requests />
        </v-col>
      </v-row>
    </material-card>
  </v-container>
</template>

<script>
  import NewRequest from '../components/NewRequest.vue'
  import AllRequests from '../components/AllRequests.vue'

  export default {
    name: 'UserProfileView',
    components: {
      NewRequest,
      AllRequests,
    },
    data () {
      return {
        requestType: 'all',
      }
    },
  }
</script>

<style lang="scss" scoped>
.btn-group-row {
  display: flex;
  justify-content: center !important;
  align-items: center;
}
</style>
