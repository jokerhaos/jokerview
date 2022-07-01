import Main from '@/view/main'
import Global from '@/libs/Global'
import {menuDataRouterTree} from '@/libs/util'

import AdminUser from '@/view/admin-user/AdminUser.vue'
import AdminRole from '@/view/admin-role/AdminRole.vue'
import AdminMenu from '@/view/admin-menu/AdminMenu.vue'
import AdminAuth from '@/view/admin-auth/AdminAuth.vue'
import AdminLog from '@/view/admin-log/AdminLog.vue'


const routeMap = {
    AdminUser : AdminUser //用户页面
    ,AdminRole //角色页面
    ,AdminMenu //菜单页面
    ,AdminAuth //权限页面
    ,AdminLog //系统日志
}

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

const loginRoute = {
  path: '/login',
  name: 'login',
  meta: {
    title: 'Login - 登录',
    hideInMenu: true
  },
  component: () => import('@/view/login/login.vue')
}

const logoutRoute = {
  path: '/logout',
  name: 'logout',
  meta: {
    title: 'logout - 退出',
    hideInMenu: true
  },
}

const homeRoute = {
  path: '/',
  name: '_home',
  redirect: '/home',
  component: Main,
  meta: {
    hideInMenu: true,
    notCache: true
  },
  children: [
    {
      path: '/home',
      name: 'home',
      meta: {
        hideInMenu: true,
        title: '首页',
        notCache: true,
        icon: 'md-home'
      },
      component: () => import('@/view/single-page/home')
    }
  ]
}

const page401Router = {
  path: '/401',
  name: 'error_401',
  meta: {
    hideInMenu: true
  },
  component: () => import('@/view/error-page/401.vue')
}

const page500Router = {
  path: '/401',
  name: 'error_401',
  meta: {
    hideInMenu: true
  },
  component: () => import('@/view/error-page/500.vue')
}

const page404Router = {
  path: '/401',
  name: 'error_401',
  meta: {
    hideInMenu: true
  },
  component: () => import('@/view/error-page/404.vue')
}

//动态路由
let menuData = Global.getMenuData();
let menuDataRouters = [];
if(JSON.stringify(menuData) != '{}'){
  menuDataRouters = menuDataRouterTree(Main,menuData.tree,routeMap);
}

let r = [
  loginRoute,homeRoute,page401Router,page404Router,page500Router,logoutRoute
];
let routers = r.concat(menuDataRouters);
export default routers;
