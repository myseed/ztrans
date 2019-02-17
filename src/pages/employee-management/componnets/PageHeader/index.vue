<template>
  <el-form
    :inline="true"
    :model="form"
    :rules="rules"
    ref="form"
    size="mini"
    style="margin-bottom: -18px;">


    <el-form-item label="员工名字" prop="employeeNameSearchKey">
      <!--<el-input-->
        <!--v-model="form.employeeNameSearchKey"-->
        <!--placeholder="请输入"-->
        <!--style="width: 100px;"/>-->
      <el-autocomplete v-model="form.employeeNameSearchKey"
                       placeholder="员工名字"
                       clearable
                       :fetch-suggestions="querySearchAsyncEmployee"
                       @select="handleSelect">
      </el-autocomplete>
    </el-form-item>


    <el-form-item label="员工工号" prop="employeeJobNumSearchKey">
      <!--<el-input-->
              <!--v-model="form.employeeJobNumSearchKey"-->
              <!--placeholder="请输入"-->
              <!--style="width: 100px;"/>-->
      <el-autocomplete v-model="form.employeeJobNumSearchKey"
                       placeholder="员工工号"
                       clearable
                       :fetch-suggestions="querySearchAsyncEmployeeJobNum"
                       @select="handleSelect">
      </el-autocomplete>

    </el-form-item>

    <el-form-item label="职位" prop="jobId">
      <el-select
              v-model="form.jobId"
              placeholder="请选择"
              clearable
              style="width: 150px;">
        <el-option v-for="(item, index) in customerJobModels" :key="index" :label="item.customerJobName" :value="item.customerJobCode"></el-option>
      </el-select>
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
        新增员工
      </el-button>
    </el-form-item>

  </el-form>
</template>

<script>
import {getCustomerJob} from '@/api/dictionary';
import {getEmployeeList} from '@/api/employee';
import util from '@/libs/util';

export default {
  data() {
    return {
        customerJobModels: [],
        baseCustomers:[],
        baseCustomersJobNum:[],
      form: {
        customerNumId: util.cookies.get('__user__customernumid'),
        employeeNameSearchKey: '',
        employeeJobNumSearchKey: '',
        jobId: ''
      },
      rules: {},
    };
  },
  created() {
      this._getCustomerJob({
          customerNumId: this.form.customerNumId,
      });
      this._getEmployeeList({
          customerNumId: this.customerNumId,
          jobId: '',
          employeeNameSearchKey: '',
      });
  },
  methods: {
      _getCustomerJob(params) {
          getCustomerJob(params)
              .then(res => {
                  if (res.code === 0) {
                      this.customerJobModels = res.customerJobModels;
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
                      let baseCustomersJobNum = [];
                      res.baseCustomers.forEach(item => {
                          baseCustomersJobNum.push({
                              value: item.jobNum,
                              ...item,
                          });
                      });
                      this.baseCustomersJobNum = baseCustomersJobNum;
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
      querySearchAsyncEmployeeJobNum(qs, cb) {
          let baseCustomersJobNum = this.baseCustomersJobNum;
          var results = qs
              ? baseCustomersJobNum.filter(this.createStateFilterRouter(qs))
              : baseCustomersJobNum;
          cb(results);
      },
      querySearchAsyncEmployee(qs, cb) {
          let baseCustomers = this.baseCustomers;
          var results = qs
              ? baseCustomers.filter(this.createStateFilterRouter(qs))
              : baseCustomers;
          cb(results);
      },
      createStateFilterRouter(qs) {
          return state => {
              return state.value.toLowerCase().indexOf(qs.toLowerCase()) != -1;
          };
      },
      handleSelect(item) {

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
