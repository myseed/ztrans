<template>
  <el-form
    :inline="true"
    :model="form"
    :rules="rules"
    ref="form"
    size="mini"
    style="margin-bottom: -18px;">


    <el-form-item label="销售员姓名" prop="salePersonNameSearchKey">
      <!--<el-input-->
        <!--v-model="form.salePersonNameSearchKey"-->
        <!--placeholder="请输入"-->
        <!--style="width: 100px;"/>-->
      <el-autocomplete v-model="form.salePersonNameSearchKey"
                       placeholder="销售员"
                       clearable
                       :fetch-suggestions="querySearchAsyncSaleName"
                       @select="handleSelectSaleName">
      </el-autocomplete>
    </el-form-item>


    <el-form-item label="销售员手机" prop="salePersonPhoneSearchKey">
      <el-input
              v-model="form.salePersonPhoneSearchKey"
              placeholder="请输入"
              style="width: 200px;"/>
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
import {getRouterAliaList} from '@/api/schedule';
import {getAllSaleList} from '@/api/customer';
import util from '@/libs/util';

export default {
  data() {
    return {
      routerDetail: [],
      franchiseeSeries:util.cookies.get('__user__franchiseeSeries'),
      form: {
        customerNumId: util.cookies.get('__user__customernumid'),
        salePersonNameSearchKey: '',
        salePersonPhoneSearchKey: '',
      },
      rules: {},
    };
  },
  created() {
      this._getAllSaleList({
          customerNumId: this.form.customerNumId,
          franchiseeId: this.franchiseeSeries,
      });
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
      querySearchAsyncSaleName(qs, cb) {
          let saleNames = this.saleNames;
          var results = qs
              ? saleNames.filter(this.createStateFilter(qs))
              : saleNames;
          cb(results);
      },
      handleSelectSaleName(item){

      },
      _getAllSaleList(params) {
          getAllSaleList(params)
              .then(res => {
                  if (res.code === 0) {
                      let saleName = [];
                      res.customerSales.forEach(item => {
                          saleName.push({
                              value: item.salePersonName,
                              ...item,
                          });
                      });
                      this.saleNames = saleName;
                  }
              })
              .catch(err => {
                  console.log(err);
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
