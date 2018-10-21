import Mock from 'mockjs'

Mock.mock('/api/demo/business/table/2', ({body}) => {
  // 这是通过 post 传来的参数
  body = JSON.parse(body)
  const {page} = body
  page.total = 1000
  return Mock.mock({
    code: 0,
    msg: '获取数据成功',
    data: {
      page,
      'employeeRouterModel|20': [
        {
          'customerName': '@cname',
          'routerAlia': '@cparagraph(0.5)',
          'routerNumber': '@guid',
          'series': '@guid'
        }
      ]
    }
  })
})
