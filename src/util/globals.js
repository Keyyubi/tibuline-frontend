const EN_LOCALE_ONLY = process.env.EN_LOCALE_ONLY === 'true'
const IN_BROWSER = typeof window !== 'undefined'
const IS_DEBUG = process.env.DEBUG === 'true'
const IS_PROD = process.env.NODE_ENV === 'production'
const BASE_URL = 'http://37.9.203.118:4647/api'
const SITUATIONS = {
  APPROVED: 0,
  DENIED: 1,
  WAITING_REVISE: 2,
  WAITING_CONTRACT: 3,
  ON_LAW_DPT: 4,
  ON_BUYING_DPT: 5,
  ACTIVE: 6,
  PASSIVE: 7,
  NOT_STARTED: 8,
  ON_GOING: 9,
  CANCELED: 10,
  FINISHED: 11,
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
      const arr = Array.from(v)
      let res = 0
      for (let i = 0; i < arr.length - 1; i++) {
        res += Number(arr[i])
      }
      return (res % 10) === Number(arr[arr.length - 1])
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
  SITUATIONS,
  ROLE_IDS,
  RULES,
  CreateURL,
  GetPostHeaders,
}
