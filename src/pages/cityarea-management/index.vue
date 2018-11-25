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
       @editCityArea="editCityArea"
       @deleteCityArea="deleteCityArea"/>
    <page-footer
      slot="footer"
      :current="page.current"
      :size="page.size"
      :total="page.total"
      @change="handlePaginationChange"/>


    <el-dialog title="编辑区" :visible.sync="editCityPopDialog">
      <el-form label-width="130px" :model="editCityModel" label-position="left" size="mini">
        <el-form-item label="区名字"  >
          <el-input v-model="editCityModel.newCityAreaName" ></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer" >
        <el-button @click="cancelCustomer" size="mini">取 消</el-button>
        <el-button type="primary" @click="onEditCityConfirm" size="mini"  :loading="loading">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog title="新增区" :visible.sync="addCityPopDialog">

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
        <el-form-item label="区名字"  >
          <el-input v-model="addCityModel.cityAreaName" ></el-input>
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
    getAllPrv,getAllCity,getAllCityArea,updateCityArea,addCityArea,deleteCityArea
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
      allCity: [],
      prvId:'',
      cityId:'',
      table: [],
      loading: false,
      customerNumId: util.cookies.get('__user__customernumid'),
      editCityPopDialog:false,
      addCityPopDialog:false,
      editCityModel: {
          cityAreaId:"",
          newCityAreaName:"",
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
        }
    },
  methods: {
    _initMyPage() {
      this.handleSubmit();
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
      this.$notify({
        title: '开始请求数据',
      });
      if(form!=null){
      this.prvId=form.prvId;
      this.cityId=form.cityId;
      }
      getAllCityArea({
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

          this.table = res.cityAreaNameAndCityAreaIdModel;
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
      editCityArea(param){
         this.editCityModel.cityAreaId=param.cityAreaId;
         this.editCityModel.newCityAreaName=param.cityAreaName;
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
          this.$notify({
              title: '开始请求数据',
          });
          if (this.editCityModel.newCityAreaName === '') {
              this.$message({
                  type: 'error',
                  message: '区不可以为空！',
              });
              this.loading = false;
              return;
          }
          updateCityArea(this.editCityModel)
              .then(res => {
                  this.loading = false;
                  this.$notify({
                      title: '数据请求完毕',
                  });
                  this.$message({
                      type: 'success',
                      message: '修改区成功!',
                  });
                  this.handleSubmit({
                      customerNumId: util.cookies.get('__user__customernumid'),
                      current: this.page.current,
                      pageSize: this.page.size,
                      prvId:this.prvId,
                      cityId:this.cityId
                  });
                  this.editCityPopDialog=false;

              })
              .catch(err => {
                  this.loading = false;
                  this.$notify({
                      title: '数据请求异常',
                  });
              });
      },
      add(){
        this.addCityPopDialog=true;
      },
      onAddCityConfirm(param){
          this.loading = true;
          this.$notify({
              title: '开始请求数据',
          });
          if (this.addCityModel.cityAreaName === '') {
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
          addCityArea(this.addCityModel)
              .then(res => {
                  this.loading = false;
                  this.$notify({
                      title: '数据请求完毕',
                  });
                  this.$message({
                      type: 'success',
                      message: '增加区成功!',
                  });
                  this.addCityPopDialog=false;
                  this.handleSubmit({
                      customerNumId: util.cookies.get('__user__customernumid'),
                      current: this.page.current,
                      pageSize: this.page.size,
                      prvId:this.addCityModel.prvId,
                      cityId:this.addCityModel.cityId,
                  });
              })
              .catch(err => {
                  this.loading = false;
                  this.$notify({
                      title: '数据请求异常',
                  });
              });
      },
      deleteCityArea(param){
        this.editCityModel.cityAreaId=param.cityAreaId;
          deleteCityArea(this.editCityModel)
              .then(res => {
                  this.loading = false;
                  this.$notify({
                      title: '数据请求完毕',
                  });
                  this.$message({
                      type: 'success',
                      message: '删除成功!',
                  });
                  this.handleSubmit({
                      customerNumId: util.cookies.get('__user__customernumid'),
                      current: this.page.current,
                      pageSize: this.page.size,
                      prvId:this.prvId,
                      cityId:this.cityId
                  });
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
