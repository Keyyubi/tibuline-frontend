<template>
  <!-- Confirmation dialog -->
  <v-dialog
    v-model="dialog"
    persistent
    width="460"
  >
    <v-card>
      <v-card-title class="text-h5 primary white--text">
        Onay
      </v-card-title>
      <v-card-text class="text-h5 py-3">
        <v-icon large>
          mdi-alert
        </v-icon>
        {{ message }}
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          class="white--text mr-3"
          color="green"
          depressed
          small
          @click="approve"
        >
          Onayla
        </v-btn>
        <v-btn
          color="error"
          dark
          depressed
          small
          @click="deny"
        >
          Vazgeç
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'ConfirmationPopup',
    props: {
      dialog: Boolean,
      result: Boolean,
      message: String,
    },
    methods: {
      approve () {
        console.log('ok')
        this.$emit('result', true)
      },
      deny () {
        return false
      },
    },
  }
</script>

<style>

</style>
