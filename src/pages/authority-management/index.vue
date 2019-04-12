<template>
  <d2-container type="full" class="page">
    <template>
      <el-form :inline="true" size="mini" label-width="110px">
        <el-form-item label="请输入角色名字" prop="roleName">
          <el-autocomplete v-model="roleName"
                           placeholder="角色名字"
                           :fetch-suggestions="querySearchAsyncRole"
                           @select="handleSelect">
          </el-autocomplete>
        </el-form-item>
        <el-form-item>
          <el-button
                  type="primary"
                  @click="handleFormSubmit">
            <d2-icon name="search"/>
            查询权限明细
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
                  type="primary"
                  @click="handleAdd">
            <d2-icon name="plus"/>
            新增角色
          </el-button>
        </el-form-item>
      </el-form>
      <div class="header">页面权限</div>
      <el-tree
              ref="menuTree"
              :data="menuTreeJson"
              show-checkbox
              node-key="id"
              :default-expanded-keys="menuExpandKey"
              :default-checked-keys="menuCheckKey"
              :props="defaultProps">
      </el-tree>
      <div class="header">数据权限</div>
      <el-tree
              ref="dataTree"
              :data="dataTreeJson"
              show-checkbox
              node-key="id"
              :default-expanded-keys="dataExpandKey"
              :default-checked-keys="dataCheckKey"
              :props="defaultProps">
      </el-tree>
      <div slot="footer" class="dialog-footer" v-if='showAuth'>
      <el-button type="primary" @click="editAuthConfirm" size="mini" :v-if="showAuth">编辑权限</el-button>
      </div>
    </template>
    <el-dialog title="添加角色" :visible.sync="addRolePopDialog">
      <el-form :model="addRoleModel" label-width="100px" size="mini">
        <el-form-item label="角色名字">
          <el-input v-model="addRoleModel.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色备注">
          <el-input v-model="addRoleModel.roleRemark"></el-input>
        </el-form-item>
      </el-form>
        <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAddRole" size="mini">取 消</el-button>
        <el-button type="primary" @click="onAddRoleConfirm" size="mini"  :loading="loading">确 定</el-button>
        </div>

    </el-dialog>
  </d2-container>
</template>

<script>
    import { getAuthorityRoleList,addRoleName,getAuthorityTreeByRoleId,updateAuthRoleRelation} from "@/api/auth";
import util from '@/libs/util';
export default {
  name: 'authority-management',
  data() {
    return {
      showAuth:false,
      loading:false,
      customerNumId: util.cookies.get('__user__customernumid'),
      addRolePopDialog:false,
      roleName:'',
      roleId:'',
      authNameList:[],
      menuExpandKey:[],
      menuCheckKey:[],
      menuTreeJson:[],
      dataExpandKey:[],
      dataCheckKey:[],
      dataTreeJson:[],
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
      addRoleModel:{
          customerNumId: util.cookies.get('__user__customernumid'),
          roleName: '',
          roleRemark: '',
       },
        defaultProps: {
            children: 'children',
            label: 'title'
        }
    };
  },

  created() {
      this._getAuthorityRoleList({
          customerNumId: this.customerNumId
      });
  },
  watch: {},
  methods: {
      _getAuthorityRoleList(params) {
          getAuthorityRoleList(params)
              .then(res => {
                  if (res.code === 0) {
                      this.authNameList = res.authRoleModels;
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
      querySearchAsyncRole(qs, cb) {
          let roleNames = [];
          this.authNameList.forEach(item => {
              roleNames.push({
                  value: item.roleName,
                  ...item,
              });
          });
          var results = qs
              ? roleNames.filter(this.createStateFilter(qs))
              : roleNames;
          cb(results);
      },
      createStateFilter(qs) {
          return state => {
              return state.value.toLowerCase().indexOf(qs.toLowerCase()) != -1;
          };
      },
      handleSelect(item) {
         this.roleId=item.roleId;
      },
      handleAdd(){
          this.addRolePopDialog=true;
      },
      cancelAddRole(){
          this.addRolePopDialog=false;
          this.addRoleModel.roleName='';
          this.addRoleModel.roleRemark='';
      },
      onAddRoleConfirm(){
          this.loading=true;
          this._addRoleName(this.addRoleModel);
          this.loading=false;
      },
      _addRoleName(param){
          addRoleName(param)
              .then(res => {
                  if (res.code === 0) {
                      this.$message({
                          type: "success",
                          message: "新增成功!"
                      });
                      location.reload();
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
      handleFormSubmit(){
          if(this.roleId==''){
              this.$message({
                  type: "error",
                  message: "请先选择角色!"
              });
              return;
          }
         this._getAuthorityTreeByRoleId({
            customerNumId: this.customerNumId,
            roleId:this.roleId
        });
      },
      _getAuthorityTreeByRoleId(param){
          getAuthorityTreeByRoleId(param)
              .then(res => {
                  if (res.code === 0) {
                     this.menuExpandKey=res.menuExpandKey;
                     this.menuCheckKey=res.menuCheckKey;
                     this.menuTreeJson=res.menuTreeJson;
                     this.dataExpandKey=res.dataExpandKey;
                     this.dataCheckKey=res.dataCheckKey;
                     this.dataTreeJson=res.dataTreeJson;
                     this.showAuth=true;
                  }
              })
              .catch(err => {
                  console.log(err);
              });
      },
      editAuthConfirm(){
          console.log( this.$refs.menuTree.getCheckedKeys());
          this.$confirm('是否编辑角色'+this.roleName+'的权限?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
          }).then(() => {
              this._updateAuthRoleRelation({
                  customerNumId: this.customerNumId,
                  roleId:this.roleId,
                  menuId:this.$refs.menuTree.getCheckedKeys().concat(this.$refs.menuTree.getHalfCheckedKeys()),
                  dataId:this.$refs.dataTree.getCheckedKeys().concat(this.$refs.dataTree.getHalfCheckedKeys())
                  // menuId:this.$refs.menuTree.getCheckedKeys(),
                  // dataId:this.$refs.dataTree.getCheckedKeys()
              });
          });
      },
      _updateAuthRoleRelation(param){
          updateAuthRoleRelation(param)
              .then(res => {
                  if (res.code === 0) {
                      this.$message({
                          type: "success",
                          message: "权限编辑成功!"
                      });
                      handleFormSubmit();
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
