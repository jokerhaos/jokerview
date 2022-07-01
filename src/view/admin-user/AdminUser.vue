<template>
    <div>
        <div>
            <Where :queryForm="queryForm"></Where>
        </div>

        <Content :style="{marginTop:'25px',boxShadow: '0px 1px 1px 1px rgba(0,0,0,.1)',border:'none',borderRadius:'0',paddingBottom: '10px'}">
            <Row>
                <Table ref="table" stripe :loading="loading" v-if="tableData&&tableData.length>0" border
                    :columns="columns" :data="tableData"></Table>
                <Card v-else>
                    <div style="text-align:center">
                        <h3>没有数据</h3>
                    </div>
                </Card>
            </Row>
            <Row :style="{marginLeft:'15px',marginTop:'15px'}">
                <Page v-if="tableData&&tableData.length>0" :total="totalCount" :page-size="pageSize" :current="currentPage" show-total show-elevator show-sizer
                    @on-change="setPage" @on-page-size-change="setLimit"></Page>
            </Row>
        </Content>
        <Model ref="Model"></Model>
        <UserAuth ref="UserAuth"></UserAuth>
        <UserMenu ref="UserMenu"></UserMenu>
    </div>
</template>
<script>
import { mapField } from '@/libs/util.js'
import Where from './templates/Where.vue'
import Model from './templates/Model.vue'
import UserAuth from './templates/UserAuth.vue'
import UserMenu from './templates/UserMenu.vue'

export default {
  name: 'User',
  components: {
    Where,
    Model,
    UserAuth,
    UserMenu
  },
  data () {
    let self = this
    return {
      update: false,
      loading: false, // 标示异步请求
      // 查询条件
      queryForm: {
        admin_user_number: '',
        admin_user_name: '',
        admin_user_phone: '',
        admin_user_email: ''
      },
      // 表头
      columns: [{
        title: 'ID',
        width: 100,
        align: 'center',
        key: 'admin_user_id'
      },
      {
        title: '用户账号',
        width: 150,
        key: 'admin_user_number'
      },
      {
        title: '用户名字',
        key: 'admin_user_name',
        width: 150

      },
      {
        title: '用户电话',
        key: 'admin_user_phone',
        width: 150,
        render: (h, data) => {
          return h('div', '+' + data.row.admin_user_area_code + ' ' + data.row.admin_user_phone)
        }

      },
      {
        title: '用户邮箱',
        key: 'admin_user_email',
        width: 160,
        ellipsis: true
      },
      {
        title: '超级管理员',
        key: 'admin_user_is_admin',
        width: 100,
        render: (h, data) => {
          return h('div', [
            h('i-switch', {
              props: {
                type: 'primary',
                size: 'large',
                value: data.row.admin_user_is_admin === 1 // 控制开关的打开或关闭状态，官网文档属性是value
              },
              scopedSlots: {
                open: function () { return h('span', '是') },
                close: function () { return h('span', '否') }
              },
              on: {
                'on-change': async (value) => { // 触发事件是on-change,用双引号括起来，
                  data.row.admin_user_is_admin = value === true ? 1 : 2
                  // 参数value是回调值，并没有使用到
                  let param = {
                    admin_user_id: data.row.admin_user_id,
                    admin_user_is_admin: value === true ? 1 : 2
                  }
                  try {
                    let result = await self.post(`/admin/AdminUser/userIsAdmin`, param)
                    if (result.data.code !== 200 || result.status !== 200) {
                      data.row.admin_user_is_admin = value === true ? 2 : 1
                      self.$Message.error(result.data.msg)
                    } else {
                      // 还原开关
                      self.$Message.success(result.data.msg)
                    }
                  } catch (error) {
                    data.row.admin_user_is_admin = value === true ? 2 : 1
                    self.$Message.error(error.message)
                  }
                }
              }
            })
          ])
        }

      },
      {
        title: '状态',
        align: 'center',
        key: 'admin_user_status',
        width: 100,
        render: (h, data) => {
          return h('div', [
            h('i-switch', {
              props: {
                type: 'primary',
                size: 'large',
                value: data.row.admin_user_status === 1 // 控制开关的打开或关闭状态，官网文档属性是value
              },
              scopedSlots: {
                open: function () { return h('span', '启动') },
                close: function () { return h('span', '禁用') }
              },
              on: {
                'on-change': async (value) => { // 触发事件是on-change,用双引号括起来，
                  data.row.admin_user_status = value === true ? 1 : 2
                  // 参数value是回调值，并没有使用到
                  let param = {
                    admin_user_id: data.row.admin_user_id,
                    admin_user_status: value === true ? 1 : 2
                  }
                  try {
                    let result = await self.post(`/admin/AdminUser/userStatusUpdate`, param)
                    if (result.data.code !== 200) {
                      // 还原开关
                      data.row.admin_user_status = value === true ? 2 : 1
                      self.$Message.error(result.data.msg)
                    } else {
                      self.$Message.success(result.data.msg)
                    }
                  } catch (error) {
                    // 还原开关
                    data.row.admin_user_status = value === true ? 2 : 1
                    self.$Message.error(error.message)
                  }
                }
              }
            })
          ])
        }
      },
      {
        title: '创建时间',
        key: 'admin_user_create_time',
        align: 'center',
        width: 150
      },
      {
        title: '更新时间',
        align: 'center',
        key: 'admin_user_update_time',
        width: 150
      },
      {
        title: '用户描述',
        align: 'center',
        key: 'admin_user_remark',
        minWidth: 100,
        ellipsis: true
      },
      {
        title: '操作',
        width: 360,
        fixed: 'right',
        render: (h, data) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              domProps: {
                innerHTML: '<i class="ivu-icon ivu-icon-md-menu"></i> 菜单'
              },
              style: {
                margin: '0px 2px 0px 0px'
              },
              on: {
                click: () => {
                  // 调用子组件方法
                  self.$refs.UserMenu.modelShow(data.row)
                }
              }
            }),
            h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              domProps: {
                innerHTML: '<i class="ivu-icon ivu-icon-ios-ribbon"></i> 权限'
              },
              style: {
                margin: '0px 2px 0px 0px'
              },
              on: {
                click: () => {
                  // 调用子组件方法
                  self.$refs.UserAuth.modelShow(data.row)
                }
              }
            }),
            h('Button', {
              props: {
                type: 'warning',
                size: 'small'
              },
              domProps: {
                innerHTML: '<i class="ivu-icon ivu-icon-md-refresh"></i> 重置密码'
              },
              style: {
                margin: '0px 2px 0px 0px'
              },
              on: {
                click: () => {
                  self.$Modal.confirm({
                    title: '确认吗？',
                    content: '<h2>确认重置登陆密码？</h2>',
                    onOk: async () => {
                      let param = {
                        admin_user_id: data.row.admin_user_id
                      }
                      let result = await self.post(`/admin/AdminUser/userNewPwd`, param)
                      if (result.data.code !== 200) {
                        self.$Message.error(result.data.msg)
                      } else {
                        setTimeout(() => {
                          self.$Modal.success({
                            title: '重置成功',
                            content: '新密码：' + result.data.data.newPwd
                          })
                        }, 1000)
                      }
                    }
                  })
                }
              }
            }),
            h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              domProps: {
                innerHTML: '<i class="ivu-icon ivu-icon-ios-nutrition-outline"></i> 修改'
              },
              style: {
                margin: '0px 2px 0px 0px'
              },
              on: {
                click: () => {
                  // 调用子组件方法
                  self.$refs.Model.modelShow(data.row, 'edit')
                }
              }
            }),
            h('Button', {
              props: {
                type: 'error',
                size: 'small'
              },
              style: {
                margin: '0px 2px'
              },
              domProps: {
                innerHTML: '<i class="ivu-icon ivu-icon-ios-trash-outline"></i> 删除'
              },
              on: {
                click: async () => {
                  self.$Modal.confirm({
                    title: '删除吗？',
                    content: '<h2>确认删除？</h2>',
                    onOk: async () => {
                      let param = {
                        admin_user_id: data.row.admin_user_id
                      }
                      let result = await self.post(`/admin/AdminUser/userDel`, param)
                      if (result.data.code !== 200) {
                        self.$Message.error(result.data.msg)
                      } else {
                        self.$Message.success({ content: '删除成功', duration: 3 })
                        self.query()
                      }
                    }
                  })
                }
              }
            })
          ])
        }
      }
      ],
      tableData: [],
      // 分页
      pageSize: 10,
      currentPage: 1,
      totalCount: 0
    }
  },
  methods: {
    async query () {
      this.loading = true
      // 格式化参数
      const resp = await this.post(`/admin/AdminUser/userList`, Object.assign(this.queryForm, {
        limit: this.pageSize,
        page: this.currentPage
      }))
      const datas = resp.data.data
      if (resp.data.code != 200) {
        this.$Message.error(datas.msg)
      } else {
        // 处理映射
        this.tableData = mapField(datas.list, this.columns)
        this.totalCount = datas.count
        this.loading = false
      }
    },
    setPage (page) {
      this.currentPage = page
      this.query()
    },
    setLimit (limit) {
      this.pageSize = limit
      this.query()
    },
    add () {
      // 调用子组件的方法
      this.$refs.Model.modelShow()
    }
  },
  async beforeMount () {
    await this.query(1)
  }

}
</script>
