<template>
    <d2-container type="full" class="page">
        <template>
            <div class="header">驾驶员基本信息</div>
            <el-form :inline="true" size="mini" label-width="110px">
                <el-form-item label="驾驶员名字">
                    <el-input v-model="addCarItem.driverName"></el-input>
                </el-form-item>
                <el-form-item label="驾驶员电话">
                    <el-input v-model="addCarItem.driverPhone"></el-input>
                </el-form-item>
                <el-form-item label="驾驶员身份证">
                    <el-input v-model="addCarItem.driverIdentityId"></el-input>
                </el-form-item>
                <el-form-item label="会员标志">
                    <el-input v-model="addCarItem.memberFlagName"></el-input>
                </el-form-item>
                <el-form-item label="行驶证类型">
                    <el-input v-model="addCarItem.carDriverTypeName"></el-input>
                </el-form-item>
                <el-form-item label="司机来源">
                    <el-input v-model="addCarItem.driverBornTypeName"></el-input>
                </el-form-item>
                <el-form-item label="车队">
                    <el-input v-model="addCarItem.motorcadeCar"></el-input>
                </el-form-item>
                <el-form-item label="车队合作伙伴">
                    <el-input v-model="addCarItem.franchiseeName"></el-input>
                </el-form-item>
            </el-form>
            <div class="header">车辆信息</div>
            <el-form :inline="true" size="mini" label-width="110px">
                <el-form-item label="车牌号">
                    <el-input v-model="addCarItem.carPlateNumber"></el-input>
                </el-form-item>
                <el-form-item label="车型">
                    <el-input v-model="addCarItem.carTypeRealName"></el-input>
                </el-form-item>
                <el-form-item label="品牌">
                    <el-input v-model="addCarItem.carBrandRealName"></el-input>
                </el-form-item>
                <el-form-item label="颜色">
                    <el-input v-model="addCarItem.carColourRealName"></el-input>
                </el-form-item>
                <el-form-item label="尺寸">
                    <el-input v-model="addCarItem.carSizeRealName"></el-input>
                </el-form-item>
                <el-form-item label="重量">
                    <el-input v-model="addCarItem.carWeightRealName"></el-input>
                </el-form-item>

            </el-form>
            <div class="header">基础信息</div>
            <el-form :inline="true" size="mini" label-width="110px">
                <el-form-item label="申请时间">
                    <el-input v-model="addCarItem.applyDtme"></el-input>
                </el-form-item>
                <el-form-item label="激活状态">
                    <el-input v-model="addCarItem.activeStatusName"></el-input>
                </el-form-item>
                <el-form-item label="激活时间">
                    <el-input v-model="addCarItem.activeDtme"></el-input>
                </el-form-item>
                <el-form-item label="审核状态">
                    <el-input v-model="addCarItem.checkStatusName"></el-input>
                </el-form-item>
                <el-form-item label="审核时间">
                    <el-input v-model="addCarItem.checkDtme"></el-input>
                </el-form-item>
                <el-form-item label="审核人">
                    <el-input v-model="addCarItem.checkPerson"></el-input>
                </el-form-item>
                <el-form-item label="审核备注">
                    <el-input v-model="addCarItem.checkRemark"></el-input>
                </el-form-item>
            </el-form>
            <div class="header" v-if='checkBoolean'>审核</div>
            <el-form :inline="true" size="mini" label-width="110px" v-if='checkBoolean'>
            <el-form-item label="审核状态">
                <el-select v-model="checkDriver.checkStatus" >
                    <el-option v-for="(item, index) in checkIdAndCheckStatus" :key="index"
                               :label="item.checkStatusName" :value="item.checkStatusId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="司机身份">
                <el-select v-model="checkDriver.driverBornType" >
                    <el-option v-for="(item, index) in bornTypeIdAndBornType" :key="index"
                              :label="item.bizTypeName" :value="item.bizTypeId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="审核失败原因">
                 <el-input v-model="checkDriver.checkRemark"></el-input>
            </el-form-item>
            <el-button size="mini" type="primary" @click="_checkDriver" >审核确认</el-button>
            </el-form>
            <div class="header">证件信息</div>
            <el-form :inline="true" size="mini" label-width="110px">
                <el-col :span="24">
                    <el-row>
                        <el-col :span="6" class="txt-center">
                            <img :src="addCarItem.drivingPicture" alt="驾驶证" class="cert-pic">
                            <p>驾驶证</p>
                        </el-col>
                        <el-col :span="6" class="txt-center">
                            <img :src="addCarItem.drivingLicense" alt="行驶证" class="cert-pic">
                            <p>行驶证</p>
                        </el-col>
                        <el-col :span="6" class="txt-center">
                            <img :src="addCarItem.identityCard" alt="身份证" class="cert-pic">
                            <p>身份证</p>
                        </el-col>
                        <el-col :span="6" class="txt-center">
                            <img :src="addCarItem.persomCarPicture" alt="人车合照" class="cert-pic">
                            <p>人车合照</p>
                        </el-col>
                    </el-row>
                </el-col>
            </el-form>
        </template>
    </d2-container>
</template>

<script>
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
        checkDriver
    } from '@/api/truck';
    import {
        getCheckStatus,getAppDictionary
    } from '@/api/dictionary';
    import util from '@/libs/util';

    export default {
        name: 'vehicle-detail',
        data() {
            return {
                customerNumId: util.cookies.get('__user__customernumid'),
                ao: '',
                carId: '',
                carDetail: {},
                checkIdAndCheckStatus: [],
                bornTypeIdAndBornType: [],
                checkBoolean: false,
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
                    franchiseeName: '',
                    memberFlagName:'',
                    carDriverTypeName:'',
                    driverBornTypeName:''
                },
                checkDriver:{
                    driverId:'',
                    driverBornType:'',
                    checkStatus:'',
                    checkRemark:'',
                    customerNumId:''
                }
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
            this._getCheckStatus({
                customerNumId: this.customerNumId,
            });
            this._getBornRealType({
                customerNumId: this.customerNumId,
                bizId:44
            });
        },
        watch: {},
        methods: {
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
            _getBornRealType(params) {
                getAppDictionary(params)
                    .then(res => {
                        if (res.code === 0) {
                            this.bornTypeIdAndBornType = res.bizLists;
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            _getCarDetail(params) {
                getCarDetail(params)
                    .then(res => {
                        if (res.code === 0) {
                            // 清空数据
                            this.carDetail = res.car;
                            if(res.car.checkStatus!='1'){
                                this.checkBoolean=true;
                            }
                            this.addCarItem = this.carDetail;
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            _checkDriver(params){
                this.checkDriver.customerNumId=this.customerNumId;
                this.checkDriver.driverId=this.carId;
                checkDriver(this.checkDriver)
                    .then(res => {
                        if (res.code === 0) {
                            this.$message.success('成功！');
                            location.reload();
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }

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
