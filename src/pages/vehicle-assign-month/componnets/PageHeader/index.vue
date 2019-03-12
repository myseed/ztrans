<template>
  <el-form
    :inline="true"
    :model="form"
    :rules="rules"
    ref="form"
    size="mini"
    style="margin-bottom: -18px;">

    <el-form-item label="客户名字" prop="customerName">
      <el-autocomplete v-model="form.customerName"
                       placeholder="客户名字"
                       clearable
                       :fetch-suggestions="querySearchAsync"
                       @select="handleSelect">
      </el-autocomplete>
    </el-form-item>

    <el-form-item label="线路名称" prop="routerAliaName">
      <el-autocomplete v-model="form.routerAliaName"
                       placeholder="线路名称"
                       clearable
                       :fetch-suggestions="querySearchAsyncRouter"
                       @select="handleSelectRouter">
      </el-autocomplete>
    </el-form-item>


    <el-form-item label="司机姓名" prop="driverName">
      <!--<el-input-->
              <!--v-model="form.driverName"-->
              <!--placeholder="请输入"-->
              <!--style="width: 100px;"/>-->
      <el-autocomplete v-model="form.driverName"
                       placeholder="请输入"
                       clearable
                       :fetch-suggestions="querySearchAsyncDriver"
                       @select="handleSelectRouter">
      </el-autocomplete>
    </el-form-item>

    <el-form-item label="车牌号" prop="carPlateNumber">
      <!--<el-input-->
      <!--v-model="form.platenumberSearchKey"-->
      <!--placeholder="请输入"-->
      <!--style="width: 150px;"/>-->
      <el-autocomplete v-model="form.carPlateNumber"
                       placeholder="车牌号"
                       clearable
                       :fetch-suggestions="querySearchAsyncDriverPlate"
                       @select="handleSelectRouter">
      </el-autocomplete>
    </el-form-item>

    <el-form-item label="任务状态" prop="taskType">
      <el-select v-model="form.taskType" placeholder="请选择" clearable>
      <el-option v-for="(item, index) in taskTypeModels" :key="index" :label="item.taskTypeName" :value="item.taskTypeId"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="指派日期" prop="registerTime">
      <el-date-picker
              size="mini"
              v-model="registerTime"
              @change="onRegisterTimeChange"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right">
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
        新增整月创单
      </el-button>
    </el-form-item>

  </el-form>
</template>

<script>
import util from '@/libs/util';
import {getRouterAliaList,getRouterAliaSearchList} from '@/api/schedule';
import {getCarTypeList} from '@/api/order';
import {getOrderType,getTaskType} from '@/api/dictionary';
import {getDriverBySearchKey,getDriverByPlateNumberSearchKey} from '@/api/truck';
import {
    getMasterCustomerListBySearchKey
} from '@/api/createorder';
export default {
  data() {
    return {
      driverNames:[],
      driverPlateNumber: [],
      customerNumId: util.cookies.get('__user__customernumid'),
      franchiseeSeries:util.cookies.get('__user__franchiseeSeries'),
      customerSeries:'',
      routerDetail: [],
      customerMaster: [],
      taskTypeModels:[],
      masterCustomerSearchKey: {
            customerMasterSearchKey: '',
            customerNumId: '',
      },
      registerTime: '',
      form: {
        customerNumId: util.cookies.get('__user__customernumid'),
        customerName: '',
        routerAliaName: '',
        driverName: '',
        carPlateNumber:'',
        startTime: '',
        endTime: '',
        taskType: '',
      },
      rules: {},
        pickerOptions: {
            shortcuts: [
                {
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    },
                },
                {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    },
                },
                {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    },
                },
            ],
        },
    };
  },
  created() {
      this._getRouterAliaSearchList({
          customerNumId: this.customerNumId,
          customerSeries: '',
          routerSearchKey: '',
          franchiseeSeries:this.franchiseeSeries
      });
      this._getDriverNameList({
          customerNumId: this.form.customerNumId,
          franchiseeSeries:this.franchiseeSeries
      });
      this._getTaskType({
          customerNumId: this.form.customerNumId,
      });
  },
    watch: {
        'registerTime'() {
            if(this.registerTime==''||this.registerTime==null){
                this.form.startTime = '';
                this.form.endTime = '';
            }
        },
        'form.customerName'() {
            if(this.form.customerName==''||this.form.customerName==null){
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
      _getTaskType(params) {
          getTaskType(params)
              .then(res => {
                  if (res.code === 0) {
                      this.taskTypeModels = res.taskTypeModels;
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
      onRegisterTimeChange(time) {
          this.form.startTime = time[0];
          this.form.endTime = time[1];
      },
      _getDriverNameList(params) {
          getDriverBySearchKey(params)
              .then(res => {
                  if (res.code === 0) {
                      let driverNames = [];
                      res.customerDrivers.forEach(item => {
                          driverNames.push({
                              value: item.driverName,
                              ...item,
                          });
                      });
                      let driverPlatNames = [];
                      res.customerDrivers.forEach(item => {
                          driverPlatNames.push({
                              value: item.carPlateNumber,
                              ...item,
                          });
                      });
                      this.driverNames = driverNames;
                      this.driverPlateNumber = driverPlatNames;
                  }
              })
              .catch(err => {
                  console.log(err);
              });
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

      handleFormSubmit() {
          this.$refs.form.validate(valid => {
              if (valid) {
                  this.$emit('submit', this.form);
              } else {
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
      handleSelect(item) {
          this.customerSeries = item.customerMasterId;
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
      querySearchAsyncDriver(qs, cb) {
          let driverNames = this.driverNames;
          var results = qs
              ? driverNames.filter(this.createStateFilter(qs))
              : driverNames;
          cb(results);
      },
      querySearchAsyncDriverPlate(qs, cb) {
          let driverPlateNumber = this.driverPlateNumber;
          var results = qs
              ? driverPlateNumber.filter(this.createStateFilterRouter(qs))
              : driverPlateNumber;
          cb(results);
      },
    handleFormReset() {
      this.$refs.form.resetFields();
    },
  },
};
</script>
