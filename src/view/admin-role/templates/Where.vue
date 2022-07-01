<template>
    <Card :style="{boxShadow: '0px 1px 1px 1px rgba(0,0,0,.1)',top:'10px',border:'none',borderRadius:'0'}">
        <Form ref="form" :model="queryForm" :label-width="100" label-position="right">
            <Row>
                <Col span="6" style="min-width:280px;">
                    <FormItem label="角色代码" class="formitem">
                        <Input type="text" v-model.trim="queryForm.admin_role_code" placeholder="角色代码" />
                    </FormItem>
                </Col>
                <Col span="6" style="min-width:280px;">
                    <FormItem label="角色名字" class="formitem">
                        <Input type="text" v-model.trim="queryForm.admin_role_name" placeholder="角色名字" />
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
      this.$parent.query(page)
    },
    add () {
      // 新增
      this.$parent.add()
    }
  }
}
</script>
