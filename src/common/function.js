import moment from 'moment'
import axios from 'axios'
import Alert from 'react-s-alert'
import { isNull, isUndefined } from 'util'
import numeral from 'numbro'

export const convertDateMoment = (date, type) => {
  const dateFormat = new Date(date)
  let strTime = moment(dateFormat).format(type)
  return strTime
}

export const generateId = () => {
  let text = ''
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < 16; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

export const formatNumberBro = (number, mantissa = 4, isReturnNaN) => {
  if (number !== 'null' && !isNull(number) && !isNaN(number) && !isUndefined(number) && number !== 'NaN') {
    if (number.toString().length > 0) {
      return numeral(number.toString().replace(/\,/g, '')).format({ trimMantissa: true, thousandSeparated: true, mantissa })
    }
  }
  return isReturnNaN ? 'NaN' : 0
}

export const replaceComma = (str) => {
  let newString = typeof (str) !== 'string' ? str.toString() : str
  return newString.replace(/,/g, '')
}
export const upperCaseFirstLetter = (lower) => {
  var upper = lower.replace(/^\w/, function (chr) {
    return chr.toUpperCase()
  })
  return upper
}

export const roundingNumber = (number, rounding = 7) => {
  const powNumber = Math.pow(10, parseInt(rounding))
  return Math.floor(number * powNumber) / powNumber
}

export const getLength = (value) => {
  return value ? value.length : 0
}

export const setItemStorage = (key, value) => {
  localStorage.setItem(key, value)
}

export const getItemStorage = (key) => {
  return localStorage.getItem(key)
}

export const removeItemStorage = (key) => {
  localStorage.removeItem(key)
}

export const showAlert = (message = 'Có lỗi xảy ra xin vui lòng thử lại', isErr = false) => {
  Alert[isErr ? 'error' : 'success'](message, {
    position: 'bottom-right',
    effect: 'scale',
    beep: true,
    offset: 100
  })
}

export const genObjectLang = (en, vi, ja, cn) => {
  return { en, vi, ja, cn }
}

export const putSignedS3 = (signedRequest, file, isNotPng) => {
  return new Promise(async (resolve, reject) => {
    const options = {
      headers: {
        'Content-Type': isNotPng ? file.type : 'png'
      }
    }
    if (isNotPng) {
      options.headers['Content-Disposition'] = 'inline'
    }

    axios.put(signedRequest, file, options)
      .then(result => {
        resolve(true)
      })
      .catch(() => {
        resolve(false)
      })
  })
}
