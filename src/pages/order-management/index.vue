<template>
  <d2-container>
    <page-header
      slot="header"
      @submit="handleSubmit"
      @downLoadExcel="downLoadExcel"
      ref="header"/>
    <page-main
      :table-data="table"
      @getOrderDetail="getOrderDetail"
      @deleteOrder="deleteOrder"
      @selectCar="selectCar"
      :loading="loading"/>
    <page-footer
      slot="footer"
      :current="page.current"
      :size="page.size"
      :total="page.total"
      @change="handlePaginationChange"/>
    <el-dialog title="变更车辆" :visible.sync="addDialog">
      <el-form :inline="true" :model="searchItemPop" size="mini">
        <el-form-item>
          <el-input v-model="searchItemPop.carPlateNumberSearchKey" placeholder="车牌号" style="width: 100px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchItemPop.driverNameSearchKey" placeholder="司机姓名" style="width: 100px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchItemPop.carTypeSeries" placeholder="车型" clearable style="width: 135px;">
            <el-option v-for="(item, index) in carTypes" :key="index" :label="item.typeName" :value="item.typeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchItemPop.carSizeSeries" placeholder="尺寸" clearable style="width: 135px;">
            <el-option v-for="(item, index) in carSizes" :key="index" :label="item.sizeName" :value="item.sizeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearchPop" icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
              size="mini"
              :data="tablePopData"
              highlight-current-row
              style="width: 100%"
              height="400">
        <el-table-column
                fixed
                type="index"
                width="50">
        </el-table-column>
        <el-table-column
                prop="carPlateNumber"
                label="车牌号"
                width="120">
        </el-table-column>
        <el-table-column
                prop="driverName"
                label="司机姓名">
        </el-table-column>
        <el-table-column
                prop="driverPhone"
                label="手机号"
                width="160">
        </el-table-column>
        <el-table-column
                prop="driverIdentityId"
                label="身份证"
                width="160">
        </el-table-column>
        <el-table-column
                prop="cityName"
                label="起始地->目的地">
        </el-table-column>
        <el-table-column
                fixed="right"
                label="操作"
                width="120">
          <template slot-scope="scope">
            <el-button @click="onCheckOrderDetail(scope.$index, scope.row)" type="text" size="small">查看已接单明细</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog title="已接单明细" :visible.sync="orderDetailDialog">
      <div class="block" style="text-align: left">
        <el-row>
          <el-col :span="24">
            <ul class="i-list">
              <li>车牌号：{{orderDetail.carPlateNumber}}</li>
              <li>车辆报价：{{orderDetail.carMoney}}元</li>
              <li>
                <el-form :inline="true" :model="orderDetail" size="mini">
                  <el-form-item label="接单价" class="order-price">
                    <el-input v-model="orderDetail.carRealMoney" placeholder="请输入"></el-input>
                  </el-form-item>
                </el-form>
              </li>
            </ul>
          </el-col>
        </el-row>
      </div>
      <div class="block" style="text-align: left; padding: 15px">
        已接单任务
      </div>
      <div class="block" style="text-align: left; padding: 15px">
        <el-table
                size="mini"
                :data="orderDetail.orderTask"
                highlight-current-row
                style="width: 100%">
          <el-table-column
                  fixed
                  type="index"
                  width="50">
          </el-table-column>
          <el-table-column
                  prop="series"
                  label="订单号">
          </el-table-column>
          <el-table-column
                  prop="routerAlia"
                  label="线路别名">
          </el-table-column>
          <el-table-column
                  prop="customerName"
                  label="客户名字">
          </el-table-column>
          <el-table-column
                  prop="appointmentDate"
                  label="用车时间"
                  width="160">
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="orderDetailDialog = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="onAssignConfirm" size="mini">确认车辆</el-button>
      </div>
    </el-dialog>

    <el-dialog title="废弃理由" :visible.sync="deleteOrderPopDialog">
      <el-form :inline="true" :model="deleteModel" label-position="left" size="mini">
        <el-form-item>
          <el-input type="textarea" v-model="deleteModel.deleteReason" style="width: 900px;" :rows="7" placeholder="请输入订单废弃理由"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDeleteOrder" size="mini">取 消</el-button>
        <el-button type="primary" @click="deleteOrderConfirm" size="mini"  :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>

<script>
import util from '@/libs/util';
import {getRouterAliaList} from '@/api/schedule';
import {
  getCarTypeList,
  getOrderByCustomerNumId,
  selectDriver,
  confirmDriver,
  getDriverOrderDetail,
  getCarSizeList,
  cancelOrderStatus,
  exportOrder,
} from '@/api/order';
import {getOrderType} from '@/api/dictionary';

export default {
  // name 值和本页的 $route.name 一致才可以缓存页面
  name: 'vehicle-assign',
  components: {
    PageHeader: () => import('./componnets/PageHeader'),
    PageMain: () => import('./componnets/PageMain'),
    PageFooter: () => import('./componnets/PageFooter'),
  },
  data() {
    return {
      customerNumId: util.cookies.get('__user__customernumid'),
      deleteReason:'',
      deleteModel:{
          series: '',
          deleteReason: '',
      },
      deleteOrderPopDialog:false,
      searchItemPop: {
        appointmentDate: '',
        carPlateNumberSearchKey: '',
        carTypeSeries: '',
        carSizeSeries: '',
        driverNameSearchKey: '',
        routerDetailSeries: '',
        series: '',
      },
      routerDetail: [],
      curPage: 1,
      pgSize: 1000,
      orderDetailDialog: false,
      orderDetail: {},
      carTypes: [],
      carSizes: [],
      orderTypes: [],
      driverModel: [],
      addDialog: false,
      table: [],
      loading: false,
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
     status:'',
    };
  },
  created() {
    this._getRouterAliaList({
      customerNumId: this.customerNumId,
    });
    this._getCarTypeList({
      customerNumId: this.customerNumId,
    });
    this._getCarSizeList({
      customerNumId: this.customerNumId,
    });
    this._getOrderTypeList({
      customerNumId: this.customerNumId,
    });
    this._initMyPage();
  },
  computed: {
    totalPage() {
      return this.tableData.length;
    },
    addTotalPage() {
      return this.driverModel.length;
    },
    tableInlineData() {
      return this.tableData.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      );
    },
    tablePopData() {
      this.driverModel.forEach(item => {
        item.district = `${item.prvRealName}/${item.cityRealName}/${
          item.cityAreaRealName
        }`;
      });
      return this.driverModel.slice(
        (this.curPage - 1) * this.pgSize,
        this.curPage * this.pgSize
      );
    },
  },
    watch: {
      $route(to, from) {
        this._initMyPage()
      },
    },
  methods: {
    _initMyPage() {
      this.handleSubmit();
    },
    _getCarTypeList(params) {
      getCarTypeList(params)
        .then(res => {
          if (res.code === 0) {
            this.carTypes = res.carTypes;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    _getCarSizeList(params) {
      getCarSizeList(params)
        .then(res => {
          if (res.code === 0) {
            this.carSizes = res.carSizes;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    _getOrderTypeList(params) {
      getOrderType(params)
        .then(res => {
          if (res.code === 0) {
            this.orderTypes = res.orderTypeModels;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    _getRouterAliaList(params) {
      getRouterAliaList(params)
        .then(res => {
          if (res.code === 0) {
            this.routerDetail = res.routerDetail;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handlePaginationChange(val) {
      this.page = val;
      // nextTick 只是为了优化示例中 notify 的显示
      this.$nextTick(() => {
        this.$refs.header.handleFormSubmit();
      });
    },
    handleSubmit(form) {
      this.status=this.$route.params.status;
      this.loading = true;
      getOrderByCustomerNumId({
        customerNumId: util.cookies.get('__user__customernumid'),
        current: this.page.current,
        pageSize: this.page.size,
        deliverStatus: this.status,
        ...form,
      })
        .then(res => {
          this.loading = false;
          this.table = res.orderModel;
          this.page = {
            current: this.page.current,
            size: this.page.size,
            total: res.total,
          };
        })
        .catch(err => {
          this.loading = false;
        });
    },
    getOrderDetail(param) {
      this.$router.push({
        path: '/order-detail',
        query: {orderId: param.orderId},
      });
    },
    deleteOrder(param) {
      if(this.$route.query.status==='4'){
          this.$message({
              type: 'error',
              message: '订单状态已经取消,不可以重复取消！',
          });
          return;
      }
        if(this.$route.query.status==='3'){
            this.$message({
                type: 'error',
                message: '订单状态已经完成,不可以废除！',
            });
            return;
        }
      this.deleteOrderPopDialog=true;
      this.deleteModel.series=param.orderId;
      // this._cancelOrderStatus({
      //   customerNumId: this.customerNumId,
      //   series: param.orderId,
      // });
    },
      deleteOrderConfirm(param){
        if(this.deleteModel.deleteReason===''){
            this.$message({
                type: 'error',
                message: '删除理由不可以为空！',
            });
            return;
        }
          this._cancelOrderStatus({
            customerNumId: this.customerNumId,
            series: this.deleteModel.series,
            deleteReason:  this.deleteModel.deleteReason,
          });
          this.deleteModel.deleteReason='';
          this.deleteOrderPopDialog=false;
      },
      cancelDeleteOrder(){
        this.deleteModel.deleteReason='';
        this.deleteOrderPopDialog=false;
      },
    _cancelOrderStatus(params) {
      cancelOrderStatus(params)
        .then(res => {
          if (res.code === 0) {
            this.$message.success('作废订单成功！');
            this.handleSubmit();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    selectCar(param) {
      this.addDialog = true;
      this.searchItemPop.appointmentDate = param.appointmentDate;
      this.searchItemPop.carTypeSeries = param.carType;
      this.searchItemPop.routerDetailSeries = param.routerDetailSeries;
      this.searchItemPop.series = param.series;
      // 加载全部数据
      this.handleSubmit();
    },
    onSearchPop() {
      this._selectDriver({
        current: 1,
        pageSize: 10,
        customerNumId: this.customerNumId,
        appointmentDate: this.searchItemPop.appointmentDate,
        carPlateNumberSearchKey: this.searchItemPop.carPlateNumberSearchKey,
        carTypeSeries: this.searchItemPop.carTypeSeries,
        driverNameSearchKey: this.searchItemPop.driverNameSearchKey,
        routerDetailSeries: this.searchItemPop.routerDetailSeries,
      });
    },
    _selectDriver(params) {
      selectDriver(params)
        .then(res => {
          if (res.code === 0) {
            this.driverModel = res.driverModel;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    onCheckOrderDetail(index, row) {
      this.orderDetailDialog = true;
      this.driverSeries = row.series;
      this._getDriverOrderDetail({
        customerNumId: this.customerNumId,
        driverSeries: row.series,
        orderSeries: this.searchItemPop.series,
      });
    },
    onAssignConfirm() {
      if (this.orderDetail.carRealMoney <= this.orderDetail.carMoney) {
        this._confirmDriver({
          carRealMoney: this.orderDetail.carRealMoney,
          customerNumId: this.customerNumId,
          driverSeries: this.driverSeries,
          orderSeries: this.searchItemPop.series,
        });
      } else {
        this.$message.error('接单价必须不高于车辆报价！');
      }
    },
    _confirmDriver(params) {
      confirmDriver(params)
        .then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '指派成功!',
            });
            this.addDialog = false;
            this.orderDetailDialog = false;
            this.handleSubmit();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    _getDriverOrderDetail(params) {
      getDriverOrderDetail(params)
        .then(res => {
          if (res.code === 0) {
            this.orderDetail = res;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
      downLoadExcel(form) {
          this.loading = true;
          var url=exportOrder({
              customerNumId: util.cookies.get('__user__customernumid'),
              ...form,
          });
          window.location.href =url;
          this.loading = false;
      },
  },
};
</script>
