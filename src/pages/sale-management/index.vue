<template>
  <d2-container>
    <page-header
      slot="header"
      @submit="handleSubmit"
      @add="handleAdd"
      ref="header"/>
    <page-main
      :table-data="table"
      :loading="loading"
       @editSale="editSale"/>
    <page-footer
      slot="footer"
      :current="page.current"
      :size="page.size"
      :total="page.total"
      @change="handlePaginationChange"/>

    <el-dialog title="添加销售" :visible.sync="addSalePopDialog">
      <el-form label-width="100px" :model="addSaleModel" label-position="left" size="mini">
        <el-form-item label="销售员名字">
          <el-input v-model="addSaleModel.salePersonName"></el-input>
        </el-form-item>
        <el-form-item label="销售员电话">
          <el-input v-model="addSaleModel.salePersonPhone"></el-input>
        </el-form-item>
        <el-form-item label="销售加盟商">
          <el-select v-model="addSaleModel.franchiseeId" clearable>
            <el-option v-for="(item, index) in franchiseeNameList" :key="index" :label="item.franchiseeName" :value="item.franchiseeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="在职状态">
          <el-select v-model="addSaleModel.operateStatus" clearable>
            <el-option v-for="(item, index) in operateIdAndoperateStatus" :key="index" :label="item.operateStatusName" :value="item.operateStatusId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入职时间">
          <el-date-picker
                  v-model="addSaleModel.joinDtme"
                  type="datetime"
                  placeholder="选择日期时间"
                  align="right"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelCustomer" size="mini">取 消</el-button>
        <el-button type="primary" @click="onAddSaleConfirm" size="mini"  :loading="loading">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog title="修改销售" :visible.sync="editSalePopDialog">
      <el-form label-width="100px" :model="editSaleModel" label-position="left" size="mini">
        <el-form-item label="销售员名字">
          <el-input v-model="editSaleModel.salePersonName"></el-input>
        </el-form-item>
        <el-form-item label="销售员电话">
          <el-input v-model="editSaleModel.salePersonPhone"></el-input>
        </el-form-item>
        <el-form-item label="销售加盟商">
          <el-select v-model="editSaleModel.franchiseeId" clearable>
            <el-option v-for="(item, index) in franchiseeNameList" :key="index" :label="item.franchiseeName" :value="item.franchiseeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="在职状态">
          <el-select v-model="editSaleModel.operateStatus" clearable>
            <el-option v-for="(item, index) in operateIdAndoperateStatus" :key="index" :label="item.operateStatusName" :value="item.operateStatusId"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelCustomer" size="mini">取 消</el-button>
        <el-button type="primary" @click="onEditSaleConfirm" size="mini"  :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>

<script>
import {
    getAllSale,addSale,editSaleBySeries
} from "@/api/sale";
import {
    getFranchiseeNameList
} from "@/api/franchisee";
import { getAllEmployee } from "@/api/employee";
import {
    getOperateStatus
} from "@/api/dictionary";
import util from "@/libs/util";


export default {
  // name 值和本页的 $route.name 一致才可以缓存页面
  name: 'scheduler',
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
      addSalePopDialog: false,
      editSalePopDialog:false,
      addSaleModel: {
          salePersonName: "",
          salePersonPhone: "",
          franchiseeId: "",
          operateStatus: "",
          joinDtme:"",
          customerNumId:""
        },
        editSaleModel: {
            salePersonId:"",
            salePersonName: "",
            salePersonPhone: "",
            franchiseeId: "",
            operateStatus: "",
            customerNumId:""
        },
      operateIdAndoperateStatus:[],
      franchiseeNameList:[],
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
    };
  },
  created() {
    this._initMyPage();
      this._getOperateStatus({
          customerNumId: this.customerNumId
      });
      this._getFranchiseeNameList({
          customerNumId: this.customerNumId,
          franchiseeType:0
      });
  },
  methods: {
    _initMyPage() {
      this.handleSubmit();
    },
      _getOperateStatus(params) {
          getOperateStatus(params)
              .then(res => {
                  if (res.code === 0) {
                      this.operateIdAndoperateStatus = res.operateIdAndoperateStatus;
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
      _getFranchiseeNameList(params) {
          getFranchiseeNameList(params)
              .then(res => {
                  if (res.code === 0) {
                      this.franchiseeNameList = res.franchiseeNameList;
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
      onAddSaleConfirm(params){
         this.loading=true;
         this.addSaleModel.customerNumId=this.customerNumId;
         this._addSale(this.addSaleModel);
         this.loading=false;
      },
     _addSale(params){
         if (params.salePersonName === '') {
             this.$message({
                 type: 'error',
                 message: '销售名字不可以为空！'
             });
             this.loading = false;
             return;
         }
         if (params.salePersonPhone === '') {
             this.$message({
                 type: 'error',
                 message: '销售电话不可以为空！'
             });
             this.loading = false;
             return;
         }
         if (params.operateStatus === '') {
             this.$message({
                 type: 'error',
                 message: '在职状态不可以为空！'
             });
             this.loading = false;
             return;
         }
         if (params.joinDtme === '') {
             this.$message({
                 type: 'error',
                 message: '入职时间！'
             });
             this.loading = false;
             return;
         }
         addSale(params)
             .then(res => {
                 if (res.code === 0) {
                     this.$message({
                         type: "success",
                         message: "修改成功!"
                     });
                     this.addSalePopDialog = false;
                     this.handleSubmit();
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
      this.loading = true;
      getAllSale({
        customerNumId: util.cookies.get('__user__customernumid'),
        current: this.page.current,
        pageSize: this.page.size,
        ...form,
      })
        .then(res => {
          this.loading = false;
          this.table = res.customerSales;
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
       this.addSalePopDialog=true;
    },
      editSale(param){
         this.editSaleModel.salePersonName=param.salePersonName;
         this.editSaleModel.franchiseeId=param.franchiseeName;
         this.editSaleModel.salePersonPhone=param.salePersonPhone;
         this.editSaleModel.operateStatus=param.operateStatusName;
         this.editSaleModel.customerNumId=this.customerNumId;
         this.editSaleModel.salePersonId=param.salePersonId;
         this.editSalePopDialog=true;
      },
      onEditSaleConfirm(param){
          this.loading=true;
          this.editSaleModel.customerNumId=this.customerNumId;
          this._editSale(this.editSaleModel);
          this.loading=false;
      },
      _editSale(params){
          if (params.salePersonName === '') {
              this.$message({
                  type: 'error',
                  message: '销售名字不可以为空！'
              });
              this.loading = false;
              return;
          }
          if (params.salePersonPhone === '') {
              this.$message({
                  type: 'error',
                  message: '销售电话不可以为空！'
              });
              this.loading = false;
              return;
          }
          if (params.operateStatus === '') {
              this.$message({
                  type: 'error',
                  message: '在职状态不可以为空！'
              });
              this.loading = false;
              return;
          }
          if (params.joinDtme === '') {
              this.$message({
                  type: 'error',
                  message: '入职时间不可以为空！'
              });
              this.loading = false;
              return;
          }
          editSaleBySeries(params)
              .then(res => {
                  if (res.code === 0) {
                      this.$message({
                          type: "success",
                          message: "修改成功!"
                      });
                      this.editSalePopDialog = false;
                      this.handleSubmit();
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
      cancelCustomer(){
        this.addSalePopDialog=false;
        this.editSalePopDialog=false;
        this.editSaleModel.salePersonName="";
        this.editSaleModel.franchiseeId="";
        this.editSaleModel.salePersonPhone="";
        this.editSaleModel.operateStatus="";
        this.editSaleModel.salePersonId="";
        this.addSaleModel.salePersonName="";
        this.addSaleModel.franchiseeId="";
        this.addSaleModel.salePersonPhone="";
        this.addSaleModel.operateStatus="";
        this.addSaleModel.salePersonId="";
        this.addSaleModel.joinDtme="";
      }
  }
};
</script>
