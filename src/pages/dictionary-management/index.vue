<template>
  <d2-container>
    <page-header
      slot="header"
      @submit="handleSubmit"
      ref="header"/>
    <page-main
      :table-data="table"
      :loading="loading"
       @editDictionary="editDictionary"/>
    <page-footer
      slot="footer"
      :current="page.current"
      :size="page.size"
      :total="page.total"
      @change="handlePaginationChange"/>


    <!--<el-dialog title="编辑字典" :visible.sync="editDictionaryPopDialog">-->
      <!--<el-form label-width="130px" :model="editDictionaryModel" label-position="left" size="mini">-->
        <!--<el-form-item label="业务类型"  >-->
          <!--<el-input v-model="editDictionaryModel.bizTypeName" disabled></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="业务明细列表">-->
          <!--<el-select-->
                  <!--v-model="editDictionaryModel.dictionaryBizDetail"-->
                  <!--multiple-->
                  <!--filterable-->
                  <!--allow-create-->
                  <!--default-first-option-->
                  <!--placeholder="请输入业务明细" >-->
          <!--</el-select>-->
        <!--</el-form-item>-->
      <!--</el-form>-->

      <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button @click="cancelCustomer" size="mini">取 消</el-button>-->
        <!--<el-button type="primary" @click="onEditDictionaryConfirm" size="mini"  :loading="loading">确 定</el-button>-->
      <!--</div>-->
    <!--</el-dialog>-->
  </d2-container>
</template>

<script>

import {
getAllDictionary
} from "@/api/dictionary";

import util from "@/libs/util";


export default {
  // name 值和本页的 $route.name 一致才可以缓存页面
  name: 'dictionary-management',
  components: {
    PageHeader: () => import('./componnets/PageHeader'),
    PageMain: () => import('./componnets/PageMain'),
    PageFooter: () => import('./componnets/PageFooter'),
  },
  data() {
    return {
      table: [],
      loading: false,
      customerNumId: util.cookies.get('__user__customernumid'),
      editDictionaryPopDialog:false,
      editDictionaryModel: {
          bizTypeName:"",
          bizTypeId:"",
          dictionaryBizDetail: []
      },
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
    };
  },
  created() {
    this._initMyPage();
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
      getAllDictionary({
        customerNumId: util.cookies.get('__user__customernumid'),
        current: this.page.current,
        pageSize: this.page.size,
        ...form,
      })
        .then(res => {
          this.loading = false;
          this.table = res.dictionarys;
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
      editDictionary(param){
          this.$router.push({
              path: '/dictionary-detail',
              query: {bizTypeId: param.bizTypeId,bizTypeName: param.bizTypeName},
          });
         // this.editDictionaryModel.bizTypeName=param.bizTypeName;
         // this.editDictionaryModel.bizTypeId=param.bizTypeId;
         // this.editDictionaryModel.dictionaryBizDetail=param.bizContentName.split(";");
         // this.editDictionaryPopDialog=true;
      },

      cancelCustomer(){
        this.editDictionaryPopDialog=false;
      },
      handleSubmitPage(form){
          handleSubmit(form);
      }
  }
};
</script>
