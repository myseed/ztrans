<template>
  <d2-container>
    <page-header
      slot="header"
      @submit="handleSubmit"
      ref="header"/>
    <page-main
      :table-data="table"
      :loading="loading"
       @editDictionary="editDictionary"/>
    <page-footer
      slot="footer"
      :current="page.current"
      :size="page.size"
      :total="page.total"
      @change="handlePaginationChange"/>

    <el-dialog title="增加小程序普通广告" :visible.sync="addAdverside">
      <el-form  size="mini" label-width="140px">
        <el-form-item label="图片业务">
          <el-input v-model="editDictionaryModel.bizTypeName" disabled></el-input>
        </el-form-item>
        <el-form-item label="广告图片" >
          <el-upload
                  :limit="1"
                  action=""
                  list-type="picture-card"
                  name="advertisePicture"
                  :http-request="onReaderComplete"
                  :before-upload="onReaderSelect"
                  :on-preview="onReaderPreview"
                  :on-remove="onReaderRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addAdverside= false" size="mini">取 消</el-button>
        <el-button type="primary" @click="addConfirm" size="mini" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>

<script>


import {
    getXcxFirstPageList,addXcxFirstPageList,getXcxAdvertiseList
} from "@/api/advertise";

import {
    getDictionaryByBizId,addDictionary,updateDictionary,deleteDictionary
} from "@/api/dictionary";
import {uploadPicture, deletePicture} from '@/api/picture';
import util from "@/libs/util";


export default {
  // name 值和本页的 $route.name 一致才可以缓存页面
  name: 'xcx-nomal-advertisement-management',
  components: {
    PageHeader: () => import('./componnets/PageHeader'),
    PageMain: () => import('./componnets/PageMain'),
    PageFooter: () => import('./componnets/PageFooter'),
  },
  data() {
    return {
      table: [],
      loading: false,
      addAdverside:false,
      customerNumId: util.cookies.get('__user__customernumid'),
      editDictionaryPopDialog:false,
      dialogVisible: false,
      dialogImageUrl: '',
      url:'',
      editDictionaryModel: {
          customerNumId: util.cookies.get('__user__customernumid'),
          bizContentId:"",
          bizTypeId:"",
          bizTypeName:"",
          bizContentName:"",
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
      this.page = val;
      // nextTick 只是为了优化示例中 notify 的显示
      this.$nextTick(() => {
        this.$refs.header.handleFormSubmit();
      });
    },
    handleSubmit(form) {
      this.loading = true;
      getXcxAdvertiseList({
        customerNumId: util.cookies.get('__user__customernumid'),
        current: this.page.current,
        pageSize: this.page.size,
        ...form,
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

      cancelCustomer(){
        this.editDictionaryPopDialog=false;
      },
      handleSubmitPage(form){
          handleSubmit(form);
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

      },
      onReaderComplete({file, filename}) {
          let pictureCode = "6";
          let customerNumId = this.customerNumId;
          // 把图片上传到服务器
          const params = {customerNumId, pictureCode};
          this.confirmStatus=true;
          this.$message({
              type: "warn",
              message: "图片正在上传!"
          });
          this._uploadPicture(params, file, filename);
      },
      _uploadPicture(params, file, filename) {
          uploadPicture(params, file)
              .then(res => {
                  if (res.data.code === 0) {
                      this.$message({
                          type: "success",
                          message: "上传成功!"
                      });
                      this.url = res.data.url;
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
      onReaderSelect(file) {
          return true;
      },
      onReaderPreview(file) {
          this.dialogImageUrl = file.url;
          this.dialogVisible = true;
      },
      onReaderRemove(file, fileList) {
          console.log(file, fileList);
          this._deletePicture({
              customerNumId: this.customerNumId,
              url: this.url
          });
      },
      editDictionary(params){
        this.editDictionaryModel.bizTypeName=params.bizTypeName;
        this.editDictionaryModel.bizContentId=params.bizContentId;
        this.editDictionaryModel.bizTypeId=params.bizTypeId;
        this.addAdverside=true;
      },
      addConfirm(){
        if(this.url==''){
            this.$message({
                type: "error",
                message: "图片还未上传成功,请稍等!"
            });
            return;
        }
        this.editDictionaryModel.bizContentName=this.url;
        this._updateDictionary(this.editDictionaryModel);
      },
      _updateDictionary(param){
          updateDictionary(param
          )
              .then(res => {
                  if(res.code==0){
                      this.$message({
                          type: "success",
                          message: "上传成功!"
                      });
                      this.addAdverside=false;
                      this.url='';
                  }
                  this.loading = false;
                  this.handleSubmit();
              })
              .catch(err => {
                  this.loading = false;
              });

      },
  }
};
</script>
