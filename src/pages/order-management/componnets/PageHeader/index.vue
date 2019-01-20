<template>
  <el-form
    :inline="true"
    :model="form"
    :rules="rules"
    ref="form"
    size="mini"
    style="margin-bottom: -18px;">


    <el-form-item label="客户名字">
      <el-autocomplete v-model="form.customerNameSearchKey"
                       placeholder="客户名字"
                       clearable
                       :fetch-suggestions="querySearchAsync"
                       @select="handleSelect">
      </el-autocomplete>
    </el-form-item>

    <el-form-item label="线路编号" prop="routerNumberSearchKey">
      <el-input
        v-model="form.routerNumberSearchKey"
        placeholder="请输入"
        style="width: 150px;"/>
    </el-form-item>



    <!--<el-form-item label="线路别名" prop="routerAliaSearchKey">-->
      <!--<el-select-->
        <!--v-model="form.routerAliaSearchKey"-->
        <!--placeholder="请选择"-->
        <!--style="width: 150px;">-->
        <!--<el-option v-for="(item, index) in routerDetail" :key="index" :label="item.routerAlia" :value="item.routerAlia"></el-option>-->
      <!--</el-select>-->
    <!--</el-form-item>-->

    <el-form-item label="线路名称">
      <el-autocomplete v-model="form.routerAliaSearchKey"
                       placeholder="线路名称"
                       clearable
                       :fetch-suggestions="querySearchAsyncRouter"
                       @select="handleSelectRouter">
      </el-autocomplete>
    </el-form-item>

    <el-form-item label="司机名字" prop="driverSearchKey">
      <el-input
              v-model="form.driverSearchKey"
              placeholder="请输入"
              style="width: 150px;"/>
    </el-form-item>

    <el-form-item label="车牌号" prop="platenumberSearchKey">
      <el-input
              v-model="form.platenumberSearchKey"
              placeholder="请输入"
              style="width: 150px;"/>
    </el-form-item>

    <el-form-item label="车型" prop="carType">
      <el-select
        v-model="form.carType"
        placeholder="请选择"
        style="width: 150px;">
        <el-option v-for="(item, index) in carTypes" :key="index" :label="item.typeName" :value="item.typeId"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="订单类型" prop="orderType">
      <el-select
        v-model="form.orderType"
        placeholder="请选择"
        style="width: 150px;">
        <el-option v-for="(item, index) in orderTypes" :key="index" :label="item.orderTypeName" :value="item.orderTypeId"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="派单型式" prop="commondOrderStatus">
      <el-select
              v-model="form.commondOrderStatus"
              placeholder="请选择"
              style="width: 150px;">
        <el-option v-for="(item, index) in commondOrderStatuses" :key="index" :label="item.orderCommondName" :value="item.orderCommondId"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="约车日期">
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
              @click="handleDownloadXlsx">
        导出订单excel
      </el-button>
    </el-form-item>

  </el-form>
</template>

<script>
import util from '@/libs/util';
import {getRouterAliaList,getRouterAliaSearchList} from '@/api/schedule';
import {getCarTypeList} from '@/api/order';
import {getOrderType,getCommondStatus} from '@/api/dictionary';
import {
    getMasterCustomerListBySearchKey
} from '@/api/createorder';
export default {
  data() {
    return {
      routerDetail: [],
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
      },
      rules: {},
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
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
                      this.routerDetail = routerDetail;
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
          this.$refs.form.validate(valid => {
              if (valid) {
                  this.$emit('downLoadExcel', this.form);
              } else {
                  this.$notify.error({
                      title: '错误',
                      message: '表单校验失败',
                  });
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
          this.$notify.error({
            title: '错误',
            message: '表单校验失败',
          });
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
      },
      querySearchAsync(qs, cb) {
          this.masterCustomerSearchKey.customerMasterSearchKey = qs;
          this.masterCustomerSearchKey.customerNumId = this.customerNumId;
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
