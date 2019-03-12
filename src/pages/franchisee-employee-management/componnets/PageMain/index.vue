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

      <el-table-column label="员工名字" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.customerName}}
        </template>
      </el-table-column>

      <el-table-column label="职位" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.jobRealName}}
        </template>
      </el-table-column>

      <el-table-column label="所属角色" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.roleNames}}
        </template>
      </el-table-column>

      <el-table-column label="工号" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.jobNum}}
        </template>
      </el-table-column>

      <el-table-column label="性别" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.sexRealName}}
        </template>
      </el-table-column>

      <el-table-column label="手机" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.mobilePhone}}
        </template>
      </el-table-column>

      <el-table-column label="座机" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.phone}}
        </template>
      </el-table-column>

      <el-table-column label="员工账号" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.customerAccount}}
        </template>
      </el-table-column>

      <el-table-column label="加盟商名字" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.franchiseeName}}
        </template>
      </el-table-column>

      <el-table-column label="是否为超级管理员" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.wetherSuperManage}}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button
                  size="mini"
                  type="primary"
                  @click="handleEdit(scope.$index, scope.row)">重置密码</el-button>
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
import {deleteFranchisee} from '@/api/franchisee';

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
      _deleteFranchisee(params, index) {
          deleteFranchisee(params)
              .then(res => {
                  if (res.code === 0) {
                      this.$message({
                          type: 'success',
                          message: '删除成功!',
                      });
                      this.currentTableData.splice(index, 1);
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
      handleDelete(index, row) {
          console.log(index, row);
          this.$emit("deleteCustomerId", {customerNumId: row.customerNumId});
      },
      handleEdit(index, row) {
          this.$emit("editPassword",{customerNumId: row.customerNumId,customerAccount:row.customerAccount,customerName:row.customerName});
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
