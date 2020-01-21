<template>
  <div id="app">
    <el-container>
      <el-header style="background-color: #2E3A4E;">
        LOGO
      </el-header>
      <el-container>
        <el-aside width="200px" height="100%;">

          <el-row>
            <el-col>
              <el-menu
                :default-active="$route.path"
                :router="true"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose">

                <el-menu-item index="/">
                  <i class="el-icon-document"></i>
                  <span slot="title">首页</span>
                </el-menu-item>

                <el-submenu index="1">
                  <template slot="title">
                    <i class="el-icon-goods"></i>
                    <span>商品管理</span>
                  </template>
                    <el-menu-item index="/admin/product/list">商品列表</el-menu-item>
                    <el-menu-item index="/admin/productCategory/list">类目列表</el-menu-item>
                </el-submenu>

                <el-submenu index="2">
                  <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>订单管理</span>
                  </template>
                    <el-menu-item index="2-1">订单列表</el-menu-item>
                </el-submenu>

                <el-submenu index="3">
                  <template slot="title">
                    <i class="el-icon-location-outline"></i>
                    <span>用户管理</span>
                  </template>
                    <el-menu-item index="3-1">用户列表</el-menu-item>
                </el-submenu>

                <el-submenu index="4">
                  <template slot="title">
                    <i class="el-icon-edit-outline"></i>
                    <span>评价管理</span>
                  </template>
                    <el-menu-item index="4-1">评价列表</el-menu-item>
                </el-submenu>

              </el-menu>
            </el-col>
          </el-row>

        </el-aside>
        <el-container>
          <el-main>

                <router-view/>

          </el-main>
        </el-container>
      </el-container>
    </el-container>

  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return{
      activeName: 'first'
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
      //this.$route.path -> 表示当前的路由地址
      //console.log(this.$route.path);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
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
</style>
