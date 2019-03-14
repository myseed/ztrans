/**
 * 客户管理接口
 */
import {httpGet} from './sys/http'
import { paramsify, signify, timestamp, sid } from './utils'
import axios from 'axios'

export function getAllMasterCustomer (params) {
  const url = `/getAllMasterCustomer`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function getMasterCustomerDetail (params) {
  const url = `/getMasterCustomerDetail`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function deleteMasterCustomer (params) {
  const url = `/deleteMasterCustomer`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function addMasterCustomer (params) {
  const url = `/addMasterCustomer`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function getAllSaleList (params) {
  const url = `/getAllSaleList`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function deleteCustomerContact (params) {
  const url = `/deleteCustomerContact`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function updateCustomerContact (params) {
  const url = `/updateCustomerContact`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function addCustomerContact (params) {
  const url = `/addCustomerContact`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function updateMasterCustomer (params) {
  const url = `/updateMasterCustomer`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function deleteOldCustomerContact (params) {
  const url = `/deleteOldCustomerContact`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function getCustomerContact (params) {
  const url = `/getCustomerContact`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function uploadCustomerExcel (params, file) {
  const url = `/uploadCustomerExcel`
  const ts = timestamp()
  const data = new FormData()
  data.append('sid', sid())
  data.append('timestamp', ts)
  data.append('params', paramsify(params))
  data.append('multipartFile', file)
  data.append('sign', signify(params, ts))
  const config = {
    headers: { 'Content-Type': 'multipart/form-data' }
  }
  return axios.post(process.env.VUE_APP_API + url, data, config)
}

export function downloadCustomerExcel (params) {
  const url = `/downloadCustomerExcel`
  const ts = timestamp()
  return '' + process.env.VUE_APP_API + url + '?params=' + paramsify(params) + '&sid=' + sid() + '&sign=' + signify(params, ts) + '&timestamp=' + ts
}
