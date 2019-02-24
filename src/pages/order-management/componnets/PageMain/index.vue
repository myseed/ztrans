<template>
  <div>
    <el-table
      :data="currentTableData"
      v-loading="loading"
      size="mini"
      stripe
      style="width: 100%;"
      @selection-change="handleSelectionChange">

      <el-table-column
        type="selection"
        width="55">
      </el-table-column>

      <el-table-column label="订单号" :show-overflow-tooltip="true" width="150" fixed="left">
        <template slot-scope="scope">
          {{scope.row.series}}
        </template>
      </el-table-column>

      <el-table-column label="线路名称（编号）" :show-overflow-tooltip="true" width="200" fixed="left">
        <template slot-scope="scope">
          {{scope.row.routerAlisa}}
        </template>
      </el-table-column>

      <el-table-column label="司机名字" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.driverName}}
        </template>
      </el-table-column>

      <el-table-column label="车牌号" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.carPlateNumber}}
        </template>
      </el-table-column>

      <el-table-column label="订单状态" :show-overflow-tooltip="true" width="70">
        <template slot-scope="scope">
          {{scope.row.deliveryStatus}}
        </template>
      </el-table-column>

      <el-table-column label="订单类型" :show-overflow-tooltip="true" width="80">
        <template slot-scope="scope">
          {{scope.row.orderType}}
        </template>
      </el-table-column>
      
      <el-table-column label="车型" :show-overflow-tooltip="true" width="80">
        <template slot-scope="scope">
          {{scope.row.carTypeName}}
        </template>
      </el-table-column>
      
      <el-table-column label="尺寸" :show-overflow-tooltip="true" width="60">
        <template slot-scope="scope">
          {{scope.row.carSizeName}}
        </template>
      </el-table-column>

      <el-table-column label="吨位" :show-overflow-tooltip="true" width="60">
        <template slot-scope="scope">
          {{scope.row.carWeightName}}
        </template>
      </el-table-column>

      <el-table-column label="派单方式" :show-overflow-tooltip="true" width="120">
        <template slot-scope="scope">
          {{scope.row.commondOrderStatusName}}
        </template>
      </el-table-column>

      <el-table-column label="用车时间" :show-overflow-tooltip="true" width="150">
        <template slot-scope="scope">
          {{scope.row.appointmentDate}}
        </template>
      </el-table-column>
      
      <el-table-column label="客户名称" :show-overflow-tooltip="true" width="200">
        <template slot-scope="scope">
          {{scope.row.masterCustomerName}}
        </template>
      </el-table-column>

      <el-table-column label="加盟商" :show-overflow-tooltip="true" width="200">
        <template slot-scope="scope">
          {{scope.row.franchiseeName}}
        </template>
      </el-table-column>

      <el-table-column label="订单备注" :show-overflow-tooltip="true" width="200">
        <template slot-scope="scope">
          {{scope.row.remark}}
        </template>
      </el-table-column>
      
      <el-table-column label="下单人" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.createOrderName}}
        </template>
      </el-table-column>
      
      <el-table-column label="下单时间" :show-overflow-tooltip="true" width="150">
        <template slot-scope="scope">
          {{scope.row.createOrderTime}}
        </template>
      </el-table-column>

      <el-table-column label="司机接单时间" :show-overflow-tooltip="true" width="150" v-if='showColumn'>
        <template slot-scope="scope">
          {{scope.row.driverReceiveTime}}
        </template>
      </el-table-column>

      <el-table-column label="司机靠车时间" :show-overflow-tooltip="true" width="150" v-if='showColumn'>
        <template slot-scope="scope">
          {{scope.row.driverGetgoodsTime}}
        </template>
      </el-table-column>

      <el-table-column label="司机发车时间" :show-overflow-tooltip="true" width="150" v-if='showColumn'>
        <template slot-scope="scope">
          {{scope.row.driverStartTime}}
        </template>
      </el-table-column>

      <el-table-column label="司机到达时间" :show-overflow-tooltip="true" width="150" v-if='showColumn'>
        <template slot-scope="scope">
          {{scope.row.driverArrTime}}
        </template>
      </el-table-column>

      <el-table-column label="司机完成时间" :show-overflow-tooltip="true" width="150" v-if='showColumn'>
        <template slot-scope="scope">
          {{scope.row.driverEndTime}}
        </template>
      </el-table-column>
      
      <el-table-column label="操作" align="center" width="300" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="selectCar(scope.$index, scope.row)">变更车辆</el-button>
          <el-button
            size="mini"
            @click="getOrderDetail(scope.$index, scope.row)">订单详情</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">废弃订单</el-button>
          <!--<el-button-->
            <!--size="mini"-->
            <!--@click="getAllMonthDetail(scope.$index, scope.row)">查看整月任务</el-button>-->
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
import {
  getCarTypeList,
  getOrderByCustomerNumId,
  selectDriver,
  confirmDriver,
  getDriverOrderDetail,
  getCarSizeList,
  cancelOrderStatus,
} from '@/api/order';
export default {
  props: {
    tableData: {
      default: () => [],
    },
    loading: {
      default: false,
    },
  },
  created() {
    this.getTrueColumn();
  },
  data() {
    return {
      showColumn:true,
      currentTableData: [],
      status:'',
      multipleSelection: [],
      downloadColumns: [
        {label: '卡密', prop: 'key'},
        {label: '面值', prop: 'value'},
        {label: '状态', prop: 'type'},
        {label: '管理员', prop: 'admin'},
        {label: '管理员备注', prop: 'adminNote'},
        {label: '创建时间', prop: 'dateTimeCreat'},
        {label: '使用状态', prop: 'used'},
        {label: '使用时间', prop: 'dateTimeUse'},
      ],
    };
  },
  watch: {
      $route(to, from) {
          this.getTrueColumn();
      },
    tableData: {
      handler(val) {
        this.currentTableData = val;
      },
      immediate: true,
    },
  },
  methods: {
      getTrueColumn () {
          this.status=this.$route.params.status;
          if(this.status=='1'){
              this.showColumn=false;
          }else{
              this.showColumn=true;
          }
      },
    handleSwitchChange(val, index) {
      const oldValue = this.currentTableData[index];
      this.$set(this.currentTableData, index, {
        ...oldValue,
        type: val,
      });
      // 注意 这里并没有把修改后的数据传递出去 如果需要的话请自行修改
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    downloadDataTranslate(data) {
      return data.map(row => ({
        ...row,
        type: row.type ? '禁用' : '正常',
        used: row.used ? '已使用' : '未使用',
      }));
    },
    getOrderDetail(index, row) {
      this.$emit('getOrderDetail', {orderId: row.series,commondOrderStatus: row.commondOrderStatus,allmonthOrderTaskSeries: row.allmonthOrderTaskSeries});
    },
    getAllMonthDetail(index, row) {
        if(row.commondOrderStatus=='0'){
            this.$message.error('只有整月指派的订单可以查看明细！');
            return;
        }
      this.$emit('getAllMonthDetail', {series: row.allmonthOrderTaskSeries});
    },
    handleDelete(index, row) {
      this.$emit('deleteOrder', {orderId: row.series});
    },
    selectCar(index, row) {
      this.$emit('selectCar', {
        appointmentDate: row.appointmentDate,
        carType: row.carType,
        routerDetailSeries: row.routerDetailSeries,
        series: row.series,
      });
    },

    handleDownloadXlsx(data) {
      this.$export
        .excel({
          title: 'D2Admin 表格示例',
          columns: this.downloadColumns,
          data: this.downloadDataTranslate(data),
        })
        .then(() => {
          this.$message('导出表格成功');
        });
    },
    handleDownloadCsv(data) {
      this.$export
        .csv({
          title: 'D2Admin 表格示例',
          columns: this.downloadColumns,
          data: this.downloadDataTranslate(data),
        })
        .then(() => {
          this.$message('导出CSV成功');
        });
    },
  },
};
</script>
