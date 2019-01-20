// layout
import layoutHeaderAside from '@/layout/header-aside'

const meta = { requiresAuth: true }

/**
 * 在主框架内显示
 */
const frameIn = [
  {
    path: '/',
    redirect: { name: 'index' },
    component: layoutHeaderAside,
    children: [
      {
        path: 'index',
        name: 'index',
        meta,
        component: () => import('@/pages/index')
      },
      {
        path: '/scheduler',
        name: 'scheduler',
        component: () => import('@/pages/scheduler'),
        meta: { meta, title: '调度人' }
      },
      {
        path: '/scheduler-customer',
        name: 'scheduler-customer',
        component: () => import('@/pages/scheduler-customer'),
        meta: { meta, title: '调度客户' }
      },
      // {
      //   path: '/vehicle-schedule',
      //   name: 'vehicle-schedule',
      //   component: () => import('@/pages/vehicle-schedule'),
      //   meta: { meta, title: '调度车辆' }
      // },
      {
        path: '/vehicle-assign',
        name: 'vehicle-assign',
        component: () => import('@/pages/vehicle-assign'),
        meta: { meta, title: '指派车辆' }
      },
      {
        path: '/vehicle-assign-month',
        name: 'vehicle-assign-month',
        component: () => import('@/pages/vehicle-assign-month'),
        meta: { meta, title: '整月派单' }
      },
      {
        path: '/order-management/:status',
        name: 'order-management',
        component: () => import('@/pages/order-management'),
        meta: { meta, title: '订单管理' }
      },
      {
        path: '/order-detail',
        name: 'order-detail',
        component: () => import('@/pages/order-detail'),
        meta: { meta, title: '订单详情' }
      },
      {
        path: '/customer-management',
        name: 'customer-management',
        component: () => import('@/pages/customer-management'),
        meta: { meta, title: '客户列表' }
      },
      {
        path: '/vehicle-management',
        name: 'vehicle-management',
        component: () => import('@/pages/vehicle-management'),
        meta: { meta, title: '车辆管理' }
      },
      {
        path: '/quotation-line',
        name: 'quotation-line',
        component: () => import('@/pages/quotation-line'),
        meta: { meta, title: '线路报价' }
      },
      {
        path: '/quotation-citywide',
        name: 'quotation-citywide',
        component: () => import('@/pages/quotation-citywide'),
        meta: { meta, title: '同城报价' }
      },
      {
        path: '/quotation-customer',
        name: 'quotation-customer',
        component: () => import('@/pages/quotation-customer'),
        meta: { meta, title: '客户报价' }
      },
      {
        path: '/quotation-line-new',
        name: 'quotation-line-new',
        component: () => import('@/pages/quotation-line-new'),
        meta: { meta, title: '线路报价' }
      },
      {
        path: '/quotation-citywide-new',
        name: 'quotation-citywide-new',
        component: () => import('@/pages/quotation-citywide-new'),
        meta: { meta, title: '同城报价' }
      },
      {
        path: '/quotation-customer-new',
        name: 'quotation-customer-new',
        component: () => import('@/pages/quotation-customer-new'),
        meta: { meta, title: '客户报价' }
      },
      {
        path: '/cost-management/:status',
        name: 'cost-management',
        component: () => import('@/pages/cost-management'),
        meta: { meta, title: '订单费用' }
      },
      {
        path: '/sale-management',
        name: 'sale-management',
        component: () => import('@/pages/sale-management'),
        meta: { meta, title: '销售管理' }
      },
      {
        path: '/franchisee-management',
        name: 'franchisee-management',
        component: () => import('@/pages/franchisee-management'),
        meta: { meta, title: '销售管理' }
      },
      {
        path: '/order-create',
        name: 'order-create',
        component: () => import('@/pages/order-create'),
        meta: { meta, title: '创建订单' }
      },
      {
        path: '/dictionary-management',
        name: 'dictionary-management',
        component: () => import('@/pages/dictionary-management'),
        meta: { meta, title: '字典管理' }
      },
      {
        path: '/dictionary-detail',
        name: 'dictionary-detail',
        component: () => import('@/pages/dictionary-detail'),
        meta: { meta, title: '字典明细管理' }
      },
      {
        path: '/prv-management',
        name: 'prv-management',
        component: () => import('@/pages/prv-management'),
        meta: { meta, title: '省' }
      },
      {
        path: '/city-management',
        name: 'city-management',
        component: () => import('@/pages/city-management'),
        meta: { meta, title: '市' }
      },
      {
        path: '/cityarea-management',
        name: 'cityarea-management',
        component: () => import('@/pages/cityarea-management'),
        meta: { meta, title: '区' }
      },
      {
        path: '/town-management',
        name: 'town-management',
        component: () => import('@/pages/town-management'),
        meta: { meta, title: '镇' }
      },
      {
        path: '/employee-management',
        name: 'employee-management',
        component: () => import('@/pages/employee-management'),
        meta: { meta, title: '员工管理' }
      },
      {
        path: '/vehicle-detail',
        name: '/vehicle-detail',
        component: () => import('@/pages/vehicle-detail'),
        meta: { meta, title: '车辆明细' }
      },
      {
        path: '/customer-detail',
        name: '/customer-detail',
        component: () => import('@/pages/customer-detail'),
        meta: { meta, title: '客户明细' }
      },
      {
        path: '/customer-router-detail',
        name: '/customer-router-detail',
        component: () => import('@/pages/customer-router-detail'),
        meta: { meta, title: '客户线路明细' }
      },
      {
        path: '/router-line-detail',
        name: '/router-line-detail',
        component: () => import('@/pages/router-line-detail'),
        meta: { meta, title: '线路明细' }
      },
      {
        path: '/router-city-detail',
        name: '/router-city-detail',
        component: () => import('@/pages/router-city-detail'),
        meta: { meta, title: '线路明细' }
      },
      {
        path: '/create-month-detail',
        name: '/create-month-detail',
        component: () => import('@/pages/create-month-detail'),
        meta: { meta, title: '创建整月单' }
      }

    ]
  }
]

/**
 * 在主框架之外显示
 */
const frameOut = [
  // 页面重定向使用 必须保留
  {
    path: '/redirect/:path*',
    component: () => import('@/pages/redirect')
  },
  // 登录
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login')
  }
]

/**
 * 错误页面
 */
const errorPage = [
  // 404
  {
    path: '*',
    name: '404',
    component: () => import('@/pages/error-page-404')
  }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
export default [
  ...frameIn,
  ...frameOut,
  ...errorPage
]
