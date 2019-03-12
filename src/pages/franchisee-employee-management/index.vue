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
       @editPassword="editPassword"
       @deleteCustomerId="deleteCustomerId"/>
    <page-footer
      slot="footer"
      :current="page.current"
      :size="page.size"
      :total="page.total"
      @change="handlePaginationChange"/>

    <el-dialog title="添加用户" :visible.sync="addCustomerePopDialog">
      <el-form label-width="100px" :model="addCustomerModel" label-position="left" size="mini">
        <el-form-item label="用户名字">
          <el-input v-model="addCustomerModel.customerName" ></el-input>
        </el-form-item>
        <el-form-item label="职位">
          <el-select
                  v-model="addCustomerModel.jobName"
                  placeholder="请选择"
                  style="width: 150px;">
            <el-option v-for="(item, index) in customerJobModels" :key="index" :label="item.customerJobName" :value="item.customerJobCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别">
          <el-select
                  v-model="addCustomerModel.sex"
                  placeholder="请选择"
                  style="width: 150px;">
            <el-option v-for="(item, index) in customerSexModels" :key="index" :label="item.customerSexName" :value="item.customerSexCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="加盟商">
          <el-select v-model="addCustomerModel.franchiseeSeries" clearable>
            <el-option v-for="(item, index) in franchiseeNameList" :key="index" :label="item.franchiseeName" :value="item.franchiseeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="可选角色">
          <el-select v-model="addCustomerModel.roleIds" multiple placeholder="请选择权限角色">
            <el-option v-for="item in authNameList" :key="item.roleId" :label="item.roleName" :value="item.roleId" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工号">
          <el-input v-model="addCustomerModel.jobNum"></el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="addCustomerModel.mobilePhone"></el-input>
        </el-form-item>
        <el-form-item label="座机">
          <el-input v-model="addCustomerModel.phone"></el-input>
        </el-form-item>
        <el-form-item label="用户账户">
          <el-input v-model="addCustomerModel.customerAccount"></el-input>
        </el-form-item>
        <el-form-item label="用户密码">
          <el-input v-model="addCustomerModel.customerPassword"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelCustomer" size="mini">取 消</el-button>
        <el-button type="primary" @click="onAddCustomerConfirm" size="mini"  :loading="loading">确 定</el-button>
      </div>
    </el-dialog>



    <el-dialog title="密码重置" :visible.sync="passwordUpdatePopDialog">
      <el-form label-width="100px" :model="addCustomerModel" label-position="left" size="mini">
        <el-form-item label="用户名字">
          <el-input v-model="addCustomerModel.customerName" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户账户">
          <el-input v-model="addCustomerModel.customerAccount" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户密码">
          <el-input v-model="addCustomerModel.customerPassword"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelCustomer" size="mini">取 消</el-button>
        <el-button type="primary" @click="updatePasswordConfirm" size="mini"  :loading="loading">确 定</el-button>
      </div>
    </el-dialog>

  </d2-container>
</template>

<script>


import { getAllEmployee,register,deleteEmployee,updatePassword } from "@/api/employee";
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
  name: 'scheduler',
  components: {
    PageHeader: () => import('./componnets/PageHeader'),
    PageMain: () => import('./componnets/PageMain'),
    PageFooter: () => import('./componnets/PageFooter'),
  },
  data() {
    return {
      customerJobModels: [],
      customerSexModels:[],
      table: [],
      loading: false,
      customerNumId: util.cookies.get('__user__customernumid'),
      franchiseeSeries:util.cookies.get('__user__franchiseeSeries'),
      addCustomerePopDialog: false,
      passwordUpdatePopDialog: false,
      addCustomerModel: {
          customerAccount: "",
          customerPassword: "",
          customerName: "",
          jobName: "",
          jobNum:"",
          sex:"",
          mobilePhone:"",
          phone:"",
          franchiseeSeries:"",
          roleIds:[]
        },
      franchiseeNameList:[],
      authNameList:[],
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
    };
  },
  created() {
      this._getCustomerJob({
          customerNumId: this.customerNumId,
      });
    this._initMyPage();

  },
  methods: {
      _initMyPage() {
          this.handleSubmit();
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
      _getAuthorityRoleList(params) {
          getAuthorityRoleList(params)
              .then(res => {
                  if (res.code === 0) {
                      this.authNameList = res.authRoleModels;
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
      _getCustomerJob(params) {
          getCustomerJob(params)
              .then(res => {
                  if (res.code === 0) {
                      this.customerJobModels = res.customerJobModels;
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
      _getCustomerSex(params) {
          getCustomerSex(params)
              .then(res => {
                  if (res.code === 0) {
                      this.customerSexModels = res.customerSexModels;
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
      onAddCustomerConfirm(params) {
          this.loading = true;
          this.addCustomerModel.customerNumId = this.customerNumId;
          this._addCustomer(this.addCustomerModel);
          this.loading = false;
      },
      _addCustomer(params) {
          if (params.customerAccount === '') {
              this.$message({
                  type: 'error',
                  message: '账号不可以为空！'
              });
              this.loading = false;
              return;
          }
          if (params.customerPassword === '') {
              this.$message({
                  type: 'error',
                  message: '密码不可以为空！'
              });
              this.loading = false;
              return;
          }
          if (params.customerName === '') {
              this.$message({
                  type: 'error',
                  message: '用户名字不可以为空！'
              });
              this.loading = false;
              return;
          }
          if (params.jobName === '') {
              this.$message({
                  type: 'error',
                  message: '职位不可以为空！'
              });
              this.loading = false;
              return;
          }
          if (params.jobNum === '') {
              this.$message({
                  type: 'error',
                  message: '工号不可以为空！'
              });
              this.loading = false;
              return;
          }
          if (params.sex === '') {
              this.$message({
                  type: 'error',
                  message: '性别不可以为空！'
              });
              this.loading = false;
              return;
          }
          if (params.mobilePhone === '') {
              this.$message({
                  type: 'error',
                  message: '手机不可以为空！'
              });
              this.loading = false;
              return;
          }
          register(params)
              .then(res => {
                  if (res.code === 0) {
                      this.$message({
                          type: "success",
                          message: "新增用户成功!"
                      });
                      this.addCustomerePopDialog = false;
                      this.handleSubmit();
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
      handlePaginationChange(val) {
          this.$notify({
              title: '分页变化',
              message: `当前第${val.current}页 共${val.total}条 每页${val.size}条`,
          });
          this.page = val;
          // nextTick 只是为了优化示例中 notify 的显示
          this.$nextTick(() => {
              this.$refs.header.handleFormSubmit();
          });
      },
      handleSubmit(form) {
          this.loading = true;
          getAllEmployee({
              customerNumId: util.cookies.get('__user__customernumid'),
              current: this.page.current,
              pageSize: this.page.size,
              franchiseeSeries:this.franchiseeSeries,
              ...form,
          })
              .then(res => {
                  this.loading = false;
                  this.table = res.baseCustomers;
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
      updatePasswordConfirm(){
          this.loading = true;
          updatePassword(this.addCustomerModel)
              .then(res => {
                  this.loading = false;
                  this.$message({
                      type: "success",
                      message: "修改成功!"
                  });
                  this.passwordUpdatePopDialog = false;
              })
              .catch(err => {
                  this.loading = false;
              });
      },
      handleAdd() {
          this.addCustomerePopDialog = true;
      },
      deleteCustomerId(param) {
          this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
          })
              .then(() => {
                  deleteEmployee({
                      customerNumId: param.customerNumId
                  }).then(res => {
                      if (res.code === 0) {
                          this.$message({
                              type: "success",
                              message: "删除成功!"
                          });
                          this.handleSubmit();
                      }
                  })
                      .catch(err => {
                          console.log(err);
                      });
              })
              .catch(() => {
                  console.log('取消删除');
              });
      },
      editPassword(param) {
          this.addCustomerModel.customerAccount = param.customerAccount;
          this.addCustomerModel.customerName =param.customerName;
          this.addCustomerModel.customerNumId =param.customerNumId;
          this.passwordUpdatePopDialog = true;

      },
      cancelCustomer() {
          this.addCustomerePopDialog = false;
          this.passwordUpdatePopDialog = false;
          this.addCustomerModel.customerAccount = "";
          this.addCustomerModel.customerPassword = "";
          this.addCustomerModel.customerName = "";
          this.addCustomerModel.jobName = "";
          this.addCustomerModel.jobNum = "";
          this.addCustomerModel.sex = "";
          this.addCustomerModel.mobilePhone = "";
          this.addCustomerModel.phone = "";
          this.addCustomerModel.franchiseeSeries = "";
          this.addCustomerModel.customerNumId="";
          this.addCustomerModel.roleIds = [];
      }
  }
};
</script>
