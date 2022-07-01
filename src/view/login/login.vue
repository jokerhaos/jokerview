<style lang="less" scoped>
@import "./login.less";
</style>

<template>
  <div @keydown.enter="handleSubmit">
    <div class="login" />
    <!-- <img src="../../../public/images/image_logo.png" alt="" class="img-logo"> -->
    <div class="login-con">
      <Card :bordered="false">
        <p slot="title">
          <Icon type="log-in" />
          欢迎登录
        </p>
        <div style="color: red">{{ message }}</div>
        <div class="form-con">
          <Form ref="loginForm" :model="form" :rules="rules">
            <FormItem prop="userName">
              <Input
                v-model="form.userName"
                placeholder="请输入用户名"
                @on-focus="clean"
              >
                <span slot="prepend">
                  <Icon :size="16" type="ios-person" />
                </span>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input
                v-model="form.password"
                type="password"
                placeholder="请输入密码"
                @on-focus="clean"
              >
                <span slot="prepend">
                  <Icon :size="14" type="md-lock" />
                </span>
              </Input>
            </FormItem>
            <FormItem v-show="codeNum" prop="code">
              <Input
                v-model="form.code"
                type="text"
                placeholder="请输入验证码"
                @on-focus="clean"
              >
                <span slot="prepend">
                  <Icon :size="14" type="ios-planet" />
                </span>
              </Input>
              <img
                :src="code_src"
                class="login-tip"
                style="
                  position: absolute;
                  top: 1px;
                  right: 0px;
                  height: 100%;
                  padding: 1px;
                  z-index: 1000;
                  border-radius: 5px;
                "
                alt="验证码"
                @click="getCode"
              />
            </FormItem>
            <FormItem>
              <Button type="primary" long @click="handleSubmit">登录</Button>
            </FormItem>
          </Form>
          <!-- <p class="login-tip">输入用户名和密码登录</p> -->
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import Global from '@/libs/Global'
import { setToken } from '@/libs/util'

export default {
  data () {
    return {
      form: {
        userName: '',
        password: '',
        code: ''
      },
      code_src: '',
      message: '',
      codeNum: 1,
      code_id: '',
      rules: {
        userName: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        code: []
      },
      code: ''
    }
  },
  async beforeMount () {
    await this.getCode()
  },
  methods: {
    clean () {
      this.message = ''
    },
    async handleSubmit () {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          const resp = await this.post('/admin/AdminLogin/login', {
            username: this.form.userName,
            password: this.form.password,
            code: this.form.code,
            code_id: this.code_id
          })
          if (resp.data.code !== 200) {
            // 登录失败
            this.getCode()
            this.message = resp.data.msg
          } else {
            // 登录成功
            const userInfo = resp.data.data.user
            const userMenu = resp.data.data.menu
            // 设置菜单权限、token
            Global.setMenuData(JSON.stringify(userMenu))
            Global.setUserInfo(JSON.stringify(userInfo))
            setToken(resp.data.data.token)
            this.$router.replace({
              name: this.$config.homeName
            })
          }
        }
      })
    },
    async getCode () {
      const resp = await this.get('/admin/AdminLogin/verify', null, true)
      console.log(resp)
      if (resp.data.code !== 200) {
        this.rules.code = [
          { required: true, message: resp.data.msg, trigger: 'blur' }
        ]
        return
      }
      const result = resp.data.data
      this.code_src = result.verify_src
      this.codeNum = result.verify_num
      this.code_id = result.verify_id
      if (this.codeNum) {
        this.rules.code = [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      }
    }
  }
}
</script>
