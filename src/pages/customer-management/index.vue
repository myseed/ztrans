<template>
  <d2-container>
    <page-header
      slot="header"
      @submit="handleSubmit"
      @add="handleAdd"
      ref="header"/>
    <page-main
      :table-data="table"
      @update="updateDate"
      @getMasterDetail="getMasterDetail"
      :loading="loading"/>
    <page-footer
      slot="footer"
      :current="page.current"
      :size="page.size"
      :total="page.total"
      @change="handlePaginationChange"/>
    <el-dialog title="添加客户" :visible.sync="addCustomerPopDialog">
      <el-form :model="addCustomerItem" label-width="100px" size="mini">
        <el-form-item label="服务类型">
          <el-select v-model="addCustomerItem.serviceType" clearable>
            <el-option v-for="(item, index) in serviceTypeModels" :key="index" :label="item.serviceTypeName" :value="item.serviceTypeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结算方式">
          <el-select v-model="addCustomerItem.caculateType" clearable>
            <el-option v-for="(item, index) in customerCaclulateTypeModels" :key="index" :label="item.customerCaclulateTypeName" :value="item.customerCaclulateTypeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="addCustomerItem.checkStatus" clearable>
            <el-option v-for="(item, index) in checkIdAndCheckStatus" :key="index" :label="item.checkStatusName" :value="item.checkStatusId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="省/市/区">
          <el-select v-model="addCustomerItem.prvName" placeholder="请选择省">
            <el-option
                    v-for="item in allPrv"
                    :key="item.prvId"
                    :label="item.prvName"
                    :value="item.prvId">
            </el-option>
          </el-select>
          <el-select v-model="addCustomerItem.cityName" placeholder="请选择市">
            <el-option
                    v-for="item in allCity"
                    :key="item.cityId"
                    :label="item.cityName"
                    :value="item.cityId">
            </el-option>
          </el-select>
          <el-select v-model="addCustomerItem.cityAreaName" placeholder="请选择区">
            <el-option
                    v-for="item in allCityArea"
                    :key="item.cityAreaId"
                    :label="item.cityAreaName"
                    :value="item.cityAreaId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户级别">
          <el-select v-model="addCustomerItem.customerLevel" clearable>
            <el-option v-for="(item, index) in customerLevelModels" :key="index" :label="item.customerLevelName" :value="item.customerLevelId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户来源">
          <el-select v-model="addCustomerItem.customerSource" clearable>
            <el-option v-for="(item, index) in customerSourceModels" :key="index" :label="item.customerSourceName" :value="item.customerSourceId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户类型">
          <el-select v-model="addCustomerItem.customerType" clearable>
            <el-option v-for="(item, index) in customerTypeModels" :key="index" :label="item.customerTypeName" :value="item.customerTypeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下单级别">
          <el-select v-model="addCustomerItem.orderLevel" clearable>
            <el-option v-for="(item, index) in customerOrderLevelModels" :key="index" :label="item.customerOrderLevelName" :value="item.customerOrderLevelId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售加盟商">
          <el-select v-model="addCustomerItem.franchiseeSeries">
            <el-option v-for="(item, index) in franchiseeNameList" :key="index" :label="item.franchiseeName" :value="item.franchiseeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售">
          <el-select v-model="addCustomerItem.saleId" clearable>
            <el-option v-for="(item, index) in customerSales" :key="index" :label="item.salePersonName" :value="item.salePersonId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="最后合作日期">
          <el-date-picker
                  v-model="addCustomerItem.finalDate"
                  type="datetime"
                  placeholder="选择日期时间"
                  align="right"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="大客户名字">
          <el-input v-model="addCustomerItem.customerName"></el-input>
        </el-form-item>
        <el-form-item label="大客户简码">
          <el-input v-model="addCustomerItem.customerSimpleCode"></el-input>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input type="textarea" v-model="addCustomerItem.detailAddress"></el-input>
        </el-form-item>
        <el-form-item label="审核备注">
          <el-input type="textarea" v-model="addCustomerItem.checkRemark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelCustomer" size="mini">取 消</el-button>
        <el-button type="primary" @click="onAddCustomerConfirm" size="mini"  :loading="loading">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑客户" :visible.sync="editCustomerPopDialog">
      <el-form :model="editCustomerItem" label-width="100px" size="mini">
        <el-form-item label="服务类型">
          <el-select v-model="editCustomerItem.serviceType" clearable>
            <el-option v-for="(item, index) in serviceTypeModels" :key="index" :label="item.serviceTypeName" :value="item.serviceTypeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结算方式">
          <el-select v-model="editCustomerItem.caculateType" clearable>
            <el-option v-for="(item, index) in customerCaclulateTypeModels" :key="index" :label="item.customerCaclulateTypeName" :value="item.customerCaclulateTypeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="editCustomerItem.checkStatus" clearable>
            <el-option v-for="(item, index) in checkIdAndCheckStatus" :key="index" :label="item.checkStatusName" :value="item.checkStatusId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="省/市/区">
          <el-select v-model="editCustomerItem.prvName" placeholder="请选择省">
            <el-option
                    v-for="item in allPrv"
                    :key="item.prvId"
                    :label="item.prvName"
                    :value="item.prvId">
            </el-option>
          </el-select>
          <el-select v-model="editCustomerItem.cityName" placeholder="请选择市">
            <el-option
                    v-for="item in allCity"
                    :key="item.cityId"
                    :label="item.cityName"
                    :value="item.cityId">
            </el-option>
          </el-select>
          <el-select v-model="editCustomerItem.cityAreaName" placeholder="请选择区">
            <el-option
                    v-for="item in allCityArea"
                    :key="item.cityAreaId"
                    :label="item.cityAreaName"
                    :value="item.cityAreaId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户级别">
          <el-select v-model="editCustomerItem.customerLevel" clearable>
            <el-option v-for="(item, index) in customerLevelModels" :key="index" :label="item.customerLevelName" :value="item.customerLevelId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户来源">
          <el-select v-model="editCustomerItem.customerSource" clearable>
            <el-option v-for="(item, index) in customerSourceModels" :key="index" :label="item.customerSourceName" :value="item.customerSourceId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户类型">
          <el-select v-model="editCustomerItem.customerType" clearable>
            <el-option v-for="(item, index) in customerTypeModels" :key="index" :label="item.customerTypeName" :value="item.customerTypeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下单级别">
          <el-select v-model="editCustomerItem.orderLevel" clearable>
            <el-option v-for="(item, index) in customerOrderLevelModels" :key="index" :label="item.customerOrderLevelName" :value="item.customerOrderLevelId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售加盟商">
          <el-select v-model="editCustomerItem.franchiseeSeries" disabled>
            <el-option v-for="(item, index) in franchiseeNameList" :key="index" :label="item.franchiseeName" :value="item.franchiseeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售">
          <el-select v-model="editCustomerItem.saleId" clearable>
            <el-option v-for="(item, index) in customerSales" :key="index" :label="item.salePersonName" :value="item.salePersonId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="最后合作日期">
          <el-date-picker
                  v-model="editCustomerItem.finalDate"
                  type="datetime"
                  placeholder="选择日期时间"
                  align="right"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="大客户名字">
          <el-input v-model="editCustomerItem.customerName"></el-input>
        </el-form-item>
        <el-form-item label="大客户简码">
          <el-input v-model="editCustomerItem.customerSimpleCode"></el-input>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input type="textarea" v-model="editCustomerItem.detailAddress"></el-input>
        </el-form-item>
        <el-form-item label="审核备注">
          <el-input type="textarea" v-model="editCustomerItem.checkRemark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editCustomerPopDialog = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="onEditCustomerConfirm" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="客户详情" :visible.sync="popDialog">
      <div style="margin-top: -10px;">
        <div class="block">
          客户信息
        </div>
        <div class="block">
          <el-row>
            <el-col :span="12">
              <ul class="i-list">
                <li>客户名称：{{customerDetail.customerName}}</li>
                <li>所在地区：{{customerDetail.prvRealName}}{{customerDetail.cityRealName}}{{customerDetail.cityAreaRealName}}</li>
                <li>销售员：{{customerDetail.saleName}}</li>
                <li>注册时间：{{customerDetail.finalDate}}</li>
                <li>审核状态：{{customerDetail.checkStatusName}}</li>
                <li>客户级别：{{customerDetail.customerLevelName}}</li>
                <li>客户来源：{{customerDetail.customerSourceName}}</li>
              </ul>
            </el-col>
            <el-col :span="12">
              <ul class="i-list">
                <li>客户代码：{{customerDetail.customerSimpleCode}}</li>
                <li>详细地址：{{customerDetail.detailAddress}}</li>
                <li>客户类型：{{customerDetail.customerTypeName}}</li>
                <li>服务类型：{{customerDetail.serviceTypeName}}</li>
                <li>结算方式：{{customerDetail.caculateTypeName}}</li>
                <li>下单级别：{{customerDetail.orderLevelName}}</li>
              </ul>
            </el-col>
          </el-row>
        </div>
        <div class="block">
          联系人信息
          <el-button style="padding: 2px 0" type="text" @click="onAddContact">添加联系人</el-button>
        </div>
        <div class="block">
          <el-table
                  size="mini"
                  :data="constantDetail"
                  highlight-current-row
                  style="width: 100%"
                  stripe>
            <el-table-column
                    fixed
                    type="index"
                    width="50">
            </el-table-column>
            <el-table-column
                    fixed
                    prop="contactName"
                    label="联系人">
            </el-table-column>
            <el-table-column
                    width="140"
                    prop="contactPhone"
                    label="联系电话">
            </el-table-column>
            <el-table-column
                    prop="wxName"
                    label="微信名称">
            </el-table-column>
            <el-table-column
                    prop="activeDtme"
                    label="创建日期">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
              <template slot-scope="scope">
                <el-button @click="onEditContact(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
                <el-button @click="onDeleteContact(scope.$index, scope.row)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="编辑联系人" :visible.sync="editContactPopDialog">
      <el-form :inline="true" :model="editContactItem" label-position="left" size="mini">
        <el-form-item label="联系人姓名">
          <el-input v-model="editContactItem.contactName"></el-input>
        </el-form-item>
        <el-form-item label="联系人电话">
          <el-input v-model="editContactItem.contactPhone"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editContactPopDialog = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="onEditContactConfirm" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加联系人" :visible.sync="addContactPopDialog">
      <el-form :inline="true" :model="addContactItem" label-position="left" size="mini">
        <el-form-item label="客户联系人姓名">
          <el-input v-model="addContactItem.contactName"></el-input>
        </el-form-item>
        <el-form-item label="客户联系人电话">
          <el-input v-model="addContactItem.contactPhone"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addContactPopDialog = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="onAddContactConfirm" size="mini"  :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
  </d2-container>


</template>
<script>
import util from '@/libs/util';
import {
  getAllMasterCustomer,
  getMasterCustomerDetail,
  deleteMasterCustomer,
  addMasterCustomer,
  getAllSaleList,
  deleteCustomerContact,
  updateMasterCustomer,
  addCustomerContact,
  updateCustomerContact,
  deleteOldCustomerContact,
} from '@/api/customer';
import {
  getCheckStatus,
  getActiveStatus,
  getCustomerCaclulateType,
  getCustomerJob,
  getCustomerLevel,
  getCustomerOrderLevel,
  getCustomerSex,
  getCustomerSource,
  getCustomerType,
  getOperateStatus,
  getAllCity,
  getAllCityArea,
  getAllPrv,
  getAllTown,
  getServiceType,
} from '@/api/dictionary';
import {
    getFranchiseeNameList
} from "@/api/franchisee";

export default {
  // name 值和本页的 $route.name 一致才可以缓存页面
  name: 'vehicle-schedule',
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
      franchiseeSeries:util.cookies.get('__user__franchiseeSeries'),
      editCustomerItem: {
        caculateType: '',
        checkRemark: '',
        checkStatus: '',
        cityAreaName: '',
        cityName: '',
        customerLevel: '',
        customerName: '',
        customerNumId: '',
        customerSimpleCode: '',
        franchiseeSeries:'',
        customerSource: '',
        customerType: '',
        detailAddress: '',
        finalDate: '',
        orderLevel: '',
        prvName: '',
        saleId: '',
        series: '',
        serviceType: '',
      },
      franchiseeNameList:[],
      customerDetail: {},
      constantDetail: [],
      popDialog: false,
      editCustomerPopDialog: false,
      addCustomerPopDialog: false,
      editContactPopDialog: false,
      addContactPopDialog: false,
      addContactItem: {
        activeDtme: '',
        activeStatus: '',
        commendFranchisee: '',
        commendSale: '',
        contactName: '',
        contactPhone: '',
        customerContactId: '',
        customerMasterId: '',
        customerNumId: '',
      },
      addCustomerItem: {
        caculateType: '',
        checkRemark: '',
        checkStatus: '',
        cityAreaName: '',
        cityName: '',
        customerLevel: '',
        customerName: '',
        customerNumId: '',
        customerSimpleCode: '',
        franchiseeSeries:'',
        customerSource: '',
        customerType: '',
        detailAddress: '',
        finalDate: '',
        orderLevel: '',
        prvName: '',
        saleId: '',
        serviceType: '',
      },
      editContactItem: {
        activeDtme: '',
        activeStatus: '',
        contactName: '',
        contactOpenId: '',
        contactPhone: '',
        customerContactId: '',
        customerMasterId: '',
        customerNumId: '',
      },
      checkIdAndCheckStatus: [],
      activeStatusModels: [],
      customerCaclulateTypeModels: [],
      customerJobModels: [],
      customerSales:[],
      customerLevelModels: [],
      customerOrderLevelModels: [],
      customerSexModels: [],
      customerSourceModels: [],
      customerTypeModels: [],
      operateIdAndoperateStatus: [],
      serviceTypeModels: [],
      allPrv: [],
      allCity: [],
      allCityArea: [],
      allTown: [],
      addCustomerPopDialog: false,
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
    };
  },
  created() {
    this._initMyPage();
      this._getAllSaleList({
          customerNumId: this.customerNumId,
          franchiseeId: this.franchiseeSeries,
      });
    // 获取字典接口数据
    this._getCheckStatus({
      customerNumId: this.customerNumId,
    });
    this._getActiveStatus({
      customerNumId: this.customerNumId,
    });
    this._getCustomerCaclulateType({
      customerNumId: this.customerNumId,
    });
    this._getCustomerSource({
      customerNumId: this.customerNumId,
    });
    this._getCustomerType({
      customerNumId: this.customerNumId,
    });
    this._getOperateStatus({
      customerNumId: this.customerNumId,
    });
    this._getCustomerSource({
      customerNumId: this.customerNumId,
    });
    this._getCustomerSex({
      customerNumId: this.customerNumId,
    });
    this._getCustomerOrderLevel({
      customerNumId: this.customerNumId,
    });
    this._getCustomerLevel({
      customerNumId: this.customerNumId,
    });
    this._getCustomerJob({
      customerNumId: this.customerNumId,
    });
    this._getServiceType({
      customerNumId: this.customerNumId,
    });
      this._getFranchiseeNameList({
          customerNumId: this.customerNumId,
          franchiseeType:0
      });
    // 省市区联动数据
    this._getAllPrv({
      current: 1,
      customerNumId: this.customerNumId,
      pageSize: 200,
    });
  },
  watch: {
    'editCustomerItem.prvName'() {
      // this.editCustomerItem.cityName = ''
      // this.editCustomerItem.cityAreaName = ''
      this._getAllCity({
        current: 1,
        pageSize: 200,
        customerNumId: this.customerNumId,
        prvId: this.editCustomerItem.prvName,
      });
    },
    'addCustomerItem.prvName'() {
      // this.addCustomerItem.cityName = ''
      // this.addCustomerItem.cityAreaName = ''
      this._getAllCity({
        current: 1,
        pageSize: 200,
        customerNumId: this.customerNumId,
        prvId: this.addCustomerItem.prvName,
      });
    },
    'editCustomerItem.cityName'() {
      // this.editCustomerItem.cityAreaName = ''
      this._getAllCityArea({
        current: 1,
        pageSize: 200,
        customerNumId: this.customerNumId,
        prvId: this.editCustomerItem.prvName,
        cityId: this.editCustomerItem.cityName,
      });
    },
    'addCustomerItem.cityName'() {
      // this.addCustomerItem.cityAreaName = ''
      this._getAllCityArea({
        current: 1,
        pageSize: 200,
        customerNumId: this.customerNumId,
        prvId: this.addCustomerItem.prvName,
        cityId: this.addCustomerItem.cityName,
      });
    },
      'addCustomerItem.franchiseeSeries'() {
         if(this.addCustomerItem.franchiseeSeries!=0&&(this.addCustomerItem.franchiseeSeries==null||this.addCustomerItem.franchiseeSeries=='')){
             return;
         }
         this.addCustomerItem.saleId='';
          this._getAllSaleList({
              customerNumId: this.customerNumId,
              franchiseeId: this.addCustomerItem.franchiseeSeries,
          });
      },
  },
  methods: {
    _getAllSaleList(params) {
      getAllSaleList(params)
        .then(res => {
          if (res.code === 0) {
            this.customerSales = res.customerSales;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    _getServiceType(params) {
      getServiceType(params)
        .then(res => {
          if (res.code === 0) {
            this.serviceTypeModels = res.serviceTypeModels;
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
    _getAllTown(params) {
      getAllTown(params)
        .then(res => {
          if (res.code === 0) {
            this.allTown = res.townNameAndTownIdModel;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    _getCheckStatus(params) {
      getCheckStatus(params)
        .then(res => {
          if (res.code === 0) {
            this.checkIdAndCheckStatus = res.checkIdAndCheckStatus;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    _getActiveStatus(params) {
      getActiveStatus(params)
        .then(res => {
          if (res.code === 0) {
            this.activeStatusModels = res.activeStatusModels;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    _getCustomerCaclulateType(params) {
      getCustomerCaclulateType(params)
        .then(res => {
          if (res.code === 0) {
            this.customerCaclulateTypeModels = res.customerCaclulateTypeModels;
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
    _getCustomerLevel(params) {
      getCustomerLevel(params)
        .then(res => {
          if (res.code === 0) {
            this.customerLevelModels = res.customerLevelModels;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    _getCustomerOrderLevel(params) {
      getCustomerOrderLevel(params)
        .then(res => {
          if (res.code === 0) {
            this.customerOrderLevelModels = res.customerOrderLevelModels;
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
    _getCustomerSource(params) {
      getCustomerSource(params)
        .then(res => {
          if (res.code === 0) {
            this.customerSourceModels = res.customerSourceModels;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    _getCustomerType(params) {
      getCustomerType(params)
        .then(res => {
          if (res.code === 0) {
            this.customerTypeModels = res.customerTypeModels;
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
    _getAllMasterCustomer(params) {
      this.loading = true;
      getAllMasterCustomer(params)
        .then(res => {
          if (res.code === 0) {
            this.tableData = res.customerMaster;
            this.loading = false;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    _getMasterCustomerDetail(params) {
      console.log(params);
      getMasterCustomerDetail(params)
        .then(res => {
          if (res.code === 0) {
            this.customerDetail = res.customerMaster;
            // 数据大客户编辑
            this.editCustomerItem = Object.assign(
              {},
              this.editCustomerItem,
              res.customerMaster
            );
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    _deleteMasterCustomer(params, index) {
      deleteMasterCustomer(params)
        .then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!',
            });
            this.tableData.splice(index, 1);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    _deleteOldCustomerContact(params, index) {
      deleteOldCustomerContact(params)
        .then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除老联系人成功!',
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
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
      getAllMasterCustomer({
        customerNumId: this.customerNumId,
        current: this.page.current,
        pageSize: this.page.size,
        franchiseeSeries:this.franchiseeSeries,
        ...form,
      })
        .then(res => {
          this.loading = false;
          this.table = res.customerMaster;
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
    onAddCustomerConfirm() {
      this.loading = true;
      this._addMasterCustomer(this.addCustomerItem);
      this.loading = false;
    },
    _addMasterCustomer(params) {
      console.log(params);
      if (params.customerName === '') {
        this.$message({
          type: 'error',
          message: '客户名字不可以为空！',
        });
        return;
      }
      if (params.customerSimpleCode === '') {
        this.$message({
          type: 'error',
          message: '客户简码不可以为空！',
        });
        return;
      }
      if (params.prvName === '') {
        this.$message({
          type: 'error',
          message: '省不可以为空！',
        });
        return;
      }
      if (params.cityName === '') {
        this.$message({
          type: 'error',
          message: '市不可以为空！',
        });
        return;
      }
      if (params.cityAreaName === '') {
        this.$message({
          type: 'error',
          message: '区不可以为空！',
        });
        return;
      }
      if (params.customerSource === '') {
        this.$message({
          type: 'error',
          message: '客户来源不可以为空！',
        });
        return;
      }
      if (params.customerType === '') {
        this.$message({
          type: 'error',
          message: '客户类型不可以为空！',
        });
        return;
      }
      if (params.customerLevel === '') {
        this.$message({
          type: 'error',
          message: '客户级别不可以为空！',
        });
        return;
      }
      if (params.orderLevel === '') {
        this.$message({
          type: 'error',
          message: '下单级别不可以为空！',
        });
        return;
      }
      if (params.caculateType === '') {
        this.$message({
          type: 'error',
          message: '结算方式不可以为空！',
        });
        return;
      }
      if (params.checkStatus === '') {
        this.$message({
          type: 'error',
          message: '审核状态不可以为空！',
        });
        return;
      }
      if (params.serviceType === '') {
        this.$message({
          type: 'error',
          message: '服务类型不可以为空！',
        });
        return;
      }
        if (params.saleId === '') {
            this.$message({
                type: 'error',
                message: '销售不可以为空！',
            });
            return;
        }
        if (params.franchiseeSeries === '') {
            this.$message({
                type: 'error',
                message: '加盟商不可以为空！',
            });
            return;
        }
      addMasterCustomer(params)
        .then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '添加成功!',
            });
            this.cancelCustomer();
            this.addCustomerPopDialog = false;
            this._initMyPage();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    cancelCustomer() {
      this.addCustomerItem.caculateType = '';
      this.addCustomerItem.checkRemark = '';
      this.addCustomerItem.checkStatus = '';
      this.addCustomerItem.cityAreaName = '';
      this.addCustomerItem.cityName = '';
      this.addCustomerItem.customerLevel = '';
      this.addCustomerItem.customerName = '';
      this.addCustomerItem.customerSimpleCode = '';
      this.addCustomerItem.customerSource = '';
      this.addCustomerItem.customerType = '';
      this.addCustomerItem.detailAddress = '';
      this.addCustomerItem.finalDate = '';
      this.addCustomerItem.orderLevel = '';
      this.addCustomerItem.prvName = '';
      this.addCustomerItem.saleId = '';
      this.addCustomerItem.serviceType = '';
      this.addCustomerPopDialog = false;
    },
    handleAdd() {
      this.addCustomerPopDialog = true;
      this.addCustomerItem.customerNumId = this.customerNumId;
    },
    onEditCustomerConfirm() {
      this._updateMasterCustomer(this.editCustomerItem);
    },
    _updateMasterCustomer(params) {
      console.log(params);
      updateMasterCustomer(params)
        .then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '修改成功!',
            });
            this.editCustomerPopDialog = false;
            this._initMyPage();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    updateDate(param) {
      this.editCustomerPopDialog = true;
      this._getMasterCustomerDetail({
        customerNumId: this.customerNumId,
        customerMasterId: param.customerMasterId,
      });
      this.editCustomerItem.customerNumId = this.customerNumId;
      this.editCustomerItem.series = param.customerMasterId;
    },
    _getMasterCustomerDetail(params) {
      console.log(params);
      getMasterCustomerDetail(params)
        .then(res => {
          if (res.code === 0) {
            this.constantDetail = res.constantDetailModel;
            this.customerDetail = res.customerMaster;
            // 数据大客户编辑
            this.editCustomerItem = Object.assign(
              {},
              this.editCustomerItem,
              res.customerMaster
            );
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getMasterDetail(param) {
      this.popDialog = true;
        this.$router.push({
            path: '/customer-detail',
            query: {customerMasterId:param.customerMasterId},
        });
      // this._getMasterCustomerDetail({
      //   customerNumId: this.customerNumId,
      //   customerMasterId: param.customerMasterId,
      // });
      this.addContactItem.customerContactId = param.saleId;
      this.addContactItem.customerMasterId = param.customerMasterId;
      this.addContactItem.customerNumId = this.customerNumId;
    },
    onAddContactConfirm() {
      this.loading = true;
      this._addCustomerContact(this.addContactItem);
      this.loading = false;
    },
    _addCustomerContact(params) {
      addCustomerContact(params)
        .then(res => {
          if (res.code === 0) {
            if (res.hasSameNameContact == 'Y') {
              this.$confirm(
                '发现此用户在其他客户下也有注册,推测为曾经作为散户下过单，另外一名客户名字叫“' +
                  res.customerMasterName +
                  '”是否删除旧联系人？',
                '提示',
                {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning',
                }
              ).then(() => {
                this._deleteOldCustomerContact({
                  customerNumId: this.customerNumId,
                  oldCustomerMasterId: res.oldCustomerMasterId,
                  newCustomerMasterId: res.newCustomerMasterId,
                });
              });
            }
            this.$message({
              type: 'success',
              message: '添加新联系人成功!',
            });
            this.addContactPopDialog = false;
            // 刷新数据
            this._getMasterCustomerDetail({
              customerNumId: this.customerNumId,
              customerMasterId: this.addContactItem.customerMasterId,
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    _deleteOldCustomerContact(params, index) {
      deleteOldCustomerContact(params)
        .then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除老联系人成功!',
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    onAddContact() {
      this.addContactPopDialog = true;
      // 清空数据
      this.addContactItem.activeDtme = '';
      this.addContactItem.activeStatus = '';
      this.addContactItem.commendFranchisee = '';
      this.addContactItem.commendSale = '';
      this.addContactItem.contactName = '';
      this.addContactItem.contactPhone = '';
    },
    onEditContactConfirm() {
      this._updateCustomerContact(this.editContactItem);
    },
    _updateCustomerContact(params) {
      updateCustomerContact(params)
        .then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '修改成功!',
            });
            this.editContactPopDialog = false;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    onEditContact(index, row) {
      this.editContactPopDialog = true;
      console.log(row);
      this.editContactItem = row;
    },
    onDeleteContact(index, row) {
      console.log(index, row);
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this._deleteCustomerContact(
            {
              customerNumId: this.customerNumId,
              customerContactId: row.customerContactId,
            },
            index
          );
        })
        .catch(() => {
          console.log('取消删除');
        });
    },
    _deleteCustomerContact(params, index) {
      deleteCustomerContact(params)
        .then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!',
            });
            this.constantDetail.splice(index, 1);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
  },
};
</script>


<style lang="scss" scoped>
  .block {
    padding: 10px 30px;
    text-align: left;
  }
  .pagination-wrapper {
    padding: 10px 0;
    text-align: right;
  }
  .i-list {
    padding: 0;
    margin: 0;
    list-style: none;
    & li {
      padding: 2px 15px;
    }
  }
</style>

