<template>
  <d2-container>
    <page-header
      slot="header"
      @submit="handleSubmit"
      @add="add"
      ref="header"/>
    <page-main
      :table-data="table"
      :loading="loading"
       @editPrv="editPrv"
       @deletePrv="deletePrv"/>
    <page-footer
      slot="footer"
      :current="page.current"
      :size="page.size"
      :total="page.total"
      @change="handlePaginationChange"/>


    <el-dialog title="编辑省" :visible.sync="editPrvPopDialog">
      <el-form label-width="130px" :model="editPrvModel" label-position="left" size="mini">
        <el-form-item label="省名字"  >
          <el-input v-model="editPrvModel.newPrvName" ></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelCustomer" size="mini">取 消</el-button>
        <el-button type="primary" @click="onEditPrvConfirm" size="mini"  :loading="loading">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog title="新增省" :visible.sync="addPrvPopDialog">
      <el-form label-width="130px" :model="addPrvModel" label-position="left" size="mini">
        <el-form-item label="省名字"  >
          <el-input v-model="addPrvModel.prvName" ></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelCustomer" size="mini">取 消</el-button>
        <el-button type="primary" @click="onAddPrvConfirm" size="mini"  :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>

<script>

import {
    getAllPrv,updatePrv,addPrv,deletePrv
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
      editPrvPopDialog:false,
      addPrvPopDialog:false,
      editPrvModel: {
          prvId:"",
          newPrvName:"",
          customerNumId:util.cookies.get('__user__customernumid')
      },
      addPrvModel: {
            prvName:"",
            customerNumId:util.cookies.get('__user__customernumid')
      },
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

  methods: {
    _initMyPage() {
      this.handleSubmit();
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
      this.$notify({
        title: '开始请求数据',
      });

      getAllPrv({
        customerNumId: util.cookies.get('__user__customernumid'),
        current: this.page.current,
        pageSize: this.page.size,
        ...form,
      })
        .then(res => {
          this.loading = false;
          this.$notify({
            title: '数据请求完毕',
          });

          this.table = res.prvNameAndPrvIds;
          this.page = {
            current: this.page.current,
            size: this.page.size,
            total: res.total,
          };
        })
        .catch(err => {
          this.loading = false;
          this.$notify({
            title: '数据请求异常',
          });
        });
    },
      editPrv(param){
         this.editPrvModel.prvId=param.prvId;
         this.editPrvModel.newPrvName=param.prvName;
         this.editPrvPopDialog=true;
      },

      cancelCustomer(){
        this.editPrvPopDialog=false;
      },
      handleSubmitPage(form){
          handleSubmit(form);
      },
      onEditPrvConfirm(param){
          this.loading = true;
          this.$notify({
              title: '开始请求数据',
          });
          if (this.editPrvModel.newPrvName === '') {
              this.$message({
                  type: 'error',
                  message: '省不可以为空！',
              });
              this.loading = false;
              return;
          }
          updatePrv(this.editPrvModel)
              .then(res => {
                  this.loading = false;
                  this.$notify({
                      title: '数据请求完毕',
                  });
                  this.$message({
                      type: 'success',
                      message: '修改成功!',
                  });
                  this.editPrvPopDialog=false;
                  this.handleSubmit();
              })
              .catch(err => {
                  this.loading = false;
                  this.$notify({
                      title: '数据请求异常',
                  });
              });
      },
      add(){
        this.addPrvPopDialog=true;
      },
      onAddPrvConfirm(param){
          this.loading = true;
          this.$notify({
              title: '开始请求数据',
          });
          if (this.addPrvModel.prvName === '') {
              this.$message({
                  type: 'error',
                  message: '省不可以为空！',
              });
              this.loading = false;
              return;
          }
          addPrv(this.addPrvModel)
              .then(res => {
                  this.loading = false;
                  this.$notify({
                      title: '数据请求完毕',
                  });
                  this.$message({
                      type: 'success',
                      message: '增加省成功!',
                  });
                  this.addPrvPopDialog=false;
                  this.handleSubmit();
              })
              .catch(err => {
                  this.loading = false;
                  this.$notify({
                      title: '数据请求异常',
                  });
              });
      },
      deletePrv(param){
        this.editPrvModel.prvId=param.prvId;
          deletePrv(this.editPrvModel)
              .then(res => {
                  this.loading = false;
                  this.$notify({
                      title: '数据请求完毕',
                  });
                  this.$message({
                      type: 'success',
                      message: '删除成功!',
                  });
                  this.handleSubmit();
              })
              .catch(err => {
                  this.loading = false;
                  this.$notify({
                      title: '数据请求异常',
                  });
              });
      }
  }
};
</script>
