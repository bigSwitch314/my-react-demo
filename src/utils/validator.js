/**
 * @flow
 */

/* eslint-disable max-len */

// IP
export const REGEXP_IP = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/

// IPv4
export const REGEXP_IPV4 = /^(((\d{1,2})|(1\d{2})|(2[0-4]\d)|(25[0-5]))\.){3}((\d{1,2})|(1\d{2})|(2[0-4]\d)|(25[0-5]))$/

// port
// export const REGEXP_PORT = /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/
export const REGEXP_PORT = /(^[1-9]\d{0,3}$)|(^[1-5]\d{4}$)|(^6[0-4]\d{3}$)|(^65[0-4]\d{2}$)|(^655[0-2]\d$)|(^6553[0-5]$)/

// URL
export const REGEXP_URL = new RegExp('^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$', 'i')

// 邮箱
export const REGEXP_MAIL = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

// 手机号
export const REGEXP_PHONE = /^1(3|4|5|7|8)\d{9}$/

// 座机
export const REGEXP_LANDLINE = new RegExp('^((\\d{3,4}-)|\\d{3.4}-)?\\d{7,8}$')

// 中英文，正整数和下划线
export const REGEXP_CNENNUM = /^[a-zA-Z0-9\u4e00-\u9fa5_]+$/

// 中英文，正整数和下划线和点
export const REGEXP_CNENNUMD = /^[a-zA-Z0-9\u4e00-\u9fa5_.]{1,50}$/

// 移动电话
// export const REGEXP_YD_PHONE = /^(0|86|17951|086|\+86)?(13[0-9]|14[579]|15[012356789]|166|17[0135678]|18[0-9]|14[57]|19[89])[0-9]{8}$/

// 移动电话 不带前缀
export const REGEXP_YD_PHONE = /(^0[1-9][0-9]{1,2}-)([0-9]{7,8}$)|(^(13[0-9]|14[579]|15[012356789]|166|17[0135678]|18[0-9]|14[57]|19[89])[0-9]{8}$)/

// 固定电话
export const REGEXP_GD_PHONE = /^(0[0-9]{2,3}-)([2-9][0-9]{6,7})+(-[0-9]{1,4})?$/

// 十六进制数
export const REGEXP_HEX = /^[a-fA-F0-9]+$/

// 整数
export const REGEXP_INT = /^-?[1-9]\d*$/

// 正整数
export const REGEXP_POSINT = /^[1-9]\d*$/

// 浮点数
export const REGEXP_FLOAT = /^-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/

// 正浮点数
export const REGEXP_POSFLOAT = /^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/

// 身份证号
export const REGEXP_IDCARD = /^(\d{18,18}|\d{15,15}|\d{17,17}x)$/

// 转换汉字为两个字符
// export function getStringByteLength(str: string) {
//   return str ? str.replace(/[^\x00-\xff]/g, 'ci').length : 0
// }

export const noSpecialChar = {
  pattern: /^[a-zA-Z0-9\u4e00-\u9fa5_.]+$/, 
  message: '中英文，数字，点和下划线',
}

export const passwordValidate = [
  { pattern: /(?=.*[A-Za-z])/, message: '包含字母'},
  { pattern: /(?=.*[0-9])/, message: '包含数字'},
  // { pattern: /(?=.*[#@$^%&*|:<>?\\])/, message: '包含特殊字符'},
]
