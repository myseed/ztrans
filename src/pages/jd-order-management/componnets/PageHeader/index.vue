<template>
  <el-form
    :inline="true"
    :model="form"
    :rules="rules"
    ref="form"
    size="mini"
    style="margin-bottom: -18px;">


    <el-form-item label="车牌号" prop="carPlateNumber">
      <el-autocomplete v-model="form.carPlateNumber"
                       placeholder="请输入"
                       clearable
                       :fetch-suggestions="querySearchAsyncDriverPlate"
                       @select="handleSelectRouter">
      </el-autocomplete>
    </el-form-item>


    <el-form-item label="出发地" prop="sourceName">
      <el-input
              v-model="form.sourceName"
              placeholder="请输入"
              style="width: 100px;"/>
    </el-form-item>

    <el-form-item label="目的地" prop="destinationName">
      <el-input
              v-model="form.destinationName"
              placeholder="请输入"
              style="width: 100px;"/>
    </el-form-item>

    <el-form-item label="发车时间" prop="registerTime">
      <el-date-picker
              size="mini"
              v-model="registerTime"
              @change="onTimeChange"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="约车开始日期"
              end-placeholder="约车结束日期">
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

    <el-form-item>
      <el-button
              type="primary"
              size="mini"
              @click="handleDownloadOrderXlsx">
        <d2-icon name="file-o"/>
        下载导入订单模板
      </el-button>
    </el-form-item>

    <el-form-item>
      <el-upload
              :http-request="onReaderComplete">
        <el-button type="primary">
          <d2-icon name="file-o"/>
          导入订单
        </el-button>
      </el-upload>

    </el-form-item>
  </el-form>
</template>

<script>
import {getFranchiseeTypeList} from '@/api/franchisee';
import {getDriverBySearchKey,getDriverByPlateNumberSearchKey} from '@/api/truck';
import {
    getJdOrderList,downloadOrderExcel,importJdOrder
} from "@/api/jdorder";
import util from '@/libs/util';

export default {
  data() {
    return {
      registerTime: '',
      driverPlateNumber: [],
      form: {
        customerNumId: util.cookies.get('__user__customernumid'),
        carPlateNumber: '',
        sourceName: '',
        destinationName:'',
        startTime: '',
        endTime: '',
        current:''
      },
        pickerOptions: {
            shortcuts: [
                {
                    text: '今天',
                    onClick(picker) {
                        picker.$emit('pick', new Date());
                    },
                },
                {
                    text: '昨天',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24);
                        picker.$emit('pick', date);
                    },
                },
                {
                    text: '一周前',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', date);
                    },
                },
            ],
        },
    };
  },
    watch: {
        'registerTime'() {
            if(this.registerTime==''||this.registerTime==null){
                this.form.startTime = '';
                this.form.endTime = '';
            }
        },
    },
    created() {
        this._getDriverNameList({
            customerNumId: this.form.customerNumId,
            franchiseeSeries:this.franchiseeSeries
        });
    },
  methods: {
      onTimeChange(time) {
          this.form.startTime = time[0];
          this.form.endTime = time[1];
      },
    handleFormSubmit() {
      this.form.current=1
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
      querySearchAsyncDriverPlate(qs, cb) {
          let driverPlateNumber = this.driverPlateNumber;
          var results = qs
              ? driverPlateNumber.filter(this.createStateFilterRouter(qs))
              : driverPlateNumber;
          cb(results);
      },
      createStateFilterRouter(qs) {
          return state => {
              return state.value.toLowerCase().indexOf(qs.toLowerCase()) != -1;
          };
      },
      handleSelectRouter(item) {

      },
      _getDriverNameList(params) {
          getDriverBySearchKey(params)
              .then(res => {
                  if (res.code === 0) {
                      let driverPlatNames = [];
                      res.customerDrivers.forEach(item => {
                          driverPlatNames.push({
                              value: item.carPlateNumber,
                              ...item,
                          });
                      });
                      this.driverPlateNumber = driverPlatNames;
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
      handleDownloadOrderXlsx (data) {
          this.$emit('downLoadOrderExcel', this.form);
      },
      onReaderComplete({ file, filename }) {
          // 把图片上传到服务器
          this.$emit('loadingStart', this.form);
          const params = { "customerNumId":this.form.customerNumId};
          this._importJdOrder(params, file, filename);
      },
      _importJdOrder(params, file, filename) {
          importJdOrder(params, file)
              .then(res => {
                  if (res.data.code === 0) {
                      this.$emit('loadingEnd', this.form);
                      this.$message({
                          type: "success",
                          message: "上传成功!"+res.data.message
                      });
                      this.handleFormSubmit();
                  }else{
                      this.$emit('loadingEnd', this.form);
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
    handleFormReset() {
      this.$refs.form.resetFields();
    }
  },
};
</script>
