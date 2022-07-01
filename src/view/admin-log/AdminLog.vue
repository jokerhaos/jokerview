<template>
    <div>
        <div>
            <Where :queryForm="queryForm" @updateTime="updateTime"></Where>
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
        <LogInfo ref="LogInfo"></LogInfo>
    </div>
</template>
<script>
import mapping from '@/libs/mapping.js'
import { mapField } from '@/libs/util.js'
import Where from './templates/Where.vue'
import LogInfo from './templates/LogInfo.vue'
import moment from 'moment'

export default {
  name: 'Log',
  components: {
    Where,
    LogInfo
  },
  data () {
    let self = this
    return {
      update: false,
      loading: false, // 标示异步请求
      // 查询条件
      queryForm: {
        admin_user_id: '',
        log_visit_path: '',
        log_type: '',
        request_ip: '',
        request_method: '',
        create_time_start: moment().format('YYYY-MM-DD') + ' 00:00:00',
        create_time_end: moment().format('YYYY-MM-DD') + ' 23:59:59'
      },
      // 表头
      columns: [{
        title: '用户ID',
        width: 100,
        align: 'center',
        key: 'admin_user_id'
      },
      {
        title: '访问路径',
        key: 'log_visit_path',
        width: 200

      },
      {
        title: '访问类型',
        key: 'log_type',
        width: 90,
        render: (h, data) => {
          return h('div', mapping.log_type[parseInt(data.row.log_type)])
        }
      },
      {
        title: '请求方式',
        key: 'request_method',
        width: 90

      },
      {
        title: '请求IP',
        key: 'request_ip',
        width: 90

      },
      {
        title: '状态码',
        key: 'response_code',
        width: 90

      },
      {
        title: '创建时间',
        key: 'create_time',
        align: 'center',
        width: 160
      },
      {
        title: '更新时间',
        align: 'center',
        key: 'update_time',
        width: 160
      },
      {
        title: '返回描述',
        align: 'center',
        key: 'response_msg',
        minWidth: 100,
        ellipsis: true
      },
      {
        title: '操作',
        // fixed: 'right',
        width: 90,
        render: (h, data) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              domProps: {
                innerHTML: '<i class="ivu-icon ivu-icon-md-information"></i> 详情'
              },
              style: {
                margin: '0px 2px 0px 0px'
              },
              on: {
                click: () => {
                  // 调用子组件方法
                  self.$refs.LogInfo.modelShow(data.row)
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
      const resp = await this.post(`/admin/AdminLog/logList`, Object.assign(this.queryForm, {
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
    },
    updateTime (date) {
      this.queryForm.create_time_start = date[0]
      this.queryForm.create_time_end = date[1]
    }
  },
  async beforeMount () {
    await this.query()
  }

}
</script>
