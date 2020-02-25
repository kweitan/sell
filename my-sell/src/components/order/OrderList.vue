<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-left: 10px;font-size: 12px;">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="height: 15px;"></div>

    <!--<div style="display: flex; height: 32px;">-->
      <!--<el-button type="primary" size="small" @click="inputWaybill">批量填写运单号</el-button>-->
      <!--&lt;!&ndash;<el-button type="primary" size="small" style="margin-left: 10px;">批量删除</el-button>&ndash;&gt;-->
      <!--<el-form :inline="true"  class="demo-form-inline" size="small" style="margin-left: 10px;">-->
        <!--<el-form-item>-->
          <!--<el-input v-model="selectName" placeholder="订单编号"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item>-->
          <!--<el-button type="primary" @click="searche">查询</el-button>-->
        <!--</el-form-item>-->
      <!--</el-form>-->
    <!--</div>-->
    <!--<div style="height: 15px;"></div>-->

    <el-tabs type="border-card" @tab-click="handleClick"  v-model="searchType">
      <el-tab-pane label="全部" name="ALL"><order-table v-if="searchType === 'ALL'" :search-type="searchType"></order-table></el-tab-pane>
      <el-tab-pane label="待支付" name="WAIT"><order-table v-if="searchType === 'WAIT'" :search-type="searchType"></order-table></el-tab-pane>
      <el-tab-pane label="待发货" name="SUCCESS"><order-table v-if="searchType === 'SUCCESS'" :search-type="searchType"></order-table></el-tab-pane>
      <el-tab-pane label="待收货" name="SHIPMENT"><order-table v-if="searchType === 'SHIPMENT'" :search-type="searchType"></order-table></el-tab-pane>
      <el-tab-pane label="待退款" name="REFUND"><order-table v-if="searchType === 'REFUND'" :search-type="searchType"></order-table></el-tab-pane><!-- 客户申请退款 待审核 -->
      <el-tab-pane label="已完成" name="FINISHED"><order-table v-if="searchType === 'FINISHED'" :search-type="searchType"></order-table></el-tab-pane>
      <el-tab-pane label="已取消" name="CANCEL"><order-table v-if="searchType === 'CANCEL'" :search-type="searchType"></order-table></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import OrderTable from '@/components/order/OrderTable'

  export default {
    name: 'OrderList',
    components:{
      'order-table': OrderTable
    },
    data () {
      return {
        msg: 'OrderList',
        currentIndex: 0,
        searchType:'ALL'
      }
    },

    mounted(){
      console.log("进入order")
      // this.$api.findAllOrderList("");
    },

    methods: {
      /*
       * tab 切换
       */
      handleClick(tab, event) {
        // console.log(tab, event);
        if (this.currentIndex === tab.index) {
          return;
        }
        console.log(tab)
        console.log("name="+tab.name);
        console.log("label="+tab.label);
        console.log("index="+tab.index);
        this.currentIndex = tab.index ;

        this.searchType = tab.name ;

        // console.log("event="+event)
      },

      /*
       *搜索
       */
      searche(){

      },

      /*
      * 填写运单号
       */
      inputWaybill(){

      }

    }
  }
</script>

<style scoped>

</style>
