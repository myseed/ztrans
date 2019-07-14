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
        <el-form-item label="司机名字">
          <el-autocomplete v-model="createOrder.driverName"
                           placeholder="司机名字"
                           clearable
                           :fetch-suggestions="querySearchAsyncDriver"
                           @select="handleSelectDriver">
          </el-autocomplete>
        </el-form-item>

        <el-form-item label="车牌号">
          <el-autocomplete v-model="createOrder.carPlateNumber"
                           placeholder="车牌号"
                           clearable
                           :fetch-suggestions="querySearchAsyncPlateNum"
                           @select="handleSelectCarPlate">
          </el-autocomplete>
        </el-form-item>

        <el-form-item label="司机手机号" >
          <el-input v-model="createOrder.driverMobile" placeholder="司机手机" style="width: 500px;" ></el-input>
        </el-form-item>

        <el-form-item label="司机报价" >
          <el-input v-model="driverPrice" placeholder="司机报价" style="width: 500px;" disabled></el-input>
        </el-form-item>

        <el-form-item label="司机真实报价" >
          <el-input v-model="driverRealPrice" placeholder="司机真实报价" style="width: 500px;"></el-input>
        </el-form-item>

        <el-form-item label="订单备注">
          <el-input  type="textarea" v-model="createOrder.remark" :rows="7" placeholder="选填" style="width: 500px;"></el-input>
        </el-form-item>
        <el-form-item label="货物信息">
          <el-input type="textarea" v-model="createOrder.goodsRemark" :rows="7" placeholder="必填"  style="width: 500px;"></el-input>
        </el-form-item>
        <el-form-item label="约车时间">
          <el-date-picker
                  style="width: 500px;"
                  v-model="createOrder.appointmentDate"
                  type="datetime"
                  placeholder="请选择约车时间"
                  align="right"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="createOrder.deliverStatus"  placeholder="">
            <el-option v-for="(item, index) in orderStatusModels" :key="item.orderStatusId" :label="item.orderStatusName" :value="item.orderStatusId"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="司机额外费用" v-if='showOrderDetail'>
          <el-input v-model="createOrder.driverAddFee" placeholder="司机额外费用" style="width: 500px;" ></el-input>
        </el-form-item>

        <!--<el-form-item label="司机交接单" >-->
          <!--<el-input v-model="createOrder.driverAddFee" placeholder="交接单" style="width: 500px;" ></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="司机交接单" v-if='showOrderDetail'>
          <el-upload
                  :limit="1"
                  action=""
                  list-type="picture-card"
                  name="driverReceitp"
                  :http-request="onReaderComplete"
                  :before-upload="onReaderSelect"
                  :on-preview="onReaderPreview"
                  :on-remove="onReaderRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <el-form-item>
          <el-button type="primary" @click="_createOrderByWeb" :loading="searching" :disabled="confirmStatus">确认</el-button>
        </el-form-item>
      </el-form>
    </template>
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
        createDriverOrder
    } from '@/api/createorder';
    import {getDriverBySearchKey,getDriverByPlateNumberSearchKey} from '@/api/truck';
    import {getCarTypeList} from '@/api/order';
    import {
        getCarSizeList,getOrderStatusList
    } from '@/api/dictionary';
    import {
        getMasterCustomerListBySearchKeyAndAuthority
    } from '@/api/customer';
    import {uploadPicture, deletePicture} from '@/api/picture';
    import util from '@/libs/util';
    export default {
        name: 'create-month-detail',
        data() {
            return {
                showOrderDetail:false,
                takeOver: [{text: '是', value: 'Y'}, {text: '否', value: 'N'}],
                dialogFormVisibleTask:false,
                searching: false,
                confirmStatus: false,
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
                driverMobile:'',
                customerName: '',
                routerAlial: '',
                driverName:'',
                carPlateNumber:'',
                createOrder: {
                    carTypeSeries: '',
                    carSizeSeries: '',
                    carWeightSeries:'',
                    customerNumId: util.cookies.get('__user__customernumid'),
                    franchiseeSeries: '',
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
                    appointmentDate: this.dateFormatter(new Date()),
                    initPrice: '',
                    initDistance: '',
                    overstepPrice: '',
                    goodsRemark: '',
                    endDate: '',
                    driverAddFee:'',
                    deliverStatus:0,
                    driverReceitp:'',
                    driverName:'',
                    carPlateNumber:'',
                    driverMobile:'',
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
                orderStatusModels: [],
                dialogVisible: false,
                dialogImageUrl: '',
            };
        },

        created() {
            this._getMasterCustomerListBySearchKeyAndAuthority({
                customerNumId: this.customerNumId,
            });
            this._getCarTypeList({
                customerNumId: this.customerNumId,
            });
            this._getCarSizeList({
                customerNumId: this.customerNumId,
            });
            this._getOrderStatusList({
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
            'createOrder.deliverStatus'() {
                if(this.createOrder.deliverStatus==6){
                    this.showOrderDetail=true;
                }else{
                    this.createOrder.driverAddFee='';
                    this.createOrder.driverReceitp='';
                    this.showOrderDetail=false;
                }
            },
        },
        methods: {
            dateFormatter(str){
                var d = new Date(str);
                var year = d.getFullYear();
                var month = (d.getMonth()+1)<10 ? '0'+(d.getMonth()+1) : (d.getMonth()+1);
                var day = d.getDate()<10 ? '0'+d.getDate() : d.getDate();
                var hour = d.getHours()<10 ? '0'+d.getHours() : d.getHours();
                var minute = d.getMinutes()<10 ? '0'+d.getMinutes() : d.getMinutes();
                var second = d.getSeconds()<10 ? '0'+d.getSeconds() : d.getSeconds();
                return [year, month, day].join('-') + " " + [hour, minute, second].join(':');
            },
            querySearchAsync(qs, cb) {
                this.masterCustomerSearchKey.customerMasterSearchKey = qs;
                this.masterCustomerSearchKey.customerNumId = this.customerNumId;
                getMasterCustomerListBySearchKeyAndAuthority(this.masterCustomerSearchKey).then(
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
                this.createOrder.franchiseeSeries=item.franchiseeSeries;
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
                this.createOrder.driverName=item.driverName;
                this.createOrder.driverMobile=item.driverPhone;
            },
            handleSelectDriver(item) {
                this.createOrder.driverSeries = item.driverId;
                this.createOrder.carPlateNumber=item.carPlateNumber;
                this.createOrder.driverMobile=item.driverPhone;
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
            _getOrderStatusList(params) {
                getOrderStatusList(params)
                    .then(res => {
                        if (res.code === 0) {
                            this.orderStatusModels = res.orderStatusModels;
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

            _getMasterCustomerListBySearchKeyAndAuthority(params) {
                getMasterCustomerListBySearchKeyAndAuthority(params)
                    .then(res => {
                        if (res.code === 0) {
                            let customerMasters = [];
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
                if (this.createOrder.driverName === '') {
                    this.$message({
                        type: 'error',
                        message: '司机名字不可以为空！',
                    });
                    this.searching = false;
                    return;
                }
                if (this.createOrder.carPlateNumber === '') {
                    this.$message({
                        type: 'error',
                        message: '司机车牌号名字不可以为空！',
                    });
                    this.searching = false;
                    return;
                }
                if (this.createOrder.driverMobile === '') {
                    this.$message({
                        type: 'error',
                        message: '司机手机不可以为空！',
                    });
                    this.searching = false;
                    return;
                }
                if (this.createOrder.goodsRemark === '') {
                    this.$message({
                        type: 'error',
                        message: '货物描述不可以为空！',
                    });
                    this.searching = false;
                    return;
                }
                if(this.driverPrice!=null&&this.driverPrice!=''&&this.driverPrice!=0&&this.driverRealPrice!=null&&this.driverRealPrice>this.driverPrice){
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
                    createDriverOrder(this.createOrder)
                        .then(res => {
                            if (res.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: '立即派单成功！',
                                });
                                location.reload();
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
            onReaderComplete({file, filename}) {
                let pictureCode = "5";
                let customerNumId = this.customerNumId;
                // 把图片上传到服务器
                const params = {customerNumId, pictureCode};
                this.confirmStatus=true;
                this.$message({
                    type: "warn",
                    message: "图片正在上传!"
                });
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
                            this.createOrder.driverReceitp = res.data.url;
                        }
                        this.confirmStatus=false;
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
                    url: this.createOrder.driverReceitp
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
