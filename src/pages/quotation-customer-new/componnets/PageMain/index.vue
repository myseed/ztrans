<template>
  <div>
    <el-table
            size="mini"
            :data="currentTableData"
            highlight-current-row
            style="width: 100%"
            stripe>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table
                  size="mini"
                  :data="props.row.routerPriceList"
                  highlight-current-row
                  style="width: 100%">
            <el-table-column label="车型" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{scope.row.carTypeRealName}}
              </template>
            </el-table-column>
            <el-table-column label="车长" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{scope.row.carSizeRealName}}
              </template>
            </el-table-column>
            <el-table-column label="吨位" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{scope.row.carWeightRealName}}
              </template>
            </el-table-column>
            <el-table-column label="报价类型" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{scope.row.routerCustomerTypeName}}
              </template>
            </el-table-column>
            <el-table-column label="起步价格(元)" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{scope.row.initPrice}}
              </template>
            </el-table-column>

            <el-table-column label="超出价格(元/公里)" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{scope.row.overstepPrice}}
              </template>
            </el-table-column>

            <el-table-column label="销售比例" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{scope.row.saleProportion}}
              </template>
            </el-table-column>

            <el-table-column label="加盟商比例" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{scope.row.franchiseeProportion}}
              </template>
            </el-table-column>

            <el-table-column
                    fixed="right"
                    label="操作"
                    width="120">
              <template slot-scope="scope">
                <el-button type="danger" @click="onDeleteDetailPrice(scope.$index, scope.row)" v-if="scope.$index % 2 === 1" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
              type="index"
              width="50">
      </el-table-column>
      <el-table-column label="线路报价ID" :show-overflow-tooltip="true">
      <template slot-scope="scope">
        {{scope.row.routerDetailSeries}}
      </template>
    </el-table-column>

      <el-table-column label="客户名称" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.customerName}}
        </template>
      </el-table-column>

      <el-table-column label="线路编号" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.routerNumber}}
        </template>
      </el-table-column>

      <el-table-column label="线路名称" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.routerAlia}}
        </template>
      </el-table-column>

      <el-table-column
              fixed="right"
              label="操作"
              width="220">
        <template slot-scope="scope">
          <el-button @click="onEditCustomerPrice(scope.$index, scope.row)" type="primary" size="mini">编辑</el-button>
          <el-button @click="getCustomerPrice(scope.$index, scope.row)"  size="mini">查看</el-button>
          <el-button @click="onDeleteCustomerPrice(scope.$index, scope.row)" type="danger" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>



  </div>
</template>

<script>
import util from '@/libs/util.js';
import {getRouterAliaSearchList} from '@/api/schedule';
import {getCarTypeList} from '@/api/order';
import {
  getAllRouterCustomerPrice,
  getMasterCustomerList,
  addRouterCustomerPrice,
  deleteRouterByRouterId,
  deleteRouterCustomerPrice,
  updateBatchRouterPrice,
  updateRouterCustomerPrice,
  getConsumerRouterPriceByRouterId,
} from '@/api/price';
import {
  getAllPrv,
  getAllCity,
  getAllCityArea,
  getAllTown,
  getCarSizeList,
} from '@/api/dictionary';
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
      customerNumId: util.cookies.get('__user__customernumid'),
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
          this._deleteRouterAndEmployee(
            {
              customerNumId: util.cookies.get('__user__customernumid'),
              series: row.series,
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
    downloadDataTranslate(data) {
      return data.map(row => ({
        ...row,
        type: row.type ? '禁用' : '正常',
        used: row.used ? '已使用' : '未使用',
      }));
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
    onDeleteDetailPrice(index, row) {
      this.$emit('onDeleteDetailPrice', {routerPriceId: row.routerPriceId});
    },
    onDeleteCustomerPrice(index, row) {
      this.$emit('onDeleteCustomerPrice', {
        routerDetailSeries: row.routerDetailSeries,
      });
    },
    onEditCustomerPrice(index, row) {
      this.$emit('onEditCustomerPrice', {
        customerSeries: row.customerSeries,
        routerDetailSeries: row.routerDetailSeries,
      });
    },
    getCustomerPrice(index, row) {
      this.$emit('getCustomerPrice', {
        customerSeries: row.customerSeries,
        routerDetailSeries: row.routerDetailSeries,
      });
    },
  },
};
</script>
