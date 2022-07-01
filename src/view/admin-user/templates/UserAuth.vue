<template>
    <Modal v-model="model" :title="title" @on-cancel="cancel" width="700px" @on-ok="handleSubmit">
        <div style="text-align:center;">
            <Alert v-if="!is_admin">用户自行分配权限则角色权限失效，使用用户自定义权限</Alert>
            <Alert type="success" v-if="is_admin">你是超级管理员，默认所有权限</Alert>
            <Transfer
                v-if="!is_admin"
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
      title: '用户权限分配',
      authData: [],
      admin_user_id: '',
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
      this.is_admin = data.admin_user_is_admin === 1
      this.admin_user_id = data.admin_user_id
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
      let result = await this.post('admin/AdminUser/userAuth', {
        admin_user_id: this.admin_user_id,
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
