<template>
  <el-form
    :inline="true"
    :model="form"
    :rules="rules"
    ref="form"
    size="mini"
    style="margin-bottom: -18px;">
    <el-form-item label="客户名称" prop="customerName">
      <el-autocomplete v-model="customerName"
                       placeholder="请输入"
                       clearable
                       :fetch-suggestions="querySearchAsync"
                       @select="handleSelect">
      </el-autocomplete>
    </el-form-item>

    <el-form-item label="线路名称" prop="routerDetailAliaSearchKey">
      <el-autocomplete v-model="form.routerDetailAliaSearchKey"
                       style="width: 150px;"
                       placeholder="请输入"
                       clearable
                       :fetch-suggestions="querySearchAsyncRouter"
                       @select="handleSelectRouter">
      </el-autocomplete>
    </el-form-item>

    <el-form-item label="司机名字">
      <el-autocomplete v-model="driverName"
                       placeholder="司机名字"
                       clearable
                       :fetch-suggestions="querySearchAsyncDriver"
                       @select="handleSelectDriver">
      </el-autocomplete>
    </el-form-item>

    <el-form-item label="车牌号">
      <el-autocomplete v-model="carPlateNumber"
                       placeholder="车牌号"
                       clearable
                       :fetch-suggestions="querySearchAsyncPlateNum"
                       @select="handleSelectCarPlate">
      </el-autocomplete>
    </el-form-item>

    <el-form-item label="抢单类型" prop="jobId">
      <el-select
              v-model="form.orderType"
              placeholder="请选择"
              clearable
              style="width: 150px;">
        <el-option v-for="(item, index) in orderTypes" :key="index" :label="item.bizTypeName" :value="item.bizTypeId"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="抢单状态" prop="jobId">
      <el-select
              v-model="form.orderStatus"
              placeholder="请选择"
              clearable
              style="width: 150px;">
        <el-option v-for="(item, index) in orderStatuss" :key="index" :label="item.bizTypeName" :value="item.bizTypeId"></el-option>
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
    </el-form-item>

    <el-form-item>
      <el-button
              type="primary"
              @click="handleAdd">
        <d2-icon name="plus"/>
        新增抢单任务
      </el-button>
    </el-form-item>

  </el-form>
</template>

<script>
    import {
        getAppDictionary
    } from '@/api/dictionary';
    import {getDriverBySearchKey,getDriverByPlateNumberSearchKey} from '@/api/truck';
    import {getRouterAliaSearchList} from '@/api/schedule';
    import {
        getMasterCustomerListBySearchKey
    } from '@/api/createorder';
import util from '@/libs/util';

export default {
  data() {
    return {
        orderTypes: [],
        orderStatuss: [],
        customerNumId: util.cookies.get('__user__customernumid'),
        franchiseeSeries:util.cookies.get('__user__franchiseeSeries'),
        routerDetail: [],
        routerNumber: [],
        customerMasterList: [],
        customerMaster: [],
        customerName:'',
        driverName:'',
        carPlateNumber:'',
        masterCustomerSearchKey: {
            customerMasterSearchKey: '',
            customerNumId: '',
        },
        driverSearchKey: {
            driverSearchName: '',
            customerNumId: '',
        },
        plateNumSearchKey: {
            plateNumberSearchKey: '',
            customerNumId: '',
        },
        registerTime: '',
        drivers:[],
        carPlateNumbers:[],
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
      form: {
        customerNumId: util.cookies.get('__user__customernumid'),
        franchiseeSeries:util.cookies.get('__user__franchiseeSeries'),
        routerDetailSeries: '',
        customerSeries: '',
        driverId: '',
        orderStatus: '',
        orderType: '',
        routerDetailAliaSearchKey:'',
        startTime:'',
        endTime:'',
        current:''
      },
      rules: {},
    };
  },
  created() {
      this._getOrderType({
          customerNumId: this.customerNumId,
          bizId:47
      });
      this._getOrderStatus({
          customerNumId: this.customerNumId,
          bizId:45
      });
  },
    watch: {
        'registerTime'() {
            if(this.registerTime==''||this.registerTime==null){
                this.form.startTime = '';
                this.form.endTime = '';
            }
        },
        'customerName'() {
            if(this.customerName==''||this.customerName==null){
                this.form.customerSeries='';
            }
            this._getRouterAliaSearchList({
                customerNumId: this.customerNumId,
                customerSeries: this.form.customerSeries,
                routerSearchKey: '',
                franchiseeSeries: this.franchiseeSeries,
            });
        }
    },
  methods: {
      onTimeChange(time) {
          this.form.startTime = time[0];
          this.form.endTime = time[1];
      },
      _getOrderType(params) {
          getAppDictionary(params)
              .then(res => {
                  if (res.code === 0) {
                      this.orderTypes = res.bizLists;
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
      _getOrderStatus(params) {
          getAppDictionary(params)
              .then(res => {
                  if (res.code === 0) {
                      this.orderStatuss = res.bizLists;
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
              return state.value.toLowerCase().indexOf(qs.toLowerCase()) === 0;
          };
      },
      handleSelect(item) {
          this.form.customerSeries = item.customerMasterId;
      },
      querySearchAsyncRouter(qs, cb) {
          let routerDetail = this.routerDetail;
          var results = qs
              ? routerDetail.filter(this.createStateFilter(qs))
              : routerDetail;
          cb(results);
      },
      handleSelectRouter(item) {
          this.form.routerDetailSeries = item.routerDetailSeries;
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
      querySearchAsyncDriver(qs, cb) {
          this.driverSearchKey.driverSearchName = qs;
          this.driverSearchKey.customerNumId = this.customerNumId;
          getDriverBySearchKey(this.driverSearchKey).then(
              res => {
                  if (res.code === 0) {
                      let drivers = [];
                      res.customerDrivers.forEach(item => {
                          drivers.push({
                              value: item.driverName,
                              ...item,
                          });
                      });
                      this.drivers = drivers;
                      let driver = this.drivers;
                      var results = qs
                          ? driver.filter(this.createStateFilterDriver(qs))
                          : driver;
                      cb(results);
                  }
              }
          );
      },
      querySearchAsyncPlateNum(qs, cb) {
          this.plateNumSearchKey.plateNumberSearchKey = qs;
          this.plateNumSearchKey.customerNumId = this.customerNumId;
          getDriverByPlateNumberSearchKey(this.plateNumSearchKey).then(
              res => {
                  if (res.code === 0) {
                      let carPlateNumberssss = [];
                      // customerMasters= res.customerMasterList;
                      res.customerDrivers.forEach(item => {
                          carPlateNumberssss.push({
                              value: item.carPlateNumber,
                              ...item,
                          });
                      });
                      this.carPlateNumbers = carPlateNumberssss;
                      let carPlateNumber = this.carPlateNumbers;
                      var results = qs
                          ? carPlateNumber.filter(this.createStateFilterDriver(qs))
                          : carPlateNumber;
                      cb(results);
                  }
              }
          );
      },
      createStateFilterDriver(qs) {
          return state => {
              return state.value.toLowerCase().indexOf(qs.toLowerCase()) != -1;
          };
      },
      handleSelectCarPlate(item) {
          this.form.driverId = item.driverId;
          this.driverName=item.driverName;
      },
      handleSelectDriver(item) {
          this.form.driverId = item.driverId;
          this.carPlateNumber=item.carPlateNumber;
      },
    handleFormSubmit() {
      this.form.current=1;
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('submit', this.form);
        } else {
          this.$notify.error({
            title: '错误',
            message: '表单校验失败',
          });
          return false;
        }
      });
    },
      handleAdd() {
          this.$refs.form.validate(valid => {
              if (valid) {
                  this.$emit('handleAdd');
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
