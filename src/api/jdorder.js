import {httpGet} from './sys/http'
import { paramsify, signify, timestamp, sid } from './utils'
import axios from 'axios'
export function getJdOrderList (params) {
  const url = `/getJdOrderList`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function deleteJdOrder (params) {
    const url = `/deleteJdOrder`
    const ts = timestamp()
    const data = {
        sid: sid(),
        timestamp: ts,
        params: paramsify(params),
        sign: signify(params, ts)
    }

    return httpGet(url, data)
}

export function importJdOrder (params, file) {
    const url = `/importJdOrder`
    const ts = timestamp()
    const data = new FormData()
    data.append('sid', sid())
    data.append('timestamp', ts)
    data.append('params', paramsify(params))
    data.append('multipartFile', file)
    data.append('sign', signify(params, ts))
    const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
    }
    return axios.post(process.env.VUE_APP_API + url, data, config)
}

export function downloadOrderExcel (params) {
    const url = `/downloadOrderExcel`
    const ts = timestamp()
    return '' + process.env.VUE_APP_API + url + '?params=' + paramsify(params) + '&sid=' + sid() + '&sign=' + signify(params, ts) + '&timestamp=' + ts
}