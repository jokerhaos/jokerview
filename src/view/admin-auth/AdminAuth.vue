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
    </div>
</template>
<script>
import { mapField } from '@/libs/util.js'
import Where from './templates/Where.vue'
import Model from './templates/Model.vue'

export default {
  name: 'Auth',
  components: {
    Where,
    Model
  },
  data () {
    let self = this
    return {
      update: false,
      loading: false, // 标示异步请求
      // 查询条件
      queryForm: {
        admin_auth_name: '',
        admin_auth_path: ''
      },
      // 表头
      columns: [{
        title: 'ID',
        width: 100,
        align: 'center',
        key: 'admin_auth_id'
      },
      {
        title: '权限名字',
        key: 'admin_auth_name',
        width: 200

      },
      {
        title: '权限路径',
        key: 'admin_auth_path',
        width: 200

      },
      {
        title: '创建时间',
        key: 'admin_auth_create_time',
        align: 'center',
        width: 160
      },
      {
        title: '更新时间',
        align: 'center',
        key: 'admin_auth_update_time',
        width: 160
      },
      {
        title: '权限描述',
        align: 'center',
        key: 'admin_auth_desc',
        minWidth: 100,
        ellipsis: true
      },
      {
        title: '操作',
        fixed: 'right',
        width: 160,
        render: (h, data) => {
          return h('div', [
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
                        admin_auth_id: data.row.admin_auth_id
                      }
                      let result = await self.post(`/admin/AdminAuth/authDel`, param)
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
      const resp = await this.post(`/admin/AdminAuth/authList`, Object.assign(this.queryForm, {
        limit: this.pageSize,
        page: this.currentPage
      }))
      const datas = resp.data.data
      if (resp.data.code !== 200) {
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
      this.$refs.Model.modelShow()
    }
  },
  async beforeMount () {
    await this.query()
  }

}
</script>
