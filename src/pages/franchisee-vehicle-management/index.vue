<template>
  <d2-container>
    <page-header
      slot="header"
      @submit="handleSubmit"
      @add="handleAdd"
      ref="header"/>
    <page-main
      :table-data="table"
      @getCarDetail="getCarDetailTable"
      @updateCarDetail="updateCarDetail"
      :loading="loading"/>
    <page-footer
      slot="footer"
      :current="page.current"
      :size="page.size"
      :total="page.total"
      @change="handlePaginationChange"/>
    <el-dialog title="车辆详情" :visible.sync="detailCarDialog">
      <el-row>
        <el-col :span="12">
          <ul class="i-list">
            <li>驾驶员姓名：{{carDetail.driverName}}</li>
            <li>驾驶员电话：{{carDetail.driverPhone}}</li>
            <li>驾驶员身份证：{{carDetail.driverIdentityId}}</li>
            <li>车牌号：{{carDetail.carPlateNumber}}</li>
            <li>车型：{{carDetail.carTypeRealName}}</li>
            <li>品牌：{{carDetail.carBrandRealName}}</li>
            <li>颜色：{{carDetail.carColourRealName}}</li>
            <li>尺寸：{{carDetail.carSizeRealName}}</li>
            <li>重量：{{carDetail.carWeightRealName}}</li>
            <li>接单区域：{{carDetail.prvRealName}}{{carDetail.cityRealName}}{{carDetail.cityAreaRealName}}</li>
          </ul>
        </el-col>
        <el-col :span="12">
          <ul class="i-list">
            <li>所属车队：{{carDetail.motorcadeCar}}</li>
            <li>申请时间：{{carDetail.applyDtme}}</li>
            <li>激活状态：{{carDetail.activeStatusName}}</li>
            <li>激活时间：{{carDetail.activeDtme}}</li>
            <li>审核状态：{{carDetail.checkStatusName}}</li>
            <li>审核时间：{{carDetail.checkDtme}}</li>
            <li>审核人：{{carDetail.checkPerson}}</li>
            <li>备注：{{carDetail.checkRemark}}</li>
          </ul>
        </el-col>
        <el-col :span="24">
          <el-row>
            <el-col :span="6" class="tx-center">
              <img  :src="carDetail.drivingPicture"  alt="驾驶证" class="cert-pic">
              <p>驾驶证</p>
            </el-col>
            <el-col :span="6" class="tx-center">
              <img :src="carDetail.drivingLicense" alt="行驶证" class="cert-pic">
              <p>行驶证</p>
            </el-col>
            <el-col :span="6" class="tx-center">
              <img :src="carDetail.identityCard"   alt="身份证" class="cert-pic">
              <p>身份证</p>
            </el-col>
            <el-col :span="6" class="tx-center">
              <img  :src="carDetail.persomCarPicture"  alt="人车合照" class="cert-pic">
              <p>人车合照</p>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog title="添加车辆" :visible.sync="addCarPopDialog">
      <el-form :model="addCarItem" label-width="100px" size="mini">
        <el-form-item label="驾驶员姓名">
          <el-input v-model="addCarItem.driverName" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="驾驶员电话">
          <el-input v-model="addCarItem.driverPhone" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="驾驶员身份证">
          <el-input v-model="addCarItem.driverIdentityId" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="车牌号">
          <el-input v-model="addCarItem.carPlateNumber" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="车型">
          <el-select v-model="addCarItem.carType" clearable>
            <el-option v-for="(item, index) in carTypes" :key="index" :label="item.typeName" :value="item.typeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆品牌">
          <el-select v-model="addCarItem.carBrand" clearable>
            <el-option v-for="(item, index) in carBrands" :key="index" :label="item.brandName" :value="item.brandId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆颜色">
          <el-select v-model="addCarItem.carColour" clearable>
            <el-option v-for="(item, index) in carColours" :key="index" :label="item.colourName" :value="item.colourId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆重量">
          <el-select v-model="addCarItem.carWeight" clearable>
            <el-option v-for="(item, index) in carWeight" :key="index" :label="item.weightName" :value="item.weightId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆尺寸">
          <el-select v-model="addCarItem.carSize" clearable>
            <el-option v-for="(item, index) in carSizes" :key="index" :label="item.sizeName" :value="item.sizeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车队加盟商">
          <el-select v-model="addCarItem.franchiseeSeries">
            <el-option v-for="(item, index) in franchiseeNameList" :key="index" :label="item.franchiseeName" :value="item.franchiseeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属车队">
          <el-select v-model="addCarItem.motorcadeId" clearable>
            <el-option v-for="(item, index) in motorcadeNameList" :key="index" :label="item.motorcadeCar" :value="item.motorcadeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请时间">
          <el-date-picker
                  v-model="addCarItem.applyDtme"
                  type="datetime"
                  placeholder="选择日期时间"
                  align="right"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="addCarItem.checkStatus" clearable>
            <el-option v-for="(item, index) in checkIdAndCheckStatus" :key="index" :label="item.checkStatusName" :value="item.checkStatusId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核时间">
          <el-date-picker
                  v-model="addCarItem.checkDtme"
                  type="datetime"
                  placeholder="选择日期时间"
                  align="right"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="审核人">
          <el-input v-model="addCarItem.checkPerson" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addCarItem.checkRemark" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="接单区域">
          <el-select v-model="addCarItem.prvName" placeholder="请选择省">
            <el-option
                    v-for="item in allPrv"
                    :key="item.prvId"
                    :label="item.prvName"
                    :value="item.prvId">
            </el-option>
          </el-select>
          <el-select v-model="addCarItem.cityName" placeholder="请选择市">
            <el-option
                    v-for="item in allCity"
                    :key="item.cityId"
                    :label="item.cityName"
                    :value="item.cityId">
            </el-option>
          </el-select>
          <el-select v-model="addCarItem.cityAreaName" placeholder="请选择区">
            <el-option
                    v-for="item in allCityArea"
                    :key="item.cityAreaId"
                    :label="item.cityAreaName"
                    :value="item.cityAreaId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span="6" class="tx-center">
            <el-upload
                    :limit="1"
                    action=""
                    list-type="picture-card"
                    name="drivingPicture"
                    :http-request="onReaderComplete"
                    :before-upload="onReaderSelect"
                    :on-preview="onReaderPreview"
                    :on-remove="onReaderRemove">
              <i class="el-icon-plus"></i>
              <div slot="tip" style="text-align: center" class="el-upload__tip">驾驶证</div>
            </el-upload>
          </el-col>
          <el-col :span="6" class="tx-center">
            <el-upload
                    :limit="1"
                    action=""
                    list-type="picture-card"
                    name="drivingLicense"
                    :http-request="onReaderComplete"
                    :before-upload="onReaderSelect"
                    :on-preview="onReaderPreview"
                    :on-remove="onReaderRemove">
              <i class="el-icon-plus"></i>
              <div slot="tip" style="text-align: center" class="el-upload__tip">行驶证</div>
            </el-upload>
          </el-col>
          <el-col :span="6" class="tx-center">
            <el-upload
                    :limit="1"
                    action=""
                    list-type="picture-card"
                    name="identityCard"
                    :http-request="onReaderComplete"
                    :before-upload="onReaderSelect"
                    :on-preview="onReaderPreview"
                    :on-remove="onReaderRemove">
              <i class="el-icon-plus"></i>
              <div slot="tip" style="text-align: center" class="el-upload__tip">身份证</div>
            </el-upload>
          </el-col>
          <el-col :span="6" class="tx-center">
            <el-upload
                    :limit="1"
                    action=""
                    list-type="picture-card"
                    name="persomCarPicture"
                    :http-request="onReaderComplete"
                    :before-upload="onReaderSelect"
                    :on-preview="onReaderPreview"
                    :on-remove="onReaderRemove">
              <i class="el-icon-plus"></i>
              <div slot="tip" style="text-align: center" class="el-upload__tip">人车合照</div>
            </el-upload>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCarPopDialog = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="onAddCarConfirm" size="mini" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑车辆" :visible.sync="editCarPopDialog">
      <el-form :model="addCarItem" label-width="100px" size="mini">
        <el-form-item label="驾驶员姓名">
          <el-input v-model="addCarItem.driverName" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="驾驶员电话">
          <el-input v-model="addCarItem.driverPhone" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="驾驶员身份证">
          <el-input v-model="addCarItem.driverIdentityId" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="车牌号">
          <el-input v-model="addCarItem.carPlateNumber" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="车型">
          <el-select v-model="addCarItem.carType" clearable>
            <el-option v-for="(item, index) in carTypes" :key="index" :label="item.typeName" :value="item.typeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆品牌">
          <el-select v-model="addCarItem.carBrand" clearable>
            <el-option v-for="(item, index) in carBrands" :key="index" :label="item.brandName" :value="item.brandId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆颜色">
          <el-select v-model="addCarItem.carColour" clearable>
            <el-option v-for="(item, index) in carColours" :key="index" :label="item.colourName" :value="item.colourId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆重量">
          <el-select v-model="addCarItem.carWeight" clearable>
            <el-option v-for="(item, index) in carWeight" :key="index" :label="item.weightName" :value="item.weightId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆尺寸">
          <el-select v-model="addCarItem.carSize" clearable>
            <el-option v-for="(item, index) in carSizes" :key="index" :label="item.sizeName" :value="item.sizeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车队加盟商">
          <el-select v-model="addCarItem.franchiseeSeries" disabled>
            <el-option v-for="(item, index) in franchiseeNameList" :key="index" :label="item.franchiseeName" :value="item.franchiseeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属车队">
          <el-select v-model="addCarItem.motorcadeId" clearable>
            <el-option v-for="(item, index) in motorcadeNameList" :key="index" :label="item.motorcadeCar" :value="item.motorcadeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请时间">
          <el-date-picker
                  v-model="addCarItem.applyDtme"
                  type="datetime"
                  placeholder="选择日期时间"
                  align="right"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="addCarItem.checkStatus" clearable>
            <el-option v-for="(item, index) in checkIdAndCheckStatus" :key="index" :label="item.checkStatusName" :value="item.checkStatusId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核时间">
          <el-date-picker
                  v-model="addCarItem.checkDtme"
                  type="datetime"
                  placeholder="选择日期时间"
                  align="right"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="审核人">
          <el-input v-model="addCarItem.checkPerson" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addCarItem.checkRemark" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="接单区域">
          <el-select v-model="addCarItem.prvName" placeholder="请选择省">
            <el-option
                    v-for="item in allPrv"
                    :key="item.prvId"
                    :label="item.prvName"
                    :value="item.prvId">
            </el-option>
          </el-select>
          <el-select v-model="addCarItem.cityName" placeholder="请选择市">
            <el-option
                    v-for="item in allCity"
                    :key="item.cityId"
                    :label="item.cityName"
                    :value="item.cityId">
            </el-option>
          </el-select>
          <el-select v-model="addCarItem.cityAreaName" placeholder="请选择区">
            <el-option
                    v-for="item in allCityArea"
                    :key="item.cityAreaId"
                    :label="item.cityAreaName"
                    :value="item.cityAreaId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span="6" class="tx-center">
            <el-upload
                    :limit="1"
                    action=""
                    list-type="picture-card"
                    name="drivingPicture"
                    :file-list="addCarItem.drivingPicture?[{url: addCarItem.drivingPicture}]:[]"
                    :http-request="onReaderComplete"
                    :before-upload="onReaderSelect"
                    :on-preview="onReaderPreview"
                    :on-remove="onReaderRemove">
              <i class="el-icon-plus"></i>
              <div slot="tip" style="text-align: center" class="el-upload__tip">驾驶证</div>
            </el-upload>
          </el-col>
          <el-col :span="6" class="tx-center">
            <el-upload
                    :limit="1"
                    action=""
                    list-type="picture-card"
                    name="drivingLicense"
                    :file-list="addCarItem.drivingLicense?[{url: addCarItem.drivingLicense}]:[]"
                    :http-request="onReaderComplete"
                    :before-upload="onReaderSelect"
                    :on-preview="onReaderPreview"
                    :on-remove="onReaderRemove">
              <i class="el-icon-plus"></i>
              <div slot="tip" style="text-align: center" class="el-upload__tip">行驶证</div>
            </el-upload>
          </el-col>
          <el-col :span="6" class="tx-center">
            <el-upload
                    :limit="1"
                    action=""
                    list-type="picture-card"
                    name="identityCard"
                    :file-list="addCarItem.identityCard?[{url: addCarItem.identityCard}]:[]"
                    :http-request="onReaderComplete"
                    :before-upload="onReaderSelect"
                    :on-preview="onReaderPreview"
                    :on-remove="onReaderRemove">
              <i class="el-icon-plus"></i>
              <div slot="tip" style="text-align: center" class="el-upload__tip">身份证</div>
            </el-upload>
          </el-col>
          <el-col :span="6" class="tx-center">
            <el-upload
                    :limit="1"
                    action=""
                    list-type="picture-card"
                    name="persomCarPicture"
                    :file-list="addCarItem.persomCarPicture?[{url: addCarItem.persomCarPicture}]:[]"
                    :http-request="onReaderComplete"
                    :before-upload="onReaderSelect"
                    :on-preview="onReaderPreview"
                    :on-remove="onReaderRemove">
              <i class="el-icon-plus"></i>
              <div slot="tip" style="text-align: center" class="el-upload__tip">人车合照</div>
            </el-upload>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editCarPopDialog = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="onEditCarConfirm" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </d2-container>
</template>

<script>
import util from '@/libs/util';
import {getRouterAliaList} from '@/api/schedule';
import {getCarTypeList} from '@/api/order';
import {
    getFranchiseeNameList
} from "@/api/franchisee";
import {
  getAllCar,
  deleteCar,
  getMotorcadeList,
  addCar,
  updateCar,
  getAllCarBand,
  getAllCarColour,
  getAllCarType,
  getCarDetail,
  getCarWeightList,
  getCarSizeList,
} from '@/api/truck';
import {
  getCheckStatus,
  getActiveStatus,
  getAllCity,
  getAllCityArea,
  getAllPrv,
  getAllTown,
} from '@/api/dictionary';
import {uploadPicture, deletePicture} from '@/api/picture';

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
        pickerOptions: {
            disabledDate(time) {
                return time.getTime() > Date.now();
            },
            shortcuts: [
                {
                    text: "今天",
                    onClick(picker) {
                        picker.$emit("pick", new Date());
                    }
                },
                {
                    text: "昨天",
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24);
                        picker.$emit("pick", date);
                    }
                },
                {
                    text: "一周前",
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit("pick", date);
                    }
                }
            ]
        },
      table: [],
      motorcadeNameList: [],
      loading: false,
      routerDetail: [],
      addCarItem: {
        activeDtme: '',
        activeStatus: '',
        applyDtme: '',
        carBrand: '',
        carColour: '',
        carPlateNumber: '',
        carType: '',
        carWeight: '',
        carSize: '',
        checkDtme: '',
        checkPerson: '',
        checkRemark: '',
        checkStatus: '',
        cityAreaName: '',
        cityName: '',
        customerNumId: '',
        driverIdentityId: '',
        driverName: '',
        driverPhone: '',
        drivingLicense: '',
        drivingPicture: '',
        identityCard: '',
        motorcadeId: '',
        persomCarPicture: '',
        prvName: '',
        franchiseeSeries:''
      },
      franchiseeNameList:[],
      editCarPopDialog: false,
      addCarPopDialog: false,
      checkIdAndCheckStatus: [],
      detailCarDialog: false,
      activeStatusModels: [],
      allPrv: [],
      allCity: [],
      allCityArea: [],
      allTown: [],
      carBrands: [],
      carColours: [],
      carTypes: [],
      carWeight: [],
      carSizes: [],
      carDetail: {},
      dialogImageUrl: '',
      customerNumId: util.cookies.get('__user__customernumid'),
      franchiseeSeries:util.cookies.get('__user__franchiseeSeries'),
      carDetail: {},
      dialogVisible:false,
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
    };
  },
  created() {
    this._initMyPage();
    this._getRouterAliaList({
      customerNumId: this.customerNumId,
    });
    // 获取字典接口数据
    this._getCheckStatus({
      customerNumId: this.customerNumId,
    });
  },
  watch: {
    'addCarItem.prvName'() {
      this._getAllCity({
        current: 1,
        pageSize: 200,
        customerNumId: this.customerNumId,
        prvId: this.addCarItem.prvName,
      });
    },
    'addCarItem.cityName'() {
      this._getAllCityArea({
        current: 1,
        pageSize: 200,
        customerNumId: this.customerNumId,
        prvId: this.addCarItem.prvName,
        cityId: this.addCarItem.cityName,
      });
    },
      'addCarItem.franchiseeSeries'() {
          if(this.addCarItem.franchiseeSeries!=0&&(this.addCarItem.franchiseeSeries==null||this.addCarItem.franchiseeSeries=='')){
              return;
          }
          this.addCarItem.motorcadeId='';
          this._getMotorcadeList({
              franchiseeid: this.addCarItem.franchiseeSeries,
          });
      },
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
    handlePaginationChange(val) {
      this.page = val;
      // nextTick 只是为了优化示例中 notify 的显示
      this.$nextTick(() => {
        this.$refs.header.handleFormSubmit();
      });
    },
    handleSubmit(form) {
      this.loading = true;
      this._getAllCar({
        customerNumId: this.customerNumId,
        franchiseeSeries:this.franchiseeSeries,
        current: this.page.current,
        pageSize: this.page.size,
        ...form,
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
    _getAllCar(params) {
      this.loading = true;
      getAllCar(params)
        .then(res => {
          if (res.code === 0) {
            this.table = res.cars;
            this.page = {
              current: this.page.current,
              size: this.page.size,
              total: res.total,
            };
            this.loading = false;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getCarDetailTable(params) {
        this.$router.push({
            path: '/vehicle-detail',
            query: {carId: params.carId},
        });
      // this.detailCarDialog = true;
      // this._getCarDetail({
      //   carId: params.carId,
      //   customerNumId: this.customerNumId,
      // });
    },
    _getCarDetail(params) {
      getCarDetail(params)
        .then(res => {
          if (res.code === 0) {
            // 清空数据
            this.carDetail = res.car;

            this.addCarItem = this.carDetail;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    _getRouterAliaList(params) {
      getRouterAliaList(params)
        .then(res => {
          if (res.code === 0) {
            this.routerDetail = res.routerDetail;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    _getCarTypeList(params) {
      getCarTypeList(params)
        .then(res => {
          if (res.code === 0) {
            this.carTypes = res.carTypes;
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
    _getMotorcadeList(params) {
      getMotorcadeList(params)
        .then(res => {
          if (res.code === 0) {
            this.motorcadeNameList = res.motorcadeNameList;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    _getAllCarBand(params) {
      getAllCarBand(params)
        .then(res => {
          if (res.code === 0) {
            this.carBrands = res.carBrands;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    _getCarWeightList(params) {
      getCarWeightList(params)
        .then(res => {
          if (res.code === 0) {
            this.carWeight = res.carWeights;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    _getAllCarColour(params) {
      getAllCarColour(params)
        .then(res => {
          if (res.code === 0) {
            this.carColours = res.carColours;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    _getCarSizeList(params) {
      getCarSizeList(params)
        .then(res => {
          if (res.code === 0) {
            this.carSizes = res.carSizes;
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
    updateCarDetail(params) {
      this.addCarItem.drivingLicense = '';
      this.addCarItem.drivingPicture = '';
      this.addCarItem.identityCard = '';
      this.addCarItem.persomCarPicture = '';
      this._getCarDetail({
        carId: params.carId,
        customerNumId: this.customerNumId,
      });
      this.editCarPopDialog = true;
    },
    onEditCarConfirm() {
      this.addCarItem.customerNumId = this.customerNumId;
      this._updateCar(this.addCarItem);
    },
    _updateCar(params) {
      console.log(params);
      updateCar(params)
        .then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '编辑成功!',
            });
            this.editCarPopDialog = false;
            this.handleSubmit();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    onAddCarConfirm() {
      this.loading = true;
      this.addCarItem.customerNumId = this.customerNumId;
      this._addCar(this.addCarItem);
      this.loading = false;
    },
    _addCar(params) {
      if (params.carPlateNumber === '') {
        this.$message({
          type: 'error',
          message: '汽车牌照不可以为空！',
        });
        return;
      }
      if (params.carType === '') {
        this.$message({
          type: 'error',
          message: '车型不可以为空！',
        });
        return;
      }
      if (params.carSize === '') {
        this.$message({
          type: 'error',
          message: '车尺寸不可以为空！',
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
      if (params.driverName === '') {
        this.$message({
          type: 'error',
          message: '驾驶员名字不可以为空！',
        });
        return;
      }
      if (params.driverIdentityId === '') {
        this.$message({
          type: 'error',
          message: '驾驶员身份证不可以为空！',
        });
        return;
      }
      if (params.driverPhone === '') {
        this.$message({
          type: 'error',
          message: '驾驶员手机号不可以为空！',
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
      if (params.checkPerson === '') {
        this.$message({
          type: 'error',
          message: '审核人不可以为空！',
        });
        return;
      }
      if (params.checkDtme === '') {
        this.$message({
          type: 'error',
          message: '审核时间不可以为空！',
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
      addCar(params)
        .then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '添加成功!',
            });
            this.addCarPopDialog = false;
            this._initMyPage();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleAdd() {
      this.addCarPopDialog = true;
    },
      onReaderComplete({ file, filename }) {
          let pictureCode = "";
          switch (filename) {
              case "drivingLicense":
                  pictureCode = "0";
                  break;
              case "drivingPicture":
                  pictureCode = "1";
                  break;
              case "persomCarPicture":
                  pictureCode = "2";
                  break;
              case "identityCard":
                  pictureCode = "3";
                  break;
              default:
                  pictureCode = "";
                  break;
          }
          let customerNumId = this.customerNumId;
          // 把图片上传到服务器
          const params = { customerNumId, pictureCode };
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
                      this.addCarItem[filename] = res.data.url;
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
      onReaderSelect(file) {
          const larger = file.size > 5 * 1024 * 1024;
          if (larger) {
              this.$message({
                  type: "error",
                  message: "文件不能大于5M"
              });
          }
          return !larger;
      },
      onReaderPreview(file) {
          this.dialogImageUrl = file.url;
          this.dialogVisible = true;
      },
      onReaderRemove(file, fileList) {
          console.log(file, fileList);
          this._deletePicture({
              customerNumId: this.customerNumId,
              url: this.addCarItem[""]
          });
      },
      _deletePicture(params) {
          deletePicture(params)
              .then(res => {
                  console.log(res);
                  if (res.code === 0) {
                      this.$message({
                          type: "success",
                          message: "删除成功!"
                      });
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
  .el-dialog__body {
    text-align: center;
  }
  .tx-center {
    padding: 20px 0;
    text-align: center;
  }
  .cert-pic {
    width: 148px;
    outline: 1px #ccc dashed;
  }
  .el-upload.el-upload--picture-card > img {
    width: 100%;
  }
</style>
