<template>
  <d2-container type="full" class="page">
    <template>
      <el-form :model="searchItem" size="mini" label-width="140px">
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
          <el-select v-model="carWeight" placeholder="请选择吨位">
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
          <el-select v-model="createOrder.carSizeSeries" disabled placeholder="">
            <el-option v-for="(item, index) in carSizes" :key="item.sizeId" :label="item.sizeName" :value="item.sizeId"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="路径站点个数">
          <el-input v-model="createOrder.sendGoodsLocationNum" placeholder="路径站点个数" style="width: 500px;"></el-input>
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
        <el-form-item label="补充信息">
          <el-input  type="textarea" v-model="createOrder.remark" :rows="7" placeholder="补充信息" style="width: 500px;"></el-input>
        </el-form-item>
        <el-form-item label="货物信息">
          <el-input type="textarea" v-model="createOrder.goodsRemark" :rows="7" placeholder="货物信息"  style="width: 500px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="_createOrderByWeb" :loading="searching">确认下单</el-button>
          <el-button type="primary" @click="cancelSign()">重置</el-button>
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
  getOrderByRouterAndDate
} from '@/api/createorder';

import {getCarTypeList} from '@/api/order';
import {
    getCarSizeList,
} from '@/api/dictionary';
import util from '@/libs/util';
export default {
  data() {
    return {
      searching: false,
      value5: '',
      customerNumId: util.cookies.get('__user__customernumid'),
      franchiseeSeries:util.cookies.get('__user__franchiseeSeries'),
      franchiseeId: '',
      currentPage: 1,
      pageSize: 200,
      searchItem: {
        saleId: '',
        contactNameSearchKey: '',
        customerNameSearchKey: '',
        mobilePhoneSearchKey: '',
        registerEndTime: '',
        registerStartTime: '',
        registerTime: '',
      },
      takeOver: [{text: '是', value: 'Y'}, {text: '否', value: 'N'}],
      carAndPriceModels: [],
      carDetailModels:[],
      carTypeAndSize: '',
      carWeight:'',
      priceAndInstance: '',
      overPrice: '',
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
      sourceLocalction: '',
      destinationLocalction: '',
      createOrder: {
        carTypeSeries: '',
        carSizeSeries: '',
        carWeightSeries:'',
        customerNumId: util.cookies.get('__user__customernumid'),
        franchiseeSeries:util.cookies.get('__user__franchiseeSeries'),
        customerMasterId: '',
        wetherSpecialCustomerPrice: '',
        routerDetailSeries: '',
        routerPriceSeries: '',
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
      },
      masterCustomerSearchKey: {
        customerMasterSearchKey: '',
        customerNumId: '',
        franchiseeSeries:'',
      },
      tableData: [],
      customerSales: [],
      customerMaster: [],
      routerDetails: [],
      customerDetail: {},
      carTypes: [],
      carSizes: [],
    };
  },

  created() {
    this._getMasterCustomerListBySearchKey({
      customerNumId: this.customerNumId,
      franchiseeSeries: this.franchiseeSeries
    });
      this._getCarTypeList({
          customerNumId: this.customerNumId,
      });
      this._getCarSizeList({
          customerNumId: this.customerNumId,
      });
  },
  watch: {
    'createOrder.customerMasterId'() {
      this._getAllRouterAlia({
        customerNumId: this.customerNumId,
        customerMasterId: this.createOrder.customerMasterId,
      });
    },
    'createOrder.routerDetailSeries'() {
        if(this.createOrder.routerDetailSeries===''){
            return;
        }
      this._getCustomerRouterDetail({
        customerNumId: this.customerNumId,
        routerDetailSeries: this.createOrder.routerDetailSeries,
      });

      this._getPriceAndCarByCustomerIdAndRouterSeries({
        customerNumId: this.customerNumId,
        routerDetailSeries: this.createOrder.routerDetailSeries,
        customerMasterId: this.createOrder.customerMasterId,
        wetherSpecialCustomerPrice: this.createOrder.wetherSpecialCustomerPrice,
      });
    },

     carWeight() {
      for (var i = 0; i < this.carDetailModels.length; i++) {
        if (this.carDetailModels[i].weightName == this.carWeight) {
          // this.createOrder.carTypeSeries = this.carDetailModels[
            //   i
            // ].carTypeName;
            // this.createOrder.carSizeSeries = this.carDetailModels[
            //   i
            // ].carSizeName;
          this.createOrder.carWeightSeries = this.carDetailModels[
             i
          ].carWeightName;
          this.createOrder.initPrice = this.carDetailModels[i].initPrice;
          this.createOrder.initDistance = this.carDetailModels[
            i
          ].initDistance;
          this.createOrder.overstepPrice = this.carDetailModels[
            i
          ].overstepPrice;
          this.createOrder.routerPriceSeries = this.carDetailModels[
            i
          ].routerPriceId;
          this.priceAndInstance =
            this.carDetailModels[i].initPrice +
            '元/' +
            this.carDetailModels[i].initDistance +
            '公里';
          this.overPrice = this.carDetailModels[i].overstepPrice + '元/公里';
          this.createOrder.carTypeSeries=this.carDetailModels[i].carTypeName;
          this.createOrder.carSizeSeries=this.carDetailModels[i].carSizeName;
        }
      }
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
          var  thisTime=new Date();
          if(this.createOrder.appointmentDate!=null&&this.createOrder.appointmentDate!=''){
              thisTime=this.createOrder.appointmentDate;
          }
          if(time!=""){
              this.createOrder.appointmentDate=this.dateFormatterNewHourAndMinute(thisTime,time);
          }else{
              this.createOrder.appointmentDate=this.dateFormatter(thisTime);
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
      dateFormatterNewHourAndMinute(str,time){
          var d = new Date(str);
          var year = d.getFullYear();
          var month = (d.getMonth()+1)<10 ? '0'+(d.getMonth()+1) : (d.getMonth()+1);
          var day = d.getDate()<10 ? '0'+d.getDate() : d.getDate();
          var hour = time.substring(0,2);
          var minute = time.substring(2,4);
          var second = d.getSeconds()<10 ? '0'+d.getSeconds() : d.getSeconds();
          return [year, month, day].join('-') + " " + [hour, minute, second].join(':');
      },
    querySearchAsync(qs, cb) {
      this.masterCustomerSearchKey.customerMasterSearchKey = qs;
      this.masterCustomerSearchKey.customerNumId = this.customerNumId;
      this.masterCustomerSearchKey.franchiseeSeries = this.franchiseeSeries;
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
      this.createOrder.customerMasterId = item.customerMasterId;
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

    _getPriceAndCarByCustomerIdAndRouterSeries(params) {
      getPriceAndCarByCustomerIdAndRouterSeries(params)
        .then(res => {
          if (res.code === 0) {
            this.carAndPriceModels = res.carAndPriceModels;
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
      if (this.createOrder.carSizeSeries === '') {
        this.$message({
          type: 'error',
          message: '车长不可以为空！',
        });
        this.searching = false;
        return;
      }
        if (this.createOrder.carTypeSeries === '') {
            this.$message({
                type: 'error',
                message: '车型不可以为空！',
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
      if (this.createOrder.appointmentDate === '') {
        this.$message({
          type: 'error',
          message: '约车时间不可以为空！',
        });
        this.searching = false;
        return;
      }
      if (this.createOrder.initPrice === '') {
        this.$message({
          type: 'error',
          message: '订单报价不可以为空！请去维护',
        });
        this.searching = false;
        return;
      }
      if (this.createOrder.sendGoodsPersonName === '') {
        this.$message({
          type: 'error',
          message: '发货人名字不可以为空！',
        });
        this.searching = false;
        return;
      }
      if (this.createOrder.sendGoodsPersonMobile === '') {
        this.$message({
          type: 'error',
          message: '发货人手机不可以为空！',
        });
        this.searching = false;
        return;
      }
      if (this.createOrder.sendAddressDetail === '') {
        this.$message({
          type: 'error',
          message: '发货人地址不可以为空！',
        });
        this.searching = false;
        return;
      }
      if (this.createOrder.receiveGoodsPersonName === '') {
        this.$message({
          type: 'error',
          message: '收货人名字不可以为空！',
        });
        this.searching = false;
        return;
      }
      if (this.createOrder.receiveGoodsPersonMobile === '') {
        this.$message({
          type: 'error',
          message: '收货人手机不可以为空！',
        });
        this.searching = false;
        return;
      }
      if (this.createOrder.receiveAddressDetail === '') {
        this.$message({
          type: 'error',
          message: '收货人地址不可以为空！',
        });
        this.searching = false;
        return;
      }
        this._getOrderByRouterAndDate({
            customerNumId: this.customerNumId,
            customerMasterId: this.createOrder.customerMasterId,
            routerDetailSeries: this.createOrder.routerDetailSeries,
            appointmentDate: this.createOrder.appointmentDate,
        });
      // this.$confirm('是否确定下单?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning',
      // }).then(() => {
      //   createOrderByWeb(this.createOrder)
      //     .then(res => {
      //       if (res.code === 0) {
      //         this.$message.success('创建手工单成功！');
      //       }
      //     })
      //     .catch(err => {
      //       console.log(err);
      //     });
      // });
      this.searching = false;
    },
      _getOrderByRouterAndDate(params) {
          getOrderByRouterAndDate(params)
              .then(res => {
                  if (res.code === 0) {
                      if(res.orderCount>0){
                          this.$confirm(res.createOrderName+'已经下过当前线路订单,订单用车时间为'+res.date+',订单号为'+res.series+',是否继续下单?', '提示', {
                              confirmButtonText: '确定',
                              cancelButtonText: '取消',
                              type: 'warning',
                          }).then(() => {
                              createOrderByWeb(this.createOrder)
                                  .then(res => {
                                      if (res.code === 0) {
                                          this.$message.success('创建手工单成功！');
                                      }
                                  })
                                  .catch(err => {
                                      console.log(err);
                                  });
                          });
                      }else{
                          this.$confirm('是否确定下单?', '提示', {
                              confirmButtonText: '确定',
                              cancelButtonText: '取消',
                              type: 'warning',
                          }).then(() => {
                              createOrderByWeb(this.createOrder)
                                  .then(res => {
                                      if (res.code === 0) {
                                          this.$message.success('创建手工单成功！');
                                      }
                                  })
                                  .catch(err => {
                                      console.log(err);
                                  });
                          });
                      }
                  }
              })
              .catch(err => {
                  console.log(err);
              });
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
</style>
