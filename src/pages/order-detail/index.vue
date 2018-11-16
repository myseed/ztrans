<template>
  <d2-container type="full" class="page">
    <template>
      <!--<el-form :inline="true" size="large" >-->
        <!--<el-form-item label="订单号" >-->
          <!--<el-input v-model="orderId" placeholder="请输入订单号" style="width:200px"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item style="width:200px">-->
          <!--<el-button type="primary" @click="getOrder()"   icon="el-icon-search">查询订单</el-button>-->
        <!--</el-form-item>-->
      <!--</el-form>-->

      <el-form size="mini" label-width="120px">
        <el-form-item label="订单号" >
          <el-input v-model="order.series" disabled></el-input>
        </el-form-item>
        <el-form-item label="线路别名" >
          <el-input v-model="order.routerAlisa" disabled></el-input>
        </el-form-item>
        <el-form-item label="订单报价" >
          <el-input v-model="order.orderMoney" disabled></el-input>
        </el-form-item>
        <el-form-item label="订单状态" >
          <el-input v-model="order.deliverStatus" disabled></el-input>
        </el-form-item>
        <el-form-item label="订单结算状态" >
          <el-input v-model="order.orderBalanceStatus" disabled></el-input>
        </el-form-item>
        <el-form-item label="订单类型" >
          <el-input v-model="order.orderType" disabled></el-input>
        </el-form-item>
        <el-form-item label="订单车辆车型" >
          <el-input v-model="order.carTypeName" disabled></el-input>
        </el-form-item>
        <el-form-item label="订单车辆尺寸" >
          <el-input v-model="order.carSizeName" disabled></el-input>
        </el-form-item>
        <el-form-item label="需要搬卸" >
          <el-input v-model="order.wetherTakeover" disabled></el-input>
        </el-form-item>
        <el-form-item label="用车时间" >
          <el-input v-model="order.appointmentDate" disabled></el-input>
        </el-form-item>
        <el-form-item label="客户名称" >
          <el-input v-model="order.masterCustomerName" disabled></el-input>
        </el-form-item>
        <el-form-item label="下单人名字" >
          <el-input v-model="order.createOrderName" disabled></el-input>
        </el-form-item>
        <el-form-item label="经停站点" >
          <el-input v-model="order.routerStations" disabled></el-input>
        </el-form-item>

        <el-form-item label="下单时间" >
          <el-input v-model="order.createOrderTime" disabled></el-input>
        </el-form-item>
        <el-form-item label="发货地址详情" >
          <el-input v-model="order.sendAddressDetail" disabled></el-input>
        </el-form-item>
        <el-form-item label="发货人" >
          <el-input v-model="order.sendGoodsPersonName" disabled></el-input>
        </el-form-item>
        <el-form-item label="发货人联系电话" >
          <el-input v-model="order.sendGoodsPersonMobile" disabled></el-input>
        </el-form-item>
        <el-form-item label="收货人联系电话" >
          <el-input v-model="order.receiveGoodsPersonMobile" disabled></el-input>
        </el-form-item>
        <el-form-item label="收货人" >
          <el-input v-model="order.receiveGoodsPersonName" disabled></el-input>
        </el-form-item>
        <el-form-item label="收货地址详情" >
          <el-input v-model="order.receiveAddressDetail" disabled></el-input>
        </el-form-item>
        <el-form-item label="车牌号" >
          <el-input v-model="order.carPlateNumber" disabled></el-input>
        </el-form-item>
        <el-form-item label="司机名字" >
          <el-input v-model="order.driverName" disabled></el-input>
        </el-form-item>
        <el-form-item label="司机电话" >
          <el-input v-model="order.driverPhone" disabled></el-input>
        </el-form-item>
        <el-form-item label="司机身份证" >
          <el-input v-model="order.driverIdentityId" disabled></el-input>
        </el-form-item>
        <el-form-item label="司机交接单" >
          <el-input v-model="order.driverReceitp" disabled></el-input>
        </el-form-item>
        <el-form-item label="司机额外费用" >
          <el-input v-model="order.driverAddFee" disabled></el-input>
        </el-form-item>
        <el-form-item label="司机车辆尺寸" >
          <el-input v-model="order.driverCarSizeRealName" disabled></el-input>
        </el-form-item>
        <el-form-item label="司机车辆车型" >
          <el-input v-model="order.driverCarTypeRealName" disabled></el-input>
        </el-form-item>
        <el-form-item label="司机车辆品牌" >
          <el-input v-model="order.driverCarBrandRealName" disabled></el-input>
        </el-form-item>
        <el-form-item label="司机车辆重量" >
          <el-input v-model="order.driverCarWeightRealName" disabled></el-input>
        </el-form-item>
        <el-form-item label="线路起始地" >
          <el-input v-model="order.routerSource" disabled></el-input>
        </el-form-item>
        <el-form-item label="线路目的地">
          <el-input v-model="order.routerDestination" disabled></el-input>
        </el-form-item>
        <el-form-item label="货物描述" >
          <el-input type="textarea" v-model="order.goodsRemark"  :rows="7" disabled></el-input>
        </el-form-item>
        <el-form-item label="下单人备注" >
          <el-input type="textarea" v-model="order.remark"   :rows="7" disabled></el-input>
        </el-form-item>
        <el-form-item label="司机备注" >
          <el-input type="textarea" v-model="order.driverRemark"  :rows="7" disabled></el-input>
        </el-form-item>
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
      orderId: '',
      order: {
        series: '',
        routerAlisa: '',
        carTypeName: '',
        carSizeName: '',
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
      },
    };
  },

  created() {
    this.orderId = this.$route.query.orderId;
    if (!this.orderId == '') {
      this.getOrder();
      this._getOrderDetailBySeries({
        customerNumId: this.customerNumId,
        series: this.orderId,
      });
    }
  },
  watch: {},
  methods: {
    getOrder() {
      this._getOrderDetailBySeries({
        customerNumId: this.customerNumId,
        series: this.orderId,
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
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
  },
};
</script>
