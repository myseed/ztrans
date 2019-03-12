<template>
  <d2-container type="full" class="page">
    <template>
      <div class="header">基本信息</div>
      <el-form :inline="true" size="mini" label-width="110px">
        <el-form-item label="订单号" >
          <el-input v-model="order.series"></el-input>
        </el-form-item>
        <el-form-item label="线路名称" >
          <el-input v-model="order.routerAlisa"></el-input>
        </el-form-item>
        <el-form-item label="需要搬卸" >
          <el-input v-model="order.wetherTakeover"></el-input>
        </el-form-item>
        <el-form-item label="下单时间" >
          <el-input v-model="order.createOrderTime"></el-input>
        </el-form-item>
        <el-form-item label="用车时间" >
          <el-input v-model="order.appointmentDate"></el-input>
        </el-form-item>
        <el-form-item label="订单状态" >
          <el-input v-model="order.deliverStatus"></el-input>
        </el-form-item>
        <el-form-item label="订单对账状态" >
          <el-input v-model="order.orderBalanceStatus"></el-input>
        </el-form-item>
        <el-form-item label="订单类型" >
          <el-input v-model="order.orderType"></el-input>
        </el-form-item>
        <el-form-item label="订单车辆车型" >
          <el-input v-model="order.carTypeName"></el-input>
        </el-form-item>
        <el-form-item label="订单车辆尺寸" >
          <el-input v-model="order.carSizeName"></el-input>
        </el-form-item>
        <el-form-item label="订单车辆吨位" >
          <el-input v-model="order.carWeightName"></el-input>
        </el-form-item>
        <el-form-item  v-if='showCustomer'>
          <el-button
                  type="primary"
                  @click="getAllMonthDetail">
            查看整月任务明细
          </el-button>
        </el-form-item>

      </el-form>
      <div class="header">客户和销售信息</div>
      <el-form :inline="true" size="mini" label-width="110px">
        <el-form-item label="客户名称" >
          <el-input v-model="order.masterCustomerName"></el-input>
        </el-form-item>
        <el-form-item label="下单人名字" >
          <el-input v-model="order.createOrderName"></el-input>
        </el-form-item>

      </el-form>
      <div class="header">起始地信息</div>
      <el-form :inline="true" size="mini" label-width="110px">
          <el-form-item label="发货人" >
              <el-input v-model="order.sendGoodsPersonName"></el-input>
          </el-form-item>
          <el-form-item label="发货人联系电话" >
              <el-input v-model="order.sendGoodsPersonMobile"></el-input>
          </el-form-item>
        <el-form-item label="发货地址详情" >
          <el-input v-model="order.sendAddressDetail" style="width: 400px;"></el-input>
        </el-form-item>
        <el-form-item label="线路起始地" >
          <el-input v-model="order.routerSource" style="width: 220px;"></el-input>
        </el-form-item>
      </el-form>
      <div class="header">目的地地信息</div>
      <el-form :inline="true" size="mini" label-width="110px">
          <el-form-item label="收货人" >
              <el-input v-model="order.receiveGoodsPersonName"></el-input>
          </el-form-item>
        <el-form-item label="收货人联系电话" >
          <el-input v-model="order.receiveGoodsPersonMobile"></el-input>
        </el-form-item>
        <el-form-item label="收货地址详情"  >
          <el-input v-model="order.receiveAddressDetail" style="width: 400px;"></el-input>
        </el-form-item>
        <el-form-item label="线路目的地">
          <el-input v-model="order.routerDestination"  style="width: 220px;"></el-input>
        </el-form-item>
      </el-form>
      <div class="header">线路报价信息</div>
      <el-form :inline="true" size="mini" label-width="110px">
        <el-form-item label="订单报价" >
          <el-input v-model="order.orderMoney"></el-input>
        </el-form-item>
        <el-form-item label="司机额外费用" >
          <el-input v-model="order.driverAddFee"></el-input>
        </el-form-item>
      </el-form>
      <div class="header">运输信息</div>
      <el-form :inline="true" size="mini" label-width="110px">
        <el-form-item label="车牌号" >
          <el-input v-model="order.carPlateNumber"></el-input>
        </el-form-item>
        <el-form-item label="司机名字" >
          <el-input v-model="order.driverName"></el-input>
        </el-form-item>
        <el-form-item label="司机电话" >
          <el-input v-model="order.driverPhone"></el-input>
        </el-form-item>
        <el-form-item label="司机身份证" >
          <el-input v-model="order.driverIdentityId"></el-input>
        </el-form-item>
        <el-form-item label="司机车辆尺寸" >
          <el-input v-model="order.driverCarSizeRealName"></el-input>
        </el-form-item>
        <el-form-item label="司机车辆车型" >
          <el-input v-model="order.driverCarTypeRealName"></el-input>
        </el-form-item>
        <el-form-item label="司机车辆品牌" >
          <el-input v-model="order.driverCarBrandRealName"></el-input>
        </el-form-item>
        <el-form-item label="司机车辆吨位" >
          <el-input v-model="order.driverCarWeightRealName"></el-input>
        </el-form-item>
          <el-form-item label="经停站点" >
              <el-input v-model="order.routerStations"></el-input>
          </el-form-item>
          <el-form-item label="司机接单时间" >
              <el-input v-model="order.driverReceiveTime"></el-input>
          </el-form-item>
          <el-form-item label="司机靠车时间" >
              <el-input v-model="order.driverGetgoodsTime"></el-input>
          </el-form-item>
          <el-form-item label="司机发车时间" >
              <el-input v-model="order.driverStartTime"></el-input>
          </el-form-item>
          <el-form-item label="司机到达时间" >
              <el-input v-model="order.driverArrTime"></el-input>
          </el-form-item>
          <el-form-item label="任务完成时间" >
              <el-input v-model="order.driverEndTime"></el-input>
          </el-form-item>
        <!--<el-form-item label="司机交接单" >-->
          <!--<el-input v-model="order.driverReceitp"></el-input>-->
        <!--</el-form-item>-->

      </el-form>
      <el-form :inline="true" size="mini" label-width="110px">
        <el-form-item label="货物描述" >
          <el-input type="textarea" v-model="order.goodsRemark"  :rows="7"></el-input>
        </el-form-item>

        <el-form-item label="司机备注" >
          <el-input type="textarea" v-model="order.driverRemark"  :rows="7"></el-input>
        </el-form-item>
        <el-form-item label="下单人备注" >
          <el-input type="textarea" v-model="order.remark"   :rows="7"></el-input>
        </el-form-item>
        <el-form-item label="订单废弃理由" >
          <el-input type="textarea" v-model="order.deleteReason"   :rows="7" ></el-input>
        </el-form-item>
            <p>交接单</p>
            <el-col class="tx-center" v-if="order.driverReceitp!==''">
              <img  :src="order.driverReceitp"  alt="司机交接单" class="cert-pic">
            </el-col>
      </el-form>
    </template>
  </d2-container>
</template>

<script>
import {getOrderDetailBySeries} from '@/api/order';
import util from '@/libs/util';
export default {
  data() {
    return {
      customerNumId: util.cookies.get('__user__customernumid'),
      franchiseeSeries:util.cookies.get('__user__franchiseeSeries'),
      ao:'',
      orderId: '',
      commondOrderStatus: '',
      allmonthOrderTaskSeries: '',
      showCustomer:true,
      order: {
        series: '',
        routerAlisa: '',
        carTypeName: '',
        carSizeName: '',
        carWeightName: '',
        wetherTakeover: '',
        appointmentDate: '',
        masterCustomerName: '',
        createOrderName: '',
        routerStations: [],
        goodsRemark: '',
        remark: '',
        createOrderTime: '',
        sendAddressDetail: '',
        sendGoodsPersonName: '',
        sendGoodsPersonMobile: '',
        receiveGoodsPersonMobile: '',
        receiveGoodsPersonName: '',
        receiveAddressDetail: '',
        carPlateNumber: '',
        driverName: '',
        driverPhone: '',
        driverIdentityId: '',
        orderMoney: '',
        driverMoney: '',
        deliverStatus: '',
        orderBalanceStatus: '',
        orderType: '',
        driverRemark: '',
        driverReceitp: '',
        driverAddFee: '',
        driverCarSizeRealName: '',
        driverCarTypeRealName: '',
        driverCarBrandRealName: '',
        driverCarWeightRealName: '',
        routerSource: '',
        routerDestination: '',
        driverReceiveTime: '',
        driverGetgoodsTime: '',
        driverStartTime: '',
        driverArrTime: '',
        driverEndTime: '',
        deleteReason:''
      },
    };
  },

  created() {
    this.orderId = this.$route.query.orderId;
    this.commondOrderStatus=this.$route.query.commondOrderStatus;
    this.allmonthOrderTaskSeries=this.$route.query.allmonthOrderTaskSeries;
    if(this.commondOrderStatus=='0'){
        this.showCustomer=false;
    }
    if (!this.orderId == '') {
      this.getOrder();
      // this._getOrderDetailBySeries({
      //   customerNumId: this.customerNumId,
      //   series: this.orderId,
      // });
    }
  },
  watch: {},
  methods: {
    getAllMonthDetail(){
        this.$router.push({
            path: '/order-month-detail',
            query: {series: this.allmonthOrderTaskSeries},
        });
    },
    getOrder() {
      this._getOrderDetailBySeries({
        customerNumId: this.customerNumId,
        series: this.orderId,
        franchiseeSeries:this.franchiseeSeries
      });
    },
    _getOrderDetailBySeries(params) {
      getOrderDetailBySeries(params)
        .then(res => {
          if (res.code === 0) {
            this.order.series = res.series;
            this.order.routerAlisa = res.routerAlisa;
            this.order.carTypeName = res.carTypeName;
            this.order.carSizeName = res.carSizeName;
            this.order.wetherTakeover = res.wetherTakeover;
            this.order.appointmentDate = res.appointmentDate;
            this.order.masterCustomerName = res.masterCustomerName;
            this.order.createOrderName = res.createOrderName;
            this.order.routerStations = res.routerStations;
            this.order.goodsRemark = res.goodsRemark;
            this.order.remark = res.remark;
            this.order.createOrderTime = res.createOrderTime;
            this.order.sendAddressDetail = res.sendAddressDetail;
            this.order.sendGoodsPersonName = res.sendGoodsPersonName;
            this.order.sendGoodsPersonMobile = res.sendGoodsPersonMobile;
            this.order.receiveGoodsPersonMobile = res.receiveGoodsPersonMobile;
            this.order.receiveGoodsPersonName = res.receiveGoodsPersonName;
            this.order.receiveAddressDetail = res.receiveAddressDetail;
            this.order.carPlateNumber = res.carPlateNumber;
            this.order.driverName = res.driverName;
            this.order.driverPhone = res.driverPhone;
            this.order.driverIdentityId = res.driverIdentityId;
            this.order.orderMoney = res.orderMoney;
            this.order.driverMoney = res.driverMoney;
            this.order.deliverStatus = res.deliverStatus;
            this.order.orderBalanceStatus = res.orderBalanceStatus;
            this.order.orderType = res.orderType;
            this.order.driverRemark = res.driverRemark;
            this.order.driverReceitp = res.driverReceitp;
            this.order.driverAddFee = res.driverAddFee;
            this.order.driverCarSizeRealName = res.driverCarSizeRealName;
            this.order.driverCarTypeRealName = res.driverCarTypeRealName;
            this.order.driverCarBrandRealName = res.driverCarBrandRealName;
            this.order.driverCarWeightRealName = res.driverCarWeightRealName;
            this.order.routerSource = res.routerSource;
            this.order.routerDestination = res.routerDestination;
            this.order.initPrice = res.initPrice;
            this.order.driverReceiveTime = res.driverReceiveTime;
            this.order.driverGetgoodsTime = res.driverGetgoodsTime;
            this.order.driverStartTime = res.driverStartTime;
            this.order.driverArrTime = res.driverArrTime;
            this.order.driverEndTime = res.driverEndTime;
            this.order.deleteReason = res.deleteReason;
            this.order.carWeightName = res.carWeightName;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="scss">
  .header {
    padding: 0 10px;
    margin-bottom: 20px;
    border-left: #2f74ff 2px solid;
    background: #f6f6f6;
    font-size: 16px;
  }
</style>
