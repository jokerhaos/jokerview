<template>
    <Modal v-model="model" :title="title" width="700px" @on-cancel="cancel" @on-ok="handleSubmit">
        <div slot="close"></div>
        <Form ref="form" :model="submitForm" :label-width="100" :rules="rules" label-position="right">
            <Row>
                <FormItem label="权限名字" prop="admin_auth_name">
                    <Input type="text" v-model.trim="submitForm.admin_auth_name"/>
                </FormItem>
                <FormItem label="权限路径" prop="admin_auth_path">
                    <Input type="text" v-model.trim="submitForm.admin_auth_path"/>
                </FormItem>
                <FormItem label="权限描述" prop="admin_auth_desc">
                    <Input type="textarea" v-model.trim="submitForm.admin_auth_desc"/>
                </FormItem>
            </Row>
        </Form>
    </Modal>
</template>

<script>
export default{
  data: () => {
    return {
      title: '',
      subUrl: '',
      roleCodeDisabled: false,
      submitForm: {
        admin_auth_id: '',
        admin_auth_name: '',
        admin_auth_path: '',
        admin_auth_desc: ''
      },
      rules: {
        admin_auth_id: [{
          required: true,
          message: '权限名字不能为空！'
        }],
        admin_auth_name: [{
          required: true,
          message: 'ID不能为空！'
        }],
        admin_auth_path: [{
          required: true,
          message: '权限路径不能为空！'
        }]
      },
      model: false
    }
  },
  methods: {
    modelShow (data = [], type = 'add') {
      this.$refs.form.resetFields()
      if (type === 'add') {
        this.title = '新增权限'
        this.subUrl = '/admin/AdminAuth/authAdd'
        this.rules.admin_auth_id[0].required = false
      } else if (type === 'edit') {
        this.title = '编辑角色'
        this.subUrl = '/admin/AdminAuth/authEdit'
        // 显示
        this.submitForm.admin_auth_name = data.admin_auth_name
        this.submitForm.admin_auth_path = data.admin_auth_path
        this.submitForm.admin_auth_desc = data.admin_auth_desc
        this.submitForm.admin_auth_id = data.admin_auth_id
        this.rules.admin_auth_id[0].required = true
      }
      this.model = true
    },
    async handleSubmit () {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const resp = await this.post(this.subUrl, this.submitForm)
          const datas = resp.data
          console.log(datas)
          if (datas.code === 200) {
            this.model = false
            this.$Message.success(this.title + ':' + datas.msg)
            this.$refs.form.resetFields()
            this.$parent.query()
          } else {
            this.model = true
            this.$Message.error(this.title + ':' + datas.msg)
          }
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    cancel () {
      this.model = false
      this.$refs.form.resetFields()
    }
  }
}
</script>
