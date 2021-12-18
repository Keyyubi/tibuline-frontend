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
const CreateURL = (endpoint = '') => BASE_URL + (endpoint.startsWith('/') ? endpoint : '/' + endpoint)

module.exports = {
  EN_LOCALE_ONLY,
  IN_BROWSER,
  IS_DEBUG,
  IS_PROD,
  SITUATIONS,
  ROLE_IDS,
  CreateURL,
}
