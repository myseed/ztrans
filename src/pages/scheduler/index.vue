<template>
  <d2-container>
    <page-header
            slot="header"
            @submit="handleSubmit"
            @add="handleAdd"
            ref="header"/>
    <page-main
            :table-data="table"
            :loading="loading"/>
    <page-footer
            slot="footer"
            :current="page.current"
            :size="page.size"
            :total="page.total"
            @change="handlePaginationChange"/>
    <el-dialog title="新增调度人" :visible.sync="addDialog">
      <el-table
              size="mini"
              :data="baseCustomers"
              highlight-current-row
              style="width: 100%"
              height="400">
        <el-table-column
                fixed
                type="index"
                width="50">
        </el-table-column>
        <el-table-column
                prop="customerName"
                label="调度人姓名"
                width="100">
        </el-table-column>
        <el-table-column
                prop="birthday"
                label="生日">
        </el-table-column>
        <el-table-column
                prop="jobNum"
                label="工号">
        </el-table-column>
        <el-table-column
                prop="sexRealName"
                label="性别">
        </el-table-column>
        <el-table-column
                prop="jobRealName"
                label="职位">
        </el-table-column>
        <el-table-column
                fixed="right"
                label="操作"
                width="80">
          <template slot-scope="scope">
            <el-button @click="onAddRouterToEmployee(scope.row)" type="primary" size="small">添加</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
              width="18%"
              title="客户与线路"
              :visible.sync="innerVisible"
              append-to-body>
        <el-form :inline="true" :model="addItemParam" size="mini"style="margin-right: 0;">
          <el-form-item label="大客户名字">
            <el-autocomplete v-model="customerName"
                             placeholder="大客户名字"
                             clearable
                             :fetch-suggestions="querySearchAsync"
                             @select="handleSelect">
            </el-autocomplete>
          </el-form-item>
          <el-form-item style="margin-right: 0;" label="线路名称">
            <!--<el-select v-model="addItemParam.routerDetailSeries" placeholder="线路别名" clearable style="width: 191px;">-->
              <!--<el-option v-for="(item, index) in routerDetail" :key="index" :label="item.routerAlia" :value="item.series"></el-option>-->
            <!--</el-select>-->
            <el-autocomplete v-model="routerName"
                             placeholder="线路名称"
                             clearable
                             :fetch-suggestions="querySearchAsyncRouter"
                             @select="handleSelectRouter">
            </el-autocomplete>
          </el-form-item>
          <el-button type="primary" @click="onAddRouterToEmployeeComfirm" size="mini">确定</el-button>
        </el-form>
      </el-dialog>
    </el-dialog>
  </d2-container>
</template>

<script>
import {
  getAllRouterAndEmployee,
  getRouterAliaList,
  addRouterToEmployee,
  getRouterAliaSearchList,
} from '@/api/schedule';
import {getAllEmployee} from '@/api/employee';
import {
    getAllRouterAlia
} from '@/api/createorder';
import util from '@/libs/util';
import {
    getMasterCustomerListBySearchKey
} from '@/api/createorder';

export default {
  // name 值和本页的 $route.name 一致才可以缓存页面
  name: 'scheduler',
  components: {
    PageHeader: () => import('./componnets/PageHeader'),
    PageMain: () => import('./componnets/PageMain'),
    PageFooter: () => import('./componnets/PageFooter'),
  },
  data() {
    return {
      table: [],
      franchiseeSeries:util.cookies.get('__user__franchiseeSeries'),
      baseCustomers: [],
      loading: false,
      addDialog: false,
      innerVisible: false,
      routerDetail: [],
      customerMaster: [],
      customerName:'',
      routerName:'',
      customerNumId: util.cookies.get('__user__customernumid'),
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
      masterCustomerSearchKey: {
        customerMasterSearchKey: '',
        customerNumId: '',
      },
      addItemParam: {
        routerDetailSeries: '',
        employeeNumId: '',
        customerSeries: '',
      },
    };
  },
  created() {
    this._initMyPage();
      this._getRouterAliaSearchList({
          customerNumId: this.customerNumId,
          customerSeries: '',
          routerSearchKey: '',
          franchiseeSeries:this.franchiseeSeries,
      });
  },
    watch: {
        'customerName'() {
            if(this.customerName==''||this.customerName==null){
                this.addItemParam.customerSeries='';
            }
            this._getRouterAliaSearchList({
                customerNumId: this.customerNumId,
                customerSeries: this.addItemParam.customerSeries,
                routerSearchKey: '',
                franchiseeSeries:this.franchiseeSeries,
            });
        }
    },
  methods: {
    _initMyPage() {
      this.handleSubmit();
    },
      _getRouterAliaSearchList(item) {
          getRouterAliaSearchList(item)
              .then(res => {
                  if (res.code === 0) {
                      let routerDetails = [];
                      res.routerDetailAliaModel.forEach(item => {
                          routerDetails.push({
                              value: item.routerAlia,
                              ...item,
                          });
                      });
                      this.routerDetail = routerDetails;
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
    handlePaginationChange(val) {
      this.page = val;
      // nextTick 只是为了优化示例中 notify 的显示
      this.$nextTick(() => {
        this.$refs.header.handleFormSubmit();
      });
    },
      querySearchAsync(qs, cb) {
          this.masterCustomerSearchKey.customerMasterSearchKey = qs;
          this.masterCustomerSearchKey.customerNumId = this.customerNumId;
          getMasterCustomerListBySearchKey(this.masterCustomerSearchKey).then(
              res => {
                  if (res.code === 0) {
                      let customerMasters = [];
                      // customerMasters= res.customerMasterList;
                      res.customerMasterList.forEach(item => {
                          customerMasters.push({
                              value: item.customerName,
                              ...item,
                          });
                      });
                      this.customerMaster = customerMasters;
                      let customerMaster = this.customerMaster;
                      var results = qs
                          ? customerMaster.filter(this.createStateFilter(qs))
                          : customerMaster;
                      cb(results);
                  }
              }
          );
      },
      createStateFilter(qs) {
          return state => {
              return state.value.toLowerCase().indexOf(qs.toLowerCase()) != -1;
          };
      },
      handleSelect(item) {
          this.addItemParam.customerSeries = item.customerMasterId;
      },
      querySearchAsyncRouter(qs, cb) {
          if(qs=''){
              return;
          }
          let routerDetails = this.routerDetail;
          var results = qs
              ? routerDetails.filter(this.createStateFilterRouter(qs))
              : routerDetails;
          cb(results);
      },
      createStateFilterRouter(qs) {
          return state => {
              return state.value.toLowerCase().indexOf(qs.toLowerCase()) != -1;
          };
      },
      handleSelectRouter(item) {
          this.addItemParam.routerDetailSeries = item.series;
      },
    handleSubmit(form) {
      this.loading = true;
      getAllRouterAndEmployee({
        current: this.page.current,
        pageSize: this.page.size,
        ...form,
      })
        .then(res => {
          this.loading = false;
          this.table = res.employeeRouterModel;
          this.page = {
            current: this.page.current,
            size: this.page.size,
            total: res.total,
          };
        })
        .catch(err => {
          this.loading = false;
        });
    },
    handleAdd() {
      this.addDialog = true;
      getAllEmployee({
        current: 1,
        pageSize: 1000,
        customerNumId: this.customerNumId,
        employeeJobNumSearchKey: '',
        employeeNameSearchKey: '',
        jobId: 0,
      })
        .then(res => {
          if (res.code === 0) {
            this.baseCustomers = res.baseCustomers;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    onAddRouterToEmployee(row) {
      console.log(row);
      this.innerVisible = true;
      this.addItemParam.employeeNumId = row.customerNumId;
    },
    onAddRouterToEmployeeComfirm() {
        if(this.addItemParam.customerSeries!==''){
        this.$confirm('选了客户后，当前客户下所有线路都会指派给该调度,是否确定添加', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        })
            .then(() => {
                this._addRouterToEmployee({
                    customerNumId: this.customerNumId,
                    employeeNumId: this.addItemParam.employeeNumId,
                    routerDetailSeries: this.addItemParam.routerDetailSeries,
                    customerSeries: this.addItemParam.customerSeries,
                });
            })
            .catch(() => {
                console.log('取消删除');
            });
        }else{
            this._addRouterToEmployee({
                customerNumId: this.customerNumId,
                employeeNumId: this.addItemParam.employeeNumId,
                routerDetailSeries: this.addItemParam.routerDetailSeries,
                customerSeries: this.addItemParam.customerSeries,
            });
        }
      this.innerVisible = false;

    },
    _addRouterToEmployee(params) {
      addRouterToEmployee(params)
        .then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '添加成功!',
            });
            this.addDialog = false;
              this.handleSubmit();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    _getRouterAliaList(params) {
      getRouterAliaList(params)
        .then(res => {
          if (res.code === 0) {
            this.routerDetail = res.routerDetail;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
  },
};
</script>
