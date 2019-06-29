/**
 * 车辆管理接口
 */

import {httpGet} from './sys/http'
import {paramsify, signify, timestamp, sid} from './utils'

export function getMemberRuleList (params) {
    const url = `/getMemberRuleList`
    const ts = timestamp()
    const data = {
        sid: sid(),
        timestamp: ts,
        params: paramsify(params),
        sign: signify(params, ts)
    }

    return httpGet(url, data)
}

export function addMemberRule (params) {
    const url = `/addMemberRule`
    const ts = timestamp()
    const data = {
        sid: sid(),
        timestamp: ts,
        params: paramsify(params),
        sign: signify(params, ts)
    }

    return httpGet(url, data)
}

export function updateMemberRule (params) {
    const url = `/updateMemberRule`
    const ts = timestamp()
    const data = {
        sid: sid(),
        timestamp: ts,
        params: paramsify(params),
        sign: signify(params, ts)
    }

    return httpGet(url, data)
}

export function deleteMemberRule (params) {
    const url = `/deleteMemberRule`
    const ts = timestamp()
    const data = {
        sid: sid(),
        timestamp: ts,
        params: paramsify(params),
        sign: signify(params, ts)
    }

    return httpGet(url, data)
}
