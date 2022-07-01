<template>
    <Modal v-model="model" :title="title" @on-cancel="cancel" @on-ok="handleSubmit">
        <Tree :data="menuTree" show-checkbox multiple ref="tree"></Tree>
    </Modal>
</template>

<script>
import { menuTree, getMenuId } from '@/libs/util'
export default {
  data () {
    return {
      model: false,
      title: '角色菜单分配',
      admin_role_id: '',
      menuTree: []
    }
  },
  methods: {
    async modelShow (data) {
      this.model = true
      this.admin_role_id = data.admin_role_id
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
        admin_role_id: this.admin_role_id,
        admin_menu_id: admin_menu_id,
        admin_menu_checked_id: admin_menu_checked_id
      }
      let result = await this.post('admin/AdminRole/roleMenu', param)
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
