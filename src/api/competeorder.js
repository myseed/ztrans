/**
 * 车辆管理接口
 */

import {httpGet} from './sys/http'
import {paramsify, signify, timestamp, sid} from './utils'

export function getAllCompeteOrderByPage (params) {
    const url = `/getAllCompeteOrderByPage`
    const ts = timestamp()
    const data = {
        sid: sid(),
        timestamp: ts,
        params: paramsify(params),
        sign: signify(params, ts)
    }

    return httpGet(url, data)
}

export function getAllCompeteDriverByPage (params) {
    const url = `/getAllCompeteDriverByPage`
    const ts = timestamp()
    const data = {
        sid: sid(),
        timestamp: ts,
        params: paramsify(params),
        sign: signify(params, ts)
    }

    return httpGet(url, data)
}

export function createCompeteOrder (params) {
    const url = `/createCompeteOrder`
    const ts = timestamp()
    const data = {
        sid: sid(),
        timestamp: ts,
        params: paramsify(params),
        sign: signify(params, ts)
    }

    return httpGet(url, data)
}

export function deleteCompeteOrder (params) {
    const url = `/deleteCompeteOrder`
    const ts = timestamp()
    const data = {
        sid: sid(),
        timestamp: ts,
        params: paramsify(params),
        sign: signify(params, ts)
    }

    return httpGet(url, data)
}

export function creatCompeteRule (params) {
    const url = `/creatCompeteRule`
    const ts = timestamp()
    const data = {
        sid: sid(),
        timestamp: ts,
        params: paramsify(params),
        sign: signify(params, ts)
    }

    return httpGet(url, data)
}

export function updateCompeteOrderStatusToHolding (params) {
    const url = `/updateCompeteOrderStatusToHolding`
    const ts = timestamp()
    const data = {
        sid: sid(),
        timestamp: ts,
        params: paramsify(params),
        sign: signify(params, ts)
    }

    return httpGet(url, data)
}

export function getCompeteDriverList (params) {
    const url = `/getCompeteDriverList`
    const ts = timestamp()
    const data = {
        sid: sid(),
        timestamp: ts,
        params: paramsify(params),
        sign: signify(params, ts)
    }

    return httpGet(url, data)
}

export function getAllUnDealCompeteOrder (params) {
    const url = `/getAllUnDealCompeteOrder`
    const ts = timestamp()
    const data = {
        sid: sid(),
        timestamp: ts,
        params: paramsify(params),
        sign: signify(params, ts)
    }

    return httpGet(url, data)
}


