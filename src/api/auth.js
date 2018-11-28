/**
 * 员工接口
 */
import {httpGet} from './sys/http'
import { paramsify, signify, timestamp, sid } from './utils'

export function getAuthorityRoleList (params) {
  const url = `/getAuthorityRoleList`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

