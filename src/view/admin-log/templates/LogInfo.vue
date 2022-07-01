<template>
    <Modal v-model="model" :title="title" width="700px" @on-cancel="cancel">
        <div slot="close"></div>
        <table class="gridtable">
            <tr>
                <th colspan="4">状态码：{{data.response_code}}</th>
            </tr>
            <tr>
                <td>日志id：</td>
                <td>{{data.admin_log_id}}</td>
                <td>用户id：</td>
                <td>{{data.admin_user_id}}</td>
            </tr>
            <tr>
                <td>访问类型：</td>
                <td>{{mapping.log_type[parseInt(data.log_type)]}}</td>
                <td>访问路径：</td>
                <td>{{data.log_visit_path}}</td>
            </tr>
            <tr>
                <td>请求方式：</td>
                <td>{{data.request_method}}</td>
                <td>请求IP：</td>
                <td>{{data.request_ip}}</td>
            </tr>
            <tr>
                <td>请求时间：</td>
                <td>{{data.create_time}}</td>
                <td>更新时间：</td>
                <td>{{data.update_time}}</td>
            </tr>
            <tr>
                <td colspan="4">{{data.request_param}}</td>
            </tr>
            <tr>
                <td colspan="4" align="center">{{data.response_msg}}</td>
            </tr>
        </table>
    </Modal>
</template>

<script>
import './LogInfo.less'
import mapping from '@/libs/mapping.js'
export default{
  data: () => {
    return {
      title: '日志详情',
      model: false,
      data: {},
      mapping: mapping
    }
  },
  methods: {
    modelShow (data) {
      this.data = data
      this.model = true
    },
    cancel () {
      this.model = false
    }
  }
}
</script>
