const EN_LOCALE_ONLY = process.env.EN_LOCALE_ONLY === 'true'
const IN_BROWSER = typeof window !== 'undefined'
const IS_DEBUG = process.env.DEBUG === 'true'
const IS_PROD = process.env.NODE_ENV === 'production'
const BASE_URL = 'http://37.9.203.118:4647/api'
const DEMAND_STATUSES = [
  /* //**
    * DEMAND FLOW with Statuses ==> CREATED 1 to PENDING  =>
  */
  // By Manager
  { key: 'CREATED', status: 0, label: 'Oluşturuldu' },
  { key: 'REPLIED', status: 1, label: 'Aday yüklendi' },
  { key: 'PENDING', status: 2, label: 'Sözleşme yüklendi' },
  { key: 'APPROVED', status: 3, label: 'Sözleşme imzalandı' },
  { key: 'COMPLITED', status: 4, label: 'Tamamlandı' },

  // REVISED: { status: 1, label: 'Revize edildi' }, // If supplier asks for revise
  // CONTRACT_PENDING: { status: 0, label: 'Sözleşme bekliyor' },
  // CONTRACT_UPLOADED: { status: 0, label: 'Sözleşme yüklendi' }, // Consultant approved here

  // // By Supplier
  // CONSULTANT_UPLOADED: { status: 1, label: 'Aday yüklendi' }, // Pending for consultant confirmation
  // PENDING_REVISE: { status: 2, label: 'Revize Belkiyor' },

  // // By Manager
  // APPROVED_BY_MANAGER: { status: 5, label: 'Aday Onaylandı' },
  // WAITING_DEPARTMANT: 4, // On Manager
  // APPROVED_BY_SUPPLIER: 6, // By Manager
  // COMPLITED: 7,
]
const ACTIVITY_STATUSES = {
  EDITABLE: 0,
  PENDING: 1,
  REVISED: 2,
  APPROVED: 3,
}
const ROLE_IDS = {
  ADMIN: 0,
  UNIT_MANAGER: 1,
  SUPPLIER: 2,
}
const RULES = {
  EMAIL: [
    v => !!v || 'E-mail is required',
    v => /.+@.+/.test(v) || 'E-mail must be valid',
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
}
const CreateURL = (endpoint = '') => BASE_URL + (endpoint.startsWith('/') ? endpoint : '/' + endpoint)
const GetPostHeaders = (token) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-type': 'application/json',
    },
  }
}

module.exports = {
  EN_LOCALE_ONLY,
  IN_BROWSER,
  IS_DEBUG,
  IS_PROD,
  DEMAND_STATUSES,
  ROLE_IDS,
  RULES,
  ACTIVITY_STATUSES,
  CreateURL,
  GetPostHeaders,
}
