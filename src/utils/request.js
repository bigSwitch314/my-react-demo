import 'whatwg-fetch'
import { message } from 'antd'
import { removeLogin } from '../components/Authentication/util'

// const baseUrl = 'http://bigswitch314.cn:80'
const baseUrl = 'http://127.0.0.1:8000'


function fetchApi(url, options, timeout = 30000) {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('TIME OUT')), timeout)
    fetch(url, options).then(resolve, reject)
  })
}

function checkStatus(res) {
  const { status, ok, statusText } = res
  if (status === 444) { // 用户登出
    window.currentUrl = window.location.href
    // removeLogin()
    window.location.reload()
  }
  if (status === 500) {
    const wrong = new Error(statusText)
    wrong.name = 'request error'
    message.error(statusText)
    throw wrong
  }
  // console.log(res.json())
  if (ok) { return res.json() }
  throw new Error(`${status} ${res.statusText}`)
}

function getParams(data) {
  if (!data) return ''
  let params = []
  Object.keys(data).forEach((item, index) => {
    if (Object.prototype.toString.call(data[item]) === '[object Array]') {
      params = data[item].map(node => `${item}[${index}]=${encodeURIComponent(node)}`)
    }
    params.push(`${item}=${encodeURIComponent(data[item])}`)
  })
  return params.length > 0 ? `?${params.join('&')}` : ''
}


function generaterParams(url, options) {
  const { params, method } = options
  delete options.params
  if (method !== 'GET') {
    options.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-cache, no-store',
      'Pragma': 'no-cache',
      ...options.headers,
    }
    options.body = JSON.stringify(params)
  } else {
    options.headers = {
      Accept: 'application/json',
      'Cache-Control': 'no-cache, no-store',
      'Pragma': 'no-cache',
      ...options.headers,
    }
    url = `${url}${getParams(params)}`
  }
  // 携带cookie
  options.credentials = 'include'
  // 携带token
  const token = sessionStorage.getItem('token')
  options.headers = { ...options.headers, Token: token || '' }

  return { url, options }
}

const methods = ['POST', 'PUT', 'DELETE', 'GET']

function handleCode(code, desc) {
  let msg = ''
  if (code === 44444) { // token过期
    message.error('登录超时，请重新登录！', 1, () => {
      removeLogin()
      window.currentUrl = window.location.href
      window.location.reload()
    })
    return
  }
  if (code === 40000) { // token错误
    message.error('token错误！', 1, () => {
      removeLogin()
      window.currentUrl = window.location.href
      window.location.reload()
    })
    return
  }
  if (code !==0) {
    msg = desc || '网络错误'
    const error = new Error(msg)
    error.name = 'request error'
    message.error(desc)
    throw error
  }
  // switch (code) {
  //   case -1: {
  //     msg = desc || '返回失败'
  //     const error = new Error(msg)
  //     error.name = 'request error'
  //     message.error(desc)
  //     throw error
  //   }
  //   case -2: {
  //     msg = desc || '缺少必传参数'
  //     const error = new Error(msg)
  //     error.name = 'request error'
  //     message.error(desc)
  //     throw error
  //   }
  //   case -3: {
  //     msg = desc || '服务器内部错误'
  //     const error = new Error(msg)
  //     error.name = 'request error'
  //     message.error(desc)
  //     throw error
  //   }
  //   default: {
  //     break
  //   }
  // }
}

function request(url, options, shouldValidate = true) {
  const { url: newUrl, options: newOptions } = generaterParams(url, options)
  return fetchApi(newUrl, newOptions)
    .then(checkStatus)
    .then(result => {
      if (!shouldValidate) return result
      const { errcode: code, errmsg: desc, data } = result
      handleCode(code, desc)
      return data
    })
    .catch(e => e)
}

methods.forEach(method => {
  const lowerType = method.toLowerCase()
  request[lowerType] = (url, type, params) => () => ({
    promise: request(baseUrl + url, { params, method }),
    type,
  })
})

export const requestUrl = (url, type, params) => () => ({
  promise: request(url, { params, method: 'GET' }, false),
  type,
})

export default request
