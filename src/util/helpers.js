import { BASE_URL } from './globals'
export function leadingSlash (str) {
  return str.startsWith('/') ? str : '/' + str
}

export function trailingSlash (str) {
  return str.endsWith('/') ? str : str + '/'
}

export const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout))
}

export const CheckIsNull = (arr) => {
  let isNull = false
  arr.forEach(e => { if (!e && typeof e !== 'number') isNull = true })

  return isNull
}
export const CreateURL = (endpoint = '') => BASE_URL + (endpoint.startsWith('/') ? endpoint : '/' + endpoint)
export const GetPostHeaders = (token) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-type': 'application/json',
    },
  }
}
