<template>
  <v-container
    id="add-activity-view"
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
        <v-icon>mdi-timeline-clock-outline</v-icon>
      </v-tab>
    </v-tabs>

    <div class="py3" />

    <v-tabs-items v-model="currentTab">
      <v-tab-item value="activities">
        <add-activity />
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        currentTab: 'activities',
      }
    },
  }
</script>

<style></style>
