<template>
  <d2-container type="full" class="page">
    <template>
      <div class="header">客户基本信息</div>
      <el-form :inline="true" size="mini" label-width="110px">
        <el-form-item label="大客户名字" >
          <el-input v-model="editCustomerItem.customerName"></el-input>
        </el-form-item>
        <el-form-item label="客户所在省" >
          <el-input v-model="editCustomerItem.prvRealName"></el-input>
        </el-form-item>
        <el-form-item label="客户所在市" >
          <el-input v-model="editCustomerItem.cityRealName"></el-input>
        </el-form-item>
        <el-form-item label="客户所在区" >
          <el-input v-model="editCustomerItem.cityAreaRealName"></el-input>
        </el-form-item>
        <el-form-item label="客户所属销售" >
          <el-input v-model="editCustomerItem.saleName"></el-input>
        </el-form-item>
        <el-form-item label="客户注册时间" >
          <el-input v-model="editCustomerItem.finalDate"></el-input>
        </el-form-item>
        <el-form-item label="客户审核状态" >
          <el-input v-model="editCustomerItem.checkStatusName"></el-input>
        </el-form-item>
        <el-form-item label="客户代码" >
          <el-input v-model="editCustomerItem.customerSimpleCode"></el-input>
        </el-form-item>
        <el-form-item label="客户地址" >
          <el-input v-model="editCustomerItem.detailAddress"></el-input>
        </el-form-item>
      </el-form>
      <div class="header">客户属性</div>
      <el-form :inline="true" size="mini" label-width="110px">
        <el-form-item label="客户级别" >
          <el-input v-model="editCustomerItem.customerLevelName"></el-input>
        </el-form-item>
        <el-form-item label="客户来源" >
          <el-input v-model="editCustomerItem.customerSourceName"></el-input>
        </el-form-item>
        <el-form-item label="客户类型" >
          <el-input v-model="editCustomerItem.customerTypeName"></el-input>
        </el-form-item>
        <el-form-item label="服务类型" >
          <el-input v-model="editCustomerItem.serviceTypeName"></el-input>
        </el-form-item>
        <el-form-item label="结算方式" >
          <el-input v-model="editCustomerItem.caculateTypeName"></el-input>
        </el-form-item>
        <el-form-item label="下单级别" >
          <el-input v-model="editCustomerItem.orderLevelName"></el-input>
        </el-form-item>
      </el-form>
      <div class="header">联系人属性
      </div>
      <!--<el-button type="primary" @click="onAddContact">添加联系人</el-button>-->
      <div class="block">
        <el-table
                size="mini"
                :data="constantDetail"
                highlight-current-row
                style="width: 100%"
                stripe>
          <el-table-column
                  fixed
                  type="index"
                  width="50">
          </el-table-column>
          <el-table-column
                  fixed
                  prop="contactName"
                  label="联系人">
          </el-table-column>
          <el-table-column
                  prop="contactPhone"
                  label="联系电话">
          </el-table-column>
          <el-table-column
                  prop="wxName"
                  label="微信名称">
          </el-table-column>
          <el-table-column
                  prop="activeDtme"
                  label="创建日期">
          </el-table-column>
          <el-table-column
                  fixed="right"
                  label="操作">
            <!--<template slot-scope="scope">-->
              <!--<el-button @click="onEditContact(scope.$index, scope.row)" type="primary" size="small">编辑</el-button>-->
              <!--<el-button @click="onDeleteContact(scope.$index, scope.row)" type="danger" size="small">删除</el-button>-->
            <!--</template>-->
          </el-table-column>
        </el-table>
      </div>
    </template>
    <el-dialog title="编辑联系人" :visible.sync="editContactPopDialog">
      <el-form :inline="true" :model="editContactItem" label-position="left" size="mini">
        <el-form-item label="联系人姓名">
          <el-input v-model="editContactItem.contactName"></el-input>
        </el-form-item>
        <el-form-item label="联系人电话">
          <el-input v-model="editContactItem.contactPhone"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editContactPopDialog = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="onEditContactConfirm" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加联系人" :visible.sync="addContactPopDialog">
      <el-form :inline="true" :model="addContactItem" label-position="left" size="mini">
        <el-form-item label="客户联系人姓名">
          <el-input v-model="addContactItem.contactName"></el-input>
        </el-form-item>
        <el-form-item label="客户联系人电话">
          <el-input v-model="addContactItem.contactPhone"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addContactPopDialog = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="onAddContactConfirm" size="mini"  :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>

<script>
    import {getAllMasterCustomer, getMasterCustomerDetail, deleteMasterCustomer, addMasterCustomer, getAllSaleList, deleteCustomerContact, updateMasterCustomer, addCustomerContact, updateCustomerContact, deleteOldCustomerContact,} from '@/api/customer';
import util from '@/libs/util';
export default {
  data() {
    return {
      customerNumId: util.cookies.get('__user__customernumid'),
      editCustomerItem: {
          caculateType: '',
          checkRemark: '',
          checkStatus: '',
          cityAreaName: '',
          cityName: '',
          customerLevel: '',
          customerName: '',
          customerNumId: '',
          customerSimpleCode: '',
          customerSource: '',
          customerType: '',
          detailAddress: '',
          finalDate: '',
          orderLevel: '',
          prvName: '',
          saleId: '',
          series: '',
          serviceType: '',
       },
       addContactItem: {
          activeDtme: '',
          activeStatus: '',
          commendFranchisee: '',
          commendSale: '',
          contactName: '',
          contactPhone: '',
          customerContactId: '',
          customerMasterId: '',
          customerNumId: util.cookies.get('__user__customernumid'),
          franchiseeSeries:util.cookies.get('__user__franchiseeSeries')
       },
       editContactItem: {
          activeDtme: '',
          activeStatus: '',
          contactName: '',
          contactOpenId: '',
          contactPhone: '',
          customerContactId: '',
          customerMasterId: '',
          customerNumId: '',
        },
      constantDetail: [],
      customerMasterId:'',
      customerDetail: {},
      editContactPopDialog: false,
      addContactPopDialog: false,
    };
  },

  created() {
    this.customerMasterId = this.$route.query.customerMasterId;
    if (!this.customerMasterId == '') {
      this._getMasterCustomerDetail({
        customerNumId: this.customerNumId,
        customerMasterId: this.customerMasterId,
      });
        this.addContactItem.customerMasterId = this.customerMasterId;
        this.addContactItem.customerNumId = this.customerNumId;
    }
  },
  watch: {},
  methods: {
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
      onEditContact(index, row) {
          this.editContactPopDialog = true;
          console.log(row);
          this.editContactItem = row;
      },
      onEditContactConfirm() {
          this._updateCustomerContact(this.editContactItem);
      },
      _updateCustomerContact(params) {
          updateCustomerContact(params)
              .then(res => {
                  if (res.code === 0) {
                      this.$message({
                          type: 'success',
                          message: '修改成功!',
                      });
                      this.editContactPopDialog = false;
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
      onDeleteContact(index, row) {
          console.log(index, row);
          this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
          })
              .then(() => {
                  this._deleteCustomerContact(
                      {
                          customerNumId: this.customerNumId,
                          customerContactId: row.customerContactId,
                      },
                      index
                  );
              })
              .catch(() => {
                  console.log('取消删除');
              });
      },
      _deleteCustomerContact(params, index) {
          deleteCustomerContact(params)
              .then(res => {
                  if (res.code === 0) {
                      this.$message({
                          type: 'success',
                          message: '删除成功!',
                      });
                      this.constantDetail.splice(index, 1);
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
      onAddContact() {
          this.addContactPopDialog = true;
          // 清空数据
          this.addContactItem.activeDtme = '';
          this.addContactItem.activeStatus = '';
          this.addContactItem.commendFranchisee = '';
          this.addContactItem.commendSale = '';
          this.addContactItem.contactName = '';
          this.addContactItem.contactPhone = '';
      },
      onAddContactConfirm() {
          this.loading = true;
          this._addCustomerContact(this.addContactItem);
          this.loading = false;
      },
      _addCustomerContact(params) {
          addCustomerContact(params)
              .then(res => {
                  if (res.code === 0) {
                      if (res.hasSameNameContact == 'Y') {
                          this.$confirm(
                              '发现此用户在其他客户下也有注册,推测为曾经作为散户下过单，另外一名客户名字叫“' +
                              res.customerMasterName +
                              '”是否删除旧联系人？',
                              '提示',
                              {
                                  confirmButtonText: '确定',
                                  cancelButtonText: '取消',
                                  type: 'warning',
                              }
                          ).then(() => {
                              this._deleteOldCustomerContact({
                                  customerNumId: this.customerNumId,
                                  oldCustomerMasterId: res.oldCustomerMasterId,
                                  newCustomerMasterId: res.newCustomerMasterId,
                              });
                          });
                      }
                      this.$message({
                          type: 'success',
                          message: '添加新联系人成功!',
                      });
                      this.addContactPopDialog = false;
                      // 刷新数据
                      this._getMasterCustomerDetail({
                          customerNumId: this.customerNumId,
                          customerMasterId: this.addContactItem.customerMasterId,
                      });
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
      _deleteOldCustomerContact(params) {
          deleteOldCustomerContact(params)
              .then(res => {
                  if (res.code === 0) {
                      this.$message({
                          type: 'success',
                          message: '删除老联系人成功!',
                      });
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
  },
};
</script>

<style lang="scss">
  .header {
    padding: 0 10px;
    margin-bottom: 20px;
    border-left: #2f74ff 2px solid;
    background: #f6f6f6;
    font-size: 16px;
  }
</style>
