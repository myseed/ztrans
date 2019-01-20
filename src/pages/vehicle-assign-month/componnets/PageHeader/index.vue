<template>
  <el-form
    :inline="true"
    :model="form"
    :rules="rules"
    ref="form"
    size="mini"
    style="margin-bottom: -18px;">

    <el-form-item label="客户名字">
      <el-autocomplete v-model="form.customerName"
                       placeholder="客户名字"
                       clearable
                       :fetch-suggestions="querySearchAsync"
                       @select="handleSelect">
      </el-autocomplete>
    </el-form-item>

    <el-form-item label="线路名称">
      <el-autocomplete v-model="form.routerAliaName"
                       placeholder="线路名称"
                       clearable
                       :fetch-suggestions="querySearchAsyncRouter"
                       @select="handleSelectRouter">
      </el-autocomplete>
    </el-form-item>


    <el-form-item label="司机姓名">
      <el-input
              v-model="form.driverName"
              placeholder="请输入"
              style="width: 100px;"/>
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
import {getOrderType} from '@/api/dictionary';
import {
    getMasterCustomerListBySearchKey
} from '@/api/createorder';
export default {
  data() {
    return {
      routerDetail: [],
      customerMaster: [],
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
        startTime: '',
        endTime: '',
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
      });
  },
  methods: {
      onRegisterTimeChange(time) {
          this.form.startTime = time[0];
          this.form.endTime = time[1];
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
