<template>
    <Form ref="form" :model="submitForm" :label-width="100" :rules="rules" label-position="right">
        <Row>
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
                <Input type="text" v-model.trim="submitForm.admin_menu_sort" placeholder="菜单排序,值越大排序越靠前"/>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit">保存修改</Button>
                <Button style="margin-left: 8px" @click="reset">重置</Button>
            </FormItem>
        </Row>
    </Form>
</template>

<script>
export default{
  data: () => {
    return {
      menuInfo: {},
      submitForm: {
        admin_menu_name: '',
        admin_menu_title: '',
        admin_menu_icon: '',
        admin_menu_path: '',
        admin_menu_sort: '',
        admin_menu_id: ''
      },
      rules: {
        admin_menu_id: [{
          required: true,
          message: '菜单ID不能为空！'
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
        }]
      }
    }
  },
  methods: {
    async handleSubmit () {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const submiturl = '/admin/AdminMenu/menuEdit'
          const resp = await this.post(submiturl, this.submitForm)
          const datas = resp.data
          if (datas.code === 200) {
            this.$Message.success('菜单编辑成功')
            this.$emit('query')
          } else {
            this.addRole = true
            this.$Message.error(datas.msg)
          }
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    async setMenuInfo (admin_menu_id) {
      // 获取所有菜单
      let menuInfo = await this.post('admin/AdminMenu/menuInfo', { admin_menu_id: admin_menu_id })
      if (menuInfo.data.code !== 200) {
        this.$Message.error(menuInfo.data.msg)
      } else {
        this.menuInfo = menuInfo.data.data
        this.submitForm.admin_menu_name = menuInfo.data.data.admin_menu_name
        this.submitForm.admin_menu_title = menuInfo.data.data.admin_menu_title
        this.submitForm.admin_menu_icon = menuInfo.data.data.admin_menu_icon
        this.submitForm.admin_menu_path = menuInfo.data.data.admin_menu_path
        this.submitForm.admin_menu_sort = menuInfo.data.data.admin_menu_sort
        this.submitForm.admin_menu_id = menuInfo.data.data.admin_menu_id
      }
    },
    reset () {
      this.submitForm.admin_menu_name = this.menuInfo.admin_menu_name
      this.submitForm.admin_menu_title = this.menuInfo.admin_menu_title
      this.submitForm.admin_menu_icon = this.menuInfo.admin_menu_icon
      this.submitForm.admin_menu_path = this.menuInfo.admin_menu_path
      this.submitForm.admin_menu_sort = this.menuInfo.admin_menu_sort
      this.submitForm.admin_menu_id = this.menuInfo.admin_menu_id
    }
  }
}
</script>
