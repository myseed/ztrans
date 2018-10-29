import {httpGet} from './sys/http'
import { paramsify, signify, timestamp, sid } from './utils'

export function getActiveStatus (params) {
  const url = `/getActiveStatus`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function getCheckStatus (params) {
  const url = `/getCheckStatus`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function getCustomerCaclulateType (params) {
  const url = `/getCustomerCaclulateType`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function getCustomerJob (params) {
  const url = `/getCustomerJob`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function getCustomerLevel (params) {
  const url = `/getCustomerLevel`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function getCustomerOrderLevel (params) {
  const url = `/getCustomerOrderLevel`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function getCustomerSex (params) {
  const url = `/getCustomerSex`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function getCustomerSource (params) {
  const url = `/getCustomerSource`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function getCustomerType (params) {
  const url = `/getCustomerType`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function getOperateStatus (params) {
  const url = `/getOperateStatus`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function getAllCity (params) {
  const url = `/getAllCity`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function getAllCityArea (params) {
  const url = `/getAllCityArea`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function getAllPrv (params) {
  const url = `/getAllPrv`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function getAllTown (params) {
  const url = `/getAllTown`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function getServiceType (params) {
  const url = `/getServiceType`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function getCarSizeList (params) {
  const url = `/getCarSizeList`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function getOrderType (params) {
  const url = `getOrderType`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}
