<template>
  <el-form
    :inline="true"
    :model="form"
    :rules="rules"
    ref="form"
    size="mini"
    style="margin-bottom: -18px;">

    <el-form-item label="客户名称" prop="customerNameSearchKey">
      <!--<el-input-->
        <!--v-model="form.customerNameSearchKey"-->
        <!--placeholder="请输入"-->
        <!--style="width: 100px;"/>-->
      <el-autocomplete v-model="form.customerNameSearchKey"
                       placeholder="客户名字"
                       clearable
                       :fetch-suggestions="querySearchAsync"
                       @select="handleSelect">
      </el-autocomplete>
    </el-form-item>

    <el-form-item label="联系人" prop="contactNameSearchKey">
      <!--<el-input-->
        <!--v-model="form.contactNameSearchKey"-->
        <!--placeholder="请输入"-->
        <!--style="width: 100px;"/>-->
      <el-autocomplete v-model="form.contactNameSearchKey"
                       placeholder="联系人"
                       clearable
                       :fetch-suggestions="querySearchAsyncContactName"
                       @select="handleSelectContactName">
      </el-autocomplete>
    </el-form-item>

    <el-form-item label="联系电话" prop="mobilePhoneSearchKey">
      <!--<el-input-->
        <!--v-model="form.mobilePhoneSearchKey"-->
        <!--placeholder="请输入"-->
        <!--style="width: 100px;"/>-->
      <el-autocomplete v-model="form.mobilePhoneSearchKey"
                       placeholder="联系电话"
                       clearable
                       :fetch-suggestions="querySearchAsyncContactPhone"
                       @select="handleSelectContactName">
      </el-autocomplete>
    </el-form-item>

    <el-form-item label="销售员" prop="saleName">
      <!--<el-select v-model="form.saleId" placeholder="请选择">-->
        <!--<el-option v-for="(item, index) in customerSales" :key="index" :label="item.salePersonName" :value="item.salePersonId"></el-option>-->
      <!--</el-select>-->
      <el-autocomplete v-model="form.saleName"
                       placeholder="销售员"
                       clearable
                       :fetch-suggestions="querySearchAsyncSaleName"
                       @select="handleSelectSaleName">
      </el-autocomplete>
    </el-form-item>

    <el-form-item label="注册日期" prop="registerTime">
      <el-date-picker
        size="mini"
        v-model="registerTime"
        @change="onRegisterTimeChange"
        type="datetimerange"
        value-format="yyyy-MM-dd HH:mm:ss"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right">
      </el-date-picker>
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

  </el-form>
</template>

<script>
import util from '@/libs/util';
import {getAllSaleList,getCustomerContact} from '@/api/customer';
import {
    getMasterCustomerListBySearchKey
} from '@/api/createorder';
export default {
  data() {
    return {
      customerSeries:'',
      customerSales: [],
      registerTime: '',
      customerMaster: [],
      contactName:[],
      contactPhone:[],
      saleNames:[],
      customerNumId: util.cookies.get('__user__customernumid'),
      franchiseeSeries:util.cookies.get('__user__franchiseeSeries'),
      masterCustomerSearchKey: {
         customerMasterSearchKey: '',
         customerNumId: '',
         franchiseeSeries:'',
      },
      form: {
        customerNumId: util.cookies.get('__user__customernumid'),
        franchiseeSeries:util.cookies.get('__user__franchiseeSeries'),
        saleId: '',
        contactNameSearchKey: '',
        customerNameSearchKey: '',
        mobilePhoneSearchKey: '',
        registerEndTime: '',
        registerStartTime: '',
        saleName:''
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
    this._getAllSaleList({
      customerNumId: this.customerNumId,
      franchiseeId: this.franchiseeSeries,
    });
    this._getContactNameList({
      customerNumId: this.customerNumId,
      franchiseeSeries:this.franchiseeSeries,
    });
  },
    watch: {
        'registerTime'() {
            if(this.registerTime==''||this.registerTime==null){
                this.form.registerStartTime = '';
                this.form.registerEndTime = '';
            }
        },
        'form.saleName'() {
            if(this.form.saleName==''||this.form.saleName==null){
                this.form.saleId='';
            }
        }
    },
  methods: {
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
          this.customerSeries = item.customerMasterId;
      },
    _getAllSaleList(params) {
        getAllSaleList(params)
        .then(res => {
            if (res.code === 0) {
                let saleName = [];
                res.customerSales.forEach(item => {
                    saleName.push({
                        value: item.salePersonName,
                        ...item,
                    });
                });
                this.saleNames = saleName;
            }
        })
        .catch(err => {
          console.log(err);
        });
    },
      _getContactNameList(params) {
          getCustomerContact(params)
              .then(res => {
                  if (res.code === 0) {
                      let contactName = [];
                      res.customerContact.forEach(item => {
                          contactName.push({
                              value: item.contactName,
                              ...item,
                          });
                      });
                      let contactPhone=[];
                      res.customerContact.forEach(item => {
                          contactPhone.push({
                              value: item.contactPhone,
                              ...item,
                          });
                      });
                      this.contactName = contactName;
                      this.contactPhone = contactPhone;
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
      querySearchAsyncSaleName(qs, cb) {
          let saleNames = this.saleNames;
          var results = qs
              ? saleNames.filter(this.createStateFilter(qs))
              : saleNames;
          cb(results);
      },
      querySearchAsyncContactName(qs, cb) {
          let contactName = this.contactName;
          var results = qs
              ? contactName.filter(this.createStateFilter(qs))
              : contactName;
          cb(results);
      },
      querySearchAsyncContactPhone(qs, cb) {
          let contactPhone = this.contactPhone;
          var results = qs
              ? contactPhone.filter(this.createStateFilter(qs))
              : contactPhone;
          cb(results);
      },
      handleSelectSaleName(item){
          this.form.saleId=item.salePersonId;
      },
      handleSelectContactName(item) {

      },
    onRegisterTimeChange(time) {
      this.form.registerStartTime = time[0];
      this.form.registerEndTime = time[1];
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
