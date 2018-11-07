<template>
  <d2-container>
    <page-header
      slot="header"
      @submit="handleSubmit"
      @add="handleAdd"
      ref="header"/>
    <page-main
      :table-data="table"
      :loading="loading"/>
    <page-footer
      slot="footer"
      :current="page.current"
      :size="page.size"
      :total="page.total"
      @change="handlePaginationChange"/>

    <el-dialog title="新增客户报价" :visible.sync="addDialog">
      <div class="block" style="text-align: left">
        线路设置
      </div>
      <div class="block" style="text-align: left; padding: 0 15px">
        <el-form :inline="true" :model="addItem" size="mini" >
          <el-form-item label="客户">
            <el-select v-model="addItem.customerSeries" placeholder="请选择" clearable>
              <el-option v-for="(item, index) in customerMasterList" :key="index" :label="item.customerName" :value="item.customerMasterId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="线路编号">
            <el-input v-model="addItem.routerNumber" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="线路别名">
            <el-input v-model="addItem.routerAlia" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="发货人名字">
            <el-input v-model="addItem.sendGoodsPersonName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="发货人电话">
            <el-input v-model="addItem.sendGoodsPersonMobile" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="发件人详细地址">
            <el-input v-model="addItem.sendAddressDetail" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="收货人名字">
            <el-input v-model="addItem.receiveGoodsPersonName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="收货人电话">
            <el-input v-model="addItem.receiveGoodsPersonMobile" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="收件人详细地址">
            <el-input v-model="addItem.receiveAddressDetail" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="起始点">
            <el-select v-model="addItem.sourcePrv" placeholder="请选择省">
              <el-option
                      v-for="item in allPrv"
                      :key="item.prvId"
                      :label="item.prvName"
                      :value="item.prvId">
              </el-option>
            </el-select>
            <el-select v-model="addItem.sourceCity" placeholder="请选择市">
              <el-option
                      v-for="item in allCity"
                      :key="item.cityId"
                      :label="item.cityName"
                      :value="item.cityId">
              </el-option>
            </el-select>
            <el-select v-model="addItem.sourceCityArea" placeholder="请选择区">
              <el-option
                      v-for="item in allCityArea"
                      :key="item.cityAreaId"
                      :label="item.cityAreaName"
                      :value="item.cityAreaId">
              </el-option>
            </el-select>
            <el-select v-model="addItem.sourceTown" placeholder="请选择镇">
              <el-option
                      v-for="item in allTown"
                      :key="item.townId"
                      :label="item.townName"
                      :value="item.townId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="目的地">
            <el-select v-model="addItem.destinationPrv" placeholder="请选择省" >
              <el-option
                      v-for="item in allPrv"
                      :key="item.prvId"
                      :label="item.prvName"
                      :value="item.prvId">
              </el-option>
            </el-select>
            <el-select v-model="addItem.destinationCity" placeholder="请选择市">
              <el-option
                      v-for="item in allCityDestination"
                      :key="item.cityId"
                      :label="item.cityName"
                      :value="item.cityId">
              </el-option>
            </el-select>
            <el-select v-model="addItem.destinationCityArea" placeholder="请选择区">
              <el-option
                      v-for="item in allCityAreaDestination"
                      :key="item.cityAreaId"
                      :label="item.cityAreaName"
                      :value="item.cityAreaId">
              </el-option>
            </el-select>
            <el-select v-model="addItem.destinationTown" placeholder="请选择镇">
              <el-option
                      v-for="item in allTownDestination"
                      :key="item.townId"
                      :label="item.townName"
                      :value="item.townId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="经停站点">
            <el-select
                    v-model="addItem.routerStations"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    placeholder="请输入经停站点">
            </el-select>
          </el-form-item>
          <el-form-item label="线路备注">
            <el-input type="textarea" :rows="4" v-model="addItem.remark" placeholder="请输入"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="block" style="text-align: left">
        报价设置
        <el-table
                size="mini"
                :data="priceSetAddList"
                highlight-current-row
                style="width: 100%">
          <el-table-column
                  prop="carTypeRealName"
                  label="车型"
                  width="120">
          </el-table-column>
          <el-table-column
                  prop="carSizeRealName"
                  label="车长"
                  width="120">
          </el-table-column>
          <el-table-column
                  prop="routerCustomerType"
                  label="报价类型"
                  :formatter="routerCustomerTypeFormat">
          </el-table-column>
          <el-table-column
                  prop="initDistance"
                  label="起步距离(公里)"
                  width="160">
          </el-table-column>
          <el-table-column
                  prop="initPrice"
                  label="起步价格(元)"
                  width="160">
          </el-table-column>
          <el-table-column
                  prop="overstepPrice"
                  label="超出价格(元/公里)"
                  width="160">
          </el-table-column>
          <el-table-column
                  prop="saleProportion"
                  label="销售比例">
          </el-table-column>
          <el-table-column
                  prop="franchiseeProportion"
                  label="加盟商比例">
          </el-table-column>
          <el-table-column
                  fixed="right"
                  label="操作"
                  width="120">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="onEditPrice(scope.$index, scope.row)" v-if="scope.$index % 2 === 1">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="addDialog = false" size="mini">取 消</el-button>
          <el-button type="primary" icon="el-icon-plus" @click="onAddPrice" size="mini">新增报价</el-button>
          <el-button type="primary" @click="onAddConfirm" size="mini" :loading="loading">提 交</el-button>
        </span>
    </el-dialog>
  </d2-container>
</template>

<script>
    import { getRouterAliaSearchList } from "@/api/schedule";
    import { getCarTypeList } from "@/api/order";
    import {
        getAllRouterCustomerPrice,
        getMasterCustomerList,
        addRouterCustomerPrice,
        deleteRouterByRouterId,
        deleteRouterCustomerPrice,
        updateBatchRouterPrice,
        updateRouterCustomerPrice,
        getConsumerRouterPriceByRouterId
    } from "@/api/price";
    import {
        getAllPrv,
        getAllCity,
        getAllCityArea,
        getAllTown,
        getCarSizeList
    } from "@/api/dictionary";
import util from "@/libs/util";

export default {
  // name 值和本页的 $route.name 一致才可以缓存页面
  name: "scheduler",
  components: {
    PageHeader: () => import("./componnets/PageHeader"),
    PageMain: () => import("./componnets/PageMain"),
    PageFooter: () => import("./componnets/PageFooter")
  },
  data() {
    return {
       addItem: {
            children: [],
            customerNumId: "",
            customerSeries: "",
            destinationCity: "",
            destinationCityArea: "",
            destinationPrv: "",
            destinationTown: "",
            remark: "",
            routerAlia: "",
            routerNumber: "",
            routerType: 0,
            sourceCity: "",
            sourceCityArea: "",
            sourcePrv: "",
            sourceTown: "",
            sendGoodsPersonName: "",
            sendGoodsPersonMobile: "",
            sendAddressDetail: "",
            receiveGoodsPersonName: "",
            receiveGoodsPersonMobile: "",
            receiveAddressDetail: "",
            routerStations: []
       },
        priceSetAddList: [],
      table: [],
      addDialog: false,
      customerNumId: util.cookies.get('__user__customernumid'),
      loading: false,
        tableData: [],
        searching: false,
        addDialog: false,
        editDialog: false,
        innerAddVisible: false,
        innerEditVisible: false,
        customerMasterList: [],
        allPrv: [],
        allCity: [],
        allCityDestination: [],
        allCityArea: [],
        allCityAreaDestination: [],
        allTown: [],
        allTownDestination: [],
        carTypes: [],
        carSizes: [],
        carTypeName: "",
        carSizeName: "",
        editPriceIndex: "",
      page: {
        current: 1,
        size: 100,
        total: 0
      }
    };
  },
  created() {
    this._initMyPage();
  },
    watch: {
        "addItem.sourcePrv"() {
            this._getAllCity({
                current: 1,
                pageSize: 200,
                customerNumId: this.customerNumId,
                prvId: this.addItem.sourcePrv
            });
        },
        "addItem.destinationPrv"() {
            this._getAllCityDestination({
                current: 1,
                pageSize: 200,
                customerNumId: this.customerNumId,
                prvId: this.addItem.destinationPrv
            });
        },
        "addItem.sourceCity"() {
            this._getAllCityArea({
                current: 1,
                pageSize: 200,
                customerNumId: this.customerNumId,
                prvId: this.addItem.sourcePrv,
                cityId: this.addItem.sourceCity
            });
        },
        "addItem.destinationCity"() {
            this._getAllCityAreaDestination({
                current: 1,
                pageSize: 200,
                customerNumId: this.customerNumId,
                prvId: this.addItem.destinationPrv,
                cityId: this.addItem.destinationCity
            });
        },
        "addItem.sourceCityArea"() {
            this._getAllTown({
                current: 1,
                pageSize: 200,
                customerNumId: this.customerNumId,
                cityAreaId: this.addItem.sourceCityArea
            });
        },
        "addItem.destinationCityArea"() {
            this._getAllTownDestination({
                current: 1,
                pageSize: 200,
                customerNumId: this.customerNumId,
                cityAreaId: this.addItem.destinationCityArea
            });
        }
    },
  methods: {
    _initMyPage() {
      this.handleSubmit();
    },
    handlePaginationChange(val) {
      this.$notify({
        title: "分页变化",
        message: `当前第${val.current}页 共${val.total}条 每页${val.size}条`
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
            title: "开始请求数据"
        });
        this._getAllRouterCustomerPrice({
            customerNumId: util.cookies.get("__user__customernumid"),
            current: this.page.current,
            pageSize: this.page.size,
            ...form
        });
    },
      _getAllRouterCustomerPrice(params) {
          getAllRouterCustomerPrice(params)
              .then(res => {
                  if (res.code === 0) {
                      this.table = res.allRouterPriceGetModels;
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
      _getAllCityDestination(params) {
          getAllCity(params)
              .then(res => {
                  if (res.code === 0) {
                      this.allCityDestination = res.cityeNameAndCityeIds;
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
      _getAllCityAreaDestination(params) {
          getAllCityArea(params)
              .then(res => {
                  if (res.code === 0) {
                      this.allCityAreaDestination = res.cityAreaNameAndCityAreaIdModel;
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
      _getAllTownDestination(params) {
          getAllTown(params)
              .then(res => {
                  if (res.code === 0) {
                      this.allTownDestination = res.townNameAndTownIdModel;
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
      routerCustomerTypeFormat(val) {
          return val.routerCustomerType === 0 ? "客户报价" : "司机报价";
      },
    handleAdd() {
        aalert()
        this.addDialog = true;
    }
  }
};
</script>
