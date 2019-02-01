<template>
  <d2-container>
    <page-header
            slot="header"
            @submit="handleSubmit"
            @handleAdd="handleAdd"
            ref="header"/>
    <page-main
            :table-data="table"
            @deleteOrder="deleteOrder"
            @timeDetail="timeDetail"
            @getTaskDetail="getTaskDetail"
            :loading="loading"/>
    <page-footer
            slot="footer"
            :current="page.current"
            :size="page.size"
            :total="page.total"
            @change="handlePaginationChange"/>
    <el-dialog width="720px" title="派单时间" :modal='false' :close-on-click-modal='false' :visible.sync="dialogFormVisibleTask" class="motorcade-flight-management-taskDialog">
      <div class="btn-groups">
        <div v-for="(item,index) in btn_group" :class="{'btn-active':item.show}" >{{item.value}}</div>
      </div>
    </el-dialog>
  </d2-container>
</template>

<script>
import util from '@/libs/util';
import {getRouterAliaList} from '@/api/schedule';
import {
    getAllMonthOrder,deleteAllMonthOrder
} from '@/api/order';
import {getOrderType} from '@/api/dictionary';

export default {
  // name 值和本页的 $route.name 一致才可以缓存页面
  name: 'vehicle-assign',
  components: {
    PageHeader: () => import('./componnets/PageHeader'),
    PageMain: () => import('./componnets/PageMain'),
    PageFooter: () => import('./componnets/PageFooter'),
  },
  data() {
    return {
      dialogFormVisibleTask:false,
      customerNumId: util.cookies.get('__user__customernumid'),
      btn_group:[],
      searchItemPop: {
        appointmentDate: '',
        carPlateNumberSearchKey: '',
        carTypeSeries: '',
        carSizeSeries: '',
        driverNameSearchKey: '',
        routerDetailSeries: '',
        series: '',
      },
      routerDetail: [],
      curPage: 1,
      pgSize: 1000,
      orderDetailDialog: false,
      orderDetail: {},
      carTypes: [],
      carSizes: [],
      orderTypes: [],
      driverModel: [],
      addDialog: false,
      table: [],
      loading: false,
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
    };
  },
  created() {
    this._getRouterAliaList({
      customerNumId: this.customerNumId,
    });
    this._initMyPage();
  },
  computed: {
    totalPage() {
      return this.tableData.length;
    },
    addTotalPage() {
      return this.driverModel.length;
    },
    tableInlineData() {
      return this.tableData.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      );
    },
    tablePopData() {
      this.driverModel.forEach(item => {
        item.district = `${item.prvRealName}/${item.cityRealName}/${
          item.cityAreaRealName
        }`;
      });
      return this.driverModel.slice(
        (this.curPage - 1) * this.pgSize,
        this.curPage * this.pgSize
      );
    },
  },
  methods: {
    _initMyPage() {
      this.handleSubmit();
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
    handlePaginationChange(val) {
      this.page = val;
      // nextTick 只是为了优化示例中 notify 的显示
      this.$nextTick(() => {
        this.$refs.header.handleFormSubmit();
      });
    },
    handleAdd(){
        this.$router.push({
            path: '/create-month-detail'
        });
    },
    handleSubmit(form) {
      this.loading = true;
      getAllMonthOrder({
        customerNumId: util.cookies.get('__user__customernumid'),
        current: this.page.current,
        pageSize: this.page.size,
        ...form,
      })
        .then(res => {
          this.loading = false;
          this.table = res.orderModels;
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
    deleteOrder(param) {
      this._deleteAllMonthOrder({
        customerNumId: this.customerNumId,
        series: param.series,
      });
    },
      getTaskDetail(param) {
          this.$router.push({
              path: '/order-month-detail',
              query: {series: param.series},
          });
    },
      timeDetail(param){
        this.btn_group=[];
        var times=param.appointmentDates;
        let time = [];
        time =times.split(",");
          for (var i=0;i<time.length;i++)
          {
              this.btn_group.push({value:time[i],show:true});
          }

          this.dialogFormVisibleTask=true;
      },
      _deleteAllMonthOrder(params) {
          this.$confirm(
              '是否删除当前记录？',
              '提示',
              {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning',
              }
          ).then(() => {
          deleteAllMonthOrder(params)
              .then(res => {
                  if (res.code === 0) {
                      this.$message.success('删除成功！');
                      this.handleSubmit();
                  }
              })
              .catch(err => {
                  console.log(err);
              });
          });
      },
    selectCar(param) {
      this.addDialog = true;
      this.searchItemPop.appointmentDate = param.appointmentDate;
      this.searchItemPop.carTypeSeries = param.carType;
      this.searchItemPop.routerDetailSeries = param.routerDetailSeries;
      this.searchItemPop.series = param.series;
      // 加载全部数据
      this.handleSubmit();
    },
    onSearchPop() {
      this._selectDriver({
        current: 1,
        pageSize: 10,
        customerNumId: this.customerNumId,
        appointmentDate: this.searchItemPop.appointmentDate,
        carPlateNumberSearchKey: this.searchItemPop.carPlateNumberSearchKey,
        carTypeSeries: this.searchItemPop.carTypeSeries,
        driverNameSearchKey: this.searchItemPop.driverNameSearchKey,
        routerDetailSeries: this.searchItemPop.routerDetailSeries,
      });
    },
    onCheckOrderDetail(index, row) {
      this.orderDetailDialog = true;
      this.driverSeries = row.series;
      this._getDriverOrderDetail({
        customerNumId: this.customerNumId,
        driverSeries: row.series,
        orderSeries: this.searchItemPop.series,
      });
    },
    onAssignConfirm() {
      if (this.orderDetail.carRealMoney <= this.orderDetail.carMoney) {
        this._confirmDriver({
          carRealMoney: this.orderDetail.carRealMoney,
          customerNumId: this.customerNumId,
          driverSeries: this.driverSeries,
          orderSeries: this.searchItemPop.series,
        });
      } else {
        this.$message.error('接单价必须不高于车辆报价！');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.btn-groups{
display: flex;
flex-wrap: wrap;
padding: 10px;
justify-content: space-around;
}
.btn-groups>div{
width: 15%;
flex-grow: 0;
flex-shrink: 0;
padding: 10px;
margin-top: 10px;
text-align: center;
border-radius: 5px;
cursor: pointer;
background: #eee;
color: #000;
}
.btn-groups>div.btn-active{
background: #409EFF;
color: #fff;
}
</style>
