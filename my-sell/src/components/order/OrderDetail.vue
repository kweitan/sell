<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-left: 10px;font-size: 12px;">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="height: 15px;"></div>
    <div class="order-content">
      <div class="user-border">
        <el-form ref="form" :model="orderInfo" label-width="120px">
          <el-row>
            <el-col :span="18">
              <el-form-item label="订单号：">
                <template >{{ orderInfo.orderNumber }}</template>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item label="支付方式：">
                <template >微信支付</template>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item label="微信交易单号：">
                <template >{{ orderInfo.transactionId }}</template>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item label="下单时间：">
                <template >{{ orderInfo.createTime }}</template>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item label="买家ID：">
                <template >{{ orderInfo.buyerId}}</template>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item label="订单状态：">
                <el-tag
                  close-transition>{{status}}
                </el-tag>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item label="收货人姓名：">
                <template >{{ orderInfo.buyerName }}</template>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item label="收货人电话：">
                <template >{{ orderInfo.buyerPhone }}</template>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="收货人地址：">
                <template >{{ orderInfo.buyerAddress }}</template>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item label="买家留言：">
                <el-tag
                  close-transition type='danger'>{{orderInfo.buyerMessage}}
                </el-tag>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item label="备注：">
                <el-button type="primary" size="small">修改备注</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

      </div>

      <div class="user-border border-right">
        <el-steps direction="vertical" :active="statusNumber" finish-status="success">
        <el-step title="等待支付"></el-step>
        <el-step title="等待发货"></el-step>
        <el-step title="等待收货"></el-step>
          <el-step title="订单已完成"></el-step>
      </el-steps></div>

    </div>


    <div style="height: 10px;">
    </div>

    <div>
      <el-table
        :data="orderInfo.orderDetailList"
        style="width: 100%">
        <el-table-column
          prop="productNumber"
          label="商品编码"
          sortable
          width="180">
        </el-table-column>
        <el-table-column
          prop="productName"
          label="商品名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="productPrice"
          label="商品单价"
          width="120">
        </el-table-column>
        <el-table-column
          prop="productQuantity"
          label="商品数量"
          width="120">
        </el-table-column>
        <el-table-column
          prop="productIcon"
          label="商品小图"
          width="180">
          <!-- 图片的显示 -->
          <template slot-scope="scope">
            <img :src="baseUrl+scope.row.productIcon"  min-width="120" height="70" />
          </template>
        </el-table-column>
        <el-table-column
          prop="productStandard"
          label="商品规格"
          width="180">
        </el-table-column>
        <el-table-column
          prop="productUnit"
          label="商品单位"
          width="180">
        </el-table-column>
        <el-table-column
          prop="productLabels"
          label="商品标签"
          width="280">
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px">
        <template>
          订单总金额：<span style="color: red;font-weight: bold;">{{orderInfo.orderAmount}}元</span>&nbsp;&nbsp;
        </template>
        <template>
          订单实付金额：<span style="color: red;font-weight: bold;">{{orderInfo.actAmount}}元</span>&nbsp;&nbsp;
        </template>
        <template>
          (满100元顺丰包邮)
        </template>

      </div>
      <div style="margin-top: 10px"></div>
      <el-button type="primary" size="small" @click="goBack()">返回</el-button>
        <div style="margin-top: 10px"></div>
    </div>
  </div>
</template>

<script>
  import configs from '../../api/config.js'
  import common from '../../utils/common.js'

  export default {
    name: 'OrderDetail',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App',
        orderInfo:{
          orderDetailList:[]
        },
        baseUrl: configs.baseRootUrl,
        status: '',
        statusNumber: 0
      }
    },
    mounted() {
      let that = this ;

      //页面切换传递过来的参数
      let orderNumber = this.$route.params.orderNumber ;
      let hashNumber = this.$route.params.hashNumber ;
      console.log("orderNumber="+orderNumber);
      console.log("hashNumber="+hashNumber);
      let tempObj = {
        'orderNumber': orderNumber,
        'hashNumber': hashNumber
      }
      //订单详情
      this.$api.selectOrderDetail(tempObj,
        success=>{
          let data = success.data ;
          that.orderInfo = data ;
          console.log("orderStatus="+that.orderInfo.orderStatus);
          console.log("payStatus="+that.orderInfo.payStatus);
          that.status = common.toStr(that.orderInfo.orderStatus,that.orderInfo.payStatus);
          that.statusNumber = common.toStatus(that.orderInfo.orderStatus,that.orderInfo.payStatus);
        },
        fail=>{
          that.$message.error(fail.message);
        });

    },
    methods:{
      goBack() {
        //返回列表
        this.$router.go(-1);
      }
    }
  }
</script>

<style scoped>
  .user-border{
    border: 1px solid #dddddd;
    padding: 15px;
    overflow: hidden;
    border-radius: 2px;
    width: 600px;
  }

  .el-form-item {
    margin-bottom: 0px;
  }

  .order-content{
    display: flex;
  }

  .border-right{
    margin-left: 10px;
    display: flex;
    justify-content: center;
  }
</style>
