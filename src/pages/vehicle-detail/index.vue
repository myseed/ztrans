<template>
  <d2-container type="full" class="page">
    <template>
      <div class="header">驾驶员基本信息</div>
      <el-form :inline="true" size="mini" label-width="110px">
        <el-form-item label="驾驶员名字" >
          <el-input v-model="addCarItem.driverName"></el-input>
        </el-form-item>
        <el-form-item label="驾驶员电话" >
          <el-input v-model="addCarItem.driverPhone"></el-input>
        </el-form-item>
        <el-form-item label="驾驶员身份证" >
          <el-input v-model="addCarItem.driverIdentityId"></el-input>
        </el-form-item>
        <el-form-item label="车队" >
          <el-input v-model="addCarItem.motorcadeCar"></el-input>
        </el-form-item>
        <el-form-item label="车队加盟商" >
          <el-input v-model="addCarItem.franchiseeName"></el-input>
        </el-form-item>
      </el-form>
      <div class="header">车辆信息</div>
      <el-form :inline="true" size="mini" label-width="110px">
        <el-form-item label="车牌号" >
          <el-input v-model="addCarItem.carPlateNumber"></el-input>
        </el-form-item>
        <el-form-item label="车型" >
          <el-input v-model="addCarItem.carTypeRealName"></el-input>
        </el-form-item>
        <el-form-item label="品牌" >
          <el-input v-model="addCarItem.carBrandRealName"></el-input>
        </el-form-item>
        <el-form-item label="颜色" >
          <el-input v-model="addCarItem.carColourRealName"></el-input>
        </el-form-item>
        <el-form-item label="尺寸" >
          <el-input v-model="addCarItem.carSizeRealName"></el-input>
        </el-form-item>
        <el-form-item label="重量" >
          <el-input v-model="addCarItem.carWeightRealName"></el-input>
        </el-form-item>

      </el-form>
      <div class="header">基础信息</div>
      <el-form :inline="true" size="mini" label-width="110px">
          <el-form-item label="申请时间" >
              <el-input v-model="addCarItem.applyDtme"></el-input>
          </el-form-item>
          <el-form-item label="激活状态" >
              <el-input v-model="addCarItem.activeStatusName"></el-input>
          </el-form-item>
        <el-form-item label="激活时间" >
          <el-input v-model="addCarItem.activeDtme"></el-input>
        </el-form-item>
        <el-form-item label="审核状态" >
          <el-input v-model="addCarItem.checkStatusName"></el-input>
        </el-form-item>
        <el-form-item label="审核时间" >
          <el-input v-model="addCarItem.checkDtme"></el-input>
        </el-form-item>
        <el-form-item label="审核人" >
          <el-input v-model="addCarItem.checkPerson"></el-input>
        </el-form-item>
        <el-form-item label="审核备注" >
          <el-input v-model="addCarItem.checkRemark"></el-input>
        </el-form-item>
      </el-form>

      <div class="header">证件信息</div>
      <el-form :inline="true" size="mini" label-width="110px">
        <el-col :span="24">
          <el-row>
            <el-col :span="6" class="txt-center">
              <img  :src="addCarItem.drivingPicture"  alt="驾驶证" class="cert-pic">
              <p>驾驶证</p>
            </el-col>
            <el-col :span="6" class="txt-center">
              <img :src="addCarItem.drivingLicense" alt="行驶证" class="cert-pic">
              <p>行驶证</p>
            </el-col>
            <el-col :span="6" class="txt-center">
              <img :src="addCarItem.identityCard"   alt="身份证" class="cert-pic">
              <p>身份证</p>
            </el-col>
            <el-col :span="6" class="txt-center">
              <img  :src="addCarItem.persomCarPicture"  alt="人车合照" class="cert-pic">
              <p>人车合照</p>
            </el-col>
          </el-row>
        </el-col>
      </el-form>
    </template>
  </d2-container>
</template>

<script>
import {getAllCar, deleteCar, getMotorcadeList, addCar, updateCar, getAllCarBand, getAllCarColour, getAllCarType, getCarDetail, getCarWeightList, getCarSizeList,} from '@/api/truck';
import util from '@/libs/util';
export default {
  data() {
    return {
      customerNumId: util.cookies.get('__user__customernumid'),
      ao:'',
      carId: '',
      carDetail: {},
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
            franchiseeName:''
        },
    };
  },

  created() {
    this.carId = this.$route.query.carId;
    if (!this.carId == '') {
      this._getCarDetail({
        customerNumId: this.customerNumId,
        carId: this.carId,
      });
    }
  },
  watch: {},
  methods: {
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

  .txt-center {
    text-align: center;

    img {
      width: 146px;
      height: 146px;
      border-radius: 8px;
    }
  }
</style>
