<template>
  <el-form
    :inline="true"
    :model="form"
    :rules="rules"
    ref="form"
    size="mini"
    style="margin-bottom: -18px;">

    <el-form-item>
      <el-input v-model="form.carPlateNumberSearchKey" placeholder="车牌号" style="width: 150px;"></el-input>
    </el-form-item>

    <el-form-item>
      <el-input v-model="form.customerNameSearchKey" placeholder="客户名字" style="width: 150px;"></el-input>
    </el-form-item>

    <el-form-item>
      <el-select v-model="form.routerDetailSeries" placeholder="线路别名" style="width: 150px;">
        <el-option v-for="(item, index) in routerDetail" :key="index" :label="item.routerAlia" :value="item.routerAlia"></el-option>
      </el-select>
    </el-form-item>


    <el-date-picker
            size="mini"
            v-model="form.time"
            @change="onTimeChange"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="约车开始日期"
            end-placeholder="约车结束日期"
            align="right">
    </el-date-picker>

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
import util from '@/libs/util';
import {getRouterAliaList} from '@/api/schedule';
import {getCarTypeList} from '@/api/order';
import {getOrderType} from '@/api/dictionary';

export default {
  data() {
    return {
      routerDetail: [],
      carTypes: [],
      orderTypes: [],
      form: {
        customerNumId: util.cookies.get('__user__customernumid'),
        carPlateNumberSearchKey: '',
        customerNameSearchKey: '',
        routerDetailSeries: '',
        time: '',
      },
      rules: {},
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            },
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            },
          },
          {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            },
          },
        ],
      },
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
  },
};
</script>
