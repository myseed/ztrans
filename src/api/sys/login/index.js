import {httpGet} from '../http'
import {paramsify, signify, signifyLogin, timestamp} from '../../utils'

export function AccountLogin(params) {
  const url = `/loginSystem`
  const ts = timestamp()
  const data = {
    timestamp: ts,
    params: paramsify(params),
    sign: signifyLogin(params, ts)
  }
  
  return httpGet(url, data)
}

export function AccountLogout(params) {
  const url = `/cancelLoginSystem`
  const ts = timestamp()
  const data = {
    timestamp: ts,
    sid: params.sid,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}
