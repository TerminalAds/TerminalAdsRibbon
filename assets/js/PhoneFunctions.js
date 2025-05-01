import readXlsxFile from 'read-excel-file'
import {getToken} from "./jwt.service";

const api = axios.create({
  baseURL: 'https://sms-api.terminalads.com/api',
  timeout: 15000,
  headers: {
    common: {
      Authorization: getToken() ? `Bearer ${getToken()}` : null,
      Accept: 'application/json',
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
      'Content-Type': 'application/json',
    }
  },
});

// import {default as  axiose } from "axios";


function isValidPhone(phone) {
  return /^(09|989)([0-9]|[۰-۹]){9}$/.test(phone)
}

async function readPhoneNumbersFromXlsxFile(file) {
  let numbers = []
  let rows = await readXlsxFile(file)

  for (let row of rows) {
    for (let cell of row) {
      numbers.push(cell?.toString() || '')
    }
  }

  return numbers;
}

function readPhoneNumbersFromCsvFile(file, callback) {
  let ret = []

  let filereader = new FileReader()

  filereader.onload = function () {
    let numbers = filereader.result.split(',')
    for (let number of numbers) {
      ret.push(number.toString())
    }
    callback(ret)
  }

  filereader.readAsText(file)
}

function readPhoneNumbersFromTextFile(file, callback) {
  let ret = []

  let filereader = new FileReader()

  filereader.onload = function () {
    let numbers = filereader.result.split('\n')
    for (let number of numbers) {
      ret.push(number.toString())
    }
    callback(ret)
  }

  filereader.readAsText(file)
}

function convertArrayToCsv(arr) {
  if (arr.length === 0)
    return ""

  let ret = arr[0]

  for (let i = 1; i < arr.length; i++) {
    ret += `,${arr[i]}`;
  }

  return ret;
}


function formatToIranianPhone(phone) {
  phone = phone.trim()
  if (phone.startsWith("+98")) {
    phone = phone.substring(1)
  } else if (phone.startsWith('09')) {
    phone = '98' + phone.substring(1)
  } else if (phone.length === 10) {
    phone = "98" + phone;
  }

  return phone
}

async function validateNumbers(numbers) {
  let valid = []
  let invalid = []

  for (let number of numbers) {
    if (isValidPhone(number)) {
      valid.push(number)
    } else {
      invalid.push(number)
    }
  }

  return {valid, invalid}
}


async function filterCorrectPhoneNumbers(numbers) {
  let arr = numbers?.filter(item => {
    return isValidPhone(formatToIranianPhone(item))
  }).map(item => formatToIranianPhone(item))

  return [...new Set(arr)]
}

async function sendSms(from,
                       to,
                       message,
                       title,
                       date,
                       operator,
                       shouldBlack,
                       shouldWhite,
                       campaign_id,
                       link,
                       shortcamp_id,
                       gap_type,
                       gap_time,
                       with_gradual = false,
                       gradual_item = undefined,
                       phoneTags = undefined) {
  // console.log("this is: "+black_list)
  try {
    let response = await api.post("/admin/message/create", {
      MsgBody: message,
      To: convertArrayToCsv(to),
      Operator: from,
      title: title,
      timeouted_at: date,
      black_list: shouldBlack,
      receiver_operator: operator,
      shouldWhite: shouldWhite,
      campaign_id,
      shortcamp_id,
      link,
      gap_type,
      gap_time,
      with_gradual,
      ...gradual_item,
      phoneTags
    })

    return {
      status: true,
      responseCode: 200,
      payload: response.data
    }
  } catch (e) {
    return {
      status: false,
      responseCode: e.response.status,
      payload: e.response.data
    }
  }
}


async function sendSmsWallet(from, to, message, title, date, operator, shouldBlack, shouldWhite) {
  try {
    let response = await api.post("admin/message/createWallet", {
      MsgBody: message,
      To: convertArrayToCsv(to),
      Operator: from,
      title: title,
      timeouted_at: date,
      black_list: shouldBlack,
      receiver_operator: operator,
      shouldWhite: shouldWhite,
      productId: '64b670bab9d47c5e2a3b4d7f',
    })

    return {
      status: true,
      responseCode: 200,
      payload: response.data
    }
  } catch (e) {
    return {
      status: false,
      responseCode: e.response.status,
      payload: e.response.data
    }
  }

}


async function calculatePrice(from, to, towhite, message) {
  let response = await api.post("admin/message/calculate/price", {
    MsgBody: message,
    black: convertArrayToCsv(to),
    white: convertArrayToCsv(towhite),
    Operator: from,
  })

  return response.data;
}

async function calculateMultiPrice(from, to, towhite, messages) {
  let response = await api.post("admin/message/group/calculate/price", {
    Operator: from,
    messages: messages,
    black: convertArrayToCsv(to),
    white: convertArrayToCsv(towhite),
  })

  return response.data;
}

function isLinkInText(text) {
  return /(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]/.test(text);
}

function getPhoneTags() {
  return new Promise((resolve, reject) => {
    axios.requestApiGet('phoneTag')
        .then(data => resolve(data))
        .catch(err => reject(err))
  })
}

export {
  isValidPhone,
  readPhoneNumbersFromXlsxFile,
  readPhoneNumbersFromCsvFile,
  validateNumbers,
  formatToIranianPhone,
  filterCorrectPhoneNumbers,
  sendSms,
  sendSmsWallet,
  readPhoneNumbersFromTextFile,
  calculatePrice,
  calculateMultiPrice,
  isLinkInText,
  getPhoneTags
}