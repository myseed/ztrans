<template>
  <el-dropdown size="small" class="d2-mr">
    <span class="btn-text">你好 {{info.name}}</span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item @click.native="logOff">
        <d2-icon name="power-off" class="d2-mr-5"/>
        注销
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import util from '@/libs/util';
import { mapState, mapActions } from 'vuex'
import Cookies from 'js-cookie'
import { getUnDealOrderCount } from '@/api/order'
export default {
  data () {
    return {
      customerNumId: util.cookies.get('__user__customernumid'),
      franchiseeSeries:util.cookies.get('__user__franchiseeSeries'),
      timr: null
    }
  },
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ])
  },
  created () {
    this.timr = setInterval(() => {
      this._getUnDealOrderCount({
        customerNumId: this.customerNumId,
        franchiseeSeries: this.franchiseeSeries
      })
    }, 1000 * 60 * 5)
  },
  destroyed () {
    this.timr = null
  },
  methods: {
    ...mapActions('d2admin/account', [
      'logout'
    ]),
    /**
     * @description 登出
     */
    logOff () {
      this.logout({
        vm: this,
        confirm: true
      })
    },
    _getUnDealOrderCount (params) {
      getUnDealOrderCount(params).then(res => {
        if (res.code === 0) {
          if (res.total > 0) {
            this.$message({
              message: `您有${res.total}条订单尚未处理!`,
              type: 'warning'
            })
          }
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
