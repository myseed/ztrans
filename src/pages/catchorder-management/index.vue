<template>
  <d2-container>
    <page-header
      slot="header"
      @submit="handleSubmit"
      @handleAdd="handleAdd"
      ref="header"/>
    <page-main
      :table-data="table"
      :loading="loading"
       @updateOrderStatus="updateOrderStatus"
       @deleteRule="deleteRule"
       @selectDriver="selectDriver"/>
    <page-footer
      slot="footer"
      :current="page.current"
      :size="page.size"
      :total="page.total"
      @change="handlePaginationChange"/>

    <el-dialog title="选择获得此标的司机" :visible.sync="selectDialog">
      <el-table
              size="mini"
              :data="tablePopData"
              highlight-current-row
              style="width: 100%"
              height="400">
        <el-table-column
                fixed
                type="index"
                width="50">
        </el-table-column>
        <el-table-column
                prop="driverName"
                label="司机姓名"
        >
        </el-table-column>
        <el-table-column
                prop="carPlateNumber"
                label="司机车牌">
        </el-table-column>
        <el-table-column
                prop="catchPrice"
                label="司机报价"
        >
        </el-table-column>
        <el-table-column
                prop="createDate"
                label="付费时间"
        >
        </el-table-column>
        <el-table-column
                fixed="right"
                label="操作"
                width="80">
        <template slot-scope="scope">
          <el-button @click="confirmDriver(scope.row)" type="primary" size="small">确定</el-button>
        </template>
        </el-table-column>
      </el-table>
    </el-dialog>

  </d2-container>
</template>

<script>

import { getAllCatchOrderByPage,getAllCatchDriverByPage,createCatchOrder,deleteCatchOrder,creatCatchRule,updateCatchOrderStatusToHolding} from "@/api/catchorder";
import { getAllEmployee,register,deleteEmployee,updatePassword,updateEmployee } from "@/api/employee";
import { getAuthorityRoleList } from "@/api/auth";
import {
    getCustomerJob,getCustomerSex
} from "@/api/dictionary";
import {
    getFranchiseeNameList
} from "@/api/franchisee";
import util from "@/libs/util";


export default {
  // name 值和本页的 $route.name 一致才可以缓存页面
  name: 'employee-management',
  components: {
    PageHeader: () => import('./componnets/PageHeader'),
    PageMain: () => import('./componnets/PageMain'),
    PageFooter: () => import('./componnets/PageFooter'),
  },
  data() {
    return {
      selectDialog:false,
      customerJobModels: [],
      customerSexModels:[],
      table: [],
      paylogs:[],
      loading: false,
      customerNumId: util.cookies.get('__user__customernumid'),
      franchiseeSeries:util.cookies.get('__user__franchiseeSeries'),
      addCustomerePopDialog: false,
      passwordUpdatePopDialog: false,
      editCustomerePopDialog:false,
      createOrderModel:{
          customerNumId: util.cookies.get('__user__customernumid'),
          franchiseeSeries:util.cookies.get('__user__franchiseeSeries'),
          series:'',
          driverId:'',
          catchPrice:'',
      },
      updateModel: {
          customerNumId: util.cookies.get('__user__customernumid'),
          franchiseeSeries:util.cookies.get('__user__franchiseeSeries'),
          series: "",
      },
      franchiseeNameList:[],
      authNameList:[],
      page: {
        current: 1,
        size: 5,
        total: 0,
      },
      count:'',
      form:{

      }
    };
  },
  created() {
    this._initMyPage();

  },
  computed: {
      tablePopData() {
          return this.paylogs.slice(
              0,
              2000
          );
      },
  },
  methods: {
      _initMyPage() {
          this.handleSubmit();
      },
      updateOrderStatus(params) {
          this.updateModel.series=params.series;
          updateCatchOrderStatusToHolding(this.updateModel)
                .then(res => {
            if (res.code === 0) {
                this.handleSubmit(this.form);
                this.$message.success('开标成功请尽快选择司机！');
            }
        })
        .catch(err => {
            console.log(err);
        });
      },
      deleteRule(params) {
          this.updateModel.series=params.series;
          deleteCatchOrder(this.updateModel)
                .then(res => {
            if (res.code === 0) {
                this.handleSubmit(this.form);
                this.$message.success('删除成功！');
            }
        })
        .catch(err => {
            console.log(err);
        });
      },
      selectDriver(params) {
          this.updateModel.series=params.series;
          this.selectDialog=true;
          getAllCatchDriverByPage(this.updateModel)
              .then(res => {
                  if (res.code === 0) {
                      this.paylogs = res.catchDriverModels;
                      this.count=res.count;
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
      confirmDriver(row){
         this.createOrderModel.series=this.updateModel.series;
         this.createOrderModel.catchPrice=row.catchPrice;
         this.createOrderModel.driverId=row.driverId;
         createCatchOrder(this.createOrderModel)
              .then(res => {
                  if (res.code === 0) {
                      this.selectDialog=false;
                      this.handleSubmit(this.form);
                      this.$message.success('成功！');
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
      handlePaginationChange(val) {
          this.page = val;
          // nextTick 只是为了优化示例中 notify 的显示
          this.$nextTick(() => {
              this.$refs.header.handleFormSubmit();
          });
      },
      handleSubmit(form) {
          this.form=form;
          this.loading = true;
          getAllCatchOrderByPage({
              customerNumId: util.cookies.get('__user__customernumid'),
              current: this.page.current,
              pageSize: this.page.size,
              franchiseeSeries:this.franchiseeSeries,
              ...form,
          })
              .then(res => {
                  this.loading = false;
                  this.table = res.catchOrderModel;
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
      handleAdd() {
          this.$router.push({
             path: '/create-catch-order'
          });
      },
  }
};
</script>
