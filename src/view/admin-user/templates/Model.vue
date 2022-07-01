<template>
    <Modal v-model="model" :title="title" width="700px" @on-cancel="cancel" @on-ok="handleSubmit">
        <div slot="close"></div>
        <Form ref="form" :model="submitForm"  :rules="rules" label-position="right">
            <FormItem label="用户账号" prop="admin_user_number" :label-width="100">
                <Input type="text" v-model.trim="submitForm.admin_user_number" :disabled="submitForm.admin_user_id != '' && submitForm.admin_user_id != undefined"/>
            </FormItem>
            <FormItem label="用户名字" prop="admin_user_name" :label-width="100">
                <Input type="text" v-model.trim="submitForm.admin_user_name"/>
            </FormItem>
            <FormItem label="选择角色" prop="admin_role_id" :label-width="100">
                <Select v-model="submitForm.admin_role_id" filterable  placeholder="角色选择" ref="admin_role_id">
                    <Option v-for="item in admin_role_list" :value="item.admin_role_id" :key="item.admin_role_id">{{item.admin_role_name}}</Option>
                </Select>
            </FormItem>
            <Row>
                <Col span="10">
                    <FormItem label="手机号" prop="admin_user_area_code" :label-width="100">
                        <Select v-model="submitForm.admin_user_area_code" filterable  placeholder="手机区号选择" ref="admin_user_area_code">
                            <Option v-for="item in countryCode" :value="item.phone_code" :key="item.country_code">+{{ item.phone_code }} {{item.chinese_name}}</Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col span="14" >
                    <FormItem prop="admin_user_phone" >
                        <Input type="text" v-model.trim="submitForm.admin_user_phone" />
                    </FormItem>
                </Col>
            </Row>
            <FormItem label="用户邮箱" prop="admin_user_email" :label-width="100">
                <Input type="text" v-model.trim="submitForm.admin_user_email"/>
            </FormItem>
            <FormItem label="登陆密码" prop="admin_user_pwd" :label-width="100" v-if="submitForm.admin_user_id == '' || submitForm.admin_user_id == undefined">
                <Input type="password" v-model.trim="submitForm.admin_user_pwd"/>
            </FormItem>
            <FormItem label="确认密码" prop="admin_user_pwd_confirm" :label-width="100" v-if="submitForm.admin_user_id == '' || submitForm.admin_user_id == undefined">
                <Input type="password" v-model.trim="submitForm.admin_user_pwd_confirm"/>
            </FormItem>
            <FormItem label="用户描述" prop="admin_user_remark" :label-width="100">
                <Input type="textarea" v-model.trim="submitForm.admin_user_remark"/>
            </FormItem>
        </Form>
    </Modal>
</template>

<script>
import countryCode from '@/libs/countryCode.js'
export default{
  data () {
    const confirmPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('确认密码不能为空！'))
      } else if (value !== this.submitForm.admin_user_pwd) {
        callback(new Error('密码输入不一致！'))
      } else {
        callback()
      }
    }
    const confirmUserNumber = async (rule, value, callback) => {
      // 修改不用判断
      if (this.submitForm.admin_user_id) {
        callback()
      } else {
        console.log(value)
        if (value === '' || value === undefined) {
          callback(new Error('用户账户不能为空！'))
        } else {
          let result = await this.post('/admin/AdminUser/userList', { admin_user_number: this.submitForm.admin_user_number })
          console.log(result.data.data.list.length)
          if (result.data.data.list.length >= 1) {
            callback(new Error('用户账户已经存在！'))
          } else {
            callback()
          }
        }
      }
    }
    return {
      countryCode: countryCode,
      admin_role_list: [],
      subUrl: '',
      title: '用户新增',
      submitForm: {
        admin_user_id: '',
        admin_user_number: '',
        admin_user_name: '',
        admin_role_id: '',
        admin_user_area_code: '',
        admin_user_phone: '',
        admin_user_email: '',
        admin_user_remark: '',
        admin_user_pwd: '',
        admin_user_pwd_confirm: ''
      },
      rules: {
        admin_user_number: [{
          required: true,
          trigger: 'blur',
          validator: confirmUserNumber
        }],
        admin_user_name: [{
          required: true,
          message: '用户名字不能为空！'
        }],
        admin_role_id: [{
          required: true,
          message: '用户角色不能为空！'
        }],
        admin_user_area_code: [{
          required: true,
          message: '手机区号不能为空！'
        }],
        admin_user_phone: [{
          required: true,
          message: '手机号码不能为空！'
        }, {
          pattern: /^\d{5,}$/,
          message: '手机号码不正确！'
        }],
        admin_user_email: [{
          type: 'email',
          message: '邮箱格式不正确！'
        }],
        admin_user_pwd: [{
          required: true,
          message: '登陆密码不能为空！'
        }, {
          type: 'string',
          min: 6,
          message: '登陆密码最少6位！'
        }],
        admin_user_pwd_confirm: [{
          required: true,
          trigger: 'blur',
          validator: confirmPwd
        }]
      },
      model: false
    }
  },
  methods: {
    async modelShow (data = [], type = 'add') {
      // 表单清空
      this.$refs.form.resetFields()
      this.$refs.admin_user_area_code.setQuery(null)
      this.$refs.admin_user_area_code.query = ''
      this.$refs.admin_role_id.setQuery(null)
      this.$refs.admin_role_id.query = ''
      // 显示
      this.submitForm.admin_user_id = data.admin_user_id
      this.submitForm.admin_user_number = data.admin_user_number
      this.submitForm.admin_user_name = data.admin_user_name
      this.submitForm.admin_user_phone = data.admin_user_phone
      this.submitForm.admin_user_email = data.admin_user_email
      this.submitForm.admin_user_remark = data.admin_user_remark
      this.model = true
      // 获取用户角色列表
      let resp = await this.post('/admin/AdminRole/roleList', { get_all: true })
      let datas = resp.data
      if (datas.code === 200) {
        this.admin_role_list = datas.data.list
      } else {
        this.$Message.error('角色信息获取失败：' + datas.msg)
      }
      // 判断添加还是编辑
      this.subUrl = '/admin/AdminUser/userAdd'
      if (type !== 'add') {
        this.title = '用户编辑'
        this.subUrl = '/admin/AdminUser/userEdit'
        this.submitForm.admin_role_id = data.admin_role_id
        this.submitForm.admin_user_area_code = data.admin_user_area_code + ''
      } else {
        this.title = '用户新增'
        this.submitForm.admin_user_area_code = '86'
      }
    },
    async handleSubmit () {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const resp = await this.post(this.subUrl, this.submitForm)
          const datas = resp.data
          if (datas.code === 200) {
            this.model = false
            this.$Message.success(this.title + '成功')
            this.$refs.form.resetFields()
            this.$parent.query()
          } else {
            this.model = true
            this.$Message.error(datas.msg)
          }
        } else {
          this.$Message.error('表单验证失败')
        }
      })
    },
    cancel () {
      // 调用关闭父方法
      this.model = false
    }
  }
}
</script>
