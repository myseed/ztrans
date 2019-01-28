<template>
  <el-form
    :inline="true"
    :model="form"
    :rules="rules"
    ref="form"
    size="mini"
    style="margin-bottom: -18px;">

    <el-form-item label="客户编号" prop="customerName">
      <!--<el-select v-model="form.customerSeries" placeholder="请选择" style="width: 150px;">-->
        <!--<el-option v-for="(item, index) in customerMasterList" :key="index" :label="item.customerName" :value="item.customerMasterId"></el-option>-->
      <!--</el-select>-->

      <el-autocomplete v-model="customerName"
                       placeholder="客户名字"
                       clearable
                       :fetch-suggestions="querySearchAsync"
                       @select="handleSelect">
      </el-autocomplete>
    </el-form-item>

    <el-form-item label="线路编号" prop="routerNumberSearchKey">
      <!--<el-input v-model="form.routerNumberSearchKey" placeholder="请输入" style="width: 100px;"></el-input>-->
      <el-autocomplete v-model="form.routerNumberSearchKey"
                       style="width: 150px;"
                       placeholder="请输入"
                       clearable
                       :fetch-suggestions="querySearchAsyncRouterNumber"
                       @select="handleSelectRouter">
      </el-autocomplete>
    </el-form-item>

    <el-form-item label="线路名称" prop="routerDetailAliaSearchKey">
      <el-autocomplete v-model="form.routerDetailAliaSearchKey"
                       style="width: 150px;"
                       placeholder="线路名称"
                       clearable
                       :fetch-suggestions="querySearchAsyncRouter"
                       @select="handleSelectRouter">
      </el-autocomplete>
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
        新增
      </el-button>
    </el-form-item>

  </el-form>
</template>

<script>
import {getMasterCustomerList} from '@/api/price';
import {getRouterAliaSearchList} from '@/api/schedule';
import {
    getMasterCustomerListBySearchKey
} from '@/api/createorder';
import util from '@/libs/util';

export default {
  data() {
    return {
      routerDetail: [],
      routerNumber: [],
      customerMasterList: [],
      customerMaster: [],
      customerName:'',
      form: {
        customerNumId: util.cookies.get('__user__customernumid'),
        customerSeries: '',
        routerNumberSearchKey: '',
        routerDetailAliaSearchKey: '',
      },
      masterCustomerSearchKey: {
       customerMasterSearchKey: '',
       customerNumId: '',
      },
      rules: {},
    };
  },
  created() {
    this._getMasterCustomerList({
      customerNumId: this.customerNumId,
      saleId: '',
    });
    this._getRouterAliaSearchList({
      customerNumId: this.customerNumId,
      customerSeries: '',
      routerSearchKey: '',
    });
  },
    watch: {
        'customerName'() {
            if(this.customerName==''||this.customerName==null){
                this.form.customerSeries='';
            }
            this._getRouterAliaSearchList({
                customerNumId: this.customerNumId,
                customerSeries: this.form.customerSeries,
                routerSearchKey: ''
            });
        }
    },
  methods: {
    querySearchAsyncRouter(qs, cb) {
      let routerDetail = this.routerDetail;
      var results = qs
        ? routerDetail.filter(this.createStateFilter(qs))
        : routerDetail;
      cb(results);
    },
      querySearchAsyncRouterNumber(qs, cb) {
      let routerDetail = this.routerNumber;
      var results = qs
        ? routerDetail.filter(this.createStateFilter(qs))
        : routerDetail;
      cb(results);
    },
    createStateFilter(qs) {
      return state => {
        return state.value.toLowerCase().indexOf(qs.toLowerCase()) === 0;
      };
    },
    handleSelectRouter(item) {
      console.log(item);
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
      handleSelect(item) {
          this.form.customerSeries = item.customerMasterId;
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
    _getMasterCustomerList(params) {
      getMasterCustomerList(params)
        .then(res => {
          if (res.code === 0) {
            this.customerMasterList = res.customerMasterList;
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
          this.$notify.error({
            title: '错误',
            message: '表单校验失败',
          });
          return false;
        }
      });
    },
    handleFormReset() {
      this.$refs.form.resetFields();
    },
    handleAdd() {
      this.$emit('add');
    },
  },
};
</script>
