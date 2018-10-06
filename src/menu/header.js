// 菜单 顶栏
export default [
    { path: '/index', title: '首页', icon: 'home' },
    {
      title: '调度管理',
      icon: 'briefcase',
      children: [
        { path: '/page1', title: '调度人', icon: 'user' },
        { path: '/page2', title: '车辆', icon: 'truck' }
      ]
    },
    {
      title: '订单管理',
      icon: 'file-text',
      children: [
        { path: '/page1', title: '指派车辆', icon: 'truck' },
        { path: '/page2', title: '订单', icon: 'file-text' },
        { path: '/page2', title: '订单详情', icon: 'file-text' }
      ]
    },
    {
      title: '客户管理',
      icon: 'address-book',
      children: [
        { path: '/page1', title: '客户列表', icon: 'list-ol' }
      ]
    },
    {
      title: '车辆管理',
      icon: 'truck',
      children: [
        { path: '/page1', title: '车辆管理', icon: 'truck' }
      ]
    },
    {
      title: '报价管理',
      icon: 'dollar',
      children: [
        { path: '/page1', title: '线路报价', icon: 'chain' },
        { path: '/page2', title: '同城报价', icon: 'bandcamp' },
        { path: '/page2', title: '客户报价', icon: 'address-book' }
      ]
    },
    {
      title: '订单费用管理',
      icon: 'money',
      children: [
        { path: '/page1', title: '订单费用', icon: 'money' }
      ]
    }
  ]
