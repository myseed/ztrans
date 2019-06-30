/**
 * 车辆管理接口
 */

import {httpGet} from './sys/http'
import {paramsify, signify, timestamp, sid} from './utils'

export function getAllCatchOrderByPage (params) {
    const url = `/getAllCatchOrderByPage`
    const ts = timestamp()
    const data = {
        sid: sid(),
        timestamp: ts,
        params: paramsify(params),
        sign: signify(params, ts)
    }

    return httpGet(url, data)
}

export function getAllCatchDriverByPage (params) {
    const url = `/getAllCatchDriverByPage`
    const ts = timestamp()
    const data = {
        sid: sid(),
        timestamp: ts,
        params: paramsify(params),
        sign: signify(params, ts)
    }

    return httpGet(url, data)
}

export function createCatchOrder (params) {
    const url = `/createCatchOrder`
    const ts = timestamp()
    const data = {
        sid: sid(),
        timestamp: ts,
        params: paramsify(params),
        sign: signify(params, ts)
    }

    return httpGet(url, data)
}

export function deleteCatchOrder (params) {
    const url = `/deleteCatchOrder`
    const ts = timestamp()
    const data = {
        sid: sid(),
        timestamp: ts,
        params: paramsify(params),
        sign: signify(params, ts)
    }

    return httpGet(url, data)
}

export function creatCatchRule (params) {
    const url = `/creatCatchRule`
    const ts = timestamp()
    const data = {
        sid: sid(),
        timestamp: ts,
        params: paramsify(params),
        sign: signify(params, ts)
    }

    return httpGet(url, data)
}

export function updateCatchOrderStatusToHolding (params) {
    const url = `/updateCatchOrderStatusToHolding`
    const ts = timestamp()
    const data = {
        sid: sid(),
        timestamp: ts,
        params: paramsify(params),
        sign: signify(params, ts)
    }

    return httpGet(url, data)
}
