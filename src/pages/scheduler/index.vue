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
                width="60">
          <template slot-scope="scope">
            <el-button @click="onAddRouterToEmployee(scope.row)" type="text" size="small">添加</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
              width="18%"
              title="线路别名"
              :visible.sync="innerVisible"
              append-to-body>
        <el-form :inline="true" :model="searchItem" size="mini">
          <el-form-item>
            <el-select v-model="addItemParam.routerDetailSeries" placeholder="线路别名" clearable>
              <el-option v-for="(item, index) in routerDetail" :key="index" :label="item.routerAlia" :value="item.series"></el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="onAddRouterToEmployeeComfirm" size="mini">确定</el-button>
        </el-form>
      </el-dialog>
    </el-dialog>
  </d2-container>
</template>

<script>
    import {getAllRouterAndEmployee,getRouterAliaList,addRouterToEmployee} from '@/api/schedule';
    import {getAllEmployee} from '@/api/employee';
    import util from '@/libs/util';

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
                baseCustomers: [],
                loading: false,
                addDialog: false,
                innerVisible: false,
                routerDetail: [],
                customerNumId: util.cookies.get('__user__customernumid'),
                page: {
                    current: 1,
                    size: 100,
                    total: 0,
                },
                addItemParam: {
                    routerDetailSeries: "",
                    employeeNumId: ""
                },
            };
        },
        created() {
            this._initMyPage();
            this._getRouterAliaList({
                customerNumId: this.customerNumId
            });
        },
        methods: {
            _initMyPage() {
                this.handleSubmit();
            },
            handlePaginationChange(val) {
                this.$notify({
                    title: '分页变化',
                    message: `当前第${val.current}页 共${val.total}条 每页${val.size}条`,
                });
                this.page = val;
                // nextTick 只是为了优化示例中 notify 的显示
                this.$nextTick(() => {
                    this.$refs.header.handleFormSubmit();
                });
            },
            handleSubmit(form) {
                this.loading = true;
                this.$notify({
                    title: '开始请求数据',
                });

                getAllRouterAndEmployee({
                    current: this.page.current,
                    pageSize: this.page.size,
                    ...form,
                })
                    .then(res => {
                        this.loading = false;
                        this.$notify({
                            title: '数据请求完毕',
                        });

                        this.table = res.employeeRouterModel;
                        this.page = {
                            current: 1,
                            size: 100,
                            total: res.total,
                        };
                    })
                    .catch(err => {
                        this.loading = false;
                        this.$notify({
                            title: '数据请求异常',
                        });
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
                this.innerVisible = false;
                this._addRouterToEmployee({
                    customerNumId: this.customerNumId,
                    employeeNumId: this.addItemParam.employeeNumId,
                    routerDetailSeries: this.addItemParam.routerDetailSeries
                });
            },
            _addRouterToEmployee(params) {
                addRouterToEmployee(params)
                    .then(res => {
                        if (res.code === 0) {
                            this.$message({
                                type: "success",
                                message: "添加成功!"
                            });
                            this.addDialog = false;
                            this.onSearch();
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
            }
        },
    };
</script>
