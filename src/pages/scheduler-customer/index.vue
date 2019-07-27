<template>
  <d2-container>
    <page-header
            slot="header"
            @submit="handleSubmit"
            @add="handleAdd"
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
  getAllRouterAndEmployee,
  getRouterAliaList,
  addRouterToEmployee,
} from '@/api/schedule';
import {getAllEmployee} from '@/api/employee';
import {getAllEmployeeAndCustomerName} from '@/api/schedulecustomer';
import util from '@/libs/util';
import {
    getMasterCustomerListBySearchKey
} from '@/api/createorder';

export default {
  // name 值和本页的 $route.name 一致才可以缓存页面
  name: 'scheduler-customer',
  components: {
    PageHeader: () => import('./componnets/PageHeader'),
    PageMain: () => import('./componnets/PageMain'),
    PageFooter: () => import('./componnets/PageFooter'),
  },
  data() {
    return {
      table: [],
      baseCustomers: [],
      loading: false,
      addDialog: false,
      innerVisible: false,
      customerName:'',
      customerNumId: util.cookies.get('__user__customernumid'),
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
      form:{current:1}
    };
  },
  created() {
    this._initMyPage();
  },
  methods: {
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
      getAllEmployeeAndCustomerName({
        current: this.page.current,
        pageSize: this.page.size,
        ...form,
      })
        .then(res => {
          this.loading = false;
          this.table = res.employeeCustomerModel;
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
  },
};
</script>
