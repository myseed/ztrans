<template>
  <el-form
    :inline="true"
    :model="form"
    :rules="rules"
    ref="form"
    size="mini"
    style="margin-bottom: -18px;">



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
        type="primary"
        @click="handleAdd">
        <d2-icon name="plus"/>
        新增会员规则
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
      form: {
        customerNumId: util.cookies.get('__user__customernumid'),
        franchiseeSeries:util.cookies.get('__user__franchiseeSeries'),
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
