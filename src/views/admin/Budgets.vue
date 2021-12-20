<template>
  <v-container
    id="job-titles-view"
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

      <v-tab href="#budgetPlans">
        Bütçeler
        <v-icon>mdi-currency-usd</v-icon>
      </v-tab>
    </v-tabs>

    <div class="py3" />

    <v-tabs-items v-model="currentTab">
      <v-tab-item value="budgetPlans">
        <v-card>
          <v-card-title>
            <h1 class="v-heading text-h2">
              Page is in progress
            </h1>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-progress-linear
              buffer-value="55"
              color="primary"
              reverse
              stream
              value="30"
            />
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
  export default {
    name: 'Budgets',
    data () {
      return {
        currentTab: 'budgetPlans',
      }
    },
  }
</script>

<style lang="scss" scoped></style>
