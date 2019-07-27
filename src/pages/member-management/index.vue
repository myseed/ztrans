<template>
  <d2-container>
    <page-header
      slot="header"
      @submit="handleSubmit"
      @selectHistory="selectHistory"
      ref="header"/>
    <page-main
      :table-data="table"
      :loading="loading"
       @refundMoney="refundMoney"
       @cutMoney="cutMoney"
       @selectHistory="selectHistory"/>
    <page-footer
      slot="footer"
      :current="page.current"
      :size="page.size"
      :total="page.total"
      @change="handlePaginationChange"/>


    <el-dialog title="扣款" :visible.sync="cutMoneyPopDialog">
      <el-form label-width="130px" :model="refundModel" label-position="left" size="mini">
        <el-form-item label="司机姓名"  >
          <el-input v-model="refundModel.driverName" disabled></el-input>
        </el-form-item>
        <el-form-item label="司机车牌"  >
          <el-input v-model="refundModel.carPlateNumber" disabled></el-input>
        </el-form-item>
        <el-form-item label="会员规则"  >
          <el-input v-model="refundModel.memberRuleTitle" disabled></el-input>
        </el-form-item>
        <el-form-item label="司机剩余金额"  >
          <el-input v-model="refundModel.driverPrice" disabled></el-input>
        </el-form-item>
        <el-form-item label="扣款金额"  >
          <el-input v-model="refundModel.refundMoney" ></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelCustomer" size="mini">取 消</el-button>
        <el-button type="primary" @click="cutConfirm" size="mini"  :loading="loading">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="退款" :visible.sync="editDictionaryPopDialog">
      <el-form label-width="130px" :model="refundModel" label-position="left" size="mini">
        <el-form-item label="司机姓名"  >
          <el-input v-model="refundModel.driverName" disabled></el-input>
        </el-form-item>
        <el-form-item label="司机车牌"  >
          <el-input v-model="refundModel.carPlateNumber" disabled></el-input>
        </el-form-item>
        <el-form-item label="会员规则"  >
          <el-input v-model="refundModel.memberRuleTitle" disabled></el-input>
        </el-form-item>
        <el-form-item label="司机支付定金"  >
          <el-input v-model="refundModel.driverPrice" disabled></el-input>
        </el-form-item>
        <el-form-item label="退款金额"  >
          <el-input v-model="refundModel.refundMoney" ></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelCustomer" size="mini">取 消</el-button>
        <el-button type="primary" @click="refundConfirm" size="mini"  :loading="loading">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="历史流水" :visible.sync="selectDialog">
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
                prop="carPlateNumber"
                label="车牌号"
                >
        </el-table-column>
        <el-table-column
                prop="memberRuleTitle"
                label="会员规则">
        </el-table-column>
        <el-table-column
                prop="driverPrice"
                label="费用"
                >
        </el-table-column>
        <el-table-column
                prop="payStatusName"
                label="支付类型"
                >
        </el-table-column>
        <el-table-column
                prop="payTime"
                label="支付时间"
                >
        </el-table-column>
      </el-table>
    </el-dialog>
  </d2-container>
</template>

<script>

import {getPayLog,refundMemberMoney,getMemberByDriverInfo,cutMemberMoney} from '@/api/member';

import util from "@/libs/util";


export default {
  // name 值和本页的 $route.name 一致才可以缓存页面
  name: 'dictionary-management',
  components: {
    PageHeader: () => import('./componnets/PageHeader'),
    PageMain: () => import('./componnets/PageMain'),
    PageFooter: () => import('./componnets/PageFooter'),
  },
  data() {
    return {
      table: [],
      paylogs: [],
      loading: false,
      customerNumId: util.cookies.get('__user__customernumid'),
      editDictionaryPopDialog:false,
      cutMoneyPopDialog:false,
      selectDialog:false,
      refundModel: {
          series:"",
          memberRuleSeries:"",
          refundMoney: "",
          driverName:"",
          carPlateNumber:"",
          memberRuleTitle:"",
          driverPrice:"",
      },
      page: {
        current: 1,
        size: 5,
        total: 0,
      },
      form:{current:1}
    };
  },
    computed: {
        tablePopData() {
            return this.paylogs.slice(
                0,
                100
            );
        },
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
      this.form=form;
      this.loading = true;
      getMemberByDriverInfo({
        customerNumId: util.cookies.get('__user__customernumid'),
        current: this.page.current,
        pageSize: this.page.size,
        ...form,
      })
        .then(res => {
          this.loading = false;
          this.table = res.memberModels;
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
      selectHistory(params) {
          getPayLog({
              customerNumId: util.cookies.get('__user__customernumid'),
              ...params,
          })
              .then(res => {
                  this.selectDialog=true;
                  this.paylogs = res.payLogDriverModels;
              })
              .catch(err => {

              });
      },
      refundMoney(param){
         this.refundModel.series=param.series;
         this.refundModel.memberRuleSeries=param.memberRuleSeries;
         this.refundModel.driverName=param.driverName;
         this.refundModel.carPlateNumber=param.carPlateNumber;
         this.refundModel.memberRuleTitle=param.memberRuleTitle;
         this.refundModel.driverPrice=param.driverPrice;
         this.editDictionaryPopDialog=true;
      },

      cutMoney(param){
          this.refundModel.series=param.series;
          this.refundModel.memberRuleSeries=param.memberRuleSeries;
          this.refundModel.driverName=param.driverName;
          this.refundModel.carPlateNumber=param.carPlateNumber;
          this.refundModel.memberRuleTitle=param.memberRuleTitle;
          this.refundModel.driverPrice=param.driverPrice;
          this.cutMoneyPopDialog=true;
      },

      cancelCustomer(){
        this.editDictionaryPopDialog=false;
        this.cutMoneyPopDialog=false;
        this.refundModel.series='';
        this.refundModel.memberRuleSeries='';
        this.refundModel.driverName='';
        this.refundModel.carPlateNumber='';
        this.refundModel.memberRuleTitle='';
        this.refundModel.driverPrice='';
        this.refundModel.refundMoney='';
      },
      handleSubmitPage(form){
          handleSubmit(form);
      },
      refundConfirm() {
          this.$confirm('退款后改司机将不再是会员,是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
          }).then(() => {
              this.loading = true;
              refundMemberMoney(this.refundModel)
                  .then(res => {
                      this.loading = false;
                      this.$message({
                          type: "success",
                          message: "退款成功！"
                      });
                      this.handleSubmit();
                      this.editDictionaryPopDialog=false;
                  })
                  .catch(err => {
                      this.loading = false;
                  });
          });
      },
      cutConfirm() {
          this.$confirm('即将扣款,是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
          }).then(() => {
              this.loading = true;
              cutMemberMoney(this.refundModel)
                  .then(res => {
                      this.loading = false;
                      this.$message({
                          type: "success",
                          message: "扣款成功！"
                      });
                      this.handleSubmit();
                      this.cutMoneyPopDialog=false;
                  })
                  .catch(err => {
                      this.loading = false;
                  });
          });
      },
  }
};
</script>
