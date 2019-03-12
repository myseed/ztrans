<template>
  <el-form
    :inline="true"
    :model="form"
    :rules="rules"
    ref="form"
    size="mini"
    style="margin-bottom: -18px;">

    <el-form-item label="客户名称" prop="customerName">
      <!--<el-select v-model="form.customerSeries" placeholder="请选择" style="width: 150px;">-->
        <!--<el-option v-for="(item, index) in customerMasterList" :key="index" :label="item.customerName" :value="item.customerMasterId"></el-option>-->
      <!--</el-select>-->

      <el-autocomplete v-model="customerName"
                       placeholder="请输入"
                       clearable
                       :fetch-suggestions="querySearchAsync"
                       @select="handleSelect">
      </el-autocomplete>
    </el-form-item>

    <el-form-item label="线路编号" prop="routerNumberSearchKey">
      <!--<el-input v-model="form.routerNumberSearchKey" placeholder="请输入" style="width: 100px;"></el-input>-->
      <el-autocomplete v-model="form.routerNumberSearchKey"
                       style="width: 150px;"
                       placeholder="请输入"
                       clearable
                       :fetch-suggestions="querySearchAsyncRouterNumber"
                       @select="handleSelectRouter">
      </el-autocomplete>
    </el-form-item>

    <el-form-item label="线路名称" prop="routerDetailAliaSearchKey">
      <el-autocomplete v-model="form.routerDetailAliaSearchKey"
                       style="width: 150px;"
                       placeholder="请输入"
                       clearable
                       :fetch-suggestions="querySearchAsyncRouter"
                       @select="handleSelectRouter">
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
              size="mini"
              @click="handleDownloadXlsx">
        <d2-icon name="file-o"/>
        下载报价excel模板
      </el-button>
    </el-form-item>

      <el-form-item>
      <el-upload
      :http-request="onReaderComplete">
        <el-button type="primary">
          <d2-icon name="file-o"/>
          导入报价excel
        </el-button>
      </el-upload>

      </el-form-item>


  </el-form>
</template>

<script>
import {getMasterCustomerList,uploadRouterPriceExcel} from '@/api/price';
import {getRouterAliaSearchList} from '@/api/schedule';
import {
    getMasterCustomerListBySearchKey
} from '@/api/createorder';
import util from '@/libs/util';

export default {
  data() {
    return {
      customerNumId: util.cookies.get('__user__customernumid'),
      franchiseeSeries:util.cookies.get('__user__franchiseeSeries'),
      routerDetail: [],
      routerNumber: [],
      customerMasterList: [],
      customerMaster: [],
      customerName:'',
      form: {
        customerNumId: util.cookies.get('__user__customernumid'),
        customerSeries: '',
        routerNumberSearchKey: '',
        routerDetailAliaSearchKey: '',
      },
      masterCustomerSearchKey: {
       customerMasterSearchKey: '',
       customerNumId: '',
      },
      rules: {},
    };
  },
  created() {
    this._getRouterAliaSearchList({
      customerNumId: this.customerNumId,
      customerSeries: '',
      routerSearchKey: '',
      franchiseeSeries: this.franchiseeSeries,
    });
  },
    watch: {
        'customerName'() {
            if(this.customerName==''||this.customerName==null){
                this.form.customerSeries='';
            }
            this._getRouterAliaSearchList({
                customerNumId: this.customerNumId,
                customerSeries: this.form.customerSeries,
                routerSearchKey: '',
                franchiseeSeries: this.franchiseeSeries,
            });
        }
    },
  methods: {
      handleDownloadXlsx (data) {
          this.$refs.form.validate(valid => {
              if (valid) {
                  this.$emit('downLoadExcel', this.form);
              } else {
                  return false;
              }
          });
      },
      onReaderComplete({ file, filename }) {
          // 把图片上传到服务器
          const params = { "customerNumId":this.form.customerNumId};
          this._uploadRouterPriceExcel(params, file, filename);
      },
      _uploadRouterPriceExcel(params, file, filename) {
          uploadRouterPriceExcel(params, file)
              .then(res => {
                  if (res.data.code === 0) {
                      this.$message({
                          type: "success",
                          message: "上传成功!"
                      });
                  }else{
                      this.$message({
                          message: res.data.message,
                          type: 'error',
                      });
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
    querySearchAsyncRouter(qs, cb) {
      let routerDetail = this.routerDetail;
      var results = qs
        ? routerDetail.filter(this.createStateFilter(qs))
        : routerDetail;
      cb(results);
    },
      querySearchAsyncRouterNumber(qs, cb) {
      let routerDetail = this.routerNumber;
      var results = qs
        ? routerDetail.filter(this.createStateFilter(qs))
        : routerDetail;
      cb(results);
    },
    createStateFilter(qs) {
      return state => {
        return state.value.toLowerCase().indexOf(qs.toLowerCase()) === 0;
      };
    },
    handleSelectRouter(item) {
      console.log(item);
    },
    _getRouterAliaSearchList(params) {
      getRouterAliaSearchList(params)
        .then(res => {
          if (res.code === 0) {
            let routerDetail = [];
            res.routerDetailAliaModel.forEach(item => {
              routerDetail.push({
                value: item.routerAlia,
                ...item,
              });
            });
              let routerNumber=[];
              res.routerDetailAliaModel.forEach(item => {
                  routerNumber.push({
                      value: item.routerNumber,
                      ...item,
                  });
              });
            this.routerDetail = routerDetail;
            this.routerNumber = routerNumber;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
      handleSelect(item) {
          this.form.customerSeries = item.customerMasterId;
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
    handleFormSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('submit', this.form);
        } else {
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
  },
};
</script>
