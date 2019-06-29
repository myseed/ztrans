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
       @deleteMember="deleteMember"
       @editMember="editMember"/>
    <page-footer
      slot="footer"
      :current="page.current"
      :size="page.size"
      :total="page.total"
      @change="handlePaginationChange"/>

    <el-dialog title="添加会员规则" :visible.sync="addCustomerePopDialog">
      <el-form label-width="100px" :model="addMemberModel" label-position="left" size="mini">
        <el-form-item label="规则标题">
          <el-input v-model="addMemberModel.memberRuleTitle" ></el-input>
        </el-form-item>
        <el-form-item label="规则内容">
          <el-input v-model="addMemberModel.memberRuleBody"></el-input>
        </el-form-item>
        <el-form-item label="会员定金">
          <el-input v-model="addMemberModel.memberRulePrice"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelCustomer" size="mini">取 消</el-button>
        <el-button type="primary" @click="onAddCustomerConfirm" size="mini"  :loading="loading">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog title="编辑用户" :visible.sync="editCustomerePopDialog">
      <el-form label-width="100px" :model="addMemberModel" label-position="left" size="mini">
        <el-form-item label="规则标题">
          <el-input v-model="addMemberModel.memberRuleTitle" disabled></el-input>
        </el-form-item>
        <el-form-item label="规则内容">
          <el-input v-model="addMemberModel.memberRuleBody"></el-input>
        </el-form-item>
        <el-form-item label="会员定金">
          <el-input v-model="addMemberModel.memberRulePrice" disabled></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelCustomer" size="mini">取 消</el-button>
        <el-button type="primary" @click="onEditCustomerConfirm" size="mini"  :loading="loading">确 定</el-button>
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


import { getMemberRuleList,addMemberRule,updateMemberRule,deleteMemberRule} from "@/api/member";

import util from "@/libs/util";


export default {
  // name 值和本页的 $route.name 一致才可以缓存页面
  name: 'member-rule-management',
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
      editCustomerePopDialog:false,
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
        addMemberModel: {
          series:"",
          memberRuleTitle: "",
          memberRuleBody: "",
          memberRulePrice: "",
          franchiseeSeries:"",
          customerNumId:"",
        },
      franchiseeNameList:[],
      authNameList:[],
      page: {
        current: 1,
        size: 5,
        total: 0,
      },
    };
  },
  created() {
    this._initMyPage();

  },
  methods: {
      _initMyPage() {
          this.handleSubmit();
      },
      onAddCustomerConfirm(params) {
          this.loading = true;
          this.addMemberModel.customerNumId = this.customerNumId;
          this.addMemberModel.franchiseeSeries=this.franchiseeSeries
          this._addCustomer(this.addMemberModel);
          this.loading = false;
      },
      _addCustomer(params) {
          if (params.memberRuleTitle === '') {
              this.$message({
                  type: 'error',
                  message: '会员规则标题不能为空！'
              });
              this.loading = false;
              return;
          }
          if (params.memberRuleBody === '') {
              this.$message({
                  type: 'error',
                  message: '会员规则内容不可以为空！'
              });
              this.loading = false;
              return;
          }
          if (params.memberRulePrice === '') {
              this.$message({
                  type: 'error',
                  message: '会员定金不可以为空！'
              });
              this.loading = false;
              return;
          }
          addMemberRule(params)
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
      onEditCustomerConfirm(params) {
          this.loading = true;
          this._editCustomer(this.addMemberModel);
          this.loading = false;
      },
      _editCustomer(params) {
          if (params.memberRuleBody === '') {
              this.$message({
                  type: 'error',
                  message: '规则内容不可以为空！'
              });
              this.loading = false;
              return;
          }
          updateMemberRule(params)
              .then(res => {
                  if (res.code === 0) {
                      this.$message({
                          type: "success",
                          message: "编辑规则成功!"
                      });
                      this.editCustomerePopDialog = false;
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
          getMemberRuleList({
              customerNumId: util.cookies.get('__user__customernumid'),
              current: this.page.current,
              pageSize: this.page.size,
              franchiseeSeries:this.franchiseeSeries,
              ...form,
          })
              .then(res => {
                  this.loading = false;
                  this.table = res.memberRules;
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
          this.addCustomerePopDialog = true;
      },
      deleteMember(param) {
          this.$confirm('此操作将永久删除该规则, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
          })
              .then(() => {
                  deleteMemberRule({
                      customerNumId: this.customerNumId,
                      series:param.series
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
      editMember(param) {
          this.addMemberModel.memberRuleTitle = param.memberRuleTitle;
          this.addMemberModel.memberRuleBody =param.memberRuleBody;
          this.addMemberModel.memberRulePrice =param.memberRulePrice;
          this.addMemberModel.series = param.series;
          this.editCustomerePopDialog = true;
      },
      cancelCustomer() {
          this.addCustomerePopDialog = false;
          this.passwordUpdatePopDialog = false;
          this.addMemberModel.memberRuleTitle = "";
          this.addMemberModel.memberRuleBody = "";
          this.addMemberModel.memberRulePrice = "";
      }
  }
};
</script>
