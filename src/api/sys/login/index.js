import request from '@/plugin/axios'
import { paramsify, signify, signifyLogin, timestamp } from '../../utils'
import { CONFIG } from '../../config'

export function AccountLogin (data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

// export function AccountLogin (params) {
//   const url = `${CONFIG.HOST}/loginSystem`
//   const ts = timestamp()
//   const data = {
//     timestamp: ts,
//     params: paramsify(params),
//     sign: signifyLogin(params, ts)
//   }

//   return request({
//     url,
//     method: 'get',
//     data
//   })
// }

export function AccountLogout (params) {
  const url = `${CONFIG.HOST}/cancelLoginSystem`
  const ts = timestamp()
  const data = {
    timestamp: ts,
    sid: params.sid,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return request({
    url,
    method: 'get',
    data
  })
}
