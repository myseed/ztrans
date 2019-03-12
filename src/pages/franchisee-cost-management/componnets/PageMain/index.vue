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

      <el-table-column label="订单号" :show-overflow-tooltip="true"  width="150">
        <template slot-scope="scope">
          {{scope.row.series}}
        </template>
      </el-table-column>

      <el-table-column label="车型" :show-overflow-tooltip="true" width="120">
        <template slot-scope="scope">
          {{scope.row.carTypeName}}
        </template>
      </el-table-column>

      <el-table-column label="客户名字" :show-overflow-tooltip="true" width="190">
        <template slot-scope="scope">
          {{scope.row.customerName}}
        </template>
      </el-table-column>

      <el-table-column label="车牌号" :show-overflow-tooltip="true" width="150">
        <template slot-scope="scope">
          {{scope.row.carPlateNumber}}
        </template>
      </el-table-column>
      
      <el-table-column label="司机名字" :show-overflow-tooltip="true" width="150">
        <template slot-scope="scope">
          {{scope.row.driverName}}
        </template>
      </el-table-column>
      
      <el-table-column label="线路名称" :show-overflow-tooltip="true" width="150">
        <template slot-scope="scope">
          {{scope.row.routerAlia}}
        </template>
      </el-table-column>
      
      <el-table-column label="预约时间" :show-overflow-tooltip="true" width="150">
        <template slot-scope="scope">
          {{scope.row.appointmentDate}}
        </template>
      </el-table-column>
      
      <el-table-column label="销售员" :show-overflow-tooltip="true" width="150">
        <template slot-scope="scope">
          {{scope.row.saleName}}
        </template>
      </el-table-column>
      
      <el-table-column label="客户应付" :show-overflow-tooltip="true" width="150" v-if='showCustomer'>
        <template slot-scope="scope">
          {{scope.row.orderMoney}}
        </template>
      </el-table-column>

      <el-table-column label="司机对账状态" :show-overflow-tooltip="true" width="150" v-if='showDriver'>
        <template slot-scope="scope">
          {{scope.row.orderBalanceStatusName}}
        </template>
      </el-table-column>
      
      <el-table-column label="司机应收" :show-overflow-tooltip="true" width="150" v-if='showDriver'>
        <template slot-scope="scope">
          {{scope.row.driverMoney}}
        </template>
      </el-table-column>


      <el-table-column label="司机额外费用" :show-overflow-tooltip="true" width="150">
        <template slot-scope="scope">
          {{scope.row.driverAddFee}}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    tableData: {
      default: () => []
    },
    loading: {
      default: false
    }
  },
  data () {
    return {
      showDriver:true,
      showCustomer:true,
      status:'',
      currentTableData: [],
      multipleSelection: [],
      downloadColumns: [
        { label: '卡密', prop: 'key' },
        { label: '面值', prop: 'value' },
        { label: '状态', prop: 'type' },
        { label: '管理员', prop: 'admin' },
        { label: '管理员备注', prop: 'adminNote' },
        { label: '创建时间', prop: 'dateTimeCreat' },
        { label: '使用状态', prop: 'used' },
        { label: '使用时间', prop: 'dateTimeUse' }
      ]
    }
  },
  created() {
      this.getTrueColumn();
  },
  watch: {
      $route(to, from) {
          this.getTrueColumn();
      },
    tableData: {
      handler (val) {
        this.currentTableData = val;
      },
      immediate: true
    },
  },
  methods: {
      getTrueColumn () {
          this.status=this.$route.params.status;
          if(this.status=='2'){
              this.showCustomer=false;
              this.showDriver=true;
          }else  if(this.status=='3'){
              this.showCustomer=true;
              this.showDriver=false;
          }else{
              this.showCustomer=true;
              this.showDriver=true;
          }
      },
      handleSwitchChange (val, index) {
      const oldValue = this.currentTableData[index]
      this.$set(this.currentTableData, index, {
        ...oldValue,
        type: val
      })
      // 注意 这里并没有把修改后的数据传递出去 如果需要的话请自行修改
    },
    handleSelectionChange (val) {
      this.multipleSelection = val;
      this.$emit("orderInfos",{orderInfos: this.multipleSelection});
    },
    downloadDataTranslate (data) {
      return data.map(row => ({
        ...row,
        type: row.type ? '禁用' : '正常',
        used: row.used ? '已使用' : '未使用'
      }))
    },
    handleDownloadXlsx (data) {
      this.$export.excel({
        title: 'D2Admin 表格示例',
        columns: this.downloadColumns,
        data: this.downloadDataTranslate(data)
      })
        .then(() => {
          this.$message('导出表格成功')
        })
    },
    handleDownloadCsv (data) {
      this.$export.csv({
        title: 'D2Admin 表格示例',
        columns: this.downloadColumns,
        data: this.downloadDataTranslate(data)
      })
        .then(() => {
          this.$message('导出CSV成功')
        })
    }
  }
}
</script>
