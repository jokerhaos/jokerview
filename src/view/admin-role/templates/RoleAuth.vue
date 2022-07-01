<template>
    <Modal v-model="model" :title="title" @on-cancel="cancel" width="700px" @on-ok="handleSubmit">
        <div style="text-align:center;">
            <Transfer
                :data="authData"
                :target-keys="authRightKey"
                :list-style="listStyle"
                filterable
                @on-change="handleChange">
            </Transfer>
        </div>
    </Modal>
</template>
<script>
import { authTranAll } from '@/libs/util'
export default {
  data () {
    return {
      model: false,
      title: '角色权限分配',
      authData: [],
      admin_role_id: '',
      authRightKey: [],
      is_admin: false,
      listStyle: {
        width: '250px',
        height: '560px',
        textAlign: 'left'
      }
    }
  },
  methods: {
    async modelShow (data) {
      this.model = true
      this.admin_role_id = data.admin_role_id
      // 获取权限列表
      let authList = await this.post('admin/AdminAuth/authList', { get_all: true })
      if (authList.data.code !== 200) {
        this.$Message.error(authList.data.msg)
      } else {
        // 映射authData
        this.authData = authTranAll(authList.data.data.list)
        // 映射authRighKey
        this.authRightKey = data.admin_auth_id != null && data.admin_auth_id !== '' && data.admin_auth_id !== undefined ? data.admin_auth_id.split(',') : []
      }
    },
    cancel () {
      this.model = false
    },
    handleChange (authRightKey) {
      this.authRightKey = authRightKey
    },
    async handleSubmit () {
      let result = await this.post('admin/AdminRole/roleAuth', {
        admin_role_id: this.admin_role_id,
        admin_auth_id: this.authRightKey.join(',')
      })
      if (result.data.code !== 200) {
        this.$Message.error(result.data.msg)
      } else {
        this.$Message.success(result.data.msg)
      }
      this.model = false
      this.$parent.query()
    }
  }
}
</script>
