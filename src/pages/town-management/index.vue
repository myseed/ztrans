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
       @editTown="editTown"
       @deleteTown="deleteTown"/>
    <page-footer
      slot="footer"
      :current="page.current"
      :size="page.size"
      :total="page.total"
      @change="handlePaginationChange"/>


    <el-dialog title="编辑镇" :visible.sync="editCityPopDialog">
      <el-form label-width="130px" :model="editCityModel" label-position="left" size="mini">
        <el-form-item label="镇名字"  >
          <el-input v-model="editCityModel.townName" ></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer" >
        <el-button @click="cancelCustomer" size="mini">取 消</el-button>
        <el-button type="primary" @click="onEditCityConfirm" size="mini"  :loading="loading">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog title="新增镇" :visible.sync="addCityPopDialog">

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
        <el-form-item label="市名字">
          <el-select v-model="addCityModel.cityId" placeholder="请选择省">
            <el-option
                    v-for="item in allCity"
                    :key="item.cityId"
                    :label="item.cityName"
                    :value="item.cityId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区名字">
          <el-select v-model="addCityModel.cityAreaId" placeholder="请选择省">
            <el-option
                    v-for="item in allCityArea"
                    :key="item.cityAreaId"
                    :label="item.cityAreaName"
                    :value="item.cityAreaId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="镇名字"  >
          <el-input v-model="addCityModel.townName" ></el-input>
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
    getAllPrv,getAllCity,getAllCityArea,getAllTown,updateTown,addTown,deleteTown
} from "@/api/dictionary";

import util from "@/libs/util";


export default {
  // name 值和本页的 $route.name 一致才可以缓存页面
  name: 'town-management',
  components: {
    PageHeader: () => import('./componnets/PageHeader'),
    PageMain: () => import('./componnets/PageMain'),
    PageFooter: () => import('./componnets/PageFooter'),
  },
  data() {
    return {
      allPrv: [],
      allCity: [],
      allCityArea:[],
      prvId:'',
      cityId:'',
      cityAreaId:'',
      table: [],
      loading: false,
      customerNumId: util.cookies.get('__user__customernumid'),
      editCityPopDialog:false,
      addCityPopDialog:false,
      editCityModel: {
          townId:"",
          townName:"",
          customerNumId:util.cookies.get('__user__customernumid')
      },
      addCityModel: {
            prvId:"",
            cityId:"",
            cityAreaName:"",
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
    watch: {
        'addCityModel.prvId'() {
            // this.editCustomerItem.cityName = ''
            // this.editCustomerItem.cityAreaName = ''
            this._getAllCity({
                current: 1,
                pageSize: 200,
                customerNumId: this.customerNumId,
                prvId: this.addCityModel.prvId,
            });
        },
        'addCityModel.cityId'() {
            // this.editCustomerItem.cityName = ''
            // this.editCustomerItem.cityAreaName = ''
            this._getAllCityArea({
                current: 1,
                pageSize: 200,
                customerNumId: this.customerNumId,
                prvId: this.addCityModel.prvId,
                cityId: this.addCityModel.cityId,
            });
        }
    },
  methods: {
    _initMyPage() {
      this.handleSubmit();
    },
      _getAllCityArea(params) {
          getAllCityArea(params)
              .then(res => {
                  if (res.code === 0) {
                      this.allCityArea = res.cityAreaNameAndCityAreaIdModel;
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
      _getAllCity(params) {
          getAllCity(params)
              .then(res => {
                  if (res.code === 0) {
                      this.allCity = res.cityeNameAndCityeIds;
                  }
              })
              .catch(err => {
                  console.log(err);
              });
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
      this.cityId=form.cityId;
      this.cityAreaId=form.cityAreaId;
      }
      getAllTown({
        customerNumId: util.cookies.get('__user__customernumid'),
        current: this.page.current,
        pageSize: this.page.size,
        ...form,
      })
        .then(res => {
          this.loading = false;
          this.table = res.townNameAndTownIdModel;
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
      editTown(param){
         this.editCityModel.townId=param.townId;
         this.editCityModel.townName=param.townName;
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
          if (this.editCityModel.townName === '') {
              this.$message({
                  type: 'error',
                  message: '镇不可以为空！',
              });
              this.loading = false;
              return;
          }
          updateTown(this.editCityModel)
              .then(res => {
                  this.loading = false;
                  this.$message({
                      type: 'success',
                      message: '修改镇成功!',
                  });
                  this.handleSubmit({
                      customerNumId: util.cookies.get('__user__customernumid'),
                      current: this.page.current,
                      pageSize: this.page.size,
                      prvId:this.prvId,
                      cityId:this.cityId,
                      cityAreaId:this.cityAreaId
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
          if (this.addCityModel.townName === '') {
              this.$message({
                  type: 'error',
                  message: '区名字不可以为空！',
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
          if (this.addCityModel.cityId === '') {
              this.$message({
                  type: 'error',
                  message: '市不可以为空！',
              });
              this.loading = false;
              return;
          }
          if (this.addCityModel.cityAreaId === '') {
              this.$message({
                  type: 'error',
                  message: '区不可以为空！',
              });
              this.loading = false;
              return;
          }
          addTown(this.addCityModel)
              .then(res => {
                  this.loading = false;
                  this.$message({
                      type: 'success',
                      message: '增加镇成功!',
                  });
                  this.addCityPopDialog=false;
                  this.handleSubmit({
                      customerNumId: util.cookies.get('__user__customernumid'),
                      current: this.page.current,
                      pageSize: this.page.size,
                      prvId:this.addCityModel.prvId,
                      cityId:this.addCityModel.cityId,
                      cityAreaId:this.addCityModel.cityAreaId,
                  });
              })
              .catch(err => {
                  this.loading = false;
              });
      },
      deleteTown(param){
        this.editCityModel.townId=param.townId;
          deleteTown(this.editCityModel)
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
                      prvId:this.prvId,
                      cityId:this.cityId,
                      cityAreaId:this.cityAreaId
                  });
              })
              .catch(err => {
                  this.loading = false;
              });
      }
  }
};
</script>
