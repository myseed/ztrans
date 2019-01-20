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

        <el-form-item label="司机名字">
          <el-autocomplete v-model="driverName"
                           placeholder="司机名字"
                           clearable
                           :fetch-suggestions="querySearchAsyncDriver"
                           @select="handleSelectDriver">
          </el-autocomplete>
        </el-form-item>

        <el-form-item label="司机报价" >
          <el-input v-model="driverPrice" placeholder="司机报价" style="width: 500px;" disabled></el-input>
        </el-form-item>

        <el-form-item label="司机真实报价" >
          <el-input v-model="driverRealPrice" placeholder="司机真实报价" style="width: 500px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="dialogFormVisibleTask=true" :loading="searching">请选择派车日期</el-button>
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
        <el-button size="mini" type="primary" @click="dialogFormVisibleTask = false">确 定</el-button>
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
    import {getDriverBySearchKey} from '@/api/truck';
    import {getCarTypeList} from '@/api/order';
    import {
        getCarSizeList,
    } from '@/api/dictionary';
    import util from '@/libs/util';
    export default {
        data() {
            return {
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
                createOrder: {
                    weightName:'',
                    customerNumId: util.cookies.get('__user__customernumid'),
                    customerSeries: '',
                    routerDetailSeries: '',
                    routerPriceSeries: '',
                    appointmentDates:[],
                    driverSeries:'',
                    carRealMoney:'',
                },
                masterCustomerSearchKey: {
                    customerMasterSearchKey: '',
                    customerNumId: '',
                },
                driverSearchKey: {
                    driverSearchName: '',
                    customerNumId: '',
                },
                tableData: [],
                customerSales: [],
                customerMaster: [],
                drivers:[],
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
                this._getDriverPriceAndCarByCustomerIdAndRouterSeries({
                    customerNumId: this.customerNumId,
                    routerDetailSeries: this.createOrder.routerDetailSeries,
                    customerMasterId: this.createOrder.customerSeries,
                    wetherSpecialCustomerPrice: this.createOrder.wetherSpecialCustomerPrice,
                });
            },

            carWeight() {
                for (var i = 0; i < this.carDetailModels.length; i++) {
                    if (this.carDetailModels[i].weightName == this.carWeight) {
                        this.createOrder.weightName = this.carDetailModels[
                            i
                            ].carWeightName;
                        this.createOrder.routerPriceSeries = this.carDetailModels[
                            i
                            ].routerPriceId;
                        this.driverPrice=this.carDetailModels[i].initPrice;
                    }
                }
            },
        },
        methods: {
            chooeseBtn(index){
                    this.btn_group[index].show=!this.btn_group[index].show;
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
                        value:year+"-"+month + "-" + day,
                        show:false
                    });
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
            createStateFilterDriver(qs) {
                return state => {
                    return state.value.toLowerCase().indexOf(qs.toLowerCase()) != -1;
                };
            },
            handleSelectDriver(item) {
                this.createOrder.driverSeries = item.driverId;
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
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },

            _createOrderByWeb() {
                this.searching = true;
                this.btn_group.forEach(item=>{
                    if(item.show){
                       this.createOrder.appointmentDates.push((item.value));
                    }
                })
                if(this.createOrder.appointmentDates.length==0){
                    this.$message({
                        type: 'error',
                        message: '请选择用车时间！',
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
    width: 15%;
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
