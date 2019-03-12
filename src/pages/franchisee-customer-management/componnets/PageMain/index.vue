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

      <el-table-column label="客户名称" :show-overflow-tooltip="true"  width="200">
        <template slot-scope="scope">
          {{scope.row.customerName}}
        </template>
      </el-table-column>

      <el-table-column label="客户代码" :show-overflow-tooltip="true"  width="200">
        <template slot-scope="scope">
          {{scope.row.customerSimpleCode}}
        </template>
      </el-table-column>

      <el-table-column label="所在地区" :show-overflow-tooltip="true"  width="200">
        <template slot-scope="scope">
          {{scope.row.prvCityArea}}
        </template>
      </el-table-column>

      <el-table-column label="联系人" :show-overflow-tooltip="true" width="200">
        <template slot-scope="scope">
          {{scope.row.contactName}}
        </template>
      </el-table-column>

      <el-table-column label="联系电话" :show-overflow-tooltip="true" width="200">
        <template slot-scope="scope">
          {{scope.row.contactPhone}}
        </template>
      </el-table-column>

      <el-table-column label="销售员" :show-overflow-tooltip="true" width="200">
        <template slot-scope="scope">
          {{scope.row.saleName}}
        </template>
      </el-table-column>

      <el-table-column label="加盟商" :show-overflow-tooltip="true" width="200">
        <template slot-scope="scope">
          {{scope.row.franchiseeName}}
        </template>
      </el-table-column>

      <el-table-column label="注册日期" :show-overflow-tooltip="true" width="200">
        <template slot-scope="scope">
          {{scope.row.createDtme}}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="220" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleCheckDetail(scope.$index, scope.row)">查看</el-button>
          <!--<el-button-->
            <!--size="mini"-->
            <!--type="danger"-->
            <!--@click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
        </template>
      </el-table-column>

    </el-table>

  </div>


</template>

<script>
import util from "@/libs/util.js";
import {
    getAllMasterCustomer,
    getMasterCustomerDetail,
    deleteMasterCustomer,
    addMasterCustomer,
    getAllSaleList,
    deleteCustomerContact,
    updateMasterCustomer,
    addCustomerContact,
    updateCustomerContact,
    deleteOldCustomerContact
} from "@/api/customer";
import {
    getCheckStatus,
    getActiveStatus,
    getCustomerCaclulateType,
    getCustomerJob,
    getCustomerLevel,
    getCustomerOrderLevel,
    getCustomerSex,
    getCustomerSource,
    getCustomerType,
    getOperateStatus,
    getAllCity,
    getAllCityArea,
    getAllPrv,
    getAllTown,
    getServiceType
} from "@/api/dictionary";

export default {
  props: {
    tableData: {
      default: () => []
    },
    loading: {
      default: false
    }
  },
  data() {
    return {
        customerNumId: util.cookies.get('__user__customernumid'),
        constantDetail: [],
       editCustomerPopDialog: false,
      currentTableData: [],
      multipleSelection: [],
      downloadColumns: [
        { label: "卡密", prop: "key" },
        { label: "面值", prop: "value" },
        { label: "状态", prop: "type" },
        { label: "管理员", prop: "admin" },
        { label: "管理员备注", prop: "adminNote" },
        { label: "创建时间", prop: "dateTimeCreat" },
        { label: "使用状态", prop: "used" },
        { label: "使用时间", prop: "dateTimeUse" }
      ]
    };
  },
  watch: {
    tableData: {
      handler(val) {
        this.currentTableData = val;
      },
      immediate: true
    }
  },
  methods: {
    _deleteMasterCustomer(params, index) {
      deleteMasterCustomer(params)
        .then(res => {
          if (res.code === 0) {
            this.$message({
              type: "success",
              message: "删除成功!"
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
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {

          this._deleteMasterCustomer(
            {
              customerNumId: util.cookies.get("__user__customernumid"),
              series: row.customerMasterId
            },
            index
          );
        })
        .catch(() => {
          console.log("取消删除");
        });
    },
    handleEdit(index, row) {
        this.$emit("update",{customerMasterId: row.customerMasterId});
    },
      _getMasterCustomerDetail(params) {
          console.log(params);
          getMasterCustomerDetail(params)
              .then(res => {
                  if (res.code === 0) {
                      this.constantDetail = res.constantDetailModel;
                      this.customerDetail = res.customerMaster;
                      // 数据大客户编辑
                      this.editCustomerItem = Object.assign(
                          {},
                          this.editCustomerItem,
                          res.customerMaster
                      );
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
    handleCheckDetail(index, row) {
        this.$emit("getMasterDetail",{customerMasterId: row.customerMasterId});
    },
    handleSwitchChange(val, index) {
      const oldValue = this.currentTableData[index];
      this.$set(this.currentTableData, index, {
        ...oldValue,
        type: val
      });
      // 注意 这里并没有把修改后的数据传递出去 如果需要的话请自行修改
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    downloadDataTranslate(data) {
      return data.map(row => ({
        ...row,
        type: row.type ? "禁用" : "正常",
        used: row.used ? "已使用" : "未使用"
      }));
    },
    handleDownloadXlsx(data) {
      this.$export
        .excel({
          title: "D2Admin 表格示例",
          columns: this.downloadColumns,
          data: this.downloadDataTranslate(data)
        })
        .then(() => {
          this.$message("导出表格成功");
        });
    },
    handleDownloadCsv(data) {
      this.$export
        .csv({
          title: "D2Admin 表格示例",
          columns: this.downloadColumns,
          data: this.downloadDataTranslate(data)
        })
        .then(() => {
          this.$message("导出CSV成功");
        });
    }
  }
};
</script>
