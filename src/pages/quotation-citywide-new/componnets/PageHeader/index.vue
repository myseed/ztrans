<template>
  <el-form
          :inline="true"
          :model="form"
          :rules="rules"
          ref="form"
          size="mini"
          style="margin-bottom: -18px;">

    <el-form-item label="线路编号" prop="routerNumberSearchKey">
      <!--<el-input v-model="form.routerNumberSearchKey" placeholder="请输入" style="width: 100px;"></el-input>-->
      <el-autocomplete v-model="form.routerNumberSearchKey"
                       style="width: 150px;"
                       placeholder="请输入"
                       clearable
                       :fetch-suggestions="querySearchAsyncRouterNumber"
                       @select="handleSelect">
      </el-autocomplete>
    </el-form-item>

    <el-form-item label="线路名称" prop="routerDetailAliaSearchKey">
      <el-autocomplete v-model="form.routerDetailAliaSearchKey"
                       style="width: 150px;"
                       placeholder="请输入"
                       clearable
                       :fetch-suggestions="querySearchAsync"
                       @select="handleSelect">
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
import util from '@/libs/util';

export default {
  data() {
    return {
      routerDetail: [],
      routerNumber: [],
      customerMasterList: [],
      customerNumId: util.cookies.get('__user__customernumid'),
      franchiseeSeries:util.cookies.get('__user__franchiseeSeries'),
      form: {
        customerNumId: util.cookies.get('__user__customernumid'),
        customerSeries: '',
        routerNumberSearchKey: '',
        routerDetailAliaSearchKey: '',
      },
      rules: {},
    };
  },
  created() {
    this._getRouterAliaSearchList({
      customerNumId: this.customerNumId,
      customerSeries: '0',
      routerSearchKey: '',
      franchiseeSeries: this.franchiseeSeries,
    });
  },
  methods: {
    querySearchAsync(qs, cb) {
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
    handleSelect(item) {
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
