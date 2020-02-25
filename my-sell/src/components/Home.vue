<template>
  <div id="app">
    <el-container>
      <el-header style="margin-bottom: 8px;">
        <div class="header-content">
          <div class="header-logo"><img src="./../assets/logo.png" style="width: 170px;height: 60px;"></div>
          <div class="header-right">
            <!--<img src=""/>-->
            <span class="username">欢迎光临：{{sellerName}}</span>
            <div class="el-btn"><el-button size="small" type="danger"  @click="logout">登出</el-button></div>
          </div>
        </div>
      </el-header>
      <el-container >
        <el-aside width="200px" height="100%;">

          <el-row>
            <el-col>
              <el-menu
                :default-active="$route.path"
                :router="true"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose">

                <el-menu-item index="/home">
                  <i class="el-icon-document"></i>
                  <span slot="title">首页</span>
                </el-menu-item>

                <el-submenu index="1">
                  <template slot="title">
                    <i class="el-icon-goods"></i>
                    <span>商品管理</span>
                  </template>
                  <el-menu-item index="/home/admin/product/list">商品列表</el-menu-item>
                  <el-menu-item index="/home/admin/productCategory/list">类目列表</el-menu-item>
                </el-submenu>

                <el-submenu index="2">
                  <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>订单管理</span>
                  </template>
                  <el-menu-item index="/home/admin/order/OrderList">订单列表</el-menu-item>
                </el-submenu>

                <el-submenu index="3">
                  <template slot="title">
                    <i class="el-icon-location-outline"></i>
                    <span>用户管理</span>
                  </template>
                  <el-menu-item index="/home/admin/buyer/BuyerList">用户列表</el-menu-item>
                </el-submenu>

                <el-submenu index="4">
                  <template slot="title">
                    <i class="el-icon-edit-outline"></i>
                    <span>商品评价管理</span>
                  </template>
                  <el-menu-item index="/home/admin/productReview/ProductReviewList">商品评价列表</el-menu-item>
                </el-submenu>

                <el-submenu index="5">
                  <template slot="title">
                    <i class="el-icon-edit-outline"></i>
                    <span>广告栏管理</span>
                  </template>
                  <el-menu-item index="/home/admin/banner/BannerList">广告栏列表</el-menu-item>
                </el-submenu>

              </el-menu>
            </el-col>
          </el-row>

        </el-aside>
        <el-container>
          <el-main>
            <!-- 内容出口 --->
            <router-view/>

          </el-main>
        </el-container>
      </el-container>
    </el-container>
    <audio id="notice" loop="loop">
      <source src="./../assets/mp3/song.mp3" type="audio/mpeg" />
    </audio>
  </div>
</template>

<script>

  import configs from '../api/config.js'

  import WebsocketHeartbeatJs from 'websocket-heartbeat-js';

  export default {
    name: 'Home',
    data(){
      return{
        activeName: 'first',
        sellerName: this.$store.getters.sellerName,
        socketPath: configs.socketPath
      }
    },
    destroyed () {
      // 销毁监听
      // this.socket.onclose = this.close
    },

    mounted() {
      let that = this ;

      let params =  this.$route.params.loginInfo;
      if (params !== undefined && params !== 'undefined' && params !== null){

        let loginInfo = JSON.parse(params) ;
        that.$store.commit('user/SETUSERINFO', loginInfo);
      }

      //初始化websocket
      this.init();

      let isLogin = that.$store.getters.isLogin;
      console.log("isLogin="+ isLogin)
      if (isLogin === '0'){
        that.$message.success('返回登录页面')
        that.$router.push({name: 'Login'});
      }
    },
    methods: {
      init(){
        let that = this ;
        let websocketHeartbeatJs = new WebsocketHeartbeatJs({
          url: that.socketPath
        });
        websocketHeartbeatJs.onopen = function () {
          console.log('connect success');
          websocketHeartbeatJs.send('hello server');
        }
        websocketHeartbeatJs.onmessage = function (e) {
          console.log(`onmessage: ${e.data}`);
          that.aplayAudio();//播放
          that.$notify({
            title: '提醒',
            message: '你有新的订单，请及时处理',
            type: 'success',
            duration: 4500,
            onClose: function () {
              that.pasueAudio();
            },
            onClick:  function () {
              that.pasueAudio();
            }
          });
        }
        websocketHeartbeatJs.onreconnect = function () {
          console.log('reconnecting...');
        }
      },
      // 语音播放
      aplayAudio () {
        const audio = document.getElementById('notice')
        audio.play()
      },
      pasueAudio(){
        const audio = document.getElementById('notice')
        audio.pause()
      },
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
        //this.$route.path -> 表示当前的路由地址
        //console.log(this.$route.path);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      logout(){
        let that = this ;
        this.$api.sellerLogout(
          success=>{
            that.$message.success("登出成功")
            that.$store.commit('user/CLEARUSERINFO');
            that.$router.push({name: 'Login'});
          },
          fail=>{
            that.$message.error(fail.message)
          });
      }
    }
  }
</script>

<style>
  #app {
    margin: 0;
    padding: 0;
  }
  body{
    margin: 0;
    padding: 0;
  }

  body .el-table th.gutter{
    display: table-cell!important;
  }

  .header-content{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    box-shadow:0 2px 3px -1px #EBEEF5;
  }
  .header-right{
    margin-left: auto;
    display: flex;
    align-items: center;

  }
  .username{
    margin-right: 10px;
  }
  .el-header{
    padding: 0;
  }
  .el-btn{
    margin-right: 30px;
  }
</style>
