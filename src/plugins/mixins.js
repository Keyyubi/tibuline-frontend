import Vue from 'vue'
import { $api } from '@/api'

Vue.mixin({
  computed: {
    $api: () => $api,
  },
})
