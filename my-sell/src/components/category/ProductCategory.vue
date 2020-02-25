<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-left: 10px;font-size: 12px;">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>类目列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="height: 15px;"></div>

    <div style="display: flex; height: 32px;">
      <el-button type="primary" size="small" @click="addProductCategory">增加类目</el-button>
      <!--<el-button type="primary" size="small" style="margin-left: 10px;">批量删除</el-button>-->
      <el-form :inline="true"  class="demo-form-inline" size="small" style="margin-left: 10px;">
        <el-form-item>
          <el-input v-model="selectName" placeholder="类目名称"></el-input>
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
        prop="sequenceId"
        label="序列号"
        width="60">
      </el-table-column>
      <el-table-column
        prop="categoryName"
        label="类目名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="categoryNumber"
        label="类目编码"
        width="140">
      </el-table-column>
      <el-table-column
        prop="belongIndex"
        label="是否首页展示"
        width="120">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.belongIndex === 1 ? 'primary' : 'success'"
            close-transition>{{scope.row.belongIndex === 1 ? '是' : '否'}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="categoryIcon"
        label="类目图标"
        width="120">
        <!-- 图片的显示 -->
        <template   slot-scope="scope">
          <img :src="baseUrl+scope.row.categoryIcon"  min-width="80" height="80" />
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
        width="360">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="moveCategory(scope.$index, scope.row,1)"
            size="mini">
            上移
          </el-button>
          <el-button
            @click.native.prevent="moveCategory(scope.$index, scope.row,0)"
            size="mini">
            下移
          </el-button>
          <el-button
            @click.native.prevent="lookupRow(scope.$index, scope.row)"
            size="mini">
            查看
          </el-button>
          <el-button
            @click.native.prevent="editorRow(scope.$index, scope.row)"
            size="mini" >
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
    name: 'ProductCategory',
    methods: {
      //增加商品类目
      addProductCategory: function(){
        this.$router.push({name: 'AddProductCategory'});
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
          let hashNumber = rows.goodHashNumber;
          let categoryNumber = rows.categoryNumber ;
          //组装成传参数据
          let params = {
            'hashNumber': hashNumber,
            'categoryNumber': categoryNumber
          }
          that.$api.deleteCategoryByNumber(params,
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
            },'')
        }).catch(() => {

        });
      },

      //上移 下移
      moveCategory(index, rows,type){
        let that = this ;
        let hashNumber = rows.goodHashNumber;
        let categoryNumber = rows.categoryNumber ;
        //组装成传参数据
        let params = {
          'hashNumber': hashNumber,
          'categoryNumber': categoryNumber,
          'type': type
        }
        this.$api.moveCategoryInfo(params,
          success=>{
            if (type === 1){
              let tempId = that.tableData[index].sequenceId ;
              that.tableData[index].sequenceId = that.tableData[index - 1].sequenceId;
              that.tableData[index - 1].sequenceId = tempId;

              let temp = that.tableData[index - 1] ;
              that.$set(that.tableData,index - 1,that.tableData[index]);
              that.$set(that.tableData,index ,temp);
            } else {
              let tempId = that.tableData[index].sequenceId ;
              that.tableData[index].sequenceId = that.tableData[index + 1].sequenceId;
              that.tableData[index + 1].sequenceId = tempId;

              let temp = that.tableData[index + 1] ;
              that.$set(that.tableData,index + 1,that.tableData[index]);
              that.$set(that.tableData,index,temp);
            }
          },
          fail=>{
            that.$message.error(fail.message)
          },'')
      },
      lookupRow(index, rows) {
        console.log("查看");
        console.log("index="+index);
        console.log("rows="+rows);
        //rows.splice(index, 1);
        let hashNumber = rows.goodHashNumber;
        let categoryNumber = rows.categoryNumber ;
        //组装成传参数据
        let params = {
          'hashNumber': hashNumber,
          'categoryNumber': categoryNumber
        }

        this.$router.push({ name: 'ViewProductCategory', params: params});
      },
      editorRow(index, rows) {
        console.log("编辑");
        console.log("index="+index);
        console.log("rows="+JSON.stringify(rows));
        this.$router.push({ name: 'EditProductCategory', params: {'categoryInfo': JSON.stringify(rows)}});
        //rows.splice(index, 1);
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
      getData() {
        let that = this;
        this.$api.getCategoryInfoListByPage({'currentPage':that.currentPage,'pageSize':that.pageSize,'selectName':that.selectName},
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

        this.getData();
      }
    },
    data() {
      return {
        currentPage: 1, //默认显示页面为1
        pageSize: 5, //    每页的数据条数
        tableData: [],
        totalSize: this.currentPage*this.pageSize,
        multipleSelection: [],
        dialogVisible: false,
        loading: true,
        selectName: '',
        baseUrl: configs.baseRootUrl
      }
    },
    mounted() {
      this.getData();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .pagination-content{
    display: flex;
    justify-content: center;
  }
</style>
