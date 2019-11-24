<template>
  <d2-container>
    <page-header
      slot="header"
      @submit="handleSubmit"
      @loadingStart="loadingStart"
      @loadingEnd="loadingEnd"
      @downLoadOrderExcel="downLoadOrderExcel"
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
    getJdOrderList,downloadOrderExcel,importJdOrder
} from "@/api/jdorder";

import util from "@/libs/util";


export default {
  // name 值和本页的 $route.name 一致才可以缓存页面
  name: 'jd-order-management',
  components: {
    PageHeader: () => import('./componnets/PageHeader'),
    PageMain: () => import('./componnets/PageMain'),
    PageFooter: () => import('./componnets/PageFooter'),
  },
  data() {
    return {
      table: [],
      loading: false,
      customerNumId: util.cookies.get('__user__customernumid'),
      editDictionaryPopDialog:false,
      editDictionaryModel: {
          bizTypeName:"",
          bizTypeId:"",
          dictionaryBizDetail: []
      },
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
      form:{current:1},
    };
  },
  created() {
    this._initMyPage();
  },

  methods: {
      downLoadOrderExcel(form) {
          this.loading = true;
          var url=downloadOrderExcel({
              customerNumId: util.cookies.get('__user__customernumid'),
          });
          window.location.href =url;
          this.loading = false;
      },
      loadingStart(form){
          this.loading = true;
      },
      loadingEnd(form){
          this.loading = false;
      },
    _initMyPage() {
      this.handleSubmit(this.form);
    },
    handlePaginationChange(val) {
      this.page = val;
      // nextTick 只是为了优化示例中 notify 的显示
      this.$nextTick(() => {
          this.form.current=this.page.current;
          this.handleSubmit(this.form);
      });
    },
    handleSubmit(form) {
      this.loading = true;
      this.form=form;
      getJdOrderList({
        customerNumId: util.cookies.get('__user__customernumid'),
        current: this.page.current,
        pageSize: this.page.size,
        ...form,
      })
        .then(res => {
          this.loading = false;
          this.table = res.jdOrders;
          this.page = {
            current: this.form.current,
            size: this.page.size,
            total: res.total,
          };
        })
        .catch(err => {
          this.loading = false;
        });
    },
      editDictionary(param){
          this.$router.push({
              path: '/dictionary-detail',
              query: {bizTypeId: param.bizTypeId,bizTypeName: param.bizTypeName},
          });
         // this.editDictionaryModel.bizTypeName=param.bizTypeName;
         // this.editDictionaryModel.bizTypeId=param.bizTypeId;
         // this.editDictionaryModel.dictionaryBizDetail=param.bizContentName.split(";");
         // this.editDictionaryPopDialog=true;
      },

      cancelCustomer(){
        this.editDictionaryPopDialog=false;
      },
      handleSubmitPage(form){
          handleSubmit(form);
      }
  }
};
</script>
