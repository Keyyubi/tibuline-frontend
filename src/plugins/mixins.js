import Vue from 'vue'
import { $api } from '@/services'

Vue.mixin({
  computed: {
    $api: () => $api,
  },
})
