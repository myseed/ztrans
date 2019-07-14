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

      <el-table-column label="抢单id" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.series}}
        </template>
      </el-table-column>

      <el-table-column label="大客户名称" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.customerName}}
        </template>
      </el-table-column>

      <el-table-column label="线路名称" :show-overflow-tooltip="true" width="150">
        <template slot-scope="scope">
          {{scope.row.routerName}}
        </template>
      </el-table-column>

      <el-table-column label="吨位" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.carWeightName}}
        </template>
      </el-table-column>

      <el-table-column label="参考价" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.driverMoney}}
        </template>
      </el-table-column>

      <el-table-column label="抢单状态" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.catchOrderStatusDesc}}
        </template>
      </el-table-column>

      <el-table-column label="抢单类型" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.catchOrderTypeDesc}}
        </template>
      </el-table-column>

      <el-table-column label="用车时间" :show-overflow-tooltip="true" width="150">
        <template slot-scope="scope">
          {{scope.row.appointmentDate}}
        </template>
      </el-table-column>

      <el-table-column label="下单时间" :show-overflow-tooltip="true" width="150">
        <template slot-scope="scope">
          {{scope.row.createDate}}
        </template>
      </el-table-column>

      <el-table-column label="付费截止时间" :show-overflow-tooltip="true" width="150">
        <template slot-scope="scope">
          {{scope.row.catchFinalDate}}
        </template>
      </el-table-column>

      <el-table-column label="违约金" :show-overflow-tooltip="true" width="150">
        <template slot-scope="scope">
          {{scope.row.breakMoney}}
        </template>
      </el-table-column>

      <el-table-column label="抢单司机" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.driverName}}
        </template>
      </el-table-column>

      <el-table-column label="抢单车牌" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.carPlateNumber}}
        </template>
      </el-table-column>

      <el-table-column label="最终价格" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.catchPrice}}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="480" fixed="right">
        <template slot-scope="scope">
          <el-button
                  size="mini"
                  type="primary"
                  @click="updateOrderStatus(scope.$index, scope.row)">开标</el-button>
          <el-button
                  size="mini"
                  type="primary"
                  @click="selectDriver(scope.$index, scope.row)">选择司机</el-button>
          <el-button
                  size="mini"
                  type="primary"
                  @click="selectHistory(scope.$index, scope.row)">查看历史</el-button>
          <el-button
                  size="mini"
                  type="primary"
                  @click="findOrder(scope.$index, scope.row)">查看订单</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import util from '@/libs/util.js';

export default {
  props: {
    tableData: {
      default: () => [],
    },
    loading: {
      default: false,
    },
  },
  data() {
    return {
      currentTableData: [],
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
    tableData: {
      handler(val) {
        this.currentTableData = val;
      },
      immediate: true,
    },
  },
  methods: {
      handleDelete(index, row) {
          this.$emit("deleteRule", {series: row.series});
      },
      updateOrderStatus(index, row) {
          if(row.catchOrderType!==1){
              this.$message.error('只有竞价抢单可以开标！');
              return;
          }
          if(row.catchOrderStatus!==0){
              this.$message.error('已经开标的抢单不可以开标！');
              return;
          }
          this.$emit("updateOrderStatus",{series:row.series});
      },
      selectDriver(index, row) {
          if(row.catchOrderType!==1){
              this.$message.error('只有竞价抢单可以选司机！');
              return;
          }
          if(row.catchOrderStatus!==1){
              this.$message.error('只有正在开标的竞价任务可以选司机！');
              return;
          }
          this.$emit("selectDriver",{series: row.series});
      },
      selectHistory(index, row) {
          if(row.catchOrderType!==1){
              this.$message.error('只有竞价抢单可以查看历史！');
              return;
          }
          if(row.catchOrderStatus!==2){
              this.$message.error('只有开标结束的竞价任务可以查看历史！');
              return;
          }
          this.$emit("selectHistory",{series: row.series});
      },
      findOrder(index, row) {
          this.$router.push({
              path: '/order-management1/1',
              query: {ruleSeries: row.series},
          });
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
  }
};
</script>
