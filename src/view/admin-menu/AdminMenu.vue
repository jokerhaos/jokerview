<template>
    <div>
        <Card>
            <div slot="title">
               <b>菜单权限</b>
                <Button type="primary" size="small" shape="circle" style="float:right;" icon="md-refresh" @click="query()">刷新</Button>
                <div style="clear:both"></div>
            </div>
            <Row>
                <Col span="11">
                    <Card>
                        <div slot="title">
                            <Button type="success" ghost v-on:click="addMenu(0,'0','顶级菜单')">添加顶级菜单</Button>
                            &nbsp;&nbsp;
                            <Button type="info" ghost v-on:click="addMenu(admin_menu_id,admin_menu_level_path,admin_menu_title)" :disabled="admin_menu_id == 0">添加子级菜单</Button>
                            &nbsp;&nbsp;
                            <Button type="error" ghost @click="del()"><Icon type="ios-trash-outline" /> 批量删除</Button>
                        </div>
                        <p>
                            <Tree :data="menuData" show-checkbox multiple ref="tree"></Tree>
                        </p>
                    </Card>
                </Col>
                <Col span="11" offset="2">
                    <Card dis-hover>
                        <div class="demo-avatar" slot="title">
                            <Avatar style="background-color: #2d8cf0" icon="ios-apps" size="small"/>
                             &nbsp;&nbsp;编辑菜单：菜单权限管理
                        </div>
                        <Alert v-if="admin_menu_id == 0" style="background-color:#f0faff;border:1px solid #abdcff">从菜单列表选择一项后，进行编辑</Alert>
                        <div v-show="admin_menu_id != 0">
                            <MenuEdit ref="MenuEdit" @query="query"></MenuEdit>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Card>
        <MenuAdd ref="MenuAdd"></MenuAdd>
    </div>
</template>
<style>
    .ivu-checkbox-inner{
        width: 16px;
        height: 16px;
    }
    .ivu-tree-title{
        font-size: 16px;
    }
</style>
<script>
import MenuEdit from './templates/MenuEdit.vue'
import MenuAdd from './templates/MenuAdd.vue'
import { menuTree, getMenuId } from '@/libs/util'

export default {
  name: 'Menu',
  components: {
    MenuEdit,
    MenuAdd
  },
  data () {
    return {
      admin_menu_id: 0,
      admin_menu_level_path: '0',
      admin_menu_title: '顶级菜单',
      menuData: []
    }
  },
  methods: {
    async addMenu (pid, admin_menu_level_path, admin_menu_title) {
      this.$refs.MenuAdd.modelShow(pid, admin_menu_level_path, admin_menu_title)
    },
    // 菜单点击回调函数
    treeClickBack (admin_menu_id, admin_menu_level_path, admin_menu_title) {
      this.admin_menu_id = admin_menu_id
      this.admin_menu_level_path = admin_menu_level_path
      this.admin_menu_title = admin_menu_title
      this.$refs.MenuEdit.setMenuInfo(admin_menu_id)
    },
    async query () {
      // 获取所有菜单
      let menuData = await this.post('admin/AdminMenu/menuList', { get_all: true })
      if (menuData.data.code !== 200) {
        this.$Message.error(menuData.data.msg)
      } else {
        this.menuData = menuTree(menuData.data.data.tree, [], true, this.treeClickBack)
      }
    },
    del () {
      // 删除
      let getCheckedNodes = this.$refs.tree.getCheckedNodes()
      if (getCheckedNodes.length <= 0) {
        this.$Message.error('请选择数据！')
        return
      }
      this.$Modal.confirm({
        title: '删除吗？',
        content: '<h2>确认删除？</h2>',
        onOk: async () => {
          let admin_menu_checked_id = getMenuId(getCheckedNodes)
          let result = await this.post('admin/AdminMenu/menuDel', { ids: admin_menu_checked_id })
          if (result.data.code === 200) {
            this.query()
            this.$Message.success(result.data.msg)
          } else {
            this.$Message.error(result.data.msg)
          }
        }
      })
    }
  },
  async beforeMount () {
    this.query()
  }
}
</script>
