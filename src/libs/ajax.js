import axios from 'axios'
import Global from '@/libs/Global.js'
import { getToken } from '@/libs/util.js'
import router from '@/router'
import { Message } from 'view-design'

// const userInfo = Global.getUserInfo();
// 配置axios
console.log(axios.defaults.headers)
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.timeout = 20000

const ajax = axios.create({
  timeout: 20000,
  //   headers: {
  // 'Authorization': getToken()
  // "BzAdminuserId" : userInfo.admin_user_id,
  // "BzRedisKey" : userInfo.redis_key
  //   },
  withCredentials: true
})

ajax.interceptors.request.use(
  req => {
    req.headers['Authorization'] = getToken()
    // req.data = qs.stringify(req.data);
    Global.loading = true
    return req
  },
  function (error) {
    Global.loading = false
    return Promise.reject(error)
  }
)

ajax.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    if (error.response.status === 401) {
      // 当前登录失效
      Message.error('登陆失效')
      router.replace({
        path: '/login',
        // 登录成功后跳入浏览的当前页面
        query: { redirect: router.currentRoute.fullPath }
      })
    } else if (error.response.status === 403) {
      // 当前操作没有权限
      Message.warning('您没有权限进行当前操作：' + error.response.data.msg)
    } else {
      Message.error('系统异常' + error.response.data.msg)
    }
    return Promise.reject(error)
  }
)

export default ajax
