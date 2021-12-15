const EN_LOCALE_ONLY = process.env.EN_LOCALE_ONLY === 'true'
const IN_BROWSER = typeof window !== 'undefined'
const IS_DEBUG = process.env.DEBUG === 'true'
const IS_PROD = process.env.NODE_ENV === 'production'
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
  ALL: 0,
  UNIT_MANAGER: 1,
  SUPPLIER: 2,
}
const postData = async (url = '', data = {}) => {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  })
  return response.json() // parses JSON response into native JavaScript objects
}
const getData = async (url = '', token = null) => {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })
  console.log('resp', response)
  return response.json() // parses JSON response into native JavaScript objects
}

module.exports = {
  EN_LOCALE_ONLY,
  IN_BROWSER,
  IS_DEBUG,
  IS_PROD,
  SITUATIONS,
  ROLE_IDS,
  postData,
  getData,
}
