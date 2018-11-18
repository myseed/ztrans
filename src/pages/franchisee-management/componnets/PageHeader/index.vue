<template>
  <el-form
    :inline="true"
    :model="form"
    :rules="rules"
    ref="form"
    size="mini"
    style="margin-bottom: -18px;">


    <el-form-item label="加盟商名字" prop="salePersonNameSearchKey">
      <el-input
        v-model="form.franchiseeNameSearchKey"
        placeholder="请输入"
        style="width: 100px;"/>
    </el-form-item>


    <el-form-item label="加盟商编码" prop="salePersonPhoneSearchKey">
      <el-input
              v-model="form.franchiseeCodeSearchKey"
              placeholder="请输入"
              style="width: 100px;"/>
    </el-form-item>

    <el-form-item label="加盟商类型" prop="salePersonPhoneSearchKey">
      <el-select
              v-model="form.franchiseeType"
              placeholder="请选择"
              style="width: 150px;">
        <el-option v-for="(item, index) in franchiseeNameTypeModels" :key="index" :label="item.franchiseeNameTypeName" :value="item.franchiseeNameTypeId"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="加盟商负责人名字" prop="salePersonPhoneSearchKey">
      <el-input
              v-model="form.chargePersonNameSearchKey"
              placeholder="请输入"
              style="width: 100px;"/>
    </el-form-item>

    <el-form-item label="加盟商负责人电话" prop="salePersonPhoneSearchKey">
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
import {getFranchiseeTypeList} from '@/api/franchisee';
import util from '@/libs/util';

export default {
  data() {
    return {
        franchiseeNameTypeModels: [],
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
