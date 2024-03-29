const IN_BROWSER = typeof window !== 'undefined'
const DEMAND_STATUSES = {
  CREATED: 0,
  REPLIED: 1,
  COMPLITED: 2,
}
const DEMAND_STATUS_LABELS = [
  //! IT's important the arrays order. Will work with keys as indexes
  'Oluşturuldu',
  'Aday yüklendi, onay bekliyor',
  'Tamamlandı',
]
const ACTIVITY_STATUSES = Object.freeze({
  CREATED: 0,
  PENDING: 1,
  REVISED: 2,
  APPROVED: 3,
  INVOICED: 4,
})
const CONTRACT_STATUSES = Object.freeze({
  CREATED: 0,
  IN_USE: 1,
  IN_USE_WITH_FILE: 2,
  TERMINATED: 3,
})
const ROLES = Object.freeze({
  ADMIN: 0,
  UNIT_MANAGER: 1,
  SUPPLIER: 2,
})
const RULES = Object.freeze({
  EMAIL: [
    v => !!v || 'E-mail alanı boş geçilemez.',
    v => /.+@.+/.test(v) || 'E-mail adresi geçerli değil.',
  ],
  PASSWORD: [
    v => !!v || 'Şifre boş geçilemez',
    v =>
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*\\+\\.])(?=.{8,})/.test(v) ||
      'Şifre en az 8 karakter olup, büyük harf, küçük harf, rakam ve özel karakter içermelidir!',
  ],
  PHONE: [
    v => !!v || 'Telefon numarası girmelisiniz',
    v => (v && v.length === 14) || 'Lütfen başında 0 olmadan 10 haneli olarak giriniz.',
    v => /^(\(5.)/.test(v) || 'Telefon numarası 5 ile başlamalıdır.',
  ],
  TCNO: [
    v => !!v || 'T.C. Kimlik Numarası giriniz.',
    v => (v && v.length === 11) || 'Kimlik numarası 11 haneli olmalıdır.',
    v => (() => {
      if (v) {
        const arr = Array.from(v)
        let res = 0
        for (let i = 0; i < arr.length - 1; i++) {
          res += Number(arr[i])
        }
        return (res % 10) === Number(arr[arr.length - 1])
      } else return true
    })() || 'Kimlik numarası geçersiz.',
  ],
  VKN: [
    v => (!!v && v.length === 10) || 'VKN 10 karakter olmalıdır.',
  ],
})
const INVOICE_TYPES = Object.freeze({
  HOURLY: 0, // Adam/Saat
  DAILY: 1, // Adam/Gun
  MONTHLY: 2, // Adam/Ay
})

module.exports = {
  IN_BROWSER,
  DEMAND_STATUSES,
  DEMAND_STATUS_LABELS,
  ROLES,
  RULES,
  ACTIVITY_STATUSES,
  INVOICE_TYPES,
  CONTRACT_STATUSES,
}
