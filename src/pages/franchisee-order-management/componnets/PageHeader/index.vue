<template>
  <el-form
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

    <el-form-item label="客户名字" prop="customerNameSearchKey">
      <el-autocomplete v-model="form.customerNameSearchKey"
                       placeholder="客户名字"
                       clearable
                       :fetch-suggestions="querySearchAsync"
                       @select="handleSelect">
      </el-autocomplete>
    </el-form-item>

    <el-form-item label="线路编号" prop="routerNumberSearchKey">
      <!--<el-input-->
        <!--v-model="form.routerNumberSearchKey"-->
        <!--placeholder="请输入"-->
        <!--style="width: 150px;"/>-->
      <el-autocomplete v-model="form.routerNumberSearchKey"
                       placeholder="线路编号"
                       clearable
                       :fetch-suggestions="querySearchAsyncRouterNumber"
                       @select="handleSelectRouter">
      </el-autocomplete>
    </el-form-item>



    <!--<el-form-item label="线路别名" prop="routerAliaSearchKey">-->
      <!--<el-select-->
        <!--v-model="form.routerAliaSearchKey"-->
        <!--placeholder="请选择"-->
        <!--style="width: 150px;">-->
        <!--<el-option v-for="(item, index) in routerDetail" :key="index" :label="item.routerAlia" :value="item.routerAlia"></el-option>-->
      <!--</el-select>-->
    <!--</el-form-item>-->

    <el-form-item label="线路名称" prop="routerAliaSearchKey">
      <el-autocomplete v-model="form.routerAliaSearchKey"
                       placeholder="线路名称"
                       clearable
                       :fetch-suggestions="querySearchAsyncRouter"
                       @select="handleSelectRouter">
      </el-autocomplete>
    </el-form-item>

    <el-form-item label="司机姓名" prop="driverSearchKey">
      <!--<el-input-->
              <!--v-model="form.driverSearchKey"-->
              <!--placeholder="请输入"-->
              <!--style="width: 150px;"/>-->
      <el-autocomplete v-model="form.driverSearchKey"
                       placeholder="司机姓名"
                       clearable
                       :fetch-suggestions="querySearchAsyncDriver"
                       @select="handleSelectRouter">
      </el-autocomplete>
    </el-form-item>

    <el-form-item label="车牌号" prop="platenumberSearchKey">
      <!--<el-input-->
              <!--v-model="form.platenumberSearchKey"-->
              <!--placeholder="请输入"-->
              <!--style="width: 150px;"/>-->
      <el-autocomplete v-model="form.platenumberSearchKey"
                       placeholder="车牌号"
                       clearable
                       :fetch-suggestions="querySearchAsyncDriverPlate"
                       @select="handleSelectRouter">
      </el-autocomplete>
    </el-form-item>

    <el-form-item label="车型" prop="carType">
      <el-select
        v-model="form.carType"
        placeholder="请选择"
        clearable
        style="width: 150px;">
        <el-option v-for="(item, index) in carTypes" :key="index" :label="item.typeName" :value="item.typeId"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="订单类型" prop="orderType">
      <el-select
        v-model="form.orderType"
        placeholder="请选择"
        clearable
        style="width: 150px;">
        <el-option v-for="(item, index) in orderTypes" :key="index" :label="item.orderTypeName" :value="item.orderTypeId"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="派单型式" prop="commondOrderStatus">
      <el-select
              v-model="form.commondOrderStatus"
              placeholder="请选择"
              clearable
              style="width: 150px;">
        <el-option v-for="(item, index) in commondOrderStatuses" :key="index" :label="item.orderCommondName" :value="item.orderCommondId"></el-option>
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

  </el-form>
</template>

<script>
import util from '@/libs/util';
import {getRouterAliaList,getRouterAliaSearchList} from '@/api/schedule';
import {getCarTypeList} from '@/api/order';
import {getOrderType,getCommondStatus} from '@/api/dictionary';
import {getDriverBySearchKey,getDriverByPlateNumberSearchKey} from '@/api/truck';
import {
    getMasterCustomerListBySearchKey
} from '@/api/createorder';
export default {
  data() {
    return {
      customerSeries:'',
      franchiseeSeries:util.cookies.get('__user__franchiseeSeries'),
      customerNumId: util.cookies.get('__user__customernumid'),
      routerDetail: [],
      routerNumber: [],
      driverNames: [],
      driverPlateNumber: [],
      carTypes: [],
      orderTypes: [],
      commondOrderStatuses:[],
      registerTime: '',
      customerMaster: [],
      masterCustomerSearchKey: {
         customerMasterSearchKey: '',
         customerNumId: '',
      },
      form: {
        customerNumId: util.cookies.get('__user__customernumid'),
        franchiseeSeries:util.cookies.get('__user__franchiseeSeries'),
        carType: '',
        orderType: '',
        startTime: '',
        endTime: '',
        customerNameSearchKey: '',
        routerAliaSearchKey: '',
        routerNumberSearchKey: '',
        driverSearchKey:'',
        platenumberSearchKey:'',
        commondOrderStatus:'',
        series:'',
      },
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
      this._getRouterAliaSearchList({
          customerNumId: this.customerNumId,
          customerSeries: '',
          routerSearchKey: '',
          franchiseeSeries:this.franchiseeSeries
      });
    this._getCarTypeList({
      customerNumId: this.form.customerNumId,
    });
    this._getOrderTypeList({
      customerNumId: this.form.customerNumId,
    });
    this._getOrderCommondList({
      customerNumId: this.form.customerNumId,
    });
    this._getDriverNameList({
      customerNumId: this.form.customerNumId,
      franchiseeSeries:this.franchiseeSeries
    });

  },
    watch: {
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
                      let routerNumber=[];
                      res.routerDetailAliaModel.forEach(item => {
                          routerNumber.push({
                              value: item.routerNumber,
                              ...item,
                          });
                      });
                      this.routerDetail = routerDetail;
                      this.routerNumber = routerNumber;
                  }
              })
              .catch(err => {
                  console.log(err);
              });
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
      // _getPlatNumNameList(params) {
      //     getDriverByPlateNumberSearchKey(params)
      //         .then(res => {
      //             if (res.code === 0) {
      //                 let driverPlatNames = [];
      //                 res.customerDrivers.forEach(item => {
      //                     driverPlatNames.push({
      //                         value: item.carPlateNumber,
      //                         ...item,
      //                     });
      //                 });
      //                 this.driverPlateNumber = driverPlatNames;
      //             }
      //         })
      //         .catch(err => {
      //             console.log(err);
      //         });
      // },
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
      _getOrderCommondList(params) {
          getCommondStatus(params)
              .then(res => {
                  if (res.code === 0) {
                      this.commondOrderStatuses = res.orderCommondModels;
                  }
              })
              .catch(err => {
                  console.log(err);
              });
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
      handleDownloadXlsx (data) {
          if(this.form.startTime==''||this.form.endTime==''){
              this.$message.error('订单导出必须选择约车时间！');
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
      onTimeChange(time) {
          this.form.startTime = time[0];
          this.form.endTime = time[1];
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
      querySearchAsyncRouter(qs, cb) {
          let routerDetails = this.routerDetail;
          var results = qs
              ? routerDetails.filter(this.createStateFilterRouter(qs))
              : routerDetails;
          cb(results);
      },
      querySearchAsyncDriver(qs, cb) {
          let driverNames = this.driverNames;
          var results = qs
              ? driverNames.filter(this.createStateFilterRouter(qs))
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
      querySearchAsyncRouterNumber(qs, cb) {
          let routerNumber = this.routerNumber;
          var results = qs
              ? routerNumber.filter(this.createStateFilterRouter(qs))
              : routerNumber;
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
    handleFormReset() {
      this.$refs.form.resetFields();
    },
  },
};
</script>
