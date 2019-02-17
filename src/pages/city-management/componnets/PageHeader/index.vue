<template>
  <el-form
    :inline="true"
    :model="form"
    :rules="rules"
    ref="form"
    size="mini"
    style="margin-bottom: -18px;">

    <el-form-item>
      <el-select v-model="form.prvId" placeholder="请选择省" clearable>
        <el-option
                v-for="item in allPrv"
                :key="item.prvId"
                :label="item.prvName"
                :value="item.prvId">
        </el-option>
      </el-select>
        <el-button
                type="primary"
                @click="handleAdd">
          <d2-icon name="plus"/>
          新增
        </el-button>
      <el-button
        type="primary"
        @click="handleFormSubmit">
        <d2-icon name="search"/>
        查询
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
    import {
        getAllPrv,
    } from '@/api/dictionary';
import util from '@/libs/util';

export default {
  data() {
    return {
      allPrv: [],
      customerNumId: util.cookies.get('__user__customernumid'),
      editCustomerItem: {
          prvId: ''
      },
      form: {
        customerNumId: util.cookies.get('__user__customernumid'),
        prvId: ''
      },
      rules: {},
    };
  },
  created() {
// 省市区联动数据
      this._getAllPrv({
          current: 1,
          customerNumId: this.customerNumId,
          pageSize: 200,
      });
  },
  methods: {
      _getAllPrv(params) {
          getAllPrv(params)
              .then(res => {
                  if (res.code === 0) {
                      this.allPrv = res.prvNameAndPrvIds;
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
