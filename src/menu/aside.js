// 菜单 侧边栏
export default [
  { path: '/index', title: '首页', icon: 'home' },
  {
    title: '调度管理',
    icon: 'briefcase',
    children: [
      { path: '/scheduler', title: '调度人', icon: 'user' },
      { path: '/vehicle-schedule', title: '调度车辆', icon: 'truck' }
    ]
  },
  {
    title: '订单管理',
    icon: 'file-text',
    children: [
      { path: '/vehicle-assign', title: '指派车辆', icon: 'truck' },
      { path: '/order-management', title: '订单', icon: 'file-text' }
    ]
  },
  {
    title: '客户管理',
    icon: 'address-book',
    children: [
      { path: '/customer-management', title: '客户列表', icon: 'list-ol' }
    ]
  },
  {
    title: '车辆管理',
    icon: 'truck',
    children: [
      { path: '/vehicle-management', title: '车辆管理', icon: 'truck' }
    ]
  },
  {
    title: '报价管理',
    icon: 'dollar',
    children: [
      { path: '/quotation-line', title: '线路报价', icon: 'chain' },
      { path: '/quotation-citywide', title: '同城报价', icon: 'bandcamp' },
      { path: '/quotation-customer', title: '客户报价', icon: 'address-book' }
    ]
  },
  {
    title: '订单费用管理',
    icon: 'money',
    children: [
      { path: '/cost-management', title: '订单费用', icon: 'money' }
    ]
  },
  {
    title: '销售管理',
    icon: 'child',
    children: [
      { path: '/sale-management', title: '销售管理', icon: 'child' }
    ]
  },
  {
    title: '加盟商管理',
    icon: 'user-circle-o',
    children: [
      { path: '/franchisee-management', title: '加盟商管理', icon: 'user-circle-o' }
    ]
  },
  {
    title: '手动下单',
    icon: 'ticket',
    children: [
      { path: '/order-create', title: '手动下单', icon: 'ticket' }
    ]
  },
   {
    title: '字典管理',
    icon: 'book',
    children: [
      { path: '/dictionary-management', title: '字典管理', icon: 'book' }
     ]
  }
]
