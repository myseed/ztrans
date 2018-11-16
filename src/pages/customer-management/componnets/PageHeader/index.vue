<template>
  <el-form
    :inline="true"
    :model="form"
    :rules="rules"
    ref="form"
    size="mini"
    style="margin-bottom: -18px;">

    <el-form-item label="客户名称" prop="customerNameSearchKey">
      <el-input
        v-model="form.customerNameSearchKey"
        placeholder="请输入"
        style="width: 100px;"/>
    </el-form-item>

    <el-form-item label="联系人" prop="contactNameSearchKey">
      <el-input
        v-model="form.contactNameSearchKey"
        placeholder="请输入"
        style="width: 100px;"/>
    </el-form-item>

    <el-form-item label="联系电话" prop="mobilePhoneSearchKey">
      <el-input
        v-model="form.mobilePhoneSearchKey"
        placeholder="请输入"
        style="width: 100px;"/>
    </el-form-item>

    <el-form-item label="销售员" prop="saleId">
      <el-select v-model="form.saleId" placeholder="请选择">
        <el-option v-for="(item, index) in customerSales" :key="index" :label="item.salePersonName" :value="item.salePersonId"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="注册日期" prop="registerTime">
      <el-date-picker
        size="mini"
        v-model="registerTime"
        @change="onRegisterTimeChange"
        type="datetimerange"
        value-format="yyyy-MM-dd HH:mm:ss"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right">
      </el-date-picker>
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
import {getAllSaleList} from '@/api/customer';

export default {
  data() {
    return {
      customerSales: [],
      registerTime: '',
      form: {
        customerNumId: util.cookies.get('__user__customernumid'),
        saleId: '',
        contactNameSearchKey: '',
        customerNameSearchKey: '',
        mobilePhoneSearchKey: '',
        registerEndTime: '',
        registerStartTime: '',
      },
      rules: {},
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            },
          },
        ],
      },
    };
  },
  created() {
    this._getAllSaleList({
      customerNumId: this.form.customerNumId,
      franchiseeId: '',
    });
  },
  methods: {
    _getAllSaleList(params) {
      getAllSaleList(params)
        .then(res => {
          if (res.code === 0) {
            this.customerSales = res.customerSales;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    onRegisterTimeChange(time) {
      this.form.registerStartTime = time[0];
      this.form.registerEndTime = time[1];
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
      this.registerTime = '';
    },
    handleAdd() {
      this.$emit('add');
    },
  },
};
</script>
