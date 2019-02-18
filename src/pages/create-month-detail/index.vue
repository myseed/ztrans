<template>
  <d2-container type="full" class="page">
    <template>
      <el-form  size="mini" label-width="140px">
        <el-form-item label="大客户名字">
          <el-autocomplete v-model="customerName"
                           placeholder="大客户名字"
                           clearable
                           :fetch-suggestions="querySearchAsync"
                           @select="handleSelect">
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="线路名称">
          <el-autocomplete v-model="routerAlial"
                           placeholder="线路名称"
                           clearable
                           :fetch-suggestions="querySearchAsyncRouter"
                           @select="handleSelectRouter">
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="是否需要搬卸">
        <el-select v-model="createOrder.wetherTakeover">
          <el-option
                  v-for="item in takeOver"
                  :key="item.text"
                  :label="item.text"
                  :value="item.value">
          </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="发货人名字" >
          <el-input v-model="createOrder.sendGoodsPersonName" placeholder="发货人名字" style="width: 500px;"></el-input>
        </el-form-item>
        <el-form-item label="发货人电话">
          <el-input v-model="createOrder.sendGoodsPersonMobile" placeholder="发货人电话" style="width: 500px;"></el-input>
        </el-form-item>
        <el-form-item label="发货人地址">
          <el-input v-model="createOrder.sendAddressDetail" placeholder="发货人地址" style="width: 500px;"></el-input>
        </el-form-item>
        <el-form-item label="发货地(省/市/区/县/)">
          <el-input v-model="sourceLocalction" disabled style="width: 500px;"></el-input>
        </el-form-item>
        <el-form-item label="收货人名字" >
          <el-input v-model="createOrder.receiveGoodsPersonName" placeholder="收货人名字" style="width: 500px;"></el-input>
        </el-form-item>
        <el-form-item label="收货人电话">
          <el-input v-model="createOrder.receiveGoodsPersonMobile" placeholder="收货人电话" style="width: 500px;"></el-input>
        </el-form-item>
        <el-form-item label="收货人地址">
          <el-input v-model="createOrder.receiveAddressDetail" placeholder="收货人地址" style="width: 500px;"></el-input>
        </el-form-item>
        <el-form-item label="收货地(省/市/区/县/)">
          <el-input v-model="destinationLocalction" disabled style="width: 500px;"></el-input>
        </el-form-item>
        <el-form-item label="吨位">
          <el-select v-model="carWeight" placeholder="请选择车型和车长">
            <el-option
                    v-for="item in carDetailModels"
                    :key="item.weightName"
                    :label="item.weightName"
                    :value="item.weightName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车型">
          <el-select v-model="createOrder.carTypeSeries" disabled placeholder="">
            <el-option v-for="(item, index) in carTypes" :key="item.typeId" :label="item.typeName" :value="item.typeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车长">
          <el-select v-model="createOrder.carSizeSeries"  disabled placeholder="">
            <el-option v-for="(item, index) in carSizes" :key="item.sizeId" :label="item.sizeName" :value="item.sizeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="路径站点个数">
          <el-input v-model="createOrder.sendGoodsLocationNum" placeholder="路径站点个数" style="width: 500px;"></el-input>
        </el-form-item>
        <el-form-item label="补充信息">
          <el-input  type="textarea" v-model="createOrder.remark" :rows="7" placeholder="补充信息" style="width: 500px;"></el-input>
        </el-form-item>
        <el-form-item label="货物信息">
          <el-input type="textarea" v-model="createOrder.goodsRemark" :rows="7" placeholder="货物信息"  style="width: 500px;"></el-input>
        </el-form-item>

        <el-form-item label="司机名字">
          <el-autocomplete v-model="driverName"
                           placeholder="司机名字"
                           clearable
                           :fetch-suggestions="querySearchAsyncDriver"
                           @select="handleSelectDriver">
          </el-autocomplete>
        </el-form-item>

        <el-form-item label="车牌号">
          <el-autocomplete v-model="carPlateNumber"
                           placeholder="车牌号"
                           clearable
                           :fetch-suggestions="querySearchAsyncPlateNum"
                           @select="handleSelectCarPlate">
          </el-autocomplete>
        </el-form-item>

        <el-form-item label="司机报价" >
          <el-input v-model="driverPrice" placeholder="司机报价" style="width: 500px;" disabled></el-input>
        </el-form-item>

        <el-form-item label="司机真实报价" >
          <el-input v-model="driverRealPrice" placeholder="司机真实报价" style="width: 500px;"></el-input>
        </el-form-item>
        <el-form-item label="派车时间(时/分)">
          <el-time-picker
                  v-model="createOrder.appointmentDate"
                  type="datetime"
                  value-format="HH:mm:ss"
                  placeholder="任意时间点">
          </el-time-picker>
          <!--<el-date-picker-->
          <!--style="width: 500px;"-->
          <!--v-model="createOrder.appointmentDate"-->
          <!--type="datetime"-->
          <!--placeholder="请选择约车时间"-->
          <!--align="right"-->
          <!--value-format="HH:mm:ss"-->
          <!--format="HH:mm:ss"-->
          <!--:picker-options="pickerOptions">-->
          <!--</el-date-picker>-->
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="dialogFormVisibleTask=true" :loading="searching">派车时间(年/月/日)</el-button>
        </el-form-item>
        <!--<div class="btn-groups">-->
        <!--<div v-for="(item,index) in btn_group" :class="{'btn-active':item.show}" @click="chooeseBtn(index)">{{item.name}}</div>-->
        <!--</div>-->
        <el-form-item>
          <el-button type="primary" @click="_createOrderByWeb" :loading="searching">确认</el-button>
        </el-form-item>
      </el-form>
    </template>
    <el-dialog width="720px" title="选择派单时间" :modal='false' :close-on-click-modal='false' :visible.sync="dialogFormVisibleTask" class="motorcade-flight-management-taskDialog">
      <div class="btn-groups">
        <div v-for="(item,index) in btn_group" :class="{'btn-active':item.show}" @click="chooeseBtn(index)">{{item.value}}</div>
      </div>
      <div slot="title" class="dialog-header">
     <span>
     选择派单时间
     </span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="dialogFormVisibleTask = false">确定</el-button>
        <el-button size="mini" type="primary" @click="clickALl()">全选</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>

<script>
    import {
        getMasterCustomerListBySearchKey,
        getAllRouterAlia,
        getCustomerRouterDetail,
        getPriceAndCarByCustomerIdAndRouterSeries,
        createOrderByWeb,
        getDriverPriceAndCarByCustomerIdAndRouterSeries,
        createAllMonthOrder
    } from '@/api/createorder';
    import {getDriverBySearchKey,getDriverByPlateNumberSearchKey} from '@/api/truck';
    import {getCarTypeList} from '@/api/order';
    import {
        getCarSizeList,
    } from '@/api/dictionary';
    import util from '@/libs/util';
    export default {
        data() {
            return {
                takeOver: [{text: '是', value: 'Y'}, {text: '否', value: 'N'}],
                dialogFormVisibleTask:false,
                searching: false,
                customerNumId: util.cookies.get('__user__customernumid'),
                carDetailModels:[],
                btn_group:[],
                carWeight:'',
                driverPrice: '',
                driverRealPrice: '',
                carAndPriceModel: {
                    carTypeName: '',
                    carSizeName: '',
                    typeName: '',
                    initPrice: '',
                    initDistance: '',
                    overstepPrice: '',
                },
                customerName: '',
                routerAlial: '',
                driverName:'',
                carPlateNumber:'',
                createOrder: {
                    carTypeSeries: '',
                    carSizeSeries: '',
                    carWeightSeries:'',
                    customerNumId: util.cookies.get('__user__customernumid'),
                    customerSeries: '',
                    routerDetailSeries: '',
                    routerPriceSeries: '',
                    appointmentDates:[],
                    driverSeries:'',
                    carRealMoney:'',
                    sendGoodsPersonName: '',
                    sendGoodsPersonMobile: '',
                    sendGoodsLocationNum: '',
                    appointmentNum: '',
                    deliverGoodsTime: '',
                    receiveGoodsPersonName: '',
                    receiveGoodsPersonMobile: '',
                    receiveGoodsLocationNum: '',
                    sendAddressDetail: '',
                    receiveAddressDetail: '',
                    wetherTakeover: 'N',
                    remark: '',
                    appointmentDate: '',
                    initPrice: '',
                    initDistance: '',
                    overstepPrice: '',
                    goodsRemark: '',
                    endDate: '',
                },
                masterCustomerSearchKey: {
                    customerMasterSearchKey: '',
                    customerNumId: '',
                },
                driverSearchKey: {
                    driverSearchName: '',
                    customerNumId: '',
                },
                plateNumSearchKey: {
                    plateNumberSearchKey: '',
                    customerNumId: '',
                },
                tableData: [],
                customerSales: [],
                customerMaster: [],
                drivers:[],
                carPlateNumbers:[],
                routerDetails: [],
                customerDetail: {},
                carTypes: [],
                carSizes: [],
            };
        },

        created() {
            this._getMasterCustomerListBySearchKey({
                customerNumId: this.customerNumId,
            });
            this._getCarTypeList({
                customerNumId: this.customerNumId,
            });
            this._getCarSizeList({
                customerNumId: this.customerNumId,
            });
            this.dateFormatter(new Date());
        },
        watch: {
            'createOrder.customerSeries'() {
                this._getAllRouterAlia({
                    customerNumId: this.customerNumId,
                    customerMasterId: this.createOrder.customerSeries,
                });
            },
            'createOrder.routerDetailSeries'() {
                this._getCustomerRouterDetail({
                    customerNumId: this.customerNumId,
                    routerDetailSeries: this.createOrder.routerDetailSeries,
                });
                this._getDriverPriceAndCarByCustomerIdAndRouterSeries({
                    customerNumId: this.customerNumId,
                    routerDetailSeries: this.createOrder.routerDetailSeries,
                    customerMasterId: this.createOrder.customerSeries,
                    wetherSpecialCustomerPrice: this.createOrder.wetherSpecialCustomerPrice,
                });
            },
            'routerAlial' (){
                var re = /^[0-9]+.?[0-9]*$/;
                var time="";
                if(this.routerAlial.length>4){
                    //截取后四位
                    if(re.test(this.routerAlial.substring(this.routerAlial.length-4,this.routerAlial.length))){
                        time=this.routerAlial.substring(this.routerAlial.length-4,this.routerAlial.length);
                    }else if(this.routerAlial.indexOf("（") != -1&&re.test(this.routerAlial.substring(this.routerAlial.indexOf("（")-4,this.routerAlial.indexOf("（")))){
                        time=this.routerAlial.substring(this.routerAlial.indexOf("（")-4,this.routerAlial.indexOf("（"));
                    }
                }
                if(time!=""){
                    this.createOrder.appointmentDate=this.dateFormatterNewHourAndMinute(new Date(),time);
                }else{
                    this.createOrder.appointmentDate="";
                }
            },
            carWeight() {
                for (var i = 0; i < this.carDetailModels.length; i++) {
                    if (this.carDetailModels[i].weightName == this.carWeight) {
                        this.createOrder.carWeightSeries = this.carDetailModels[
                            i
                            ].carWeightName;
                        this.createOrder.routerPriceSeries = this.carDetailModels[
                            i
                            ].routerPriceId;
                        this.driverPrice=this.carDetailModels[i].initPrice;
                        this.createOrder.carTypeSeries=this.carDetailModels[i].carTypeName;
                        this.createOrder.carSizeSeries=this.carDetailModels[i].carSizeName;
                    }
                }
            },
        },
        methods: {
            dateFormatterNewHourAndMinute(str,time){
                var d = new Date(str);
                var hour = time.substring(0,2);
                var minute = time.substring(2,4);
                var second = d.getSeconds()<10 ? '0'+d.getSeconds() : d.getSeconds();
                return [hour, minute, second].join(':');
            },
            chooeseBtn(index){
                    this.btn_group[index].show=!this.btn_group[index].show;
            },
            clickALl(){
                this.btn_group.forEach(item=>{
                    item.show=!item.show;
                })
            },
            dateFormatter(str){
                var startDate = new Date();
                var endDate = new Date();
                endDate.setDate(startDate.getDate() + 30);
                var dataArr = [];
                var weeks = ['日', '一', '二', '三', '四', '五', '六'];
                while((endDate.getTime() - startDate.getTime()) >= 0) {
                    var year = startDate.getFullYear();
                    var month = (startDate.getMonth() + 1).toString().length == 1 ? "0" + (startDate.getMonth() + 1).toString() : (startDate.getMonth() + 1);
                    var day = startDate.getDate().toString().length == 1 ? "0" + startDate.getDate() : startDate.getDate();
                    var week = weeks[startDate.getDay()];
                    dataArr.push(year+"-"+month + "-" + day);
                    this.btn_group.push({
                        value:year+"-"+month + "-" + day+"*星期"+week,
                        show:false
                    });
                    if(endDate.getTime()-startDate.getTime()==0){
                        this.createOrder.endDate=year+"-"+month + "-" + day+" "+"23:59:59";
                    }
                    startDate.setDate(startDate.getDate() + 1);
                }

            },
            querySearchAsync(qs, cb) {
                this.masterCustomerSearchKey.customerMasterSearchKey = qs;
                this.masterCustomerSearchKey.customerNumId = this.customerNumId;
                getMasterCustomerListBySearchKey(this.masterCustomerSearchKey).then(
                    res => {
                        if (res.code === 0) {
                            let customerMasters = [];
                            // customerMasters= res.customerMasterList;
                            res.customerMasterList.forEach(item => {
                                customerMasters.push({
                                    value: item.customerName,
                                    ...item,
                                });
                            });
                            this.customerMaster = customerMasters;
                            let customerMaster = this.customerMaster;
                            var results = qs
                                ? customerMaster.filter(this.createStateFilter(qs))
                                : customerMaster;
                            cb(results);
                        }
                    }
                );
            },
            createStateFilter(qs) {
                return state => {
                    return state.value.toLowerCase().indexOf(qs.toLowerCase()) != -1;
                };
            },
            handleSelect(item) {
                this.createOrder.customerSeries = item.customerMasterId;
            },
            querySearchAsyncRouter(qs, cb) {
                let routerDetails = this.routerDetails;
                var results = qs
                    ? routerDetails.filter(this.createStateFilterRouter(qs))
                    : routerDetails;
                cb(results);
            },
            createStateFilterRouter(qs) {
                return state => {
                    return state.value.toLowerCase().indexOf(qs.toLowerCase()) != -1;
                };
            },
            handleSelectRouter(item) {
                this.createOrder.routerDetailSeries = item.series;
            },

            querySearchAsyncDriver(qs, cb) {
                this.driverSearchKey.driverSearchName = qs;
                this.driverSearchKey.customerNumId = this.customerNumId;
                getDriverBySearchKey(this.driverSearchKey).then(
                    res => {
                        if (res.code === 0) {
                            let drivers = [];
                            // customerMasters= res.customerMasterList;
                            res.customerDrivers.forEach(item => {
                                drivers.push({
                                    value: item.driverName,
                                    ...item,
                                });
                            });
                            this.drivers = drivers;
                            let driver = this.drivers;
                            var results = qs
                                ? driver.filter(this.createStateFilterDriver(qs))
                                : driver;
                            cb(results);
                        }
                    }
                );
            },
            querySearchAsyncPlateNum(qs, cb) {
                this.plateNumSearchKey.plateNumberSearchKey = qs;
                this.plateNumSearchKey.customerNumId = this.customerNumId;
                getDriverByPlateNumberSearchKey(this.plateNumSearchKey).then(
                    res => {
                        if (res.code === 0) {
                            let carPlateNumberssss = [];
                            // customerMasters= res.customerMasterList;
                            res.customerDrivers.forEach(item => {
                                carPlateNumberssss.push({
                                    value: item.carPlateNumber,
                                    ...item,
                                });
                            });
                            this.carPlateNumbers = carPlateNumberssss;
                            let carPlateNumber = this.carPlateNumbers;
                            var results = qs
                                ? carPlateNumber.filter(this.createStateFilterDriver(qs))
                                : carPlateNumber;
                            cb(results);
                        }
                    }
                );
            },
            createStateFilterDriver(qs) {
                return state => {
                    return state.value.toLowerCase().indexOf(qs.toLowerCase()) != -1;
                };
            },
            handleSelectCarPlate(item) {
                this.createOrder.driverSeries = item.driverId;
                this.driverName=item.driverName;
            },
            handleSelectDriver(item) {
                this.createOrder.driverSeries = item.driverId;
                this.carPlateNumber=item.carPlateNumber;
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
            _getCustomerRouterDetail(params) {
                getCustomerRouterDetail(params)
                    .then(res => {
                        if (res.code === 0) {
                            this.createOrder.sendGoodsPersonName = res.sendGoodsPersonName;
                            this.createOrder.sendGoodsPersonMobile = res.sendGoodsPersonMobile;
                            this.createOrder.sendAddressDetail = res.sendAddressDetail;
                            this.createOrder.receiveGoodsPersonName =
                                res.receiveGoodsPersonName;
                            this.createOrder.receiveGoodsPersonMobile =
                                res.receiveGoodsPersonMobile;
                            this.createOrder.receiveAddressDetail = res.receiveAddressDetail;
                            this.createOrder.sendGoodsLocationNum = res.sendGoodsLocationNum;
                            this.createOrder.sendGoodsLocationNum = res.sendGoodsLocationNum;
                            this.sourceLocalction =
                                res.sourcePrvName +
                                '/' +
                                res.sourceCityName +
                                '/' +
                                res.sourceCityAreaName +
                                '/' +
                                res.sourceTownName;
                            this.destinationLocalction =
                                res.destinationPrvName +
                                '/' +
                                res.destinationCityName +
                                '/' +
                                res.destinationCityAreaName +
                                '/' +
                                res.destinationTownName;
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            _getAllRouterAlia(item) {
                getAllRouterAlia(item)
                    .then(res => {
                        if (res.code === 0) {
                            let routerDetails = [];
                            res.routerAliaModels.forEach(item => {
                                routerDetails.push({
                                    value: item.routerAlia,
                                    ...item,
                                });
                            });
                            this.routerDetails = routerDetails;
                            this.createOrder.wetherSpecialCustomerPrice =
                                res.weatherSpecialCustomer;
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },

            _getMasterCustomerListBySearchKey(params) {
                getMasterCustomerListBySearchKey(params)
                    .then(res => {
                        if (res.code === 0) {
                            let customerMasters = [];
                            // customerMasters= res.customerMasterList;
                            res.customerMasterList.forEach(item => {
                                customerMasters.push({
                                    value: item.customerName,
                                    ...item,
                                });
                            });
                            this.customerMaster = customerMasters;
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            __getDriverListBySearchKey(params) {
                getDriverBySearchKey(params)
                    .then(res => {
                        if (res.code === 0) {
                            let drivers = [];
                            // customerMasters= res.customerMasterList;
                            res.customerDrivers.forEach(item => {
                                drivers.push({
                                    value: item.driverName,
                                    ...item,
                                });
                            });
                            this.drivers = drivers;
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            _getDriverPriceAndCarByCustomerIdAndRouterSeries(params) {
                getDriverPriceAndCarByCustomerIdAndRouterSeries(params)
                    .then(res => {
                        if (res.code === 0) {
                            this.carDetailModels = res.carAndPriceModels;
                            if(this.carWeight==null||this.carWeight==''){
                                this.carWeight=this.carDetailModels[0].weightName;
                            }
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },

            _createOrderByWeb() {
                this.searching = true;
                this.createOrder.appointmentDates=[];
                this.btn_group.forEach(item=>{
                    if(item.show){
                        var time=item.value;
                        var realTime=item.value.substring(0,item.value.indexOf("*"))
                       this.createOrder.appointmentDates.push(realTime);
                    }
                })
                if(this.createOrder.appointmentDates.length==0){
                    this.$message({
                        type: 'error',
                        message: '请选择用车年月日！',
                    });
                    this.searching = false;
                    return;
                }
                if (this.createOrder.appointmentDate === '') {
                    this.$message({
                        type: 'error',
                        message: '请选择用车年时分！',
                    });
                    this.searching = false;
                    return;
                }
                if (this.createOrder.customerMasterId === '') {
                    this.$message({
                        type: 'error',
                        message: '大客户名字不可以为空！',
                    });
                    this.searching = false;
                    return;
                }
                if (this.createOrder.routerDetailSeries === '') {
                    this.$message({
                        type: 'error',
                        message: '线路不可以为空！',
                    });
                    this.searching = false;
                    return;
                }
                if (this.createOrder.carWeightSeries === '') {
                    this.$message({
                        type: 'error',
                        message: '吨位不可以为空！',
                    });
                    this.searching = false;
                    return;
                }
                if (this.createOrder.driverSeries === '') {
                    this.$message({
                        type: 'error',
                        message: '司机不可以为空！',
                    });
                    this.searching = false;
                    return;
                }
                if(this.driverRealPrice!=null&&this.driverRealPrice>this.driverPrice){
                    this.$message({
                        type: 'error',
                        message: '司机获得的真实价格不应该大于他的报价！',
                    });
                    this.searching = false;
                    return;
                }
                if(this.driverRealPrice!=null&&this.driverRealPrice!=''){
                    this.createOrder.carRealMoney=this.driverRealPrice;
                }else{
                    this.createOrder.carRealMoney=this.driverPrice;
                }
                this.$confirm('是否确定此派单规则?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    createAllMonthOrder(this.createOrder)
                        .then(res => {
                            if (res.code === 0) {
                                this.$message.success('整月派单成功！');
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        });
                });
                this.searching = false;
            },

            cancelSign() {
                this.$confirm('是否清除此页下单数据?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    location.reload();
                });
            },
        },
    };
</script>

<style lang="scss" scoped>
  .page {
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
        padding: 5px 15px;
      }
    }
  }
  .btn-groups{
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    justify-content: space-around;
  }
  .btn-groups>div{
    width: 10%;
    flex-grow: 0;
    flex-shrink: 0;
    padding: 10px;
    margin-top: 10px;
    text-align: center;
    border-radius: 5px;
    cursor: pointer;
    background: #eee;
    color: #000;
  }
  .btn-groups>div.btn-active{
    background: #409EFF;
    color: #fff;
  }
</style>
