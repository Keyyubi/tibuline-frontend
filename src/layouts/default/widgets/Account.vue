<template>
  <v-menu
    bottom
    left
    min-width="200"
    offset-y
    origin="top right"
    transition="scale-transition"
  >
    <template v-slot:activator="{ attrs, on }">
      <v-btn
        class="ml-2"
        min-width="0"
        text
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </template>

    <v-list
      :tile="false"
      flat
      nav
    >
      <app-bar-item
        v-if="user.roleId === 0"
        to="/account"
      >
        <v-list-item-title>
          <i>{{ user.firstname + ' ' + user.lastname }}</i>
        </v-list-item-title>
      </app-bar-item>

      <template v-for="(p, i) in profile">
        <v-divider
          v-if="p.divider"
          :key="`divider-${i}`"
          class="mb-2 mt-2"
        />

        <app-bar-item
          v-else
          :key="`item-${i}`"
          to="/"
        >
          <v-list-item-title v-text="p.title" />
        </app-bar-item>
      </template>
      <v-divider class="mb-2 mt-2" />
      <v-btn
        depressed
        block
        @click="logout"
      >
        Log out
      </v-btn>
    </v-list>
  </v-menu>
</template>

<script>
  import { get } from 'vuex-pathify'
  export default {
    name: 'DefaultAccount',

    data: () => ({
      profile: [
        { divider: true },
        { title: 'Hesap Bilgileri' },
        { title: 'Ayarlar' },
      ],
    }),
    computed: {
      ...get('user', ['user']),
    },
    methods: {
      logout () {
        this.$store.dispatch('user/logout')
      },
    },
  }
</script>
