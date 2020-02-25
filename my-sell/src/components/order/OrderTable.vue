<template>
  <div>
    <div style="display: flex; height: 15px;">
      <!--<el-button v-if="searchType === 'SUCCESS'" type="primary" @click="inputWaybill" style="height: 34px;margin-right: 10px;">批量填写运单号</el-button>-->
      <!--<el-button type="primary" size="small" style="margin-left: 10px;">批量删除</el-button>-->
      <el-form :inline="true"  class="demo-form-inline" size="small" >
        <el-form-item>
          <el-input v-model="orderNumber" placeholder="订单编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchByOrderNumber">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="height: 30px;"></div>
    <el-table
      :data="orderList"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      stripe
      style="width: 100%"
      v-loading="loading"
      @selection-change="handleSelectionChange"
      min-height="720">
      <el-table-column
        type="selection"
        width="55"
      >
      </el-table-column>
      <el-table-column type="index" width="60" label="序号">
      </el-table-column>
      <el-table-column
        prop="orderNumber"
        label="订单编码"
        width="180">
      </el-table-column>
      <el-table-column
        prop="buyerId"
        label="买家OPENID"
        width="150">
      </el-table-column>
      <el-table-column
        prop="buyerName"
        label="收货人名字"
        width="120">
      </el-table-column>
      <el-table-column
        prop="buyerPhone"
        label="收货人电话"
        width="120">
      </el-table-column>
      <el-table-column
        prop="buyerAddress"
        label="收货人地址"
        width="220">
      </el-table-column>
      <el-table-column
        prop="orderAmount"
        label="订单金额"
        width="100">
        <template slot-scope="scope">
          <el-tag
            type="primary"
            close-transition>￥{{scope.row.orderAmount}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="actAmount"
        label="支付金额"
        width="100">
        <template slot-scope="scope">
          <el-tag
            type="danger"
            close-transition>￥{{scope.row.actAmount}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="订单状态"
        width="100">
        <template slot-scope="scope">
          <el-tag
            type="success"
            close-transition><span v-if="scope.row.payStatus === 'WAIT' && scope.row.orderStatus === 'NEW'">待支付</span>
            <span v-if="scope.row.payStatus === 'SUCCESS' && scope.row.orderStatus === 'NEW'">待发货</span>
            <span v-if="scope.row.payStatus === 'SUCCESS' && scope.row.orderStatus === 'SHIPMENT'">待收货</span>
            <span v-if="scope.row.payStatus === 'SUCCESS' && scope.row.orderStatus === 'REVIEW'">待评价</span>
            <span v-if="scope.row.payStatus === 'CLOSE' && scope.row.orderStatus === 'FINISHED'">已完成</span>
            <span v-if="scope.row.payStatus === 'CLOSE' && scope.row.orderStatus === 'CANCEL'">已取消</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="下单时间"
        width="180">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="220">
        <template slot-scope="scope">
          <el-button type="text" size="small"  @click.native.prevent="lookupRow(scope.$index, scope.row)">订单详情</el-button>
          <el-button type="text" size="small"  @click.native.prevent="amend(scope.$index, scope.row)" v-if="scope.row.payStatus === 'WAIT'">修改金额</el-button>
          <el-button type="text" size="small" v-if="scope.row.payStatus === 'SUCCESS' && scope.row.orderStatus === 'NEW'">填写运单号</el-button>
          <el-button type="text" size="small" v-if="scope.row.orderStatus === 'SHIPMENT' && scope.row.payStatus === 'SUCCESS'">确认收货</el-button>
          <el-button type="text" size="small" v-if="scope.row.payStatus === 'SUCCESS' && cope.row.orderStatus === 'NEW'">退款审批</el-button>
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

    <!--填写物流信息-->
    <el-dialog
      title="填写运单号"
      :visible.sync="shipmentVisible"
      width="20%"
      center>
      <el-select v-model="shipmentInfo.expressCorAbbreviation" placeholder="快递公司简称" >
        <el-option label="顺丰" value="SFEXPRESS"></el-option>
        <el-option label="EMS" value="EMS"></el-option>
        <el-option label="申通" value="STO"></el-option>
        <el-option label="圆通" value="YTO"></el-option>
        <el-option label="中通" value="ZTO"></el-option>
      </el-select>
      <div style="height: 5px;"></div>
      <el-input style="width: 300px;" v-model="shipmentInfo.expressCorName" placeholder="快递公司名称"></el-input>
      <div style="height: 5px;"></div>
      <el-input style="width: 300px;" v-model="shipmentInfo.trackingNumber" placeholder="填写运单号"></el-input>
      <div style="height: 5px;"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="shipmentVisible = false">取 消</el-button>
        <el-button type="primary" @click="shipmentVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!--修改付款金额-->
    <el-dialog
      title="修改付款金额"
      :visible.sync="modifyFeeVisible"
      center>
      <el-form ref="modifyFee" :model="modifyFee" label-position="right" label-width="180px">
        <el-form-item label="总金额" prop="totalMoifyFee">
          <el-col :span="12">
            <el-input v-model="totalMoifyFee" disabled></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="加减符号">
          <el-select v-model="modifyFee.symbol" placeholder="请选择加减符号" @change="modify">
            <el-option label="+" value="+"></el-option>
            <el-option label="-" value="-"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="加减金额" prop="actFee" >
          <el-col :span="12">
            <el-input v-model="modifyFee.actFee" @change="modifyMomey"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="最后实际付款金额" prop="actFee">
          <el-col :span="12">
            <el-input v-model="modifyFee.actPayFee" disabled></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyFeeVisible = false">取 消</el-button>
        <el-button type="primary" @click="makeModifyFee">确 定</el-button>
      </span>
    </el-dialog>

    <!--退款申请审批-->
    <el-dialog
      title="退款申请审批"
      :visible.sync="refundApplyVisible"
      width="20%"
      center>
      <el-select v-model="shipmentInfo.expressCorAbbreviation" placeholder="快递公司简称" >
        <el-option label="顺丰" value="SFEXPRESS"></el-option>
        <el-option label="EMS" value="EMS"></el-option>
        <el-option label="申通" value="STO"></el-option>
        <el-option label="圆通" value="YTO"></el-option>
        <el-option label="中通" value="ZTO"></el-option>
      </el-select>
      <div style="height: 5px;"></div>
      <el-input style="width: 300px;" v-model="shipmentInfo.expressCorName" placeholder="快递公司名称"></el-input>
      <div style="height: 5px;"></div>
      <el-input style="width: 300px;" v-model="shipmentInfo.trackingNumber" placeholder="填写运单号"></el-input>
      <div style="height: 5px;"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="refundApplyVisible = false">取 消</el-button>
        <el-button type="primary" @click="refundApplyVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>


</template>

<script>
  import common from '../../utils/common.js'

  export default {
    name: 'OrderTable',
    props:{
      searchType: String
    },
    data () {
      return {
        msg: '',
        currentPage: 1, //默认显示页面为1
        pageSize: 10, //    每页的数据条数
        orderList: [],
        totalSize: this.currentPage*this.pageSize,
        orderNumber:'',
        loading: true,
        shipmentVisible: false,
        modifyFeeVisible: false,
        refundApplyVisible: false,
        status: '',
        shipmentInfo:{
          expressCorName: '',
          expressCorAbbreviation: '',
          trackingNumber: ''
        },
        modifyFee:{
          symbol: '+',
          actPayFee: 0.00,
          actFee: 0.00,
          orderNumber: '',
          hashNumber: ''
        },
        totalMoifyFee: 0.00,
        currentRow: 0

      }
    },
    methods: {
      //选择事件
      handleSelectionChange(val) {
        console.log("handleSelectionChange事件"+val);
        this.multipleSelection = val;
      },
      //填写运单号
      inputWaybill(){
        this.shipmentVisible = true ;
      },
      //搜索
      searchByOrderNumber(){

        this.getOrderData();
      },
      handleSizeChange(size) {
        this.pageSize = size;
        console.log(`每页 ${size} 条`);
        this.getOrderData();
      },
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage;
        console.log(`当前页: ${currentPage}`);
        this.getOrderData();
      },
      getOrderData(){
        let that = this;
        this.$api.findAllOrderList({'currentPage':that.currentPage,'pageSize':that.pageSize,'searchType':that.searchType,'orderNumber':that.orderNumber},
          success=>{
            that.currentPage = success.currentPage;
            that.totalSize = success.totalSize;
            // that.orderList = [];
            that.orderList = success.data;
            console.log("that.orderList"+that.orderList)
            that.loading = false;
          },
          fail=>{
            console.log("error");
            that.$message.error('加载失败');
            that.loading = false;
            that.totalSize = 0;
          });
      },
      lookupRow(index, rows) {
        console.log("查看");
        console.log("index="+index);
        console.log("rows="+rows);
        //rows.splice(index, 1);
        let hashNumber = rows.hashNumber;
        let orderNumber = rows.orderNumber ;
        //组装成传参数据
        let params = {
          'hashNumber': hashNumber,
          'orderNumber': orderNumber
        }

        this.$router.push({ name: 'OrderDetail', params: params});
      },
      amend(index, rows){
        this.totalMoifyFee = rows.orderAmount ;
        this.currentRow = index;
        this.modifyFee.actPayFee = 0 ;
        this.modifyFee.actFee = 0 ;
        this.modifyFeeVisible = true;
        console.log("查看");
        console.log("index="+index);
        console.log("rows="+rows);
        //rows.splice(index, 1);
        let hashNumber = rows.hashNumber;
        let orderNumber = rows.orderNumber ;
        this.modifyFee.orderNumber = orderNumber
        this.modifyFee.hashNumber = hashNumber;
        //组装成传参数据

      },
      makeModifyFee(){
        let that = this ;
        //修改金额按钮
        that.$api.modifyActPayFee(JSON.stringify(that.modifyFee),
          success=>{
            that.$message.success(success.message);
            that.orderList[that.currentRow].actAmount = that.modifyFee.actPayFee;
            //返回类目列表
            that.modifyFeeVisible = false
          },
          fail=>{
            that.$message.error(fail.message);
          });
      },
      modify(value){
        console.log("value=>this.modifyFee.actFee="+this.modifyFee.actFee)
        if (value == '+'){
          this.modifyFee.actPayFee = parseFloat(this.totalMoifyFee+parseFloat(this.modifyFee.actFee)).toFixed(2);

        } else {
          this.modifyFee.actPayFee = parseFloat(this.totalMoifyFee-parseFloat(this.modifyFee.actFee)).toFixed(2);
        }
      },
      modifyMomey(){
        let total = this.totalMoifyFee;
        console.log("this.modifyFee.actFee="+this.modifyFee.actFee)
        if (this.modifyFee.symbol == '+'){
          this.modifyFee.actPayFee = parseFloat(total+parseFloat(this.modifyFee.actFee)).toFixed(2);
        } else {
          this.modifyFee.actPayFee = parseFloat(total-parseFloat(this.modifyFee.actFee)).toFixed(2);
        }

      }
    },
    mounted() {
      console.log("拉取数据")
      //获取数据
      this.getOrderData();
    },
    computed: {

    }
  }
</script>

<style scoped>
  .pagination-content{
    display: flex;
    justify-content: center;
  }
</style>
