<template>
    <Modal v-model="model" :title="title" width="700px" @on-cancel="cancel" @on-ok="handleSubmit">
        <div slot="close"></div>
        <Form ref="form" :model="submitForm" :label-width="100" :rules="rules" label-position="right">
            <Row>
                <FormItem label="角色代码" prop="admin_role_code">
                    <Input type="text" v-model.trim="submitForm.admin_role_code" :disabled="roleCodeDisabled"/>
                </FormItem>
                <FormItem label="角色名字" prop="admin_role_name">
                    <Input type="text" v-model.trim="submitForm.admin_role_name"/>
                </FormItem>
                <FormItem label="角色描述" prop="admin_role_desc">
                    <Input type="textarea" v-model.trim="submitForm.admin_role_desc"/>
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
        admin_role_id: '',
        admin_role_code: '',
        admin_role_name: '',
        admin_role_desc: ''
      },
      rules: {
        admin_role_code: [{
          required: true,
          message: '角色代码不能为空！'
        }],
        admin_role_id: [{
          required: true,
          message: 'ID不能为空！'
        }],
        admin_role_name: [{
          required: true,
          message: '角色名称不能为空！'
        }]
      },
      model: false
    }
  },
  methods: {
    modelShow (data = [], type = 'add') {
      this.$refs.form.resetFields()
      if (type === 'add') {
        this.title = '新增角色'
        this.subUrl = '/admin/AdminRole/roleAdd'
        this.roleCodeDisabled = false
        this.rules.admin_role_id[0].required = false
      } else if (type === 'edit') {
        this.title = '编辑角色'
        this.subUrl = '/admin/AdminRole/roleEdit'
        // 显示
        this.submitForm.admin_role_code = data.admin_role_code
        this.submitForm.admin_role_name = data.admin_role_name
        this.submitForm.admin_role_desc = data.admin_role_desc
        this.submitForm.admin_role_id = data.admin_role_id
        this.roleCodeDisabled = true
        this.rules.admin_role_id[0].required = true
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
      // 调用关闭父方法
      this.model = false
      this.$refs.form.resetFields()
    }
  }
}
</script>
