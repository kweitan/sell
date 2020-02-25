<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-left: 10px;font-size: 12px;">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="height: 15px;"></div>
    <div style="display: flex; height: 32px;">
      <el-button type="primary" size="small" @click="addProductInfo">增加商品</el-button>
      <!--<el-button type="primary" size="small" style="margin-left: 10px;">批量删除</el-button>-->
      <el-form :inline="true" class="demo-form-inline" size="small" style="margin-left: 10px;">
        <el-form-item>
          <el-input v-model="selectName" placeholder="商品名称"></el-input>
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
        width="70">
      </el-table-column>
      <el-table-column
        prop="goodStock"
        label="商品库存"
        width="70">
      </el-table-column>
      <el-table-column
        prop="goodDescription"
        label="商品描述"
        width="200">
      </el-table-column>
      <el-table-column
        prop="goodIcon"
        label="商品图标"
        width="100">
        <!-- 图片的显示 -->
        <template   slot-scope="scope">
          <img :src="baseUrl+scope.row.goodIcon"  min-width="70" height="70" />
        </template>
      </el-table-column>
      <el-table-column
        prop="goodStandard"
        label="商品规格"
        width="80">
      </el-table-column>
      <el-table-column
        prop="creator"
        label="创建者"
        width="80">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="150">
      </el-table-column>
      <el-table-column
        prop="updater"
        label="更新者"
        width="80">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="更新时间"
        width="140">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="320">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="moveProduct(scope.$index, scope.row,1)"
            type="text"
            size="small">
            上移
          </el-button>
          <el-button
            @click.native.prevent="moveProduct(scope.$index, scope.row,0)"
            type="text"
            size="small">
            下移
          </el-button>
          <el-button
            @click.native.prevent="onShelves(scope.$index, scope.row)"
            type="text"
            size="small"
          v-if="scope.row.goodStatus == 0?true:false">
            上架
          </el-button>
          <el-button
            @click.native.prevent="offTake(scope.$index, scope.row)"
            type="text"
            size="small"
          v-else>
            下架
          </el-button>
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

  </div>

</template>

<script>

  import configs from '../../api/config.js'

  export default {
    name: 'ProductInfo',

    methods: {
      //增加商品
      addProductInfo: function(){
        this.$router.push({name: 'ShowAddProduct'});
      },
      deleteRow(index, rows) {
        console.log("删除");
        console.log("index="+index);
        console.log("rows="+rows);
        //rows.splice(index, 1);

        let that = this ;
        this.$confirm('此操作将删除该商品, 是否继续?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //请求商品详情
          let goodHashNumber = rows.goodHashNumber;
          let goodNumber = rows.goodNumber ;
          //组装成传参数据
          let params = {
            'hashNumber': goodHashNumber,
            'productNumber': goodNumber
          }
          that.$api.deleteProductInfoByNumber(params,
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
      lookupRow(index, rows) {
        console.log("查看");
        console.log("index="+index);
        console.log("rows="+rows);
        console.log(JSON.stringify(rows))

        //请求商品详情
        let goodHashNumber = rows.goodHashNumber;
        let goodNumber = rows.goodNumber ;
        //组装成传参数据
        let params = {
          'hashNumber': goodHashNumber,
          'productNumber': goodNumber
        }
        let that = this ;
        //请求商品详情
        this.$api.getProductDetailInfoByProductNumber(params,
          success=>{
              //请求商品类目信息
              that.$api.getCategoryInfoByNumber(params,
                res =>{
                  that.$router.push({ name: 'ViewProductInfo', params: {
                    'productInfo': JSON.stringify(rows),'productDetailInfo': JSON.stringify(success.data),
                      'productCategoryList': JSON.stringify(res.data)
                  }})
                },
                error=>{
                  that.$message.error(error.message)
                }
              );


          },
          fail=>{
            that.$Message.error(fail.message)
          });




        // this.$router.push({ name: 'ViewProductInfo', params: { }})
        //rows.splice(index, 1);
      },
      //上架
      onShelves(index, rows){

        let that = this ;
        this.$confirm('此操作将上架该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //请求商品详情
          let goodHashNumber = rows.goodHashNumber;
          let goodNumber = rows.goodNumber ;
          //组装成传参数据
          let params = {
            'hashNumber': goodHashNumber,
            'productNumber': goodNumber
          }
          that.$api.upProductInfo(params,
            success=>{
              // rows.productStatus = 1;
              that.tableData[index].goodStatus = 1;
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

      //上移 下移 moveProduct
      moveProduct(index,rows,type){
        let that = this ;
        let goodHashNumber = rows.goodHashNumber;
        let goodNumber = rows.goodNumber ;
        //组装成传参数据
        let params = {
          'hashNumber': goodHashNumber,
          'productNumber': goodNumber,
          'type': type
        }
        //this.$set(list,index,row),其中list是我的table数据列表
        this.$api.moveProductInfo(params,
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
        })
      },

      //下架
      offTake(index, rows){
        // let that = this ;
        // this.$confirm('此操作将下架该商品, 是否继续?', '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //
        // }).catch(() => {
        //
        // });
        let that = this ;
        this.$confirm('此操作将下架该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
//请求商品详情
          let goodHashNumber = rows.goodHashNumber;
          let goodNumber = rows.goodNumber ;
          //组装成传参数据
          let params = {
            'hashNumber': goodHashNumber,
            'productNumber': goodNumber
          }

          that.$api.downProductInfo(params,
            success=>{
              console.log("success=*"+success)
              // rows.productStatus = 0;
              that.tableData[index].goodStatus = 0;
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
      editorRow(index, rows) {
        console.log("编辑");
        console.log("index="+index);
        console.log("rows="+rows);
        //rows.splice(index, 1);
        let goodHashNumber = rows.goodHashNumber;
        let goodNumber = rows.goodNumber ;
        //组装成传参数据
        let params = {
          'hashNumber': goodHashNumber,
          'productNumber': goodNumber
        }

        this.$router.push({ name: 'EditProductInfo', params: params})
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

        this.$api.selectProductList({'currentPage':that.currentPage,'pageSize':that.pageSize,'selectName':that.selectName},
          success=>{
            that.currentPage = success.currentPage;
            that.totalSize = success.totalSize;
            that.tableData = success.data;
            that.loading = false;
          },
          fail=>{
            console.log("error");
            that.$message('加载失败');
            that.loading = false;
            that.totalSize = 0;
          }
        );

        // axios.get('http://localhost:8090/hotsell/admin/product/list?currentPage='+this.currentPage+"&pagesize="+this.pagesize).then(response => {
        //   console.log(response.data);
        //   let res = response.data;
        //   if (res.code==0){
        //     that.currentPage = res.currentPage;
        //     that.totalSize = res.totalSize;
        //     that.tableData = res.data;
        //     that.loading = false;
        //   }
        //
        // }, response => {
        //   console.log("error");
        //   that.$message('加载失败');
        //   that.loading = false;
        //   that.totalSize = 0;
        // });
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
      goBack() {
        //返回列表
        this.$router.go(-1);
      }
    },
    data() {
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
        baseUrl: configs.baseRootUrl
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
