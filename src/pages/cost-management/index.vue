<template>
  <d2-container>
    <page-header
      slot="header"
      @submit="handleSubmit"
      @downLoadExcel="downLoadExcel"
      @downLoadPriceExcel="downLoadPriceExcel"
      @calculate="calculate"
      ref="header"/>
    <page-main
      :table-data="table"
      :loading="loading"
      @orderInfos="orderInfoss"
      @updatePrice="updatePrice"/>
    <page-footer
      slot="footer"
      :current="page.current"
      :size="page.size"
      :total="page.total"
      @change="handlePaginationChange"/>
    <el-dialog title="修改报价" :visible.sync="updatePriceDialog">
      <el-form  label-width="100px" :model="updatePriceModel"  size="mini">
        <el-form-item label="订单号">
          <el-input v-model="updatePriceModel.series" disabled></el-input>
        </el-form-item>
        <el-form-item label="线路名字">
          <el-input v-model="updatePriceModel.routerAlia" disabled></el-input>
        </el-form-item>
        <el-form-item label="客户姓名">
          <el-input v-model="updatePriceModel.customerName" disabled></el-input>
        </el-form-item>
        <el-form-item label="司机姓名">
          <el-input v-model="updatePriceModel.driverName" disabled></el-input>
        </el-form-item>
        <el-form-item label="司机车牌">
          <el-input v-model="updatePriceModel.carPlateNumber" disabled></el-input>
        </el-form-item>
        <el-form-item label="客户报价"  v-if='showCustomer'>
          <el-input v-model="updatePriceModel.orderMoney"></el-input>
        </el-form-item>
        <el-form-item label="客户额外费用"  v-if='showCustomer'>
          <el-input v-model="updatePriceModel.customerAddFee"></el-input>
        </el-form-item>
        <el-form-item label="司机报价" v-if='showDriver'>
          <el-input v-model="updatePriceModel.driverMoney" ></el-input>
        </el-form-item>
        <el-form-item label="司机额外费用" v-if='showDriver'>
          <el-input v-model="updatePriceModel.driverAddFee" ></el-input>
        </el-form-item>
        <el-form-item label="司机额外费用" v-if='showDriver'>
          <el-input v-model="updatePriceModel.driverDeductFee" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updatePriceDialog = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="updatePriceConfirm" size="mini"  :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>

<script>
import util from '@/libs/util';
import {getOrderPriceList,exportOrderPrice,exportEditOrderPrice,updateOrderFeeByHasCalculate,updateOrderFeeBySeries} from '@/api/orderprice';

export default {
  // name 值和本页的 $route.name 一致才可以缓存页面
  name:util.cookies.get('__routerName__'),
  components: {
    PageHeader: () => import('./componnets/PageHeader'),
    PageMain: () => import('./componnets/PageMain'),
    PageFooter: () => import('./componnets/PageFooter'),
  },
  data() {
    return {
      updatePriceDialog:false,
      showCustomer:false,
      showDriver:false,
      updatePriceModel: {
        customerNumId: util.cookies.get('__user__customernumid'),
        series: '',
        customerName: '',
        routerAlia: '',
        carPlateNumber: '',
        driverName: '',
        orderMoney: '',
        driverMoney: '',
        driverDeductFee:'',
        customerAddFee:'',
        driverAddFee:'',
      },
      table: [],
      orderInfos: [],
      tableSeries: [],
      customerNumId: util.cookies.get('__user__customernumid'),
      franchiseeSeries:util.cookies.get('__user__franchiseeSeries'),
      loading: false,
      form: {
          current:1
      },
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
    };
  },
  created() {
    this._initMyPage();
  },
    watch: {
        $route(to, from) {
            this._initMyPage();
        }
    },
  methods: {
    _initMyPage() {
      this.handleSubmit(this.form);
    },
    handlePaginationChange(val) {
      this.page = val;
      // nextTick 只是为了优化示例中 notify 的显示
      this.$nextTick(() => {
          this.form.current=this.page.current;
          this.handleSubmit(this.form);
      });
    },
      handleSubmit(form) {
          this.loading = true;
          this.form=form;
          getOrderPriceList({
              customerNumId: this.customerNumId,
              franchiseeSeries: this.franchiseeSeries,
              current: this.page.current,
              pageSize: this.page.size,
              status:this.$route.params.status,
              ...form,
          })
              .then(res => {
                  this.loading = false;
                  this.table = res.orderPriceModels;
                  this.page = {
                      current: this.form.current,
                      size: this.page.size,
                      total: res.total,
                  };
              })
              .catch(err => {
                  this.loading = false;
              });
      },
      orderInfoss(param) {
          this.orderInfos=[];
          for(var i of param.orderInfos) {
              this.orderInfos.push(i.series);
          };
      },
      updatePrice(param) {
         this.updatePriceModel.series=param.series;
         this.updatePriceModel.customerName=param.customerName;
         this.updatePriceModel.routerAlia=param.routerAlia;
         this.updatePriceModel.driverName=param.driverName;
         this.updatePriceModel.carPlateNumber=param.carPlateNumber;
         this.updatePriceModel.orderMoney=param.orderMoney;
         this.updatePriceModel.driverMoney=param.driverMoney;
         this.updatePriceModel.customerAddFee=param.customerAddFee;
         this.updatePriceModel.driverAddFee=param.driverAddFee;
         this.updatePriceModel.driverDeductFee=param.driverDeductFee;
         this.showCustomer=param.showCustomer;
         this.showDriver=param.showDriver;
         this.updatePriceDialog=true;
      },
      calculate(param){
          this.$confirm("此操作将更改订单结算状态, 是否继续?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
          })
              .then(() => {
          updateOrderFeeByHasCalculate({
              customerNumId:this.customerNumId,
              orderInfos:this.orderInfos
          })
              .then(res => {
                  this.$message({
                      type: 'success',
                      message: '修改结算状态成功！'
                  });
                  this.handleSubmit(this.form);
              })
              .catch(err => {
                  console.log(err);
              });
      }) .catch(() => {
              console.log("更改结算状态失败！");
          });
      },
     downLoadExcel(form) {
      this.loading = true;
      var url=exportOrderPrice({
        customerNumId: this.customerNumId,
        status:this.$route.params.status,
        ...form,
      });
         window.location.href =url;
         this.loading = false;
     },
      downLoadPriceExcel(form) {
          this.loading = true;
          var url=exportEditOrderPrice({
              customerNumId: this.customerNumId,
              status:this.$route.params.status,
              ...form,
          });
          window.location.href =url;
          this.loading = false;
      },
      updatePriceConfirm(){
        this._updateOrderFeeBySeries(this.updatePriceModel);
      },
      _updateOrderFeeBySeries(params) {
          updateOrderFeeBySeries(params)
              .then(res => {
                  if (res.code === 0) {
                      this.$message({
                          type: 'success',
                          message: '修改订单价格成功！'
                      });
                      this.updatePriceDialog=false;
                      this.handleSubmit(this.form);
                  }
                  this.loading = false;
              })
              .catch(err => {
                  console.log(err);
              });
      },
  },
};
</script>
