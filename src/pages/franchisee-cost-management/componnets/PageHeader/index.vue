<template>
  <el-form
    :data="currentTableData"
    :inline="true"
    :model="form"
    :rules="rules"
    ref="form"
    size="mini"
    style="margin-bottom: -18px;">

    <el-form-item label="订单号" prop="series">
      <el-input
              v-model="form.series"
              placeholder="请输入"
              clearable
              style="width: 200px;"/>
    </el-form-item>

    <el-form-item label="车牌号" prop="carPlateNumberSearchKey">
      <!--<el-input v-model="form.carPlateNumberSearchKey" placeholder="请输入" style="width: 100px;"></el-input>-->
      <el-autocomplete v-model="form.carPlateNumberSearchKey"
                       placeholder="车牌名称"
                       clearable
                       :fetch-suggestions="querySearchAsyncDriverPlate"
                       @select="handleSelectRouter">
      </el-autocomplete>
    </el-form-item>

    <el-form-item label="客户名字" prop="customerNameSearchKey">
      <el-autocomplete v-model="form.customerNameSearchKey"
                       placeholder="客户名字"
                       clearable
                       :fetch-suggestions="querySearchAsync"
                       @select="handleSelect">
      </el-autocomplete>
    </el-form-item>


    <el-form-item label="线路名称" prop="routerDetailSeries">
      <el-autocomplete v-model="form.routerDetailSeries"
                       placeholder="线路名称"
                       clearable
                       :fetch-suggestions="querySearchAsyncRouter"
                       @select="handleSelectRouter">
      </el-autocomplete>
    </el-form-item>

    <el-form-item label="对账状态" prop="orderBalanceStatus">
      <el-select
              v-model="form.orderBalanceStatus"
              placeholder="请选择"
              clearable
              style="width: 150px;">
        <el-option v-for="(item, index) in orderBalanceStatusList" :key="index" :label="item.orderBalanceStatusName" :value="item.orderBalanceStatus"></el-option>
      </el-select>
    </el-form-item>



    <el-form-item label="约车日期" prop="registerTime">
      <el-date-picker
              size="mini"
              v-model="registerTime"
              @change="onTimeChange"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="约车开始日期"
              end-placeholder="约车结束日期">
      </el-date-picker>
    </el-form-item>

    <el-form-item>
      <el-button
        type="primary"
        @click="handleFormSubmit">
        <d2-icon name="search"/>
        查询
      </el-button>
    </el-form-item>

    <el-form-item>
      <el-button
        @click="handleFormReset">
        <d2-icon name="refresh"/>
        重置
      </el-button>

      <el-button
              type="primary"
              size="mini"
              @click="calculate" v-if='showDriver'>
        已对账
      </el-button>
    </el-form-item>

  </el-form>
</template>

<script>
import util from '@/libs/util';
import {
    getMasterCustomerListBySearchKey
} from '@/api/createorder';
import {getRouterAliaSearchList} from '@/api/schedule';
import {getCarTypeList} from '@/api/order';
import {getOrderType,getOrderBalanceStatus} from '@/api/dictionary';
import {getDriverBySearchKey,getDriverByPlateNumberSearchKey} from '@/api/truck';

export default {
  data() {
    return {
      customerSeries:'',
      customerNumId: util.cookies.get('__user__customernumid'),
      franchiseeSeries:util.cookies.get('__user__franchiseeSeries'),
      showDriver:true,
      currentTableData: [],
      driverPlateNumber: [],
      routerDetail: [],
      carTypes: [],
      orderTypes: [],
      orderBalanceStatusList: [],
      registerTime: '',
      form: {
        customerNumId: util.cookies.get('__user__customernumid'),
        carPlateNumberSearchKey: '',
        customerNameSearchKey: '',
        routerDetailSeries: '',
        startTime: '',
        endTime: '',
        orderBalanceStatus: '',
        series:'',
      },
      masterCustomerSearchKey: {
            customerMasterSearchKey: '',
            customerNumId: '',
      },
      customerMaster: [],
      rules: {},
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            },
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            },
          },
          {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            },
          },
        ],
      },
    };
  },
  created() {
      this.getTrueColumn();
      this._getRouterAliaSearchList({
          customerNumId: this.customerNumId,
          customerSeries: '',
          routerSearchKey: '',
          franchiseeSeries:this.franchiseeSeries
      });
      this._getOrderBalanceStatusList({
          customerNumId: this.customerNumId,
      });
      this._getDriverNameList({
          customerNumId: this.form.customerNumId,
          franchiseeSeries:this.franchiseeSeries
      });
  },
    watch: {
        $route(to, from) {
            this.getTrueColumn();
        },
        'registerTime'() {
            if(this.registerTime==''||this.registerTime==null){
                this.form.startTime = '';
                this.form.endTime = '';
            }
        },
        'form.customerNameSearchKey'() {
            if(this.form.customerNameSearchKey==''||this.form.customerNameSearchKey==null){
                this.customerSeries='';
            }
            this._getRouterAliaSearchList({
                customerNumId: this.customerNumId,
                customerSeries: this.customerSeries,
                routerSearchKey: ''
            });
        }
    },
  methods: {
      getTrueColumn () {
          this.status=this.$route.params.status;
          if(this.status=='2'){
              this.showCustomer=false;
              this.showDriver=true;
          }else  if(this.status=='3'){
              this.showCustomer=true;
              this.showDriver=false;
          }else{
              this.showCustomer=true;
              this.showDriver=true;
          }
      },
      querySearchAsyncDriverPlate(qs, cb) {
          let driverPlateNumber = this.driverPlateNumber;
          var results = qs
              ? driverPlateNumber.filter(this.createStateFilterRouter(qs))
              : driverPlateNumber;
          cb(results);
      },
      _getRouterAliaSearchList(params) {
          getRouterAliaSearchList(params)
              .then(res => {
                  if (res.code === 0) {
                      let routerDetail = [];
                      res.routerDetailAliaModel.forEach(item => {
                          routerDetail.push({
                              value: item.routerAlia,
                              ...item,
                          });
                      });
                      this.routerDetail = routerDetail;
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
      querySearchAsync(qs, cb) {
          this.masterCustomerSearchKey.customerMasterSearchKey = qs;
          this.masterCustomerSearchKey.customerNumId = this.customerNumId;
          this.masterCustomerSearchKey.franchiseeSeries = this.franchiseeSeries;
          getMasterCustomerListBySearchKey(this.masterCustomerSearchKey).then(
              res => {
                  if (res.code === 0) {
                      let customerMasters = [];
                      // customerMasters= res.customerMasterList;
                      res.customerMasterList.forEach(item => {
                          customerMasters.push({
                              value: item.customerName,
                              ...item,
                          });
                      });
                      this.customerMaster = customerMasters;
                      let customerMaster = this.customerMaster;
                      var results = qs
                          ? customerMaster.filter(this.createStateFilter(qs))
                          : customerMaster;
                      cb(results);
                  }
              }
          );
      },
      createStateFilter(qs) {
          return state => {
              return state.value.toLowerCase().indexOf(qs.toLowerCase()) != -1;
          };
      },
      _getDriverNameList(params) {
          getDriverBySearchKey(params)
              .then(res => {
                  if (res.code === 0) {
                      let driverPlatNames = [];
                      res.customerDrivers.forEach(item => {
                          driverPlatNames.push({
                              value: item.carPlateNumber,
                              ...item,
                          });
                      });
                      this.driverPlateNumber = driverPlatNames;
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
      onTimeChange(time) {
          this.form.startTime = time[0];
          this.form.endTime = time[1];
      },
      handleSelect(item) {
          this.customerSeries = item.customerMasterId;
      },
      querySearchAsyncRouter(qs, cb) {
          let routerDetails = this.routerDetail;
          var results = qs
              ? routerDetails.filter(this.createStateFilterRouter(qs))
              : routerDetails;
          cb(results);
      },
      createStateFilterRouter(qs) {
          return state => {
              return state.value.toLowerCase().indexOf(qs.toLowerCase()) != -1;
          };
      },
      handleSelectRouter(item) {

      },
      handleDownloadXlsx (data) {
          if(this.form.startTime==''||this.form.endTime==''){
              this.$message.error('订单费用导出必须选择约车时间！');
              return;
          }
          this.$refs.form.validate(valid => {
              if (valid) {
                  this.$emit('downLoadExcel', this.form);
              } else {
                  return false;
              }
          });
      },
      calculate () {
           this.$emit('calculate');
      },
      _getOrderBalanceStatusList(params) {
          getOrderBalanceStatus(params)
              .then(res => {
                  if (res.code === 0) {
                      this.orderBalanceStatusList = res.orderBalanceStatusList;
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
    handleFormSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('submit', this.form);
        } else {
          return false;
        }
      });
    },
    handleFormReset() {
      this.$refs.form.resetFields();
    },
  },
};
</script>
