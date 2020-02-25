<template>
  <div id="app">
    <router-view/>
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
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  },
  watch: {

  },

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
