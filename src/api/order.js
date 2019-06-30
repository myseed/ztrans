/**
 * 指派接口
 */

import { httpGet } from './sys/http'
import { paramsify, signify, timestamp, sid } from './utils'
import axios from 'axios'

export function getCarTypeList (params) {
  const url = `/getCarTypeList`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function getOrderByCustomerNumId (params) {
  const url = `/getOrderByCustomerNumId`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function selectDriver (params) {
  const url = `/selectDriver`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function confirmDriver (params) {
  const url = `/confirmDriver`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function getDriverOrderDetail (params) {
  const url = `/getDriverOrderDetail`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}

export function getUnDealOrderCount (params) {
  const url = `/getUnDealOrderCount`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}
export function getCarSizeList (params) {
  const url = `/getCarSizeList`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return httpGet(url, data)
}
export function getOrderDetailBySeries (params) {
    const url = `/getOrderDetailBySeries`
    const ts = timestamp()
    const data = {
        sid: sid(),
        timestamp: ts,
        params: paramsify(params),
        sign: signify(params, ts)
    }

    return httpGet(url, data)
}

export function deleteOrder (params) {
    const url = `/deleteOrder`
    const ts = timestamp()
    const data = {
        sid: sid(),
        timestamp: ts,
        params: paramsify(params),
        sign: signify(params, ts)
    }

    return httpGet(url, data)
}

export function cancelOrderStatus (params) {
    const url = `/cancelOrderStatus`
    const ts = timestamp()
    const data = {
        sid: sid(),
        timestamp: ts,
        params: paramsify(params),
        sign: signify(params, ts)
    }

   return httpGet(url, data)
}

export function getAllMonthOrder (params) {
    const url = `/getAllMonthOrder`
    const ts = timestamp()
    const data = {
        sid: sid(),
        timestamp: ts,
        params: paramsify(params),
        sign: signify(params, ts)
    }

    return httpGet(url, data)
}

export function deleteAllMonthOrder (params) {
    const url = `/deleteAllMonthOrder`
    const ts = timestamp()
    const data = {
        sid: sid(),
        timestamp: ts,
        params: paramsify(params),
        sign: signify(params, ts)
    }

    return httpGet(url, data)
}

export function getAllMonthOrderDetail (params) {
    const url = `/getAllMonthOrderDetail`
    const ts = timestamp()
    const data = {
        sid: sid(),
        timestamp: ts,
        params: paramsify(params),
        sign: signify(params, ts)
    }

    return httpGet(url, data)
}

export function exportOrder (params) {
    const url = `/exportOrder`
    const ts = timestamp()
    return '' + process.env.VUE_APP_API + url + '?params=' + paramsify(params) + '&sid=' + sid() + '&sign=' + signify(params, ts) + '&timestamp=' + ts
}

export function getOrderByDriverSeries (params) {
    const url = `/getOrderByDriverSeries`
    const ts = timestamp()
    const data = {
        sid: sid(),
        timestamp: ts,
        params: paramsify(params),
        sign: signify(params, ts)
    }

    return httpGet(url, data)
}

export function updateDriverOrder (params) {
    const url = `/updateDriverOrder`
    const ts = timestamp()
    const data = {
        sid: sid(),
        timestamp: ts,
        params: paramsify(params),
        sign: signify(params, ts)
    }

    return httpGet(url, data)
}

export function importEditOrderPrice (params, file) {
    const url = `/importEditDriverOrderPrice`
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

export function importEditCustomerOrderPrice (params, file) {
    const url = `/importEditCustomerOrderPrice`
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

export function updateError (params) {
    const url = `/updateError`
    const ts = timestamp()
    const data = {
        sid: sid(),
        timestamp: ts,
        params: paramsify(params),
        sign: signify(params, ts)
    }

    return httpGet(url, data)
}