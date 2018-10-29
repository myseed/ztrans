<template>
  <d2-container>
    <page-header
      slot="header"
      @submit="handleSubmit"
      ref="header"/>
    <page-main
      :table-data="table"
      :loading="loading"/>
    <page-footer
      slot="footer"
      :current="page.current"
      :size="page.size"
      :total="page.total"
      @change="handlePaginationChange"/>
  </d2-container>
</template>

<script>
import {
  getOrderByCustomerNumId,
  selectDriver,
  confirmDriver,
  getDriverOrderDetail,
  getCarSizeList,
  deleteOrder
} from "@/api/order";
import { getOrderType } from "@/api/dictionary";

export default {
  // name 值和本页的 $route.name 一致才可以缓存页面
  name: "vehicle-assign",
  components: {
    PageHeader: () => import("./componnets/PageHeader"),
    PageMain: () => import("./componnets/PageMain"),
    PageFooter: () => import("./componnets/PageFooter")
  },
  data() {
    return {
      table: [],
      loading: false,
      page: {
        current: 1,
        size: 100,
        total: 0
      }
    };
  },
  created() {
    this._initMyPage();
  },
  methods: {
    _initMyPage() {
      this.handleSubmit();
    },
    handlePaginationChange(val) {
      this.$notify({
        title: "分页变化",
        message: `当前第${val.current}页 共${val.total}条 每页${val.size}条`
      });
      this.page = val;
      // nextTick 只是为了优化示例中 notify 的显示
      this.$nextTick(() => {
        this.$refs.header.handleFormSubmit();
      });
    },
    handleSubmit(form) {
      this.loading = true;
      this.$notify({
        title: "开始请求数据"
      });
      console.log(form)
      getOrderByCustomerNumId({
        current: this.page.current,
        pageSize: this.page.size,
        ...form
      })
        .then(res => {
          this.loading = false;
          this.$notify({
            title: "数据请求完毕"
          });

          this.table = res.orderModel;
          this.page = {
            current: 1,
            size: 100,
            total: res.total
          };
        })
        .catch(err => {
          this.loading = false;
          this.$notify({
            title: "数据请求异常"
          });
        });
    }
  }
};
</script>
