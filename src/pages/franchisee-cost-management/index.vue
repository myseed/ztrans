<template>
  <d2-container>
    <page-header
      slot="header"
      @submit="handleSubmit"
      @downLoadExcel="downLoadExcel"
      @calculate="calculate"
      ref="header"/>
    <page-main
      :table-data="table"
      :loading="loading"
      @orderInfos="orderInfoss"/>
    <page-footer
      slot="footer"
      :current="page.current"
      :size="page.size"
      :total="page.total"
      @change="handlePaginationChange"/>
  </d2-container>
</template>

<script>
import util from '@/libs/util';
import {getOrderPriceList,exportOrderPrice,updateOrderFeeByHasCalculate} from '@/api/orderprice';

export default {
  // name 值和本页的 $route.name 一致才可以缓存页面
  name: 'vehicle-assign',
  components: {
    PageHeader: () => import('./componnets/PageHeader'),
    PageMain: () => import('./componnets/PageMain'),
    PageFooter: () => import('./componnets/PageFooter'),
  },
  data() {
    return {
      table: [],
      orderInfos: [],
      customerNumId: util.cookies.get('__user__customernumid'),
      franchiseeSeries:util.cookies.get('__user__franchiseeSeries'),
      loading: false,
      form: { },
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
    };
  },
  created() {
    this._initMyPage();
  },
    watch: {
        $route(to, from) {
            this._initMyPage();
        }
    },
  methods: {
    _initMyPage() {
      this.handleSubmit();
    },
    handlePaginationChange(val) {
      this.page = val;
      // nextTick 只是为了优化示例中 notify 的显示
      this.$nextTick(() => {
        this.$refs.header.handleFormSubmit();
      });
    },
      handleSubmit(form) {
          this.loading = true;
          this.form=form;
          getOrderPriceList({
              customerNumId: this.customerNumId,
              franchiseeSeries: this.franchiseeSeries,
              current: this.page.current,
              pageSize: this.page.size,
              status:this.$route.params.status,
              ...form,
          })
              .then(res => {
                  this.loading = false;
                  this.table = res.orderPriceModels;
                  this.page = {
                      current: this.page.current,
                      size: this.page.size,
                      total: res.total,
                  };
              })
              .catch(err => {
                  this.loading = false;
              });
      },
      orderInfoss(param) {
          for(var i of param.orderInfos) {
              this.orderInfos.push(i.series);
          };
      },
      calculate(param){
          this.$confirm("此操作将更改订单结算状态, 是否继续?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
          })
              .then(() => {
          updateOrderFeeByHasCalculate({
              customerNumId:this.customerNumId,
              orderInfos:this.orderInfos
          })
              .then(res => {
                  this.$message({
                      type: 'success',
                      message: '修改结算状态成功！'
                  });
                  this.handleSubmit(this.form);
              })
              .catch(err => {
                  console.log(err);
              });
      }) .catch(() => {
              console.log("更改结算状态失败！");
          });
      },
     downLoadExcel(form) {
      this.loading = true;
      var url=exportOrderPrice({
        customerNumId: this.customerNumId,
        status:this.$route.params.status,
        ...form,
      });
         window.location.href =url;
         this.loading = false;
     },
  },
};
</script>
