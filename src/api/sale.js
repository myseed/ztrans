/**
 * 调度接口
 */
import {httpGet} from './sys/http'
import { paramsify, signify, timestamp, sid } from './utils'

export function getAllSale (params) {
  const url = `/getAllSale`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function deleteSale (params) {
  const url = `/deleteSale`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}
