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

export function getFranchiseeTypeList (params) {
    const url = `/getFranchiseeTypeList`
    const ts = timestamp()
    const data = {
        sid: sid(),
        timestamp: ts,
        params: paramsify(params),
        sign: signify(params, ts)
    }

    return httpGet(url, data)
}



export function getAllFranchisee (params) {
    const url = `/getAllFranchisee`
    const ts = timestamp()
    const data = {
        sid: sid(),
        timestamp: ts,
        params: paramsify(params),
        sign: signify(params, ts)
    }

    return httpGet(url, data)
}



export function addFranchisee (params) {
    const url = `/addFranchisee`
    const ts = timestamp()
    const data = {
        sid: sid(),
        timestamp: ts,
        params: paramsify(params),
        sign: signify(params, ts)
    }

    return httpGet(url, data)
}




export function updateFranchisee (params) {
    const url = `/updateFranchisee`
    const ts = timestamp()
    const data = {
        sid: sid(),
        timestamp: ts,
        params: paramsify(params),
        sign: signify(params, ts)
    }

    return httpGet(url, data)
}


export function deleteFranchisee (params) {
    const url = `/deleteFranchisee`
    const ts = timestamp()
    const data = {
        sid: sid(),
        timestamp: ts,
        params: paramsify(params),
        sign: signify(params, ts)
    }

    return httpGet(url, data)
}