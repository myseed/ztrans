<template>
  <el-form
    :inline="true"
    :model="form"
    :rules="rules"
    ref="form"
    size="mini"
    style="margin-bottom: -18px;">



    <el-form-item label="调度人名称" prop="employeeNameSearchKey">
      <el-input
        v-model="form.employeeNameSearchKey"
        placeholder="请输入"
        style="width: 100px;"/>
    </el-form-item>

    <el-form-item label="大客户名称">
      <el-autocomplete v-model="form.customerNameSearchKey"
                       placeholder="请输入大客户名称"
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

  </el-form>
</template>

<script>
import {getRouterAliaList} from '@/api/schedule';
import util from '@/libs/util';
import {
    getMasterCustomerListBySearchKey
} from '@/api/createorder';
export default {
  data() {
    return {
      routerDetail: [],
      form: {
        customerNumId: util.cookies.get('__user__customernumid'),
        routerDetailAliaSearchKey: '',
        employeeNameSearchKey: '',
      },
      masterCustomerSearchKey: {
        customerMasterSearchKey: '',
        customerNumId: '',
      },
      customerMaster: [],
      rules: {},
    };
  },
  created() {
      this._getMasterCustomerListBySearchKey({
          customerNumId: this.customerNumId,
      });
  },
  methods: {
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
      handleSelect(item) {
          // this.createOrder.customerMasterId = item.customerMasterId;
      },
      _getMasterCustomerListBySearchKey(params) {
          getMasterCustomerListBySearchKey(params)
              .then(res => {
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
    handleAdd() {
      this.$emit('add');
    },
  },
};
</script>
