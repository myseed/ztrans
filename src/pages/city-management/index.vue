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
       @editCity="editCity"
       @deleteCity="deleteCity"/>
    <page-footer
      slot="footer"
      :current="page.current"
      :size="page.size"
      :total="page.total"
      @change="handlePaginationChange"/>


    <el-dialog title="编辑市" :visible.sync="editCityPopDialog">
      <el-form label-width="130px" :model="editCityModel" label-position="left" size="mini">
        <el-form-item label="市名字"  >
          <el-input v-model="editCityModel.newCityName" ></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer" >
        <el-button @click="cancelCustomer" size="mini">取 消</el-button>
        <el-button type="primary" @click="onEditCityConfirm" size="mini"  :loading="loading">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog title="新增市" :visible.sync="addCityPopDialog">

      <el-form label-width="130px" :model="addCityModel" label-position="left" size="mini">
        <el-form-item label="省名字">
          <el-select v-model="addCityModel.prvId" placeholder="请选择省">
            <el-option
                    v-for="item in allPrv"
                    :key="item.prvId"
                    :label="item.prvName"
                    :value="item.prvId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="市名字"  >
          <el-input v-model="addCityModel.cityName" ></el-input>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelCustomer" size="mini">取 消</el-button>
        <el-button type="primary" @click="onAddCityConfirm" size="mini"  :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>

<script>

import {
    getAllPrv,getAllCity,updateCity,addCity,deleteCity
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
      allPrv: [],
      prvId:'',
      table: [],
      loading: false,
      customerNumId: util.cookies.get('__user__customernumid'),
      editCityPopDialog:false,
      addCityPopDialog:false,
      editCityModel: {
          cityId:"",
          newCityName:"",
          customerNumId:util.cookies.get('__user__customernumid')
      },
      addCityModel: {
            prvId:"",
            cityName:"",
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
      this._getAllPrv({
          current: 1,
          customerNumId: this.customerNumId,
          pageSize: 200,
      });
  },

  methods: {
    _initMyPage() {
      this.handleSubmit();
    },
      _getAllPrv(params) {
          getAllPrv(params)
              .then(res => {
                  if (res.code === 0) {
                      this.allPrv = res.prvNameAndPrvIds;
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
      if(form!=null){
      this.prvId=form.prvId;
      }
      getAllCity({
        customerNumId: util.cookies.get('__user__customernumid'),
        current: this.page.current,
        pageSize: this.page.size,
        ...form,
      })
        .then(res => {
          this.loading = false;

          this.table = res.cityeNameAndCityeIds;
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
      editCity(param){
         this.editCityModel.cityId=param.cityId;
         this.editCityModel.newCityName=param.cityName;
         this.editCityPopDialog=true;
      },

      cancelCustomer(){
        this.editCityPopDialog=false;
        this.addCityPopDialog=false;
      },
      handleSubmitPage(form){
          handleSubmit(form);
      },
      onEditCityConfirm(param){
          this.loading = true;
          if (this.editCityModel.newCityName === '') {
              this.$message({
                  type: 'error',
                  message: '市不可以为空！',
              });
              this.loading = false;
              return;
          }
          updateCity(this.editCityModel)
              .then(res => {
                  this.loading = false;
                  this.$message({
                      type: 'success',
                      message: '修改市成功!',
                  });
                  this.handleSubmit({
                      customerNumId: util.cookies.get('__user__customernumid'),
                      current: this.page.current,
                      pageSize: this.page.size,
                      prvId:this.prvId
                  });
                  this.editCityPopDialog=false;

              })
              .catch(err => {
                  this.loading = false;
              });
      },
      add(){
        this.addCityPopDialog=true;
      },
      onAddCityConfirm(param){
          this.loading = true;
          if (this.addCityModel.cityName === '') {
              this.$message({
                  type: 'error',
                  message: '市名字不可以为空！',
              });
              this.loading = false;
              return;
          }
          if (this.addCityModel.prvId === '') {
              this.$message({
                  type: 'error',
                  message: '省不可以为空！',
              });
              this.loading = false;
              return;
          }
          addCity(this.addCityModel)
              .then(res => {
                  this.loading = false;
                  this.$message({
                      type: 'success',
                      message: '增加市成功!',
                  });
                  this.addCityPopDialog=false;
                  this.handleSubmit({
                      customerNumId: util.cookies.get('__user__customernumid'),
                      current: this.page.current,
                      pageSize: this.page.size,
                      prvId:this.addCityModel.prvId
                  });
              })
              .catch(err => {
                  this.loading = false;
              });
      },
      deleteCity(param){
        this.editCityModel.cityId=param.cityId;
          deleteCity(this.editCityModel)
              .then(res => {
                  this.loading = false;
                  this.$message({
                      type: 'success',
                      message: '删除成功!',
                  });
                  this.handleSubmit({
                      customerNumId: util.cookies.get('__user__customernumid'),
                      current: this.page.current,
                      pageSize: this.page.size,
                      prvId:this.prvId
                  });
              })
              .catch(err => {
                  this.loading = false;
              });
      }
  }
};
</script>
