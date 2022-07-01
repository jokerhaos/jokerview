<template>
    <Modal v-model="model" :title="title" @on-cancel="cancel" @on-ok="handleSubmit">
        <Alert v-if="!is_admin">用户自行分配菜单则角色菜单失效，使用用户自定义菜单</Alert>
        <Alert type="success" v-if="is_admin">你是超级管理员，默认所有菜单</Alert>
        <Tree :data="menuTree" show-checkbox multiple ref="tree" v-if="!is_admin"></Tree>
    </Modal>
</template>

<script>
import { menuTree, getMenuId } from '@/libs/util'
export default {
  data () {
    return {
      model: false,
      title: '用户菜单分配',
      admin_user_id: '',
      is_admin: false,
      menuTree: []
    }
  },
  methods: {
    async modelShow (data) {
      this.model = true
      this.admin_user_id = data.admin_user_id
      this.is_admin = data.admin_user_is_admin === 1
      // 获取所有菜单
      let menuData = await this.post('admin/AdminMenu/menuList', { get_all: true })
      if (menuData.data.code !== 200) {
        this.$Message.error(menuData.data.msg)
      } else {
        let checkedId = data.admin_menu_checked_id != null && data.admin_menu_checked_id !== '' && data.admin_menu_checked_id !== undefined ? data.admin_menu_checked_id.split(',') : []
        this.menuTree = menuTree(menuData.data.data.tree, checkedId)
      }
    },
    async handleSubmit () {
      let getCheckedNodes = this.$refs.tree.getCheckedNodes()
      let getCheckedAndIndeterminateNodes = this.$refs.tree.getCheckedAndIndeterminateNodes()
      let admin_menu_id = getMenuId(getCheckedAndIndeterminateNodes)
      let admin_menu_checked_id = getMenuId(getCheckedNodes)
      let param = {
        admin_user_id: this.admin_user_id,
        admin_menu_id: admin_menu_id,
        admin_menu_checked_id: admin_menu_checked_id
      }
      let result = await this.post('admin/AdminUser/userMenu', param)
      if (result.data.code !== 200) {
        this.$Message.error(result.data.msg)
      } else {
        this.$Message.success(result.data.msg)
        this.$parent.query()
      }
    },
    cancel () {
      this.model = false
    }
  }
}

</script>
