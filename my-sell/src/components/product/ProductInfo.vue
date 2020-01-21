<template>
  <div>
    <div style="height: 15px;"></div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-left: 10px;font-size: 12px;">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="height: 15px;"></div>
    <div style="display: flex; height: 32px;">
      <el-button type="primary" size="small" style="margin-left: 10px;">增加商品</el-button>
      <el-button type="primary" size="small" style="margin-left: 10px;">批量删除</el-button>
      <el-form :inline="true" :model="goods" class="demo-form-inline" size="small" style="margin-left: 10px;">
        <el-form-item>
          <el-input v-model="goods.goodName" placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div style="height: 15px;"></div>
    <el-table
      :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      style="width: 100%"
      max-height="360"
      stripe
      ref="checkTable"
      @selection-change="handleSelectionChange"
      size="small">
      <el-table-column
        type="selection"
        width="55"
      >
      </el-table-column>
      <el-table-column type="index" width="60" label="序号">
      </el-table-column>
      <el-table-column
        prop="goodNumber"
        label="商品编码"
        width="150">
      </el-table-column>
      <el-table-column
        prop="goodName"
        label="商品名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="goodPrice"
        label="商品价格"
        width="120">
      </el-table-column>
      <el-table-column
        prop="goodStock"
        label="商品库存"
        width="120">
      </el-table-column>
      <el-table-column
        prop="goodDescription"
        label="商品描述"
        width="300">
      </el-table-column>
      <el-table-column
        prop="goodIcon"
        label="商品图标"
        width="120">
        <!-- 图片的显示 -->
        <template   slot-scope="scope">
          <img :src="scope.row.goodIcon"  min-width="70" height="70" />
        </template>
      </el-table-column>
      <el-table-column
        prop="goodStandard"
        label="商品规格"
        width="120">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="160">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="lookupRow(scope.$index, tableData4)"
            type="text"
            size="small">
            查看
          </el-button>
          <el-button
            @click.native.prevent="editorRow(scope.$index, tableData4)"
            type="text"
            size="small">
            编辑
          </el-button>
          <el-button
            @click.native.prevent="deleteRow(scope.$index, tableData4)"
            type="text"
            size="small">
            删除
          </el-button>
        </template>

      </el-table-column>
    </el-table>
    <div style="height: 10px;"></div>
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

  </div>

</template>

<script>
  import axios from 'axios'
  export default {
    methods: {
      deleteRow(index, rows) {
        console.log("删除");
        console.log("index="+index);
        console.log("rows="+rows);
        //rows.splice(index, 1);
      },
      lookupRow(index, rows) {
        console.log("查看");
        console.log("index="+index);
        console.log("rows="+rows);
        //rows.splice(index, 1);
      },
      editorRow(index, rows) {
        console.log("编辑");
        console.log("index="+index);
        console.log("rows="+rows);
        //rows.splice(index, 1);
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
      getData() {
        let that = this;
        axios.get('http://localhost:8090/hotsell/wechat/product/list?currentPage='+this.currentPage+"&pagesize="+this.pagesize).then(response => {
          console.log(response.data);
          let res = response.data;
          if (res.code==0){
            that.currentPage = res.currentPage
            that.totalSize = res.totalSize;
            that.tableData = res.data;
          }

        }, response => {
          console.log("error");
        });
      },
      handleSelectionChange(val) {
        console.log("handleSelectionChange事件"+val);
        this.multipleSelection = val;
      },

      //商品查询
      onSubmit() {
        console.log('submit!');
      }
    },
    data() {
      return {
        currentPage: 1, //默认显示页面为1
        pagesize: 10, //    每页的数据条数
        tableData: [],
        totalSize: this.currentPage*this.pagesize,
        multipleSelection: [],
        goods: {
          goodName: ''
        }
      }
    },
    mounted() {
      this.getData();
    },
  }
</script>

<style scoped>

  .pagination-content{
    display: flex;
    justify-content: center;
  }

</style>
