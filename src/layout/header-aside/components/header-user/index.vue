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
import { getUnDealOrderCount,getAllUncheckErrOrder } from '@/api/order'
import { getAllUnDealCompeteOrder } from '@/api/competeorder'
import { getAllUnDealCatchOrder } from '@/api/catchorder'
import { getAllUncheck } from '@/api/truck'
export default {
  data () {
    return {
      customerNumId: util.cookies.get('__user__customernumid'),
      franchiseeSeries:util.cookies.get('__user__franchiseeSeries'),
      timr: null,
      timrDriver: null,
      timrErrorOrder: null,
      timrUndealCompeteOrder: null,
      timrUndealCatchOrder: null
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
    this.timrDriver = setInterval(() => {
      this._getAllUncheck({
       customerNumId: this.customerNumId,
       franchiseeSeries: this.franchiseeSeries
      })
   }, 1000 * 60 * 5)
    this.timrErrorOrder = setInterval(() => {
      this._getAllUncheckErrOrder({
       customerNumId: this.customerNumId,
       franchiseeSeries: this.franchiseeSeries
      })
   }, 1000 * 60 * 5)
    this.timrUndealCompeteOrder = setInterval(() => {
      this._getAllUnDealCompeteOrder({
       customerNumId: this.customerNumId,
       franchiseeSeries: this.franchiseeSeries
      })
   }, 1000 * 60  * 5)
    this.timrUndealCatchOrder = setInterval(() => {
      this._getAllUnDealCatchOrder({
       customerNumId: this.customerNumId,
       franchiseeSeries: this.franchiseeSeries
      })
   }, 1000 * 60 * 5)
  },
  destroyed () {
    this.timr = null
    this.timrDriver = null
    this.timrErrorOrder = null
    this.timrUndealCompeteOrder = null
    this.timrUndealCatchOrder = null

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
    },
      _getAllUncheck (params) {
          getAllUncheck(params).then(res => {
              if (res.code === 0) {
                  if (res.count > 0) {
                      this.$message({
                          message: `现在有${res.count}位司机等待审核!`,
                          type: 'warning'
                      })
                  }
              }
          }).catch(err => {
              console.log(err)
          })
      },
      _getAllUncheckErrOrder (params) {
          getAllUncheckErrOrder(params).then(res => {
              if (res.code === 0) {
                  if (res.total > 0) {
                      this.$message({
                          message: `现在有${res.total}笔司机报备订单需要审核!`,
                          type: 'warning'
                      })
                  }
              }
          }).catch(err => {
              console.log(err)
          })
      },
      _getAllUnDealCompeteOrder (params) {
          getAllUnDealCompeteOrder(params).then(res => {
              if (res.code === 0) {
                  if (res.count > 0) {
                      this.$message({
                          message: `现在有${res.count}笔竞标任务需要开标!`,
                          type: 'warning'
                      })
                  }
              }
          }).catch(err => {
              console.log(err)
          })
      },
      _getAllUnDealCatchOrder (params) {
          getAllUnDealCatchOrder(params).then(res => {
              if (res.code === 0) {
                  if (res.count > 0) {
                      this.$message({
                          message: `现在有${res.count}笔竞标抢单任务需要开标!`,
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
