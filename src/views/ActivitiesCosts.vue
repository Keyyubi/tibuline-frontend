<template>
  <v-container
    id="consultants-view"
    fluid
    tag="section"
  >
    <v-tabs
      v-model="currentTab"
      background-color="primary"
      centered
      dark
      icons-and-text
    >
      <v-tabs-slider />

      <v-tab href="#activities">
        Aktiviteler
        <v-icon>mdi-account-group</v-icon>
      </v-tab>

      <v-tab href="#costs">
        Masraflar
        <v-icon>mdi-account-group</v-icon>
      </v-tab>
    </v-tabs>

    <div class="py3" />

    <v-tabs-items v-model="currentTab">
      <v-tab-item value="activities">
        <activities />
      </v-tab-item>

      <v-tab-item value="costs">
        <all-consultants />
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
  export default {
    name: 'ActivitiesCosts',
    data () {
      return {
        currentTab: 'activities',
      }
    },
  }
</script>
