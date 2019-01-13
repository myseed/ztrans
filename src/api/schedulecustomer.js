/**
 * 调度接口
 */
import {httpGet} from './sys/http'
import { paramsify, signify, timestamp, sid } from './utils'

export function getAllEmployeeAndCustomerName (params) {
  const url = `/getAllEmployeeAndCustomerName`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function deleteEmployeeAndCustomerName (params) {
  const url = `/deleteEmployeeAndCustomerName`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}
