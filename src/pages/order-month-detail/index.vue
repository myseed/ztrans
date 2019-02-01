<template>
  <d2-container type="full" class="page">
    <template>
      <div class="header">基本信息</div>
      <el-form :inline="true" size="mini" label-width="110px">
        <el-form-item label="整月派单任务号" >
          <el-input v-model="order.series"></el-input>
        </el-form-item>
        <el-form-item label="当然任务状态" >
          <el-input v-model="order.taskTypeName"></el-input>
        </el-form-item>
        <el-form-item label="线路名称" >
          <el-input v-model="order.routerAlisa"></el-input>
        </el-form-item>
        <el-form-item label="需要搬卸" >
          <el-input v-model="order.wetherTakeover"></el-input>
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

      </el-form>
      <div class="header">客户和下单人</div>
      <el-form :inline="true" size="mini" label-width="110px">
        <el-form-item label="客户名称" >
          <el-input v-model="order.masterCustomerName"></el-input>
        </el-form-item>
        <el-form-item label="整月派单人名字" >
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
      </el-form>
      <div class="header">运输信息</div>
      <el-form :inline="true" size="mini" label-width="110px">
        <el-form-item label="车牌号" >
          <el-input v-model="order.carPlateNumber"></el-input>
        </el-form-item>
        <el-form-item label="司机名字" >
          <el-input v-model="order.driverName"></el-input>
        </el-form-item>
      </el-form>
      <el-form :inline="true" size="mini" label-width="110px">
        <el-form-item label="货物描述" >
          <el-input type="textarea" v-model="order.goodsRemark"  :rows="7"></el-input>
        </el-form-item>

        <el-form-item label="下单人备注" >
          <el-input type="textarea" v-model="order.remark"   :rows="7"></el-input>
        </el-form-item>
        <div class="header">派单时间</div>
        <div class="btn-groups">
          <div v-for="(item,index) in btn_group" :class="{'btn-active':item.show}" >{{item.value}}</div>
        </div>
      </el-form>
    </template>
  </d2-container>
</template>

<script>
import {getAllMonthOrderDetail} from '@/api/order';
import util from '@/libs/util';
export default {
  data() {
    return {
      btn_group:[],
      customerNumId: util.cookies.get('__user__customernumid'),
      ao:'',
      series: '',
      order: {
        series: '',
        routerAlisa: '',
        carTypeName: '',
        carSizeName: '',
        carWeightName: '',
        wetherTakeover: '',
        masterCustomerName: '',
        createOrderName: '',
        goodsRemark: '',
        remark: '',
        sendAddressDetail: '',
        sendGoodsPersonName: '',
        sendGoodsPersonMobile: '',
        receiveGoodsPersonMobile: '',
        receiveGoodsPersonName: '',
        receiveAddressDetail: '',
        carPlateNumber: '',
        driverName: '',
        taskTypeName:''
      },
    };
  },

  created() {
    this.series = this.$route.query.series;
    if (!this.series == '') {
      this.getOrder();
      // this._getOrderDetailBySeries({
      //   customerNumId: this.customerNumId,
      //   series: this.orderId,
      // });
    }
  },
  watch: {},
  methods: {
    getOrder() {
      this._getAllMonthOrderDetail({
        customerNumId: this.customerNumId,
        series: this.series,
      });
    },
    _getAllMonthOrderDetail(params) {
        getAllMonthOrderDetail(params)
        .then(res => {
          if (res.code === 0) {
            this.order.series = res.series;
            this.order.routerAlisa = res.routerAlia;
            this.order.carTypeName = res.carTypeName;
            this.order.carSizeName = res.carSizeName;
            this.order.wetherTakeover = res.wetherTakeover;
            this.order.masterCustomerName = res.customerName;
            this.order.createOrderName = res.createOrderName;
            this.order.goodsRemark = res.goodsRemark;
            this.order.remark = res.remark;
            this.order.sendAddressDetail = res.sendAddressDetail;
            this.order.sendGoodsPersonName = res.sendGoodsPersonName;
            this.order.sendGoodsPersonMobile = res.sendGoodsPersonMobile;
            this.order.receiveGoodsPersonMobile = res.receiveGoodsPersonMobile;
            this.order.receiveGoodsPersonName = res.receiveGoodsPersonName;
            this.order.receiveAddressDetail = res.receiveAddressDetail;
            this.order.carPlateNumber = res.carPlateNumber;
            this.order.driverName = res.driverName;
            this.order.carWeightName = res.carWeightName;
            this.order.taskTypeName = res.taskTypeName;
              this.btn_group=[];
              for (var i=0;i<res.appointmentDates.length;i++)
              {
                  this.btn_group.push({value:res.appointmentDates[i],show:true});
              }
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
  .btn-groups{
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    justify-content: space-around;
  }
  .btn-groups>div{
    width: 15%;
    flex-grow: 0;
    flex-shrink: 0;
    padding: 10px;
    margin-top: 10px;
    text-align: center;
    border-radius: 5px;
    cursor: pointer;
    background: #eee;
    color: #000;
  }
  .btn-groups>div.btn-active{
    background: #409EFF;
    color: #fff;
  }
</style>
