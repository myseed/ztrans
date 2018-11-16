<template>
  <el-form
    :inline="true"
    :model="form"
    :rules="rules"
    ref="form"
    size="mini"
    style="margin-bottom: -18px;">

    <el-form-item label="线路别名" prop="routerDetailAliaSearchKey">
      <el-select
        v-model="form.routerDetailAliaSearchKey"
        placeholder="请选择"
        style="width: 150px;">
        <el-option v-for="(item, index) in routerDetail" :key="index" :label="item.routerAlia" :value="item.routerAlia"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="车牌号" prop="carPlateNumberSearchKey">
      <el-input
        v-model="form.carPlateNumberSearchKey"
        placeholder="请输入"
        style="width: 100px;"/>
    </el-form-item>

    <el-form-item label="司机姓名" prop="driverNameSearchKey">
      <el-input
        v-model="form.driverNameSearchKey"
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
import util from '@/libs/util';
import {getRouterAliaList} from '@/api/schedule';

export default {
  data() {
    return {
      routerDetail: [],
      form: {
        customerNumId: util.cookies.get('__user__customernumid'),
        routerDetailAliaSearchKey: '',
        carPlateNumberSearchKey: '',
        driverNameSearchKey: '',
      },
      rules: {},
    };
  },
  created() {
    this._getRouterAliaList({
      customerNumId: this.form.customerNumId,
    });
  },
  methods: {
    _getRouterAliaList(params) {
      getRouterAliaList(params)
        .then(res => {
          if (res.code === 0) {
            this.routerDetail = res.routerDetail;
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
