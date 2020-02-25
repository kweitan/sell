<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-left: 10px;font-size: 12px;">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="height: 15px;"></div>

    <div style="display: flex; height: 32px;">
      <el-form :inline="true"  class="demo-form-inline" size="small">
        <el-form-item>
          <el-input v-model="selectName" placeholder="用户名称"></el-input>
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
        prop="avatarUrl"
        label="用户头像"
        width="120">
        <!-- 图片的显示 -->
        <template   slot-scope="scope">
          <img :src="scope.row.avatarUrl"  min-width="70" height="70" />
        </template>
      </el-table-column>
      <el-table-column
        prop="buyerName"
        label="用户昵称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="openId"
        label="openid"
        width="120">
      </el-table-column>
      <el-table-column
        prop="buyerGender"
        label="性别"
        width="120">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.buyerGender === 1 ? 'primary' : 'success'"
            close-transition>{{scope.row.buyerGender === 1 ? '男' : '女'}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="buyerCountry"
        label="省市区"
        width="240">
        <template slot-scope="scope">
          <el-tag
            close-transition>{{scope.row.buyerProvince}}-{{scope.row.buyerCity}}
          </el-tag>
        </template>
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
            type="text"
            size="small">
            查看
          </el-button>
          <el-button
            type="text"
            size="small">
            编辑
          </el-button>
          <el-button
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
    name: 'BuyerList',
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
        this.$api.getBuyerInfoListByPage({'currentPage':that.currentPage,'pageSize':that.pageSize,'selectName':that.selectName},
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
    }
  }
</script>

<style scoped>
  .pagination-content{
    display: flex;
    justify-content: center;
  }
</style>
