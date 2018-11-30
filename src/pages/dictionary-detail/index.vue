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
       @editDictionary="editDictionary"
       @deleteDictionary="deleteDictionary"/>
    <page-footer
      slot="footer"
      :current="page.current"
      :size="page.size"
      :total="page.total"
      @change="handlePaginationChange"/>


    <el-dialog title="增加字典" :visible.sync="addDictionaryPopDialog">
      <el-form label-width="130px" :model="editDictionaryModel" label-position="left" size="mini">
        <el-form-item label="业务类型"  >
          <el-input v-model="editDictionaryModel.bizTypeName" disabled></el-input>
        </el-form-item>
        <el-form-item label="新增业务明细内容">
          <el-input v-model="editDictionaryModel.bizContentName" ></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelCustomer" size="mini">取 消</el-button>
        <el-button type="primary" @click="onAddDictionaryConfirm" size="mini"  :loading="loading">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑字典" :visible.sync="editDictionaryPopDialog">
      <el-form label-width="130px" :model="editDictionaryModel" label-position="left" size="mini">
        <el-form-item label="业务类型"  >
          <el-input v-model="editDictionaryModel.bizTypeName" disabled></el-input>
        </el-form-item>
        <el-form-item label="修改业务明细内容">
          <el-input v-model="editDictionaryModel.bizContentName" ></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelCustomer" size="mini">取 消</el-button>
        <el-button type="primary" @click="onEditDictionaryConfirm" size="mini"  :loading="loading">确 定</el-button>
      </div>

    </el-dialog>
  </d2-container>
</template>

<script>

import {
    getDictionaryByBizId,addDictionary,updateDictionary,deleteDictionary
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
      bizTypeId: '',
      bizTypeName: '',
      loading: false,
      customerNumId: util.cookies.get('__user__customernumid'),
      editDictionaryPopDialog:false,
      addDictionaryPopDialog:false,
      editDictionaryModel: {
          bizTypeName:'',
          bizTypeId:'',
          bizContentName:'',
          bizContentId:''
      },
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
    };
  },
  created() {
    this.editDictionaryModel.bizTypeId = this.$route.query.bizTypeId,
    this.editDictionaryModel.bizTypeName = this.$route.query.bizTypeName,
    this._initMyPage();
  },

  methods: {
    _initMyPage() {
      this.handleSubmit();
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
       getDictionaryByBizId({
        customerNumId: util.cookies.get('__user__customernumid'),
        current: this.page.current,
        pageSize: this.page.size,
        bizTypeId:this.editDictionaryModel.bizTypeId
      })
        .then(res => {
          this.loading = false;
          this.table = res.dictionarys;
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
      editDictionary(param){
         this.editDictionaryModel.bizTypeName=param.bizTypeName;
         this.editDictionaryModel.bizTypeId=param.bizTypeId;
         this.editDictionaryModel.bizContentId=param.bizContentId;
         this.editDictionaryModel.bizContentName=param.bizContentName;
         this.editDictionaryPopDialog=true;
      },
      onEditDictionaryConfirm(param){
          this.loading=true;
          this.editDictionaryModel.customerNumId=this.customerNumId;
          this._editDictionary(this.editDictionaryModel);
          this.loading=false;
      },
      _editDictionary(params){
          if (params.bizContentName === '') {
              this.$message({
                  type: 'error',
                  message: '字典明细不可以为空！'
              });
              this.loading = false;
              return;
          }
          updateDictionary(params)
              .then(res => {
                  if (res.code === 0) {
                      this.$message({
                          type: "success",
                          message: "修改成功!"
                      });
                      this.editDictionaryPopDialog = false;
                      this.handleSubmit();
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
      onAddDictionaryConfirm(param){
          this.loading=true;
          this.editDictionaryModel.customerNumId=this.customerNumId;
          this._addDictionary(this.editDictionaryModel);
          this.loading=false;
      },
      _addDictionary(params){
          if (params.bizContentName === '') {
              this.$message({
                  type: 'error',
                  message: '字典明细不可以为空！'
              });
              this.loading = false;
              return;
          }
          addDictionary(params)
              .then(res => {
                  if (res.code === 0) {
                      this.$message({
                          type: "success",
                          message: "操作成功!"
                      });
                      this.addDictionaryPopDialog = false;
                      this.handleSubmit();
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
      cancelCustomer(){
        this.editDictionaryModel.bizContentName='';
        this.editDictionaryPopDialog=false;
        this.addDictionaryPopDialog=false;
      },
      handleSubmitPage(form){
          handleSubmit(form);
      },
      add(){
          this.addDictionaryPopDialog=true;
      },
      deleteDictionary(param){
          deleteDictionary({
              customerNumId: util.cookies.get('__user__customernumid'),
              bizTypeId:param.bizTypeId,
              bizContentId:param.bizContentId,
          })
              .then(res => {
                  this.loading = false;
                  this.handleSubmit();
              })
              .catch(err => {
                  this.loading = false;
              });

      }
  }
};
</script>
