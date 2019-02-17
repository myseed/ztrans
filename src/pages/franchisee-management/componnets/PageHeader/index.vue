<template>
  <el-form
    :inline="true"
    :model="form"
    :rules="rules"
    ref="form"
    size="mini"
    style="margin-bottom: -18px;">


    <el-form-item label="加盟商名字" prop="franchiseeNameSearchKey">
      <!--<el-input-->
        <!--v-model="form.franchiseeNameSearchKey"-->
        <!--placeholder="请输入"-->
        <!--style="width: 100px;"/>-->
      <el-autocomplete v-model="form.franchiseeNameSearchKey"
                       placeholder="加盟商名字"
                       clearable
                       :fetch-suggestions="querySearchAsyncFranchiseeName"
                       @select="handleSelect">
      </el-autocomplete>
    </el-form-item>


    <el-form-item label="加盟商编码" prop="franchiseeCodeSearchKey">
      <!--<el-input-->
              <!--v-model="form.franchiseeCodeSearchKey"-->
              <!--placeholder="请输入"-->
              <!--style="width: 100px;"/>-->
      <el-autocomplete v-model="form.franchiseeCodeSearchKey"
                       placeholder="加盟商名字"
                       clearable
                       :fetch-suggestions="querySearchAsyncFranchiseeCode"
                       @select="handleSelect">
      </el-autocomplete>
    </el-form-item>

    <el-form-item label="加盟商类型" prop="franchiseeType">
      <el-select
              v-model="form.franchiseeType"
              placeholder="请选择"
              clearable
              style="width: 150px;">
        <el-option v-for="(item, index) in franchiseeNameTypeModels" :key="index" :label="item.franchiseeNameTypeName" :value="item.franchiseeNameTypeId"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="加盟商负责人名字" prop="chargePersonNameSearchKey">
      <!--<el-input-->
              <!--v-model="form.chargePersonNameSearchKey"-->
              <!--placeholder="请输入"-->
              <!--style="width: 100px;"/>-->
      <el-autocomplete v-model="form.chargePersonNameSearchKey"
                       placeholder="加盟商负责人名字"
                       clearable
                       :fetch-suggestions="querySearchAsyncChargePerson"
                       @select="handleSelect">
      </el-autocomplete>
    </el-form-item>

    <el-form-item label="加盟商负责人电话" prop="chargePersonPhoneSearchKey">
      <el-input
              v-model="form.chargePersonPhoneSearchKey"
              placeholder="请输入"
              style="width: 100px;"/>
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
import {getFranchiseeTypeList,getFranchiseeNameList} from '@/api/franchisee';
import util from '@/libs/util';

export default {
  data() {
    return {
        franchiseeNameTypeModels: [],
        franchiseeNames: [],
        franchiseeCodes: [],
        chargePersonNames: [],
      form: {
        customerNumId: util.cookies.get('__user__customernumid'),
        franchiseeNameSearchKey: '',
        franchiseeCodeSearchKey: '',
        chargePersonNameSearchKey: '',
        chargePersonPhoneSearchKey: '',
        franchiseeType: '',
        franchiseeLevel: '',
      },
      rules: {},
    };
  },
  created() {
      this._getFranchiseeTypeList({
          customerNumId: this.form.customerNumId,
      });
      this._getFranchiseeNameList({
          customerNumId: this.form.customerNumId,
      });
  },
  methods: {
      _getFranchiseeTypeList(params) {
          getFranchiseeTypeList(params)
              .then(res => {
                  if (res.code === 0) {
                      this.franchiseeNameTypeModels = res.franchiseeNameTypeModel;
                  }
              })
              .catch(err => {
                  console.log(err);
              });
     },
      _getFranchiseeNameList(params) {
          getFranchiseeNameList(params)
              .then(res => {
                  if (res.code === 0) {
                      let franchiseeNames = [];
                      res.franchiseeNameList.forEach(item => {
                          franchiseeNames.push({
                              value: item.franchiseeName,
                              ...item,
                          });
                      });
                      this.franchiseeNames = franchiseeNames;
                      let franchiseeCodes = [];
                      res.franchiseeNameList.forEach(item => {
                          franchiseeCodes.push({
                              value: item.franchiseeCode,
                              ...item,
                          });
                      });
                      this.franchiseeCodes = franchiseeCodes;
                      let chargePersonNames = [];
                      res.franchiseeNameList.forEach(item => {
                          chargePersonNames.push({
                              value: item.chargePersonName,
                              ...item,
                          });
                      });
                      this.chargePersonNames = chargePersonNames;
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
      querySearchAsyncFranchiseeName(qs, cb) {
          let franchiseeNames = this.franchiseeNames;
          var results = qs
              ? franchiseeNames.filter(this.createStateFilter(qs))
              : franchiseeNames;
          cb(results);
      },
      querySearchAsyncFranchiseeCode(qs, cb) {
          let franchiseeCodes = this.franchiseeCodes;
          var results = qs
              ? franchiseeCodes.filter(this.createStateFilter(qs))
              : franchiseeCodes;
          cb(results);
      },
      querySearchAsyncFranchiseeCode(qs, cb) {
          let franchiseeCodes = this.franchiseeCodes;
          var results = qs
              ? franchiseeCodes.filter(this.createStateFilter(qs))
              : franchiseeCodes;
          cb(results);
      },
      querySearchAsyncChargePerson(qs, cb) {
          let chargePersonNames = this.chargePersonNames;
          var results = qs
              ? chargePersonNames.filter(this.createStateFilter(qs))
              : chargePersonNames;
          cb(results);
      },
      handleSelect(item){

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
