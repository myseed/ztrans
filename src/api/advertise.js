/**
 * 客户管理接口
 */

import {httpGet} from './sys/http'
import { paramsify, signify, timestamp, sid } from './utils'



export function getXcxFirstPageList (params) {
  const url = `/getXcxFirstPageList`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }
  return httpGet(url, data)
}

export function addXcxFirstPageList (params) {
    const url = `/addXcxFirstPageList`
    const ts = timestamp()
    const data = {
        sid: sid(),
        timestamp: ts,
        params: paramsify(params),
        sign: signify(params, ts)
    }
    return httpGet(url, data)
}

export function getXcxAdvertiseList (params) {
    const url = `/getXcxAdvertiseList`
    const ts = timestamp()
    const data = {
        sid: sid(),
        timestamp: ts,
        params: paramsify(params),
        sign: signify(params, ts)
    }
    return httpGet(url, data)
}
