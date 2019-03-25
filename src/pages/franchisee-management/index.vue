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
       @editFranchisee="editFranchisee"/>
    <page-footer
      slot="footer"
      :current="page.current"
      :size="page.size"
      :total="page.total"
      @change="handlePaginationChange"/>

    <el-dialog title="添加合作伙伴" :visible.sync="addFranchiseePopDialog">
      <el-form label-width="100px" :model="addFranchiseeModel" label-position="left" size="mini">
        <el-form-item label="合作伙伴名字">
          <el-input v-model="addFranchiseeModel.franchiseeName" ></el-input>
        </el-form-item>
        <el-form-item label="合作伙伴编码">
          <el-input v-model="addFranchiseeModel.franchiseeCode"></el-input>
        </el-form-item>
        <el-form-item label="负责人名字">
          <el-input v-model="addFranchiseeModel.chargePersonName"></el-input>
        </el-form-item>
        <el-form-item label="负责人电话">
          <el-input v-model="addFranchiseeModel.chargePersonPhone"></el-input>
        </el-form-item>
        <el-form-item label="合作伙伴账户">
          <el-input v-model="addFranchiseeModel.customerAccount"></el-input>
        </el-form-item>
        <el-form-item label="合作伙伴密码">
          <el-input v-model="addFranchiseeModel.customerPassword"></el-input>
        </el-form-item>
        <el-form-item label="合作伙伴类型">
          <el-select
                  v-model="addFranchiseeModel.franchiseeType"
                  placeholder="请选择"
                  style="width: 150px;">
            <el-option v-for="(item, index) in franchiseeNameTypeModels" :key="index" :label="item.franchiseeNameTypeName" :value="item.franchiseeNameTypeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择省">
          <el-select
                  v-model="addFranchiseeModel.prvName"
                  placeholder="请选择"
                  style="width: 150px;">
            <el-option v-for="(item, index) in allPrv" :key="index" :label="item.prvName" :value="item.prvId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择市">
          <el-select
                  v-model="addFranchiseeModel.cityName"
                  placeholder="请选择"
                  style="width: 150px;">
            <el-option v-for="(item, index) in allCity" :key="index" :label="item.cityName" :value="item.cityId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择区">
          <el-select
                  v-model="addFranchiseeModel.cityAreaName"
                  placeholder="请选择"
                  style="width: 150px;">
            <el-option v-for="(item, index) in allCityArea" :key="index" :label="item.cityAreaName" :value="item.cityAreaId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合伙时间">
          <el-date-picker
                  v-model="addFranchiseeModel.joinDtme"
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
        <el-button type="primary" @click="onAddFranchiseeConfirm" size="mini"  :loading="loading">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog title="编辑合作伙伴" :visible.sync="editFranchiseePopDialog">
      <el-form label-width="100px" :model="editFranchiseeModel" label-position="left" size="mini">
        <el-form-item label="合作伙伴名字">
          <el-input v-model="editFranchiseeModel.franchiseeName" ></el-input>
        </el-form-item>
        <el-form-item label="合作伙伴编码">
          <el-input v-model="editFranchiseeModel.franchiseeCode"></el-input>
        </el-form-item>
        <el-form-item label="负责人名字">
          <el-input v-model="editFranchiseeModel.chargePersonName"></el-input>
        </el-form-item>
        <el-form-item label="负责人电话">
          <el-input v-model="editFranchiseeModel.chargePersonPhone"></el-input>
        </el-form-item>
        <el-form-item label="合作伙伴账户">
          <el-input v-model="editFranchiseeModel.customerAccount"></el-input>
        </el-form-item>
        <el-form-item label="合作伙伴类型">
          <el-select
                  v-model="editFranchiseeModel.franchiseeType"
                  placeholder="请选择"
                  style="width: 150px;">
            <el-option v-for="(item, index) in franchiseeNameTypeModels" :key="index" :label="item.franchiseeNameTypeName" :value="item.franchiseeNameTypeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择省">
          <el-select
                  v-model="editFranchiseeModel.prvName"
                  placeholder="请选择"
                  style="width: 150px;">
            <el-option v-for="(item, index) in allPrv" :key="index" :label="item.prvName" :value="item.prvId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择市">
          <el-select
                  v-model="editFranchiseeModel.cityName"
                  placeholder="请选择"
                  style="width: 150px;">
            <el-option v-for="(item, index) in allCity" :key="index" :label="item.cityName" :value="item.cityId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择区">
          <el-select
                  v-model="editFranchiseeModel.cityAreaName"
                  placeholder="请选择"
                  style="width: 150px;">
            <el-option v-for="(item, index) in allCityArea" :key="index" :label="item.cityAreaName" :value="item.cityAreaId"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelCustomer" size="mini">取 消</el-button>
        <el-button type="primary" @click="onEditFranchiseeConfirm" size="mini"  :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>

<script>

import {
getFranchiseeNameList,getAllFranchisee,addFranchisee,updateFranchisee,deleteFranchisee,getFranchiseeTypeList
} from "@/api/franchisee";
import { getAllEmployee } from "@/api/employee";
import {
getOperateStatus,getAllCity, getAllCityArea, getAllPrv,
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
      franchiseeNameTypeModels: [],
      table: [],
      loading: false,
      customerNumId: util.cookies.get('__user__customernumid'),
      addFranchiseePopDialog: false,
      editFranchiseePopDialog:false,
      allPrv: [],
      allCity: [],
      allCityArea: [],
      addFranchiseeModel: {
          franchiseeName: "",
          franchiseeCode: "",
          franchiseeType: "",
          operateStatus: "",
          prvName:"",
          cityName:"",
          cityAreaName:"",
          joinDtme:"",
          chargePersonName:"",
          chargePersonPhone:"",
          customerAccount:"",
          customerPassword:"",
          customerNumId:""
        },
        editFranchiseeModel: {
            franchiseeId:"",
            franchiseeName: "",
            franchiseeCode: "",
            franchiseeType: "",
            prvName:"",
            cityName:"",
            cityAreaName:"",
            chargePersonName:"",
            chargePersonPhone:"",
            customerAccount:"",
            customerNumId:""
        },
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
      this._getFranchiseeTypeList({
          customerNumId: this.customerNumId,
      });
      // 省市区联动数据
      this._getAllPrv({
          current: 1,
          customerNumId: this.customerNumId,
          pageSize: 200,
      });
  },
    watch: {
        'editFranchiseeModel.prvName'() {
            // this.editCustomerItem.cityName = ''
            // this.editCustomerItem.cityAreaName = ''
            this._getAllCity({
                current: 1,
                pageSize: 200,
                customerNumId: this.customerNumId,
                prvId: this.editFranchiseeModel.prvName,
            });
        },
        'addFranchiseeModel.prvName'() {
            // this.addCustomerItem.cityName = ''
            // this.addCustomerItem.cityAreaName = ''
            this._getAllCity({
                current: 1,
                pageSize: 200,
                customerNumId: this.customerNumId,
                prvId: this.addFranchiseeModel.prvName,
            });
        },
        'editFranchiseeModel.cityName'() {
            // this.editCustomerItem.cityAreaName = ''
            this._getAllCityArea({
                current: 1,
                pageSize: 200,
                customerNumId: this.customerNumId,
                prvId: this.editFranchiseeModel.prvName,
                cityId: this.editFranchiseeModel.cityName,
            });
        },
        'addFranchiseeModel.cityName'() {
            // this.addCustomerItem.cityAreaName = ''
            this._getAllCityArea({
                current: 1,
                pageSize: 200,
                customerNumId: this.customerNumId,
                prvId: this.addFranchiseeModel.prvName,
                cityId: this.addFranchiseeModel.cityName,
            });
        },
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
      _getFranchiseeTypeList(params) {
          getFranchiseeTypeList(params)
              .then(res => {
                  if (res.code === 0) {
                      this.franchiseeNameTypeModels = res.franchiseeNameTypeModel;
                  }
              })
              .catch(err => {
                  console.log(err);
              });
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
      onAddFranchiseeConfirm(params){
         this.loading=true;
         this.addFranchiseeModel.customerNumId=this.customerNumId;
         this._addFranchisee(this.addFranchiseeModel);
         this.loading=false;
      },
     _addFranchisee(params){
         if (params.franchiseeName=== '') {
             this.$message({
                 type: 'error',
                 message: '合作伙伴名字不可以为空！'
             });
             this.loading = false;
             return;
         }
         if (params.franchiseeCode === '') {
             this.$message({
                 type: 'error',
                 message: '合作伙伴编号不可以为空！'
             });
             this.loading = false;
             return;
         }
         if (params.franchiseeType === '') {
             this.$message({
                 type: 'error',
                 message: '合作伙伴类型不可以为空！'
             });
             this.loading = false;
             return;
         }
         if (params.joinDtme === '') {
             this.$message({
                 type: 'error',
                 message: '合伙时间不可以为空！'
             });
             this.loading = false;
             return;
         }
         if (params.prvName === '') {
             this.$message({
                 type: 'error',
                 message: '省不可以为空！'
             });
             this.loading = false;
             return;
         }
         if (params.cityName === '') {
             this.$message({
                 type: 'error',
                 message: '市不可以为空！'
             });
             this.loading = false;
             return;
         }
         if (params.cityAreaName === '') {
             this.$message({
                 type: 'error',
                 message: '区不可以为空！'
             });
             this.loading = false;
             return;
         }
         if (params.chargePersonName === '') {
             this.$message({
                 type: 'error',
                 message: '负责人名字不可以为空！'
             });
             this.loading = false;
             return;
         }
         if (params.customerAccount === '') {
             this.$message({
                 type: 'error',
                 message: '合作伙伴登录账户不可以为空！'
             });
             this.loading = false;
             return;
         }
         if (params.customerPassword === '') {
             this.$message({
                 type: 'error',
                 message: '合作伙伴登录密码不可以为空！'
             });
             this.loading = false;
             return;
         }
         addFranchisee(params)
             .then(res => {
                 if (res.code === 0) {
                     this.$message({
                         type: "success",
                         message: "修改成功!"
                     });
                     this.addFranchiseePopDialog = false;
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
      getAllFranchisee({
        customerNumId: util.cookies.get('__user__customernumid'),
        current: this.page.current,
        pageSize: this.page.size,
        ...form,
      })
        .then(res => {
          this.loading = false;
          this.table = res.customerFranchisees;
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
       this.addFranchiseePopDialog=true;
    },
      editFranchisee(param){
         this.editFranchiseeModel.franchiseeId=param.franchiseeId;
         this.editFranchiseeModel.franchiseeName=param.franchiseeName;
         this.editFranchiseeModel.franchiseeCode=param.franchiseeCode;
         this.editFranchiseeModel.franchiseeType=param.franchiseeType;
         this.editFranchiseeModel.customerNumId=this.customerNumId;
         this.editFranchiseeModel.prvName=param.prvName;
         this.editFranchiseeModel.cityName=param.cityName;
         this.editFranchiseeModel.cityAreaName=param.cityAreaName;
         this.editFranchiseeModel.chargePersonName=param.chargePersonName;
         this.editFranchiseeModel.chargePersonPhone=param.chargePersonPhone;
         this.editFranchiseeModel.customerAccount=param.customerAccount;
         this.editFranchiseePopDialog=true;
      },
      onEditFranchiseeConfirm(param){
          this.loading=true;
          this.editFranchiseeModel.customerNumId=this.customerNumId;
          this._editFranchisee(this.editFranchiseeModel);
          this.loading=false;
      },
      _editFranchisee(params){
          if (params.franchiseeName === '') {
              this.$message({
                  type: 'error',
                  message: '合作伙伴名字不可以为空！'
              });
              this.loading = false;
              return;
          }
          if (params.franchiseeCode === '') {
              this.$message({
                  type: 'error',
                  message: '合作伙伴编码不可以为空！'
              });
              this.loading = false;
              return;
          }
          if (params.franchiseeType === '') {
              this.$message({
                  type: 'error',
                  message: '合作伙伴类型不可以为空！'
              });
              this.loading = false;
              return;
          }
          updateFranchisee(params)
              .then(res => {
                  if (res.code === 0) {
                      this.$message({
                          type: "success",
                          message: "修改成功!"
                      });
                      this.editFranchiseePopDialog = false;
                      this.handleSubmit();
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
      cancelCustomer(){
        this.addFranchiseePopDialog=false;
        this.editFranchiseePopDialog=false;
        this.addFranchiseeModel.franchiseeName="";
        this.addFranchiseeModel.franchiseeCode="";
        this.addFranchiseeModel.franchiseeType="";
        this.addFranchiseeModel.prvName="";
        this.addFranchiseeModel.cityName="";
        this.addFranchiseeModel.cityAreaName="";
        this.addFranchiseeModel.joinDtme="";
        this.addFranchiseeModel.chargePersonName="";
        this.addFranchiseeModel.chargePersonPhone="";
        this.addFranchiseeModel.customerAccount="";
        this.addFranchiseeModel.customerPassword="";
      }
  }
};
</script>
