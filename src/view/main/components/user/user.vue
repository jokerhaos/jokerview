<template>
  <div class="user-avatar-dropdown">
    <Dropdown @on-click="handleClick">
      <Badge>
        <!-- <Avatar :src="userAvatar"/> -->
        {{ user_name }}
      </Badge>
      <Icon :size="18" type="md-arrow-dropdown" />
      <DropdownMenu slot="list">
        <DropdownItem name="editpwd"
          ><Icon type="ios-create-outline" /> 修改密码</DropdownItem
        >
        <DropdownItem name="logout"
          ><Icon type="md-log-out" /> 退出登录</DropdownItem
        >
      </DropdownMenu>
    </Dropdown>

    <Modal
      v-model="model"
      :title="title"
      width="700px"
      @on-cancel="cancel"
      @on-ok="handleSubmit"
    >
      <div slot="close" />
      <Form
        ref="form"
        :model="submitForm"
        :rules="rules"
        :label-width="100"
        label-position="right"
      >
        <FormItem label="旧密码" prop="y_pwd">
          <Input v-model.trim="submitForm.y_pwd" type="password" />
        </FormItem>
        <FormItem label="新密码" prop="new_pwd">
          <Input v-model.trim="submitForm.new_pwd" type="password" />
        </FormItem>
        <FormItem label="确认密码" prop="new_pwd_confirm">
          <Input v-model.trim="submitForm.new_pwd_confirm" type="password" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import './user.less'
import Global from '@/libs/Global'
import router from '@/router'
export default {
  name: 'User',
  props: {
    userAvatar: {
      type: String,
      default: ''
    }
  },
  data () {
    const confirmPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('确认密码不能为空！'))
      } else if (value !== this.submitForm.new_pwd) {
        callback(new Error('密码输入不一致！'))
      } else {
        callback()
      }
    }
    return {
      model: false,
      user_name: '',
      title: '修改密码',
      submitForm: {
        admin_user_id: '',
        y_pwd: '',
        new_pwd: '',
        new_pwd_confirm: ''
      },
      rules: {
        y_pwd: [
          {
            required: true,
            message: '旧密码不能为空！'
          },
          {
            type: 'string',
            min: 6,
            message: '旧密码最少6位！'
          }
        ],
        new_pwd: [
          {
            required: true,
            message: '新密码不能为空！'
          },
          {
            type: 'string',
            min: 6,
            message: '新密码最少6位！'
          }
        ],
        new_pwd_confirm: [
          {
            required: true,
            trigger: 'blur',
            validator: confirmPwd
          }
        ]
      }
    }
  },
  created () {
    const userInfo = Global.getUserInfo()
    this.submitForm.admin_user_id = userInfo.admin_user_id
    this.user_name = userInfo.admin_user_name
  },
  methods: {
    async logout () {
      const resp = await this.post('/admin/AdminLogin/logout', this.submitForm)
      if (resp.data.code === 200) {
        router.replace({
          path: '/login',
          // 登录成功后跳入浏览的当前页面
          query: { redirect: router.currentRoute.fullPath }
        })
      } else {
        this.$Message.error(resp.data.msg)
      }
    },
    userEditPwd () {
      this.$refs.form.resetFields()
      this.model = true
    },
    cancel () {
      // 调用关闭父方法
      this.model = false
    },
    async handleSubmit () {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const resp = await this.post(
            '/admin/AdminUser/userEditPwd',
            this.submitForm
          )
          const datas = resp.data
          if (datas.code === 200) {
            this.model = false
            this.$Message.success('密码修改成功，2秒后重新登陆')
            setTimeout(() => {
              window.location.href = '/logout'
            }, 2000)
          } else {
            this.model = true
            this.$Message.error(datas.msg)
          }
        } else {
          this.$Message.error('表单验证失败')
        }
      })
    },
    handleClick (name) {
      switch (name) {
        case 'logout':
          this.logout()
          break
        case 'editpwd':
          this.userEditPwd()
          break
      }
    }
  }
}
</script>
