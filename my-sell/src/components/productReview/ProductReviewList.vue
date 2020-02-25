<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-left: 10px;font-size: 12px;">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品评价管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品评价列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="height: 15px;"></div>

    <div style="display: flex; height: 32px;">
      <el-form :inline="true"  class="demo-form-inline" size="small" >
        <el-form-item>
          <el-input v-model="personName" placeholder="昵称" ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="productName" placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="height: 15px;"></div>

    <el-table
      :data="tableData"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      style="width: 100%"
      min-height="720"
      stripe
      ref="checkTable"
      @selection-change="handleSelectionChange"
      v-loading="loading"
      size="small">
      <el-table-column
        type="selection"
        width="55"
      >
      </el-table-column>
      <el-table-column type="index" width="60" label="序号">
      </el-table-column>
      <el-table-column
        prop="personIcon"
        label="评论人小图"
        width="120">
        <!-- 图片的显示 -->
        <template   slot-scope="scope">
          <img :src="scope.row.bannerIcon"  min-width="120" height="120" />
        </template>
      </el-table-column>
      <el-table-column
        prop="personName"
        label="评论人昵称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="productName"
        label="产品名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="productReviewLevel"
        label="评价级别"
        width="120">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.belongIndex === 1 ? 'primary' : 'success'"
            close-transition>{{scope.row.belongIndex === 1 ? '好评' : '差评'}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="productReviewContent"
        label="评论内容"
        width="200">
      </el-table-column>

      <el-table-column
        prop="creator"
        label="创建者"
        width="120">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="150">
      </el-table-column>
      <el-table-column
        label="操作"
        width="240">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="modifyRow(scope.$index, scope.row)"
            type="text"
            size="small">
            修改评论内容
          </el-button>
          <el-button
            @click.native.prevent="deleteRow(scope.$index, scope.row)"
            type="text"
            size="small">
            删除
          </el-button>

        </template>

      </el-table-column>
    </el-table>
    <div style="height: 10px;"></div>
    <el-row>
      <el-col :span="14">
        <div class="pagination-content">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalSize">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
    <!--修改评论内容-->
    <el-dialog
      title="修改评论内容"
      :visible.sync="modifyContentVisible"
      center>
      <el-form ref="modifyContent" :model="productReivewInfo" label-position="right" label-width="180px">
        <el-form-item label="评价级别">
          <el-select v-model="productReivewInfo.reviewLevel">
            <el-option label="好评" value="1"></el-option>
            <el-option label="差评" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="评价内容">
          <el-col :span="12">
            <el-input type="textarea" v-model="productReivewInfo.reviewContent" ></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyContentVisible = false">取 消</el-button>
        <el-button type="primary" @click="makeModifyContent">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

  import configs from '../../api/config.js'

  export default {
    name: 'BannerList',
    data () {
      return {
        currentPage: 1, //默认显示页面为1
        pagesize: 10, //    每页的数据条数
        tableData: [],
        totalSize: this.currentPage*this.pagesize,
        multipleSelection: [],
        //用户搜索
        personName:'',
        productName:'',
        dialogVisible: false,
        loading: true,
        baseUrl: configs.baseRootUrl,
        modifyContentVisible: false,
        productReivewInfo:{
          productNumber:'',
          hashNumber:'',
          reviewContent:'',
          reviewLevel: 1
        }
      }
    },
    mounted() {
      this.getData();
    },
    methods:{
      getData() {
        let that = this;
        this.$api.findProductReviewList({'currentPage':that.currentPage,'pagesize':that.pagesize,'productName':that.productName,'personName':that.personName},
          success => {
            console.log(success.data);
            let res = success;
            that.currentPage = res.currentPage;
            that.totalSize = res.totalSize;
            that.tableData = res.data;
            that.loading = false;
          }, fail => {
            console.log("error");
            that.$message(fail.message);
            that.loading = false;
            that.totalSize = 0;
          });
      },
      handleSelectionChange(val) {
        console.log("handleSelectionChange事件"+val);
        this.multipleSelection = val;
      },

      //商品查询
      onSubmit() {
        console.log('submit!');
        //查询
        this.getData();
      },
      handleSizeChange(size) {
        this.pagesize = size;
        console.log(`每页 ${size} 条`);
        this.getData();
      },
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage;
        console.log(`当前页: ${currentPage}`);
        this.getData();
      },
      makeModifyContent(){
        let that = this ;
        that.$api.modifyProductReview(that.productReivewInfo,
          success=>{
            that.getData();
            that.$message({
              message: success.message,
              type: 'success'
            });
          },
          fail=>{
            that.$message.error(fail.message)
          })
      },
      modifyRow (index, rows) {
        console.log("修改");
        console.log("index="+index);
        console.log("rows="+rows);
        let hashNumber = rows.hashNumber;
        let productNumber = rows.productNumber ;
        //组装成传参数据
        this.productReivewInfo.hashNumber = rows.hashNumber;
        this.productReivewInfo.productNumber = rows.productNumber;
        this.productReivewInfo.reviewContent = rows.productReviewContent;
        this.productReivewInfo.reviewLevel = rows.productReviewLevel;
        this.modifyContentVisible = true ;
      },
      deleteRow(index, rows) {
        console.log("删除");
        console.log("index="+index);
        console.log("rows="+rows);
        let that = this ;
        this.$confirm('此操作将删除该类目, 是否继续?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //请求商品详情
          let hashNumber = rows.hashNumber;
          let productNumber = rows.productNumber ;
          //组装成传参数据
          let params = {
            'hashNumber': hashNumber,
            'productNumber': productNumber
          }
          that.$api.deleteProductReview(params,
            success=>{
              // rows.productStatus = 1;
              that.tableData.splice(index,1)
              that.$message({
                message: success.message,
                type: 'success'
              });
            },
            fail=>{
              that.$message.error(fail.message)
            })
        }).catch(() => {

        });
      },
    }
  }
</script>

<style scoped>
  .pagination-content{
    display: flex;
    justify-content: center;
  }
</style>
