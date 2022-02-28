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
export const CreateURL = (endpoint = '') => trailingSlash(process.env.VUE_APP_ROOT_API) + 'api' + (endpoint.startsWith('/') ? endpoint : '/' + endpoint)

export const parsedToken = () => {
  const token = localStorage.getItem('tibuline@jwt')
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  }).join(''))

  return JSON.parse(jsonPayload)
}
