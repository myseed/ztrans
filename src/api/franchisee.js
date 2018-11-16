import {httpGet} from './sys/http'
import { paramsify, signify, timestamp, sid } from './utils'

export function getFranchiseeNameList (params) {
  const url = `/getFranchiseeNameList`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}
