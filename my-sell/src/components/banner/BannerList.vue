<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-left: 10px;font-size: 12px;">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>广告栏管理</el-breadcrumb-item>
      <el-breadcrumb-item>广告栏列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="height: 15px;"></div>

    <div style="display: flex; height: 32px;">
      <el-button type="primary" size="small" @click="addBanner">增加广告栏</el-button>
      <el-form :inline="true"  class="demo-form-inline" size="small" style="margin-left: 10px;">
        <el-form-item>
          <el-input v-model="selectName" placeholder="广告名称"></el-input>
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
        prop="bannerIcon"
        label="广告栏图片"
        width="200">
        <!-- 图片的显示 -->
        <template   slot-scope="scope">
          <img :src="baseUrl+scope.row.bannerIcon"  min-width="300" height="70" />
        </template>
      </el-table-column>
      <el-table-column
        prop="bannerName"
        label="广告栏名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="bannerUrl"
        label="广告栏连接地址"
        width="240">
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
            @click.native.prevent="lookupRow(scope.$index, scope.row)"
            type="text"
            size="small">
            查看
          </el-button>
          <el-button
            @click.native.prevent="editorRow(scope.$index, scope.row)"
            type="text"
            size="small">
            编辑
          </el-button>
          <el-button
            @click.native.prevent="deleteRow(scope.$index, scope.row)"
            type="danger"
            size="mini">
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
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalSize">
          </el-pagination>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>

  import configs from '../../api/config.js'

  export default {
    name: 'BannerList',
    data () {
      return {
        currentPage: 1, //默认显示页面为1
        pageSize: 10, //    每页的数据条数
        tableData: [],
        totalSize: this.currentPage*this.pageSize,
        multipleSelection: [],
        //用户搜索
        selectName:'',
        dialogVisible: false,
        loading: true,
        baseUrl: configs.baseRootUrl,
        adminToken: configs.adminToken
      }
    },
    mounted() {
      this.getData();
    },
    methods:{
      getData() {
        let that = this;
        this.$api.getBannerList({'currentPage':that.currentPage,'pageSize':that.pageSize,'selectName':that.selectName},
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
        this.pageSize = size;
        console.log(`每页 ${size} 条`);
        this.getData();
      },
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage;
        console.log(`当前页: ${currentPage}`);
        this.getData();
      },
      addBanner(){
        this.$router.push({name: 'AddBanner'});
      },
      lookupRow (index, rows) {
        console.log("查看");
        console.log("index="+index);
        console.log("rows="+rows);
        let hashNumber = rows.hashNumber;
        let bannerId = rows.bannerId ;
        //组装成传参数据
        let params = {
          'hashNumber': hashNumber,
          'bannerId': bannerId
        }

        this.$router.push({ name: 'ViewBanner', params: params});
      },
      editorRow(index, rows) {
        console.log("编辑");
        console.log("index="+index);
        console.log("rows="+JSON.stringify(rows));
        this.$router.push({ name: 'EditBanner', params: {'bannerInfo': JSON.stringify(rows)}});
      },
      deleteRow(index, rows) {
        console.log("删除");
        console.log("index="+index);
        console.log("rows="+rows);
        //rows.splice(index, 1);
        let that = this ;
        this.$confirm('此操作将删除该类目, 是否继续?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //请求商品详情
          let hashNumber = rows.hashNumber;
          let bannerId = rows.bannerId ;
          //组装成传参数据
          let params = {
            'hashNumber': hashNumber,
            'bannerId': bannerId
          }
          that.$api.deleteBanner(params,
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
