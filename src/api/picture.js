import {httpGet} from './sys/http'
import { paramsify, signify, timestamp, sid } from './utils'
import axios from 'axios'
import { CONFIG } from './config'

export function uploadPicture (params, file) {
  const url = `/uploadPicture`
  const ts = timestamp()
  const data = new FormData()
  data.append('sid', sid())
  data.append('timestamp', ts)
  data.append('params', paramsify(params))
  data.append('multipartFile', file)
  data.append('sign', signify(params, ts))
  const config = {
    headers: {'Content-Type': 'multipart/form-data'}
  }
  return axios.post(process.env.VUE_APP_API +url, data, config)
}

export function getPicture (params) {
  const url = `/getPicture`
  const data = {
    params: paramsify(params),
    sign: signify(params)
  }
  return httpGet(url, data)
}

export function deletePicture (params) {
  const url = `/deletePicture`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }
  return httpGet(url, data)
}
