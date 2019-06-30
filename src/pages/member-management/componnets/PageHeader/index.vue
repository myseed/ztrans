<template>
  <el-form
    :inline="true"
    :model="form"
    :rules="rules"
    ref="form"
    size="mini"
    style="margin-bottom: -18px;">


    <el-form-item label="司机名字">
      <el-autocomplete v-model="form.driverNameSearchKey"
                       placeholder="司机名字"
                       clearable
                       :fetch-suggestions="querySearchAsyncDriver"
                       @select="handleSelectDriver">
      </el-autocomplete>
    </el-form-item>

    <el-form-item label="车牌号">
      <el-autocomplete v-model="form.carPlateNumberSearchKey"
                       placeholder="车牌号"
                       clearable
                       :fetch-suggestions="querySearchAsyncPlateNum"
                       @select="handleSelectCarPlate">
      </el-autocomplete>
    </el-form-item>

    <el-form-item label="会员规则">
      <el-autocomplete v-model="form.memberRuleTitleSearchKey"
                       placeholder="会员规则"
                       clearable
                       :fetch-suggestions="querySearchAsyncMemberRule"
                       @select="handleSelectMemberRule">
      </el-autocomplete>
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
              @click="selectByHistory">
        <d2-icon name="search"/>
        查询历史流水
      </el-button>
    </el-form-item>

  </el-form>
</template>

<script>
    import {getDriverBySearchKey,getDriverByPlateNumberSearchKey} from '@/api/truck';
    import {getMemberRuleListBySearchKey} from '@/api/member';
import util from '@/libs/util';

export default {
  data() {
    return {
        customerNumId: util.cookies.get('__user__customernumid'),
        driverSearchKey: {
            driverSearchName: '',
            customerNumId: '',
        },
        plateNumSearchKey: {
            plateNumberSearchKey: '',
            customerNumId: '',
        },
        memberRuleSearchKey: {
            memberSearchKey: '',
            customerNumId: '',
        },
        drivers:[],
        carPlateNumbers:[],
        memberRules:[],
      form: {
        customerNumId: util.cookies.get('__user__customernumid'),
        carPlateNumberSearchKey: '',
        driverNameSearchKey: '',
        memberRuleTitleSearchKey:''
      },
      driverId:'',
      rules: {},
    };
  },
  created() {

  },
  methods: {
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
      querySearchAsyncMemberRule(qs, cb) {
          this.memberRuleSearchKey.memberSearchKey = qs;
          this.memberRuleSearchKey.customerNumId = this.customerNumId;
          getMemberRuleListBySearchKey(this.memberRuleSearchKey).then(
              res => {
                  if (res.code === 0) {
                      let memberRule = [];
                      // customerMasters= res.customerMasterList;
                      res.memberTitles.forEach(item => {
                          memberRule.push({
                              value: item,
                              ...item,
                          });
                      });
                      this.memberRules = memberRule;
                      let rule = this.memberRules;
                      var results = qs
                          ? rule.filter(this.createStateFilterDriver(qs))
                          : rule;
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
          this.driverId = item.driverId;
          this.form.driverNameSearchKey=item.driverName;
      },
      handleSelectDriver(item) {
          this.driverId = item.driverId;
          this.form.carPlateNumberSearchKey=item.carPlateNumber;
      },
      handleSelectMemberRule(item) {

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
    },
    handleAdd() {
      this.$emit('add');
    },
      selectByHistory(index, row) {
       if(this.driverId==''){
           this.$message({
               type: "error",
               message: "请在搜索栏中输入司机或者车牌！"
           });
       }
          this.$emit("selectHistory",{series:this.driverId});
      },
  },
};
</script>
