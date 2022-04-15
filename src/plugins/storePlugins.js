import { $api } from '@/api'

export default function (store) {
  try {
    store.$api = $api
  } catch (e) {
    console.error('store error', e)
  }
}
