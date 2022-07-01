import ajax from '@/libs/ajax'

const AjaxPlugin = {}
const baseUrl = process.env.VUE_APP_BASE_API
AjaxPlugin.install = async function (Vue, options) {
  // 封装post请求以及界面反馈
  Vue.prototype.post = async function (url, param, notShowMessage = false) {
    try {
      if (!notShowMessage) {
        this.$Message.loading({ content: '正在发送请求', duration: 10 })
      }
      //   console.log(param)
      const resp = await ajax.post(baseUrl + '/' + (url.substr(0, 1) === '/' ? url.substr(1) : url), param)
      if (resp.status > 400) {
        throw new Error('response status is not 200')
      }
      if (resp.data.__error__) { // 后端返回的明确错误
        this.$Modal.warning({ title: '请求异常', content: resp.data.__error__ })
        let err = new Error(resp.data.__error__)
        err.name = 'apiError'
        throw err
      }

      this.$Message.destroy()
      if (!notShowMessage) {
        this.$Message.info('请求成功')
      }
      return resp
    } catch (e) {
      this.$Message.destroy()
      this.$Message.error('请求失败')
      throw e
    }
  }
  Vue.prototype.get = async function (url, param, showMessage = false) {
    try {
      this.$Message.loading({ content: '正在发送请求', duration: 10 })
      const resp = await ajax.get(baseUrl + '/' + (url.substr(0, 1) === '/' ? url.substr(1) : url), param)
      if (resp.status > 400) {
        throw new Error('response status is not 200')
      }
      if (resp.data.__error__) { // 后端返回的明确错误
        this.$Modal.warning({ title: '请求异常', content: resp.data.__error__ })
        let err = new Error(resp.data.__error__)
        err.name = 'apiError'
        throw err
      }
      this.$Message.destroy()
      this.$Message.info('请求成功')
      return resp
    } catch (e) {
      this.$Message.destroy()
      this.$Message.error('请求失败')
      throw e
    }
  }
}

export default AjaxPlugin
