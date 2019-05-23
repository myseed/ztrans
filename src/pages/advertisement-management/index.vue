<template>
  <d2-container type="full" class="page">
    <template>
      <el-form  size="mini" label-width="140px">
        <el-form-item label="广告图片" >
          <el-upload
                  :limit="1"
                  action=""
                  list-type="picture-card"
                  name="advertisePicture"
                  :http-request="onReaderComplete"
                  :before-upload="onReaderSelect"
                  :on-preview="onReaderPreview"
                  :on-remove="onReaderRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form>
    </template>
  </d2-container>
</template>

<script>
    import {
        getMasterCustomerListBySearchKey,
        getAllRouterAlia,
        getCustomerRouterDetail,
        getPriceAndCarByCustomerIdAndRouterSeries,
        createOrderByWeb,
        getDriverPriceAndCarByCustomerIdAndRouterSeries,
        createDriverOrder
    } from '@/api/createorder';
    import {getDriverBySearchKey,getDriverByPlateNumberSearchKey} from '@/api/truck';
    import {getCarTypeList} from '@/api/order';
    import {
        getCarSizeList,getOrderStatusList
    } from '@/api/dictionary';
    import {
        getMasterCustomerListBySearchKeyAndAuthority
    } from '@/api/customer';
    import {uploadPicture, deletePicture} from '@/api/picture';
    import util from '@/libs/util';
    export default {
        name: 'create-month-detail',
        data() {
            return {
                dialogFormVisibleTask:false,
                searching: false,
                customerNumId: util.cookies.get('__user__customernumid'),
                dialogVisible: false,
                dialogImageUrl: '',
                url:''
            };
        },

        methods: {
            onReaderComplete({file, filename}) {
                let pictureCode = "6";
                let customerNumId = this.customerNumId;
                // 把图片上传到服务器
                const params = {customerNumId, pictureCode};
                this.$message({
                    type: "warn",
                    message: "图片正在上传!"
                });
                this._uploadPicture(params, file, filename);
            },
            _uploadPicture(params, file, filename) {
                uploadPicture(params, file)
                    .then(res => {
                        if (res.data.code === 0) {
                            this.$message({
                                type: "success",
                                message: "上传成功!"
                            });
                            this.url = res.data.url;
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            onReaderSelect(file) {
                return true;
            },
            onReaderPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            onReaderRemove(file, fileList) {
                console.log(file, fileList);
                this._deletePicture({
                    customerNumId: this.customerNumId,
                    url: this.url
                });
            },
            _deletePicture(params) {
                deletePicture(params)
                    .then(res => {
                        console.log(res);
                        if (res.code === 0) {
                            this.$message({
                                type: "success",
                                message: "删除成功!"
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

<style lang="scss" scoped>
  .page {
    .block {
      padding: 10px 30px;
      text-align: left;
    }
    .pagination-wrapper {
      padding: 10px 0;
      text-align: right;
    }
    .i-list {
      padding: 0;
      margin: 0;
      list-style: none;
      & li {
        padding: 5px 15px;
      }
    }
  }
  .btn-groups{
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    justify-content: space-around;
  }
  .btn-groups>div{
    width: 10%;
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
