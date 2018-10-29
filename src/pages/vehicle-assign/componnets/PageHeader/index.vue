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

    <el-form-item label="线路编号" prop="routerNumberSearchKey">
      <el-input
        v-model="form.routerNumberSearchKey"
        placeholder="请输入"
        style="width: 100px;"/>
    </el-form-item>

    <el-form-item label="线路别名" prop="routerAliaSearchKey">
      <el-select
        v-model="form.routerAliaSearchKey"
        placeholder="请选择"
        style="width: 150px;">
        <el-option v-for="(item, index) in routerDetail" :key="index" :label="item.routerAlia" :value="item.routerAlia"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="车型" prop="carType">
      <el-select
        v-model="form.carType"
        placeholder="请选择"
        style="width: 150px;">
        <el-option v-for="(item, index) in carTypes" :key="index" :label="item.typeName" :value="item.typeId"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="订单类型" prop="orderType">
      <el-select
        v-model="form.orderType"
        placeholder="请选择"
        style="width: 150px;">
        <el-option v-for="(item, index) in orderTypes" :key="index" :label="item.orderTypeName" :value="item.orderTypeId"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="约车时间" prop="appointmentDate">
      <el-date-picker
        size="mini"
        v-model="form.appointmentDate"
        type="datetime"
        placeholder="请选择"
        align="right"
        value-format="yyyy-MM-dd HH:mm:ss"
        :picker-options="pickerOptions"
        style="width: 175px;">
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

  </el-form>
</template>

<script>
import util from "@/libs/util";
import { getRouterAliaList } from "@/api/schedule";
import { getCarTypeList } from "@/api/order";
import { getOrderType } from "@/api/dictionary";

export default {
  data() {
    return {
      routerDetail: [],
      carTypes: [],
      orderTypes: [],
      form: {
        customerNumId: util.cookies.get("__user__customernumid"),
        carType: "",
        orderType: "",
        appointmentDate: "",
        customerNameSearchKey: "",
        routerAliaSearchKey: "",
        routerNumberSearchKey: "",
        deliverStatus: 0
      },
      rules: {},
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      }
    };
  },
  created() {
    this._getRouterAliaList({
      customerNumId: this.form.customerNumId
    });
    this._getCarTypeList({
      customerNumId: this.form.customerNumId
    });
    this._getOrderTypeList({
      customerNumId: this.form.customerNumId
    });
  },
  methods: {
    _getOrderTypeList(params) {
      getOrderType(params)
        .then(res => {
          if (res.code === 0) {
            this.orderTypes = res.orderTypeModels;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    _getCarTypeList(params) {
      getCarTypeList(params)
        .then(res => {
          if (res.code === 0) {
            this.carTypes = res.carTypes;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
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
          this.$emit("submit", this.form);
        } else {
          this.$notify.error({
            title: "错误",
            message: "表单校验失败"
          });
          return false;
        }
      });
    },
    handleFormReset() {
      this.$refs.form.resetFields();
    }
  }
};
</script>
