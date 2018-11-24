<template>
  <el-form
    :inline="true"
    :model="form"
    :rules="rules"
    ref="form"
    size="mini"
    style="margin-bottom: -18px;">


    <el-form-item label="业务类型" prop="bizTypeNameSearchKey">
      <el-input
        v-model="form.bizTypeNameSearchKey"
        placeholder="请输入"
        style="width: 100px;"/>
    </el-form-item>


    <el-form-item label="业务明细" prop="bizContentNameSearchKey">
      <el-input
              v-model="form.bizContentNameSearchKey"
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

  </el-form>
</template>

<script>
import {getFranchiseeTypeList} from '@/api/franchisee';
import util from '@/libs/util';

export default {
  data() {
    return {
      form: {
        customerNumId: util.cookies.get('__user__customernumid'),
        bizTypeNameSearchKey: '',
        bizContentNameSearchKey: ''
      },
      rules: {},
    };
  },
  created() {

  },
  methods: {
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
