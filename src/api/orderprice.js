/**
 * 订单费用接口
 */

import {httpGet} from './sys/http'
import { paramsify, signify, timestamp, sid } from './utils'

export function getOrderPriceList (params) {
  const url = `/getOrderPriceList`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function exportOrderPrice (params) {
  const url = `/exportOrderPrice`
  const ts = timestamp()
  return '' + process.env.VUE_APP_API + url + '?params=' + paramsify(params) + '&sid=' + sid() + '&sign=' + signify(params, ts) + '&timestamp=' + ts
}


export function updateOrderFeeByHasCalculate (params) {
  const url = `/updateOrderFeeByHasCalculate`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
}

  return httpGet(url, data)
}