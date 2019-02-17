<template>
  <el-form
    :inline="true"
    :model="form"
    :rules="rules"
    ref="form"
    size="mini"
    style="margin-bottom: -18px;">

    <!--<el-form-item label="所属车队" prop="motorcadeId">-->
      <!--<el-select v-model="form.motorcadeId" placeholder="请选择" style="width: 150px;">-->
        <!--<el-option v-for="(item, index) in motorcadeNameList" :key="index" :label="item.motorcadeCar" :value="item.motorcadeId"></el-option>-->
      <!--</el-select>-->
    <!--</el-form-item>-->

    <el-form-item label="审核状态" prop="checkStatus">
      <el-select v-model="form.checkStatus" placeholder="请选择" style="width: 150px;" clearable>
        <el-option v-for="(item, index) in checkIdAndCheckStatus" :key="index" :label="item.checkStatusName" :value="item.checkStatusId"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="车牌号" prop="carPlateNumberSearchKey">
      <!--<el-input-->
              <!--v-model="form.carPlateNumberSearchKey"-->
              <!--placeholder="请输入"-->
              <!--style="width: 100px;"/>-->
      <el-autocomplete v-model="form.carPlateNumberSearchKey"
                       placeholder="车牌号"
                       clearable
                       :fetch-suggestions="querySearchAsyncDriverPlate"
                       @select="handleSelectRouter">
      </el-autocomplete>
    </el-form-item>

    <el-form-item label="司机姓名" prop="driverNameSearchKey">
      <!--<el-input-->
              <!--v-model="form.driverNameSearchKey"-->
              <!--placeholder="请输入"-->
              <!--style="width: 100px;"/>-->
      <el-autocomplete v-model="form.driverNameSearchKey"
                       placeholder="司机姓名"
                       clearable
                       :fetch-suggestions="querySearchAsyncDriver"
                       @select="handleSelectRouter">
      </el-autocomplete>
    </el-form-item>

    <el-form-item label="司机手机号" prop="driverPhoneSearchKey">
      <el-input
              v-model="form.driverPhoneSearchKey"
              placeholder="请输入"
              style="width: 100px;"/>
    </el-form-item>

    <el-form-item>
      <el-button
        type="primary"
        @click="handleFormSubmit">
        <d2-icon name="search"/>
        查询
      </el-button>
    </el-form-item>

    <el-form-item>
      <el-button
        @click="handleFormReset">
        <d2-icon name="refresh"/>
        重置
      </el-button>
    </el-form-item>

    <el-form-item>
      <el-button
        type="primary"
        @click="handleAdd">
        <d2-icon name="plus"/>
        新增
      </el-button>
    </el-form-item>

  </el-form>
</template>

<script>
import util from '@/libs/util';
import {
  getCheckStatus,
  getActiveStatus,
  getAllCity,
  getAllCityArea,
  getAllPrv,
  getAllTown,
} from '@/api/dictionary';
import {getDriverBySearchKey,getDriverByPlateNumberSearchKey} from '@/api/truck';
export default {
  data() {
    return {
      customerSales: [],
      driverNames: [],
      driverPlateNumber: [],
      registerTime: '',
      checkIdAndCheckStatus: [],
      motorcadeNameList: [],
      form: {
        customerNumId: util.cookies.get('__user__customernumid'),
        motorcadeId: '',
        checkStatus: '',
        carPlateNumberSearchKey: '',
        driverNameSearchKey: '',
        driverPhoneSearchKey: '',
      },
      rules: {},
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            },
          },
        ],
      },
    };
  },
  created() {
    this._getCheckStatus({
      customerNumId: this.customerNumId,
    });
      this._getDriverNameList({
          customerNumId: this.form.customerNumId,
      });
  },
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
    onRegisterTimeChange(time) {
      this.form.registerStartTime = time[0];
      this.form.registerEndTime = time[1];
    },
      _getDriverNameList(params) {
          getDriverBySearchKey(params)
              .then(res => {
                  if (res.code === 0) {
                      let driverNames = [];
                      res.customerDrivers.forEach(item => {
                          driverNames.push({
                              value: item.driverName,
                              ...item,
                          });
                      });
                      let driverPlatNames = [];
                      res.customerDrivers.forEach(item => {
                          driverPlatNames.push({
                              value: item.carPlateNumber,
                              ...item,
                          });
                      });
                      this.driverNames = driverNames;
                      this.driverPlateNumber = driverPlatNames;
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
      handleSelectRouter(item) {

      },
      querySearchAsyncDriver(qs, cb) {
          let driverNames = this.driverNames;
          var results = qs
              ? driverNames.filter(this.createStateFilterRouter(qs))
              : driverNames;
          cb(results);
      },
      querySearchAsyncDriverPlate(qs, cb) {
          let driverPlateNumber = this.driverPlateNumber;
          var results = qs
              ? driverPlateNumber.filter(this.createStateFilterRouter(qs))
              : driverPlateNumber;
          cb(results);
      },
      createStateFilterRouter(qs) {
          return state => {
              return state.value.toLowerCase().indexOf(qs.toLowerCase()) === 0;
          };
      },
    handleFormSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('submit', this.form);
        } else {
          this.$notify.error({
            title: '错误',
            message: '表单校验失败',
          });
          return false;
        }
      });
    },
    handleFormReset() {
      this.$refs.form.resetFields();
      this.registerTime = '';
    },
    handleAdd() {
      this.$emit('add');
    },
  },
};
</script>
