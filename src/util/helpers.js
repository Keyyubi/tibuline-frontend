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
export const CreateURL = (endpoint = '') => process.env.VUE_APP_ROOT_API + '/api' + (endpoint.startsWith('/') ? endpoint : '/' + endpoint)
