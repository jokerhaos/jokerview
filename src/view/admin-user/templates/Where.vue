<template>
    <Card :style="{boxShadow: '0px 1px 1px 1px rgba(0,0,0,.1)',top:'10px',border:'none',borderRadius:'0'}">
        <Form ref="form" :model="queryForm" :label-width="100" label-position="right">
            <Row>
                <Col span="6" style="min-width:280px;">
                    <FormItem label="用户账号" class="formitem">
                        <Input type="text" v-model.trim="queryForm.admin_user_number" placeholder="用户账号" />
                    </FormItem>
                </Col>
                <Col span="6" style="min-width:280px;">
                    <FormItem label="用户名字" class="formitem">
                        <Input type="text" v-model.trim="queryForm.admin_user_name" placeholder="用户名字" />
                    </FormItem>
                </Col>
                <Col span="6" style="min-width:280px;">
                    <FormItem label="用户电话" class="formitem">
                        <Input type="text" v-model.trim="queryForm.admin_user_phone" placeholder="用户电话" />
                    </FormItem>
                </Col>
                <Col span="6" style="min-width:280px;">
                    <FormItem label="用户电话" class="formitem">
                        <Input type="text" v-model.trim="queryForm.admin_user_email" placeholder="用户邮箱" />
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <FormItem class="formitem-button">
                    <Button :style="{marginRight:'21px'}" type="primary" @click="query()">查询</Button>
                    <Button type="primary" @click="add()">新增</Button>
                </FormItem>
            </Row>
        </Form>
    </Card>
</template>

<script>

export default{
  props: ['queryForm'],
  data: () => {
    return {}
  },
  methods: {
    // 查询
    query (page) {
      this.$parent.query()
    },
    add () {
      // 新增
      this.$parent.add()
    }
  }
}
</script>
