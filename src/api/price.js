/**
 * 报价接口
 */

import { httpGet , httpPost } from './sys/http'
import { paramsify, signify, timestamp, sid, signifymultipartFile} from './utils'
import axios from 'axios'
export function getAllRouterPriceByRouterId (params) {
  const url = `/getAllRouterPriceByRouterId`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function getAllRouterCustomerPrice (params) {
  const url = `/getAllRouterCustomerPrice`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function deleteRouterByRouterId (params) {
  const url = `/deleteRouterByRouterId`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function addRouterPrice (params) {
  const url = `/addRouterPrice`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function deleteRouterPrice (params) {
  const url = `/deleteRouterPrice`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function updateBatchRouterPrice (params) {
  const url = `/updateBatchRouterPrice`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function getMasterCustomerList (params) {
  const url = `/getMasterCustomerList`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function deleteRouterCustomerPrice (params) {
  const url = `/deleteRouterCustomerPrice`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function addRouterCustomerPrice (params) {
  const url = `/addRouterCustomerPrice`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function updateRouterCustomerPrice (params) {
  const url = `/updateRouterCustomerPrice`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function getConsumerRouterPriceByRouterId (params) {
  const url = `/getConsumerRouterPriceByRouterId`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function getRouterPriceByRouterId (params) {
  const url = `/getRouterPriceByRouterId`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function addRouterCustomerPriceNew (params) {
  const url = `/addRouterCustomerPriceNew`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function updateRouterCustomerPriceNew (params) {
  const url = `/updateRouterCustomerPriceNew`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function addRouterPriceNew (params) {
  const url = `/addRouterPriceNew`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function updateRouterPriceNew (params) {
  const url = `/updateRouterPriceNew`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function uploadRouterPriceExcel (params, file) {
  const url = `/uploadRouterPriceExcel`
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

export function downloadRouterPriceExcel (params) {
  const url = `/downloadRouterPriceExcel`
  const ts = timestamp()
  return '' + process.env.VUE_APP_API + url + '?params=' + paramsify(params) + '&sid=' + sid() + '&sign=' + signify(params, ts) + '&timestamp=' + ts
}