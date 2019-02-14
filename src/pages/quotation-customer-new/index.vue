<template>
  <d2-container>
    <page-header
      slot="header"
      @submit="handleSubmit"
      @add="handleAdd"
      @downLoadExcel="downLoadExcel"
      ref="header"/>
    <page-main
      :table-data="table"
      @onDeleteDetailPrice="onDeleteDetailPrice"
      @onDeleteCustomerPrice="onDeleteCustomerPrice"
      @onEditCustomerPrice="onEditCustomerPrice"
      @getCustomerPrice="getCustomerPrice"
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
        <el-form label-width="120px" :model="addItem" size="mini" >
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
      <!--<div class="block" style="text-align: left">-->
        <!--报价设置-->
        <!--<el-table-->
                <!--size="mini"-->
                <!--:data="priceSetAddList"-->
                <!--highlight-current-row-->
                <!--style="width: 100%">-->
          <!--<el-table-column-->
                  <!--prop="carTypeRealName"-->
                  <!--label="车型"-->
                  <!--width="120">-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
                  <!--prop="carSizeRealName"-->
                  <!--label="车长"-->
                  <!--width="120">-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
                  <!--prop="routerCustomerType"-->
                  <!--label="报价类型"-->
                  <!--:formatter="routerCustomerTypeFormat">-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
                  <!--prop="initDistance"-->
                  <!--label="起步距离(公里)"-->
                  <!--width="160">-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
                  <!--prop="initPrice"-->
                  <!--label="起步价格(元)"-->
                  <!--width="160">-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
                  <!--prop="overstepPrice"-->
                  <!--label="超出价格(元/公里)"-->
                  <!--width="160">-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
                  <!--prop="saleProportion"-->
                  <!--label="销售比例">-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
                  <!--prop="franchiseeProportion"-->
                  <!--label="加盟商比例">-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
                  <!--fixed="right"-->
                  <!--label="操作"-->
                  <!--width="120">-->
            <!--<template slot-scope="scope">-->
              <!--<el-button type="text" size="small" @click="onEditPrice(scope.$index, scope.row)" v-if="scope.$index % 2 === 1">编辑</el-button>-->
            <!--</template>-->
          <!--</el-table-column>-->
        <!--</el-table>-->
      <!--</div>-->
      <span slot="footer" class="dialog-footer">
          <el-button @click="addDialog = false" size="mini">取 消</el-button>
          <!--<el-button type="primary" icon="el-icon-plus" @click="onAddPrice" size="mini">新增报价</el-button>-->
          <el-button type="primary" @click="onAddConfirm" size="mini" :loading="loading">提 交</el-button>
        </span>
    </el-dialog>
    <el-dialog
            title="新增报价"
            :visible.sync="innerAddVisible"
            append-to-body>
      <el-form label-width="145px" size="mini">
        <el-form-item label="车型">
          <el-select v-model="carTypeName" placeholder="请选择" clearable>
            <el-option v-for="(item, index) in carTypes" :key="index" :label="item.typeName" :value="`${item.typeId}-${item.typeName}`"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车长">
          <el-select v-model="carSizeName" placeholder="请选择" clearable>
            <el-option v-for="(item, index) in carSizes" :key="index" :label="item.sizeName" :value="`${item.sizeId}-${item.sizeName}`"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="block" style="padding: 15px 0">
        客户报价
      </div>
      <div class="block" style="padding: 0 15px">
        <el-form label-width="130px" :model="priceSetAddItem0" size="mini">
          <el-form-item label="起步距离(公里)">
            <el-input v-model="priceSetAddItem0.initDistance" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="起步价格(元)">
            <el-input v-model="priceSetAddItem0.initPrice" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="超出价格(元/公里)">
            <el-input v-model="priceSetAddItem0.overstepPrice" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="销售比例">
            <el-input v-model="priceSetAddItem0.saleProportion" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="加盟商比例">
            <el-input v-model="priceSetAddItem0.franchiseeProportion" placeholder=""></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="block" style="padding: 15px 0">
        司机报价
      </div>
      <div class="block" style="padding: 0 15px">
        <el-form label-width="130px" :model="priceSetAddItem1" size="mini">
          <el-form-item label="起步距离(公里)">
            <el-input v-model="priceSetAddItem1.initDistance" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="起步价格(元)">
            <el-input v-model="priceSetAddItem1.initPrice" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="超出价格(元/公里)">
            <el-input v-model="priceSetAddItem1.overstepPrice" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="销售比例">
            <el-input v-model="priceSetAddItem1.saleProportion" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="加盟商比例">
            <el-input v-model="priceSetAddItem1.franchiseeProportion" placeholder=""></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="innerAddVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="onAddPriceConfirm" size="mini">提 交</el-button>
        </span>
    </el-dialog>
    <el-dialog title="编辑客户报价" :visible.sync="editDialog">
      <div class="block" style="text-align: left">
        线路设置
      </div>
      <div class="block" style="text-align: left; padding: 0 15px">
        <el-form label-width="120px" :model="addItem" size="mini">
          <el-form-item label="客户">
            <el-select v-model="addItem.customerSeries" placeholder="请选择" clearable>
              <el-option v-for="(item, index) in customerMasterList" :key="index" :label="item.customerName" :value="item.customerMasterId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="线路编号">
            <el-input v-model="addItem.routerNumber" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="线路名称">
            <el-input v-model="addItem.routerAlia" placeholder="请输入" ></el-input>
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
            <el-select v-model="addItem.destinationPrv" placeholder="请选择省">
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
      <!--<div class="block" style="text-align: left">-->
        <!--报价设置-->
        <!--<el-table-->
                <!--size="mini"-->
                <!--:data="priceSetAddList"-->
                <!--highlight-current-row-->
                <!--style="width: 100%">-->
          <!--<el-table-column-->
                  <!--prop="carTypeRealName"-->
                  <!--label="车型"-->
                  <!--width="120">-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
                  <!--prop="carSizeRealName"-->
                  <!--label="车长"-->
                  <!--width="120">-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
                  <!--prop="routerCustomerType"-->
                  <!--label="报价类型"-->
                  <!--:formatter="routerCustomerTypeFormat">-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
                  <!--prop="initDistance"-->
                  <!--label="起步距离(公里)"-->
                  <!--width="160">-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
                  <!--prop="initPrice"-->
                  <!--label="起步价格(元)"-->
                  <!--width="160">-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
                  <!--prop="overstepPrice"-->
                  <!--label="超出价格(元/公里)"-->
                  <!--width="160">-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
                  <!--prop="saleProportion"-->
                  <!--label="销售比例">-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
                  <!--prop="franchiseeProportion"-->
                  <!--label="加盟商比例">-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
                  <!--fixed="right"-->
                  <!--label="操作"-->
                  <!--width="120">-->
            <!--<template slot-scope="scope">-->
              <!--<el-button type="text" size="small" @click="onEditPrice(scope.$index, scope.row)" v-if="scope.$index % 2 === 1">编辑</el-button>-->
            <!--</template>-->
          <!--</el-table-column>-->
        <!--</el-table>-->
      <!--</div>-->
      <span slot="footer" class="dialog-footer">
          <el-button @click="editDialog = false" size="mini">取 消</el-button>
          <!--<el-button type="primary" icon="el-icon-plus" @click="onAddPrice" size="mini">新增报价</el-button>-->
          <el-button type="primary" @click="onEditConfirm" size="mini">提 交</el-button>
        </span>
    </el-dialog>
    <el-dialog
            title="编辑报价"
            :visible.sync="innerEditVisible"
            append-to-body>
      <el-form label-width="145px" size="mini">
        <el-form-item label="车型">
          <el-select v-model="carTypeName" placeholder="请选择" clearable>
            <el-option v-for="(item, index) in carTypes" :key="index" :label="item.typeName" :value="`${item.typeId}-${item.typeName}`"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车长">
          <el-select v-model="carSizeName" placeholder="请选择" clearable>
            <el-option v-for="(item, index) in carSizes" :key="index" :label="item.sizeName" :value="`${item.sizeId}-${item.sizeName}`"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="block" style="padding: 15px 0">
        客户报价
      </div>
      <div class="block" style="padding: 0 15px">
        <el-form label-width="130px" :model="priceSetAddItem0" size="mini">
          <el-form-item label="起步距离(公里)">
            <el-input v-model="priceSetAddItem0.initDistance" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="起步价格(元)">
            <el-input v-model="priceSetAddItem0.initPrice" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="超出价格(元/公里)">
            <el-input v-model="priceSetAddItem0.overstepPrice" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="销售比例">
            <el-input v-model="priceSetAddItem0.saleProportion" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="加盟商比例">
            <el-input v-model="priceSetAddItem0.franchiseeProportion" placeholder=""></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="block" style="padding: 15px 0">
        司机报价
      </div>
      <div class="block" style="padding: 0 15px">
        <el-form label-width="130px" :model="priceSetAddItem1" size="mini">
          <el-form-item label="起步距离(公里)">
            <el-input v-model="priceSetAddItem1.initDistance" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="起步价格(元)">
            <el-input v-model="priceSetAddItem1.initPrice" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="超出价格(元/公里)">
            <el-input v-model="priceSetAddItem1.overstepPrice" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="销售比例">
            <el-input v-model="priceSetAddItem1.saleProportion" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="加盟商比例">
            <el-input v-model="priceSetAddItem1.franchiseeProportion" placeholder=""></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="innerEditVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="onEditPriceConfirm(editPriceIndex)" size="mini">提 交</el-button>
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
        getConsumerRouterPriceByRouterId,
        downloadRouterPriceExcel
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
        priceSetAddItem0: {
            carTypeName: "",
            carTypeRealName: "",
            carSizeName: "",
            carSizeRealName: "",
            franchiseeProportion: "",
            initDistance: "",
            initPrice: "",
            overstepPrice: "",
            routerCustomerType: 0,
            routerPriceId: "",
            routerType: 0,
            saleProportion: ""
        },
        priceSetAddItem1: {
            carTypeName: "",
            carTypeRealName: "",
            carSizeName: "",
            carSizeRealName: "",
            franchiseeProportion: "",
            initDistance: "",
            initPrice: "",
            overstepPrice: "",
            routerCustomerType: 1,
            routerPriceId: "",
            routerType: 0,
            saleProportion: ""
        },
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
        routerDetail: [],
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
        size: 10,
        total: 0
      }
    };
  },
  created() {
      this._getMasterCustomerList({
          customerNumId: this.customerNumId,
          saleId: ""
      });
      this._getAllPrv({
          current: 1,
          customerNumId: this.customerNumId,
          pageSize: 200
      });
      this._getCarTypeList({
          customerNumId: this.customerNumId
      });
      this._getCarSizeList({
          customerNumId: this.customerNumId
      });

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
      this.page = val;
      // nextTick 只是为了优化示例中 notify 的显示
      this.$nextTick(() => {
        this.$refs.header.handleFormSubmit();
      });
    },
    handleSubmit(form) {
        this.loading = true;
        this._getAllRouterCustomerPrice({
            customerNumId: util.cookies.get("__user__customernumid"),
            current: this.page.current,
            pageSize: this.page.size,
            ...form
        });
        this.loading = false;
    },
      _getAllRouterCustomerPrice(params) {
          getAllRouterCustomerPrice(params)
              .then(res => {
                  if (res.code === 0) {
                      this.table = res.allRouterPriceGetModels;
                      this.page = {
                          current: this.page.current,
                          size: this.page.size,
                          total: res.total
                      };
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
        this.addDialog = true;

        // 清空数据
        this.addItem = {
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
            sourceTown: ""
        };
        this.priceSetAddList = [];
    },
      _getMasterCustomerList(params) {
          getMasterCustomerList(params)
              .then(res => {
                  if (res.code === 0) {
                      this.customerMasterList = res.customerMasterList;
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
      onAddConfirm() {
          this.addItem.customerNumId = this.customerNumId;
          this._addRouterCustomerPrice(this.addItem);
      },
      _addRouterCustomerPrice(params) {
          this.loading = true;
          if (params.customerSeries === "") {
              this.$message({
                  type: "error",
                  message: "大客户不可以为空！"
              });
              this.loading = false;
              return;
          }
          if (params.routerAlia === "") {
              this.$message({
                  type: "error",
                  message: "线路别名不可以为空！"
              });
              this.loading = false;
              return;
          }
          if (params.routerNumber === "") {
              this.$message({
                  type: "error",
                  message: "线路编号不可以为空！"
              });
              this.loading = false;
              return;
          }
          if (params.sourcePrv === "") {
              this.$message({
                  type: "error",
                  message: "起始省不可以为空！"
              });
              this.loading = false;
              return;
          }
          if (params.sourceCity === "") {
              this.$message({
                  type: "error",
                  message: "起始市不可以为空！"
              });
              this.loading = false;
              return;
          }
          if (params.sourceCityArea === "") {
              this.$message({
                  type: "error",
                  message: "起始区不可以为空！"
              });
              this.loading = false;
              return;
          }
          if (params.sourceTown === "") {
              this.$message({
                  type: "error",
                  message: "起始镇不可以为空！"
              });
              this.loading = false;
              return;
          }
          if (params.destinationPrv === "") {
              this.$message({
                  type: "error",
                  message: "目的省不可以为空！"
              });
              this.loading = false;
              return;
          }
          if (params.destinationCity === "") {
              this.$message({
                  type: "error",
                  message: "目的市不可以为空！"
              });
              this.loading = false;
              return;
          }
          if (params.destinationCityArea === "") {
              this.$message({
                  type: "error",
                  message: "目的区不可以为空！"
              });
              this.loading = false;
              return;
          }
          if (params.destinationTown === "") {
              this.$message({
                  type: "error",
                  message: "目的镇不可以为空！"
              });
              this.loading = false;
              return;
          }
          var x;
          for (x in params.children) {
              if (params.children[x].carTypeName === "") {
                  this.$message({
                      type: "error",
                      message: "车型不可以为空！"
                  });
                  this.loading = false;
                  return;
              }
              if (params.children[x].carSizeName === "") {
                  this.$message({
                      type: "error",
                      message: "尺寸不可以为空！"
                  });
                  this.loading = false;
                  return;
              }
              var y;
              for (y in params.children[x].routerPriceList) {
                  if (params.children[x].routerPriceList[y].initPrice === "") {
                      this.$message({
                          type: "error",
                          message: "起步价不可以为空！"
                      });
                      this.loading = false;
                      return;
                  }
                  if (params.children[x].routerPriceList[y].initDistance === "") {
                      this.$message({
                          type: "error",
                          message: "起步距离如果不清楚请写0！"
                      });
                      this.loading = false;
                      return;
                  }
                  if (params.children[x].routerPriceList[y].overstepPrice === "") {
                      this.$message({
                          type: "error",
                          message: "超过指定范围价如果不清楚请写0！"
                      });
                      this.loading = false;
                      return;
                  }
                  if (
                      params.children[x].routerPriceList[y].franchiseeProportion === ""
                  ) {
                      this.$message({
                          type: "error",
                          message: "加盟商提成比例如果不清楚请写0！"
                      });
                      this.loading = false;
                      return;
                  }
                  if (params.children[x].routerPriceList[y].saleProportion === "") {
                      this.$message({
                          type: "error",
                          message: "销售提成比例如果不清楚请写0！"
                      });
                      this.loading = false;
                      return;
                  }
              }
          }
          addRouterCustomerPrice(params)
              .then(res => {
                  if (res.code === 0) {
                      this.$message({
                          type: "success",
                          message: "添加成功!"
                      });
                      this.addDialog = false;
                      this.handleSubmit();
                  }
                  this.loading = false;
              })
              .catch(err => {
                  console.log(err);
              });
      },
      onAddPrice() {
          this.innerAddVisible = true;

          // 清空数据
          this.carTypeName = "";
          this.carSizeName = "";
          this.priceSetAddItem0 = {
              carTypeName: "",
              carTypeRealName: "",
              carSizeName: "",
              carSizeRealName: "",
              franchiseeProportion: 0,
              initDistance: 0,
              initPrice: "",
              overstepPrice: 0,
              routerCustomerType: 0,
              routerPriceId: "",
              routerType: 0,
              saleProportion: 0
          };
          this.priceSetAddItem1 = {
              carTypeName: "",
              carTypeRealName: "",
              carSizeName: "",
              carSizeRealName: "",
              franchiseeProportion: 0,
              initDistance: 0,
              initPrice: "",
              overstepPrice: 0,
              routerCustomerType: 1,
              routerPriceId: "",
              routerType: 0,
              saleProportion: 0
          };
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
      onAddPriceConfirm() {
          this.innerAddVisible = false;

          const item = this.carTypeName.split("-");
          this.priceSetAddItem0.carTypeName = item[0];
          this.priceSetAddItem0.carTypeRealName = item[1];
          this.priceSetAddItem1.carTypeName = item[0];
          this.priceSetAddItem1.carTypeRealName = item[1];

          const item1 = this.carSizeName.split("-");
          this.priceSetAddItem0.carSizeName = item1[0];
          this.priceSetAddItem0.carSizeRealName = item1[1];
          this.priceSetAddItem1.carSizeName = item1[0];
          this.priceSetAddItem1.carSizeRealName = item1[1];

          this.priceSetAddList.push(this.priceSetAddItem0);
          this.priceSetAddList.push(this.priceSetAddItem1);

          this.addItem.children.push({
              carTypeName: item[0],
              carSizeName: item1[0],
              routerType: 0,
              routerPriceList: [this.priceSetAddItem0, this.priceSetAddItem1]
          });
      },
      onDeleteDetailPrice(param) {
          this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
          })
              .then(() => {
                  this._deleteRouterCustomerPrice(
                      {
                          customerNumId: this.customerNumId,
                          routerPriceId: param.routerPriceId
                      }
                  );
              })
              .catch(() => {
                  console.log("取消删除");
              });
      },
      _deleteRouterCustomerPrice(params) {
          deleteRouterCustomerPrice(params)
              .then(res => {
                  if (res.code === 0) {
                      this.$message({
                          type: "success",
                          message: "删除成功!"
                      });
                      this.handleSubmit();
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
      onDeleteCustomerPrice(param) {
          this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
          })
              .then(() => {
                  this._deleteRouterByRouterId(
                      {
                          customerNumId: this.customerNumId,
                          routerDetailSeries: param.routerDetailSeries
                      }
                  );
              })
              .catch(() => {
                  console.log("取消删除");
              });
      },
      _deleteRouterByRouterId(params) {
          deleteRouterByRouterId(params)
              .then(res => {
                  if (res.code === 0) {
                      this.$message({
                          type: "success",
                          message: "删除成功!"
                      });
                      this.table.splice(index, 1);
                      this.handleSubmit();
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
      getCustomerPrice(param){
          this.$router.push({
              path: '/customer-router-detail',
              query: {consumerSeries:param.customerSeries,routerDetailSeries: param.routerDetailSeries,routerType: 0},
          });
      },
      onEditCustomerPrice(param) {
          this._getConsumerRouterPriceByRouterId({
              consumerSeries: param.customerSeries,
              customerNumId: this.customerNumId,
              routerDetailSeries: param.routerDetailSeries,
              routerType: 0
          });
          this.editDialog = true;
      },
      _getConsumerRouterPriceByRouterId(params) {
          // console.log(params)
          getConsumerRouterPriceByRouterId(params)
              .then(res => {
                  if (res.code === 0) {
                      // console.log(res)
                      this.addItem.children = [];
                      this.addItem.customerNumId = this.customerNumId;
                      this.addItem.customerSeries =
                          res.allRouterPriceGetModel.customerSeries;
                      this.addItem.destinationCity =
                          res.allRouterPriceGetModel.destinationCity;
                      this.addItem.destinationCityArea =
                          res.allRouterPriceGetModel.destinationCityArea;
                      this.addItem.destinationPrv =
                          res.allRouterPriceGetModel.destinationPrv;
                      this.addItem.destinationTown =
                          res.allRouterPriceGetModel.destinationTown;
                      this.addItem.remark = res.allRouterPriceGetModel.remark;
                      this.addItem.routerAlia = res.allRouterPriceGetModel.routerAlia;
                      this.addItem.routerDetailSeries =
                          res.allRouterPriceGetModel.routerDetailSeries;
                      this.addItem.routerNumber = res.allRouterPriceGetModel.routerNumber;
                      this.addItem.sourceCity = res.allRouterPriceGetModel.sourceCity;
                      this.addItem.sourceCityArea =
                          res.allRouterPriceGetModel.sourceCityArea;
                      this.addItem.sourcePrv = res.allRouterPriceGetModel.sourcePrv;
                      this.addItem.sourceTown = res.allRouterPriceGetModel.sourceTown;
                      this.priceSetAddList = res.allRouterPriceGetModel.routerPriceList;
                      this.addItem.sendGoodsPersonName =
                          res.allRouterPriceGetModel.sendGoodsPersonName;
                      this.addItem.sendGoodsPersonMobile =
                          res.allRouterPriceGetModel.sendGoodsPersonMobile;
                      this.addItem.sendAddressDetail =
                          res.allRouterPriceGetModel.sendAddressDetail;
                      this.addItem.receiveGoodsPersonName =
                          res.allRouterPriceGetModel.receiveGoodsPersonName;
                      this.addItem.receiveGoodsPersonMobile =
                          res.allRouterPriceGetModel.receiveGoodsPersonMobile;
                      this.addItem.receiveAddressDetail =
                          res.allRouterPriceGetModel.receiveAddressDetail;
                      this.addItem.routerStations =
                          res.allRouterPriceGetModel.routerStations;
                      res.allRouterPriceGetModel.routerPriceList.forEach(item => {
                          this.addItem.children.push({
                              carTypeName: item.carTypeName,
                              carSizeName: item.carSizeName,
                              routerType: item.routerType,
                              routerPriceList: [item]
                          });
                      });
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
      onEditConfirm() {
          this.addItem.customerNumId = this.customerNumId;
          this._updateRouterCustomerPrice(this.addItem);
      },
      _updateRouterCustomerPrice(params) {
          updateRouterCustomerPrice(params)
              .then(res => {
                  if (res.code === 0) {
                      this.$message({
                          type: "success",
                          message: "编辑成功!"
                      });
                      this.editDialog = false;
                      this.handleSubmit();
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
      onEditPrice(index, row) {
          this.innerEditVisible = true;
          this.editPriceIndex = index;
          // 把待编辑数据写入以下字段
          this.carTypeName = `${row.carTypeName}-${row.carTypeRealName}`;
          this.carSizeName = `${row.carSizeName}-${row.carSizeRealName}`;
          this.priceSetAddItem0 = this.priceSetAddList[index - 1];
          this.priceSetAddItem1 = this.priceSetAddList[index];
          // .log(this.addItem.children)
      },
      downLoadExcel(form) {
          this.loading = true;
          var url=downloadRouterPriceExcel({
              customerNumId: util.cookies.get('__user__customernumid'),
          });
          window.location.href =url;
          this.loading = false;
      },
      onEditPriceConfirm(index) {
          this.innerEditVisible = false;
          // console.log(index)
          const item = this.carTypeName.split("-");
          this.priceSetAddItem0.carTypeName = item[0];
          this.priceSetAddItem0.carTypeRealName = item[1];
          this.priceSetAddItem1.carTypeName = item[0];
          this.priceSetAddItem1.carTypeRealName = item[1];

          const item1 = this.carSizeName.split("-");
          this.priceSetAddItem0.carSizeName = item1[0];
          this.priceSetAddItem0.carSizeRealName = item1[1];
          this.priceSetAddItem1.carSizeName = item1[0];
          this.priceSetAddItem1.carSizeRealName = item1[1];

          this.priceSetAddList[index - 1] = this.priceSetAddItem0;
          this.priceSetAddList[index] = this.priceSetAddItem1;

          this.addItem.children[index - 1] = {
              carTypeName: item[0],
              carSizeName: item1[0],
              routerType: 0,
              routerPriceList: [this.priceSetAddItem0]
          };
          this.addItem.children[index] = {
              carTypeName: item[0],
              carSizeName: item1[0],
              routerType: 0,
              routerPriceList: [this.priceSetAddItem1]
          };
      },
  }
};
</script>
