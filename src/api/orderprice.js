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
