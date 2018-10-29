import request from '@/plugin/axios'

export function getAllRouterAndEmployee (data) {
  return request({
    url: '/demo/business/table/2',
    method: 'post',
    data
  })
}
