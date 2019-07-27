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
       @selectDriver="selectDriver"
       @selectHistory="selectHistory"/>
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
                prop="competePrice"
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

    <el-dialog title="司机竞标详情" :visible.sync="selectHistoryDialog">
      <el-table
              size="mini"
              :data="historyPopData"
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
                prop="competePrice"
                label="司机报价"
        >
        </el-table-column>
        <el-table-column
                prop="statusName"
                label="竞标结果"
        >
        </el-table-column>

      </el-table>
    </el-dialog>

  </d2-container>
</template>

<script>

import { getAllCompeteOrderByPage,getAllCompeteDriverByPage,createCompeteOrder,deleteCompeteOrder,creatCompeteRule,updateCompeteOrderStatusToHolding,getCompeteDriverList} from "@/api/competeorder";

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
      selectHistoryDialog:false,
      customerJobModels: [],
      customerSexModels:[],
      table: [],
      paylogs:[],
      historylogs:[],
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
          competePrice:'',
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
          current:1
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
      historyPopData() {
          return this.historylogs.slice(
              0,
              2000
          );
      },
  },
  methods: {
      _initMyPage() {
          this.handleSubmit(this.form);
      },
      updateOrderStatus(params) {
          this.updateModel.series=params.series;
          updateCompeteOrderStatusToHolding(this.updateModel)
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
          deleteCompeteOrder(this.updateModel)
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
          getAllCompeteDriverByPage(this.updateModel)
              .then(res => {
                  if (res.code === 0) {
                      this.paylogs = res.competeDriverModel;
                      this.count=res.count;
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
      selectHistory(params) {
          this.updateModel.series=params.series;
          this.selectHistoryDialog=true;
          getCompeteDriverList(this.updateModel)
              .then(res => {
                  if (res.code === 0) {
                      this.historylogs = res.competeDriverModels;
                      this.count=res.count;
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
      confirmDriver(row){
         this.createOrderModel.series=row.series;
         this.createOrderModel.competePrice=row.competePrice;
         this.createOrderModel.driverId=row.driverId;
          createCompeteOrder(this.createOrderModel)
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
              this.form.current=this.page.current;
              this.handleSubmit(this.form);
          });
      },
      handleSubmit(form) {
          this.form=form;
          this.loading = true;
          getAllCompeteOrderByPage({
              customerNumId: util.cookies.get('__user__customernumid'),
              current: this.page.current,
              pageSize: this.page.size,
              franchiseeSeries:this.franchiseeSeries,
              ...form,
          })
              .then(res => {
                  this.loading = false;
                  this.table = res.competeOrderModel;
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
      handleAdd() {
          this.$router.push({
             path: '/create-compete-order'
          });
      },
  }
};
</script>
