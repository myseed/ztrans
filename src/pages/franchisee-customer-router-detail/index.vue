<template>
    <d2-container type="full" class="page">
        <template>
            <div class="header">客户线路基本信息</div>
            <el-form :inline="true" size="mini" label-width="110px">
                <el-form-item label="大客户名字" >
                    <el-input v-model="editCustomerRouterItem.customerName"></el-input>
                </el-form-item>
                <el-form-item label="线路编号" >
                    <el-input v-model="editCustomerRouterItem.routerNumber"></el-input>
                </el-form-item>
                <el-form-item label="线路名称" >
                    <el-input v-model="editCustomerRouterItem.routerAlia" disabled></el-input>
                </el-form-item>
                <el-form-item label="发货人名字" >
                    <el-input v-model="editCustomerRouterItem.sendGoodsPersonName"></el-input>
                </el-form-item>
                <el-form-item label="发货人电话" >
                    <el-input v-model="editCustomerRouterItem.sendGoodsPersonMobile"></el-input>
                </el-form-item>
                <el-form-item label="发件人详细地址" >
                    <el-input v-model="editCustomerRouterItem.sendAddressDetail"></el-input>
                </el-form-item>
                <el-form-item label="收货人名字" >
                    <el-input v-model="editCustomerRouterItem.receiveGoodsPersonName"></el-input>
                </el-form-item>
                <el-form-item label="收货人电话" >
                    <el-input v-model="editCustomerRouterItem.receiveGoodsPersonMobile"></el-input>
                </el-form-item>
                <el-form-item label="收件人详细地址" >
                    <el-input v-model="editCustomerRouterItem.receiveAddressDetail"></el-input>
                </el-form-item>
                <el-form-item label="经停站点">
                    <el-select
                            v-model="editCustomerRouterItem.routerStations"
                            multiple
                            filterable
                            allow-create
                            default-first-option
                            placeholder="请输入经停站点">
                    </el-select>
                </el-form-item>
                <el-form-item label="线路备注">
                    <el-input type="textarea" :rows="4" v-model="editCustomerRouterItem.remark" placeholder="请输入"></el-input>
                </el-form-item>
                <div class="header">线路起始目的地</div>
                <el-form-item label="起始点">
                    <el-select v-model="editCustomerRouterItem.sourcePrv" placeholder="请选择省">
                        <el-option
                                v-for="item in allPrv"
                                :key="item.prvId"
                                :label="item.prvName"
                                :value="item.prvId">
                        </el-option>
                    </el-select>
                    <el-select v-model="editCustomerRouterItem.sourceCity" placeholder="请选择市">
                        <el-option
                                v-for="item in allCity"
                                :key="item.cityId"
                                :label="item.cityName"
                                :value="item.cityId">
                        </el-option>
                    </el-select>
                    <el-select v-model="editCustomerRouterItem.sourceCityArea" placeholder="请选择区">
                        <el-option
                                v-for="item in allCityArea"
                                :key="item.cityAreaId"
                                :label="item.cityAreaName"
                                :value="item.cityAreaId">
                        </el-option>
                    </el-select>
                    <el-select v-model="editCustomerRouterItem.sourceTown" placeholder="请选择镇">
                        <el-option
                                v-for="item in allTown"
                                :key="item.townId"
                                :label="item.townName"
                                :value="item.townId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="目的地">
                    <el-select v-model="editCustomerRouterItem.destinationPrv" placeholder="请选择省">
                        <el-option
                                v-for="item in allPrv"
                                :key="item.prvId"
                                :label="item.prvName"
                                :value="item.prvId">
                        </el-option>
                    </el-select>
                    <el-select v-model="editCustomerRouterItem.destinationCity" placeholder="请选择市">
                        <el-option
                                v-for="item in allCityDestination"
                                :key="item.cityId"
                                :label="item.cityName"
                                :value="item.cityId">
                        </el-option>
                    </el-select>
                    <el-select v-model="editCustomerRouterItem.destinationCityArea" placeholder="请选择区">
                        <el-option
                                v-for="item in allCityAreaDestination"
                                :key="item.cityAreaId"
                                :label="item.cityAreaName"
                                :value="item.cityAreaId">
                        </el-option>
                    </el-select>
                    <el-select v-model="editCustomerRouterItem.destinationTown" placeholder="请选择镇">
                        <el-option
                                v-for="item in allTownDestination"
                                :key="item.townId"
                                :label="item.townName"
                                :value="item.townId">
                        </el-option>
                    </el-select>
                </el-form-item>

            </el-form>
            <div class="header">线路报价</div>
            <!--<el-button type="primary" @click="onAddCustomerRouter">添加线路报价</el-button>-->
            <div class="block">
                <el-table
                        size="mini"
                        :data="customerRouterPrice"
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
                            prop="carTypeRealName"
                            label="车型">
                    </el-table-column>
                    <el-table-column
                            prop="carSizeRealName"
                            label="尺寸">
                    </el-table-column>
                    <el-table-column
                            prop="carWeightRealName"
                            label="吨位">
                    </el-table-column>
                    <el-table-column
                            prop="routerCustomerTypeName"
                            label="报价类别">
                    </el-table-column>
                    <el-table-column
                            prop="initPrice"
                            label="起步价(元)">
                    </el-table-column>
                    <el-table-column
                            prop="initDistance"
                            label="起步距离(公里)">
                    </el-table-column>
                    <el-table-column
                            prop="overstepPrice"
                            label="超出价格(元/公里)">
                    </el-table-column>
                    <el-table-column
                            prop="franchiseeProportion"
                            label="加盟商提成">
                    </el-table-column>
                    <el-table-column
                            prop="saleProportion"
                            label="销售提成">
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            label="操作"
                            width="220">
                        <!--<template slot-scope="scope">-->
                            <!--<el-button @click="onEditCustomerRouter(scope.$index, scope.row)" type="primary" size="small">编辑</el-button>-->
                            <!--<el-button @click="onDeleteCustomerRouter(scope.$index, scope.row)" type="danger" size="small">删除</el-button>-->
                        <!--</template>-->
                    </el-table-column>
                </el-table>
            </div>
        </template>
        <el-dialog
                title="新增报价"
                :visible.sync="innerAddVisible"
                append-to-body>
            <el-form label-width="145px" size="mini">
                <el-form-item label="车型">
                    <el-select v-model="carTypeName" placeholder="请选择" clearable>
                        <el-option v-for="(item, index) in carTypes" :key="index" :label="item.typeName" :value="item.typeId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="车长">
                    <el-select v-model="carSizeName" placeholder="请选择" clearable>
                        <el-option v-for="(item, index) in carSizes" :key="index" :label="item.sizeName" :value="item.sizeId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="吨位">
                    <el-select v-model="carWeightName" placeholder="请选择" clearable>
                        <el-option v-for="(item, index) in carWeights" :key="index" :label="item.weightName" :value="item.weightId"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="block" style="padding: 15px 0">
                客户报价
            </div>
            <div class="block" style="padding: 0 15px" >
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


        <el-dialog
                title="修改客户报价"
                :visible.sync="innerUpdateCustomerVisible"
                append-to-body>
            <el-form label-width="145px" size="mini" >
                <el-form-item label="车型">
                    <el-select v-model="carTypeName" placeholder="请选择" clearable>
                        <el-option v-for="(item, index) in carTypes" :key="index" :label="item.typeName" :value="item.typeId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="车长">
                    <el-select v-model="carSizeName" placeholder="请选择" clearable>
                        <el-option v-for="(item, index) in carSizes" :key="index" :label="item.sizeName" :value="item.sizeId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="吨位">
                    <el-select v-model="carWeightName" placeholder="请选择" clearable>
                        <el-option v-for="(item, index) in carWeights" :key="index" :label="item.weightName" :value="item.weightId"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="block" style="padding: 15px 0">
                客户报价
            </div>
            <div class="block" style="padding: 0 15px" >
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
            <span slot="footer" class="dialog-footer">
          <el-button @click="innerUpdateCustomerVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="updateRouterPrice" size="mini">提 交</el-button>
        </span>
        </el-dialog>


        <el-dialog
                title="修改司机报价"
                :visible.sync="innerUpdateDriverVisible"
                append-to-body>
            <el-form label-width="145px" size="mini" >
                <el-form-item label="车型">
                    <el-select v-model="carTypeName" placeholder="请选择" clearable>
                        <el-option v-for="(item, index) in carTypes" :key="index" :label="item.typeName" :value="item.typeId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="车长">
                    <el-select v-model="carSizeName" placeholder="请选择" clearable>
                        <el-option v-for="(item, index) in carSizes" :key="index" :label="item.sizeName" :value="item.sizeId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="吨位">
                    <el-select v-model="carWeightName" placeholder="请选择" clearable>
                        <el-option v-for="(item, index) in carWeights" :key="index" :label="item.weightName" :value="item.weightId"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="block" style="padding: 15px 0">
                司机报价
            </div>
            <div class="block" style="padding: 0 15px" >
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
            <span slot="footer" class="dialog-footer">
          <el-button @click="innerUpdateCustomerVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="updateRouterPrice" size="mini">提 交</el-button>
        </span>
        </el-dialog>
    </d2-container>
</template>

<script>
    import {
        getAllRouterCustomerPrice,
        getMasterCustomerList,
        addRouterCustomerPrice,
        deleteRouterByRouterId,
        deleteRouterCustomerPrice,
        updateBatchRouterPrice,
        updateRouterCustomerPrice,
        getConsumerRouterPriceByRouterId,
        addRouterCustomerPriceNew,
        updateRouterCustomerPriceNew
    } from "@/api/price";
    import {
        getAllPrv,
        getAllCity,
        getAllCityArea,
        getAllTown,
        getCarSizeList,
    } from "@/api/dictionary";
    import { getCarTypeList } from "@/api/order";
    import { getCarWeightList } from "@/api/truck";
    import util from '@/libs/util';
    export default {
        data() {
            return {
                customerNumId: util.cookies.get('__user__customernumid'),
                editCustomerRouterItem: {
                    customerNumId: "",
                    customerSeries: "",
                    customerName: "",
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
                addRouterPriceModel: {
                    customerNumId: util.cookies.get('__user__customernumid'),
                    customerSeries: '',
                    routerDetailSeries: '',
                    carTypeName: '',
                    carSizeName: '',
                    carWeightName: '',
                    routerPriceList: [],
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
                allPrv: [],
                allCity: [],
                allCityDestination: [],
                allCityArea: [],
                allCityAreaDestination: [],
                allTown: [],
                allTownDestination: [],
                customerMasterList: [],
                customerRouterPrice:[],
                constantDetail: [],
                consumerSeries:'',
                routerDetailSeries:'',
                routerType:'',
                customerDetail: {},
                editContactPopDialog: false,
                addContactPopDialog: false,
                innerAddVisible:false,
                innerUpdateCustomerVisible:false,
                innerUpdateDriverVisible:false,
                carTypeName: "",
                carSizeName: "",
                carWeightName:"",
                carTypes: [],
                carSizes: [],
                carWeights: [],
                priceSetAddItem0: {
                    carTypeName: "",
                    carTypeRealName: "",
                    carSizeName: "",
                    carSizeRealName: "",
                    carWeightName: "",
                    carWeightRealName: "",
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
                    carWeightName: "",
                    carWeightRealName: "",
                    franchiseeProportion: "",
                    initDistance: "",
                    initPrice: "",
                    overstepPrice: "",
                    routerCustomerType: 1,
                    routerPriceId: "",
                    routerType: 0,
                    saleProportion: ""
                },
            };
        },

        created() {
            this.consumerSeries = this.$route.query.consumerSeries;
            this.routerDetailSeries = this.$route.query.routerDetailSeries;
            this.routerType = this.$route.query.routerType;
            if (!this.consumerSeries == '') {
                this.submitForm();
            };
        },
        watch: {
            "editCustomerRouterItem.sourcePrv"() {
                this._getAllCity({
                    current: 1,
                    pageSize: 200,
                    customerNumId: this.customerNumId,
                    prvId: this.editCustomerRouterItem.sourcePrv
                });
            },
            "editCustomerRouterItem.destinationPrv"() {
                this._getAllCityDestination({
                    current: 1,
                    pageSize: 200,
                    customerNumId: this.customerNumId,
                    prvId: this.editCustomerRouterItem.destinationPrv
                });
            },
            "editCustomerRouterItem.sourceCity"() {
                this._getAllCityArea({
                    current: 1,
                    pageSize: 200,
                    customerNumId: this.customerNumId,
                    prvId: this.editCustomerRouterItem.sourcePrv,
                    cityId: this.editCustomerRouterItem.sourceCity
                });
            },
            "editCustomerRouterItem.destinationCity"() {
                this._getAllCityAreaDestination({
                    current: 1,
                    pageSize: 200,
                    customerNumId: this.customerNumId,
                    prvId: this.editCustomerRouterItem.destinationPrv,
                    cityId: this.editCustomerRouterItem.destinationCity
                });
            },
            "editCustomerRouterItem.sourceCityArea"() {
                this._getAllTown({
                    current: 1,
                    pageSize: 200,
                    customerNumId: this.customerNumId,
                    cityAreaId: this.editCustomerRouterItem.sourceCityArea
                });
            },
            "editCustomerRouterItem.destinationCityArea"() {
                this._getAllTownDestination({
                    current: 1,
                    pageSize: 200,
                    customerNumId: this.customerNumId,
                    cityAreaId: this.editCustomerRouterItem.destinationCityArea
                });
            }
        },
        methods: {
            submitForm(){
                this._getConsumerRouterPriceByRouterId({
                    consumerSeries: this.consumerSeries,
                    customerNumId: this.customerNumId,
                    routerDetailSeries: this.routerDetailSeries,
                    routerType: this.routerType
                });
            },
            _getCarWeightList(params) {
                getCarWeightList(params)
                    .then(res => {
                        if (res.code === 0) {
                            this.carWeights = res.carWeights;
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
            onAddCustomerRouter(params){
                this.innerAddVisible=true;
                // 清空数据
                this.carTypeName = "";
                this.carSizeName = "";
                this.carWeightName = "";
                this.priceSetAddItem0 = {
                    carTypeName: "",
                    carTypeRealName: "",
                    carSizeName: "",
                    carSizeRealName: "",
                    carWeightName: "",
                    carWeightRealName: "",
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
                    carWeightName: "",
                    carWeightRealName: "",
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
            _getConsumerRouterPriceByRouterId(params) {
                // console.log(params)
                getConsumerRouterPriceByRouterId(params)
                    .then(res => {
                        if (res.code === 0) {
                            this.editCustomerRouterItem.customerNumId = this.customerNumId;
                            this.editCustomerRouterItem.customerSeries =
                                res.allRouterPriceGetModel.customerSeries;
                            this.editCustomerRouterItem.destinationCity =
                                res.allRouterPriceGetModel.destinationCity;
                            this.editCustomerRouterItem.destinationCityArea =
                                res.allRouterPriceGetModel.destinationCityArea;
                            this.editCustomerRouterItem.destinationPrv =
                                res.allRouterPriceGetModel.destinationPrv;
                            this.editCustomerRouterItem.destinationTown =
                                res.allRouterPriceGetModel.destinationTown;
                            this.editCustomerRouterItem.remark = res.allRouterPriceGetModel.remark;
                            this.editCustomerRouterItem.routerAlia = res.allRouterPriceGetModel.routerAlia;
                            this.editCustomerRouterItem.routerDetailSeries =
                                res.allRouterPriceGetModel.routerDetailSeries;
                            this.editCustomerRouterItem.routerNumber = res.allRouterPriceGetModel.routerNumber;
                            this.editCustomerRouterItem.sourceCity = res.allRouterPriceGetModel.sourceCity;
                            this.editCustomerRouterItem.sourceCityArea =
                                res.allRouterPriceGetModel.sourceCityArea;
                            this.editCustomerRouterItem.sourcePrv = res.allRouterPriceGetModel.sourcePrv;
                            this.editCustomerRouterItem.sourceTown = res.allRouterPriceGetModel.sourceTown;
                            this.priceSetAddList = res.allRouterPriceGetModel.routerPriceList;
                            this.editCustomerRouterItem.sendGoodsPersonName =
                                res.allRouterPriceGetModel.sendGoodsPersonName;
                            this.editCustomerRouterItem.sendGoodsPersonMobile =
                                res.allRouterPriceGetModel.sendGoodsPersonMobile;
                            this.editCustomerRouterItem.sendAddressDetail =
                                res.allRouterPriceGetModel.sendAddressDetail;
                            this.editCustomerRouterItem.receiveGoodsPersonName =
                                res.allRouterPriceGetModel.receiveGoodsPersonName;
                            this.editCustomerRouterItem.receiveGoodsPersonMobile =
                                res.allRouterPriceGetModel.receiveGoodsPersonMobile;
                            this.editCustomerRouterItem.receiveAddressDetail =
                                res.allRouterPriceGetModel.receiveAddressDetail;
                            this.editCustomerRouterItem.routerStations =
                                res.allRouterPriceGetModel.routerStations;
                            this.customerRouterPrice=res.allRouterPriceGetModel.routerPriceList;
                            this.editCustomerRouterItem.customerName =
                                res.allRouterPriceGetModel.customerName;
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            onAddPriceConfirm() {
                this.addRouterPriceModel.customerSeries=this.consumerSeries;
                this.addRouterPriceModel.routerDetailSeries=this.routerDetailSeries;
                this.addRouterPriceModel.carTypeName=this.carTypeName;
                this.addRouterPriceModel.carSizeName=this.carSizeName;
                this.addRouterPriceModel.carWeightName=this.carWeightName;
                this.addRouterPriceModel.routerPriceList.push(this.priceSetAddItem0);
                this.addRouterPriceModel.routerPriceList.push(this.priceSetAddItem1);
                this._addRouterCustomerPriceNew(this.addRouterPriceModel);
                this.addRouterPriceModel.routerPriceList=[];
            },
            _addRouterCustomerPriceNew(params) {
                addRouterCustomerPriceNew(params)
                    .then(res => {
                        if (res.code === 0) {
                            this.innerAddVisible = false;
                            this.$message({
                                type: "success",
                                message: "增加成功!"
                            });
                            this.submitForm();
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            onDeleteCustomerRouter(index, row) {
                // 把待编辑数据写入以下字段
                this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        this._deleteRouterCustomerPrice(
                            {
                                customerNumId: this.customerNumId,
                                routerPriceId: row.routerPriceId
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
                            this.submitForm();
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            onEditCustomerRouter(index, row) {
                this.carTypeName=row.carTypeName;
                this.carSizeName=row.carSizeName;
                this.carWeightName=row.carWeightName;
                this.priceSetAddItem0.initDistance=row.initDistance;
                this.priceSetAddItem0.franchiseeProportion=row.franchiseeProportion;
                this.priceSetAddItem0.initPrice=row.initPrice;
                this.priceSetAddItem0.overstepPrice=row.overstepPrice;
                this.priceSetAddItem0.saleProportion=row.saleProportion;
                this.priceSetAddItem0.routerPriceId=row.routerPriceId;
                //此状态为客户
                if(row.routerCustomerType=='0'){
                    this.innerUpdateCustomerVisible=true;
                }else{
                    this.innerUpdateDriverVisible=true;
                }
            },
            updateRouterPrice() {
                this.priceSetAddItem0.carTypeName=this.carTypeName;
                this.priceSetAddItem0.carSizeName=this.carSizeName;
                this.priceSetAddItem0.carWeightName=this.carWeightName;
                this._updateRouterCustomerPriceNew(this.priceSetAddItem0);
            },
            _updateRouterCustomerPriceNew(params) {
                updateRouterCustomerPriceNew(params)
                    .then(res => {
                        if (res.code === 0) {
                            this.innerUpdateCustomerVisible = false;
                            this.innerUpdateDriverVisible = false;
                            this.$message({
                                type: "success",
                                message: "更新成功!"
                            });
                            this.submitForm();
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
        },
    };
</script>

<style lang="scss">
    .header {
        padding: 0 10px;
        margin-bottom: 20px;
        border-left: #2f74ff 2px solid;
        background: #f6f6f6;
        font-size: 16px;
    }
</style>
