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

      <el-table-column label="规则标题" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.memberRuleTitle}}
        </template>
      </el-table-column>

      <el-table-column label="规则内容" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.memberRuleBody}}
        </template>
      </el-table-column>

      <el-table-column label="会员定金" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.memberRulePrice}}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="300" fixed="right">
        <template slot-scope="scope">
          <el-button
                  size="mini"
                  type="primary"
                  @click="editMember(scope.$index, scope.row)">编辑</el-button>
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
          console.log(index, row);
          this.$emit("deleteMember", {series:row.series});
      },
      editMember(index, row) {
          this.$emit("editMember",{series:row.series,memberRuleTitle:row.memberRuleTitle,memberRuleBody:row.memberRuleBody,memberRulePrice:row.memberRulePrice});
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
