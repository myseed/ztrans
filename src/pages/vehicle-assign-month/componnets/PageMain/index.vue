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

      <el-table-column label="客户名字" :show-overflow-tooltip="true" width="190">
        <template slot-scope="scope">
          {{scope.row.customerName}}
        </template>
      </el-table-column>

      <el-table-column label="线路名称" :show-overflow-tooltip="true" width="190">
        <template slot-scope="scope">
          {{scope.row.routerAliaName}}
        </template>
      </el-table-column>

      <el-table-column label="司机姓名" :show-overflow-tooltip="true" >
        <template slot-scope="scope">
          {{scope.row.driverName}}
        </template>
      </el-table-column>

      <el-table-column label="司机车牌" :show-overflow-tooltip="true" >
        <template slot-scope="scope">
          {{scope.row.carPlateNumber}}
        </template>
      </el-table-column>




      <el-table-column label="线路载重" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.weightName}}
        </template>
      </el-table-column>
      
      <el-table-column label="用车时间列表" :show-overflow-tooltip="true" width="190">
        <template slot-scope="scope">
          {{scope.row.appointmentDates}}
        </template>
      </el-table-column>
      
      <el-table-column label="司机真实报价" :show-overflow-tooltip="true" width="100">
        <template slot-scope="scope">
          {{scope.row.carRealMoney}}
        </template>
      </el-table-column>

      <el-table-column label="任务过期时间" :show-overflow-tooltip="true" width="150">
        <template slot-scope="scope">
          {{scope.row.appointmentFinalDate}}
        </template>
      </el-table-column>

      <el-table-column label="任务状态" :show-overflow-tooltip="true" width="100">
        <template slot-scope="scope">
          {{scope.row.taskTypeName}}
        </template>
      </el-table-column>
      
      <el-table-column label="操作" align="center" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button
                  size="mini"
                  type="primary"
                  @click="taskDetail(scope.$index, scope.row)">任务明细</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除线路</el-button>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
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
     timeDetail(index, row) {
      this.$emit('timeDetail', {appointmentDates: row.appointmentDates});
    },
      handleDelete(index, row) {
          this.$emit('deleteOrder', {series: row.series});
      },
      taskDetail(index, row) {
          this.$emit('getTaskDetail', {series: row.series});
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

  },
};
</script>
