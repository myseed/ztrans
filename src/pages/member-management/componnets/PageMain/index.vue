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

      <el-table-column label="司机名字" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.driverName}}
        </template>
      </el-table-column>

      <el-table-column label="司机车牌" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.carPlateNumber}}
        </template>
      </el-table-column>

      <el-table-column label="会员规则" :show-overflow-tooltip="true">
      <template slot-scope="scope">
        {{scope.row.memberRuleTitle}}
      </template>
    </el-table-column>

      <el-table-column label="会员费" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.memberRulePrice}}
        </template>
      </el-table-column>

      <el-table-column label="剩余金额" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.driverPrice}}
        </template>
      </el-table-column>

      <el-table-column label="入会时间" :show-overflow-tooltip="true" width="150">
        <template slot-scope="scope">
          {{scope.row.memberDate}}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" fixed="right" width="300">
        <template slot-scope="scope">
          <el-button
                  size="mini"
                  type="primary"
                  @click="cutMoney(scope.$index, scope.row)">扣款</el-button>
          <el-button
                  size="mini"
                  type="primary"
                  @click="refundMoney(scope.$index, scope.row)">退款</el-button>
          <el-button
                  size="mini"
                  type="primary"
                  @click="selectHistory(scope.$index, scope.row)">查看历史流水</el-button>
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
      console.log(index, row);
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this._deleteFranchisee(
            {
              customerNumId: util.cookies.get('__user__customernumid'),
              franchiseeId: row.franchiseeId,
            },
            index
          );
        })
        .catch(() => {
          console.log('取消删除');
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
      selectHistory(index, row) {
          this.$emit("selectHistory",{series:row.series});
      },
      refundMoney(index, row) {
          this.$emit("refundMoney",{driverName:row.driverName,carPlateNumber:row.carPlateNumber,memberRuleTitle:row.memberRuleTitle,driverPrice:row.driverPrice,memberRuleSeries:row.memberRuleSeries,series:row.series});
      },
      cutMoney(index, row) {
          this.$emit("cutMoney",{driverName:row.driverName,carPlateNumber:row.carPlateNumber,memberRuleTitle:row.memberRuleTitle,driverPrice:row.driverPrice,memberRuleSeries:row.memberRuleSeries,series:row.series});
      },
  }
};
</script>
