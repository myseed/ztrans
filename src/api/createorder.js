/**
 * 客户管理接口
 */

import {httpGet} from './sys/http'
import { paramsify, signify, timestamp, sid } from './utils'



export function getMasterCustomerListBySearchKey (params) {
  const url = `/getMasterCustomerListBySearchKey`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }
  return httpGet(url, data)
}

export function getAllRouterAlia (params) {
  const url = `/getRouterAliaByCustomerMasterId`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }
  return httpGet(url, data)
}

export function getCustomerRouterDetail (params) {
  const url = `/getCustomerRouterDetail`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }
  return httpGet(url, data)
}

export function getPriceAndCarByCustomerIdAndRouterSeries (params) {
  const url = `/getPriceAndCarByCustomerIdAndRouterSeries`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }
  return httpGet(url, data)
}

export function createOrderByWeb (params) {
  const url = `/createOrderByEmployee`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }
  return httpGet(url, data)
}

export function getDriverPriceAndCarByCustomerIdAndRouterSeries (params) {
  const url = `/getDriverPriceAndCarByCustomerIdAndRouterSeries`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }
  return httpGet(url, data)
}

export function createAllMonthOrder (params) {
  const url = `/createAllMonthOrder`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }
  return httpGet(url, data)
}

export function getOrderByRouterAndDate (params) {
  const url = `/getOrderByRouterAndDate`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }
  return httpGet(url, data)
}
