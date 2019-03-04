<template>
  <el-form
    :inline="true"
    :model="form"
    :rules="rules"
    ref="form"
    size="mini"
    style="margin-bottom: -18px;">

    <el-form-item label="线路名称" prop="routerDetailAliaSearchKey">
      <el-autocomplete v-model="form.routerDetailAliaSearchKey"
                       placeholder="线路名称"
                       clearable
                       :fetch-suggestions="querySearchAsyncRouter"
                       @select="handleSelectRouter">
      </el-autocomplete>
    </el-form-item>

    <el-form-item label="调度人" prop="employeeNameSearchKey">
      <!--<el-input-->
        <!--v-model="form.employeeNameSearchKey"-->
        <!--placeholder="请输入"-->
        <!--style="width: 100px;"/>-->
      <el-autocomplete v-model="form.employeeNameSearchKey"
                       placeholder="调度人"
                       clearable
                       :fetch-suggestions="querySearchAsyncEmployee"
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
    import {getRouterAliaList,getRouterAliaSearchList} from '@/api/schedule';
    import {getEmployeeList} from '@/api/employee';
import util from '@/libs/util';

export default {
  data() {
    return {
      routerDetail: [],
      baseCustomers:[],
      franchiseeSeries:util.cookies.get('__user__franchiseeSeries'),
      customerNumId: util.cookies.get('__user__customernumid'),
      form: {
        customerNumId: util.cookies.get('__user__customernumid'),
        routerDetailAliaSearchKey: '',
        employeeNameSearchKey: '',
      },
      rules: {},
    };
  },
  created() {
      this._getRouterAliaSearchList({
          customerNumId: this.customerNumId,
          customerSeries: '',
          routerSearchKey: '',
          franchiseeSeries:this.franchiseeSeries
      });
      this._getEmployeeList({
          customerNumId: this.customerNumId,
          jobId: '0',
          employeeNameSearchKey: '',
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
      _getEmployeeList(params) {
          getEmployeeList(params)
              .then(res => {
                  if (res.code === 0) {
                      let baseCustomers = [];
                      res.baseCustomers.forEach(item => {
                          baseCustomers.push({
                              value: item.customerName,
                              ...item,
                          });
                      });
                      this.baseCustomers = baseCustomers;
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
      querySearchAsyncEmployee(qs, cb) {
          let baseCustomers = this.baseCustomers;
          var results = qs
              ? baseCustomers.filter(this.createStateFilterRouter(qs))
              : baseCustomers;
          cb(results);
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
