<template>
    <Modal v-model="model" title="新增菜单" width="700px" @on-cancel="cancel" @on-ok="handleSubmit">
        <div slot="close"></div>
        <Form ref="form" :model="submitForm" :label-width="100" :rules="rules" label-position="right">
            <FormItem label="父级菜单" prop="admin_menu_ptitle">
                <Input type="text" v-model.trim="admin_menu_ptitle" disabled/>
            </FormItem>
            <FormItem label="菜单名字" prop="admin_menu_name">
                <Input type="text" v-model.trim="submitForm.admin_menu_name"/>
            </FormItem>
            <FormItem label="菜单标题" prop="admin_menu_title">
                <Input type="text" v-model.trim="submitForm.admin_menu_title"/>
            </FormItem>
            <FormItem label="菜单图标" prop="admin_menu_icon">
                <Input type="text" v-model.trim="submitForm.admin_menu_icon"/>
            </FormItem>
            <FormItem label="菜单路径" prop="admin_menu_path">
                <Input type="text" v-model.trim="submitForm.admin_menu_path"/>
            </FormItem>
            <FormItem label="菜单排序" prop="admin_menu_sort">
                <Input type="text" v-model.trim="submitForm.admin_menu_sort"/>
            </FormItem>
        </Form>
    </Modal>
</template>

<script>
export default{
  data: () => {
    return {
      admin_menu_ptitle: '',
      submitForm: {
        admin_menu_pid: '0',
        admin_menu_name: '',
        admin_menu_title: '',
        admin_menu_icon: '',
        admin_menu_path: '',
        admin_menu_sort: 1,
        admin_menu_level_path: ''
      },
      rules: {
        admin_menu_pid: [{
          required: true,
          message: '父级ID不能为空！'
        }],
        admin_menu_name: [{
          required: true,
          message: '菜单名字不能为空！'
        }],
        admin_menu_title: [{
          required: true,
          message: '菜单标题不能为空！'
        }],
        admin_menu_icon: [{
          required: true,
          message: '菜单图标不能为空！'
        }],
        admin_menu_path: [{
          required: true,
          message: '菜单地址不能为空！'
        }],
        admin_menu_sort: [{
          required: true,
          message: '菜单排序不能为空！'
        }],
        admin_menu_level_path: [{
          required: true,
          message: '菜单等级地址不能为空！'
        }]
      },
      model: false
    }
  },
  methods: {
    modelShow (pid, admin_menu_level_path, admin_menu_title) {
      // 显示
      this.model = true
      this.$refs.form.resetFields()
      // 赋值
      this.admin_menu_ptitle = admin_menu_title
      this.submitForm.admin_menu_pid = pid
      this.submitForm.admin_menu_level_path = admin_menu_level_path
    },
    async handleSubmit () {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const submiturl = '/admin/AdminMenu/menuAdd'
          const resp = await this.post(submiturl, this.submitForm)
          const datas = resp.data
          if (datas.code === 200) {
            this.$refs.form.resetFields()
            this.model = false
            this.$Message.success('菜单新增成功')
            this.$parent.query()
          } else {
            this.model = true
            this.$Message.error(datas.msg)
          }
        } else {
          this.model = true
          this.$Message.error('表单验证失败！')
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
