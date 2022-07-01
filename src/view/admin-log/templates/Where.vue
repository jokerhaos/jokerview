<template>
    <Card :style="{boxShadow: '0px 1px 1px 1px rgba(0,0,0,.1)',top:'10px',border:'none',borderRadius:'0'}">
        <Form ref="form" :model="queryForm" :label-width="100" label-position="right">
            <Row>
                <Col span="6" style="min-width:280px;">
                    <FormItem label="用户ID" class="formitem">
                        <Input type="text" v-model.trim="queryForm.admin_user_id" placeholder="用户ID" />
                    </FormItem>
                </Col>
                <Col span="6" style="min-width:280px;">
                    <FormItem label="访问路径" class="formitem">
                        <Input type="text" v-model.trim="queryForm.log_visit_path" placeholder="访问路径" />
                    </FormItem>
                </Col>
                <Col span="6" style="min-width:280px;">
                    <FormItem label="访问类型" class="formitem">
                        <Select v-model="queryForm.log_type" style="width:200px" clearable>
                            <Option v-for="(item, index) in mapping.log_type" :value="index" :key="index">{{ item }}</Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col span="6" style="min-width:280px;">
                    <FormItem label="请求类型" class="formitem">
                        <Input type="text" v-model.trim="queryForm.request_method" placeholder="请求类型" />
                    </FormItem>
                </Col>
                <Col span="6" style="min-width:280px;">
                    <FormItem label="请求IP" class="formitem">
                        <Input type="text" v-model.trim="queryForm.request_ip" placeholder="请求IP" />
                    </FormItem>
                </Col>
                <Col span="12" style="min-width:300px;">
                    <FormItem label="创建时间" class="formitem">
                        <DatePicker type="datetimerange" style="width: 300px"
                        @on-change="updateTime"
                        :value="[
                            queryForm.create_time_start,
                            queryForm.create_time_end
                        ]"
                        >
                        </DatePicker>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <FormItem class="formitem-button">
                    <Button :style="{marginRight:'21px'}" type="primary" @click="query()">查询</Button>
                </FormItem>
            </Row>
        </Form>
    </Card>
</template>

<script>
import mapping from '@/libs/mapping.js'

export default{
  props: ['queryForm'],
  data: () => {
    return {
      mapping: mapping
    }
  },
  methods: {
    // 查询
    query () {
      this.$parent.query()
    },
    updateTime (date) {
      this.$emit('updateTime', date)
    }
  }
}
</script>
