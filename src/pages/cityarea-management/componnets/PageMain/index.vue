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

      <el-table-column label="区名字" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.cityAreaName}}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
                  size="mini"
                  type="primary"
                  @click="handleEdit(scope.$index, scope.row)">修改</el-button>
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
      handleEdit(index, row) {
          this.$emit("editCityArea",{cityAreaId:row.cityAreaId,cityAreaName:row.cityAreaName});
      },
      handleDelete(index, row) {
          this.$emit("deleteCityArea",{cityAreaId:row.cityAreaId});
      }
  }
};
</script>
