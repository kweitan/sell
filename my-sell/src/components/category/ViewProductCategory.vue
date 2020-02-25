<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 12px;">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>类目明细</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="height: 15px;"></div>
    <el-form ref="form" :model="goods" label-position="right" label-width="110px">
      <el-form-item label="商品类目" >
        <el-col :span="12">
        <el-input v-model="goods.categoryName" placeholder="请输入商品类目名称" disabled></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="是否在首页展示" >
        <el-col :span="6">
          <el-input v-model="goods.belongIndex==1?'是':'否'" placeholder="请选择是否是首页" disabled></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="首页商品小图">
          <img v-if="goods.categoryIcon" :src="baseUrl+goods.categoryIcon" class="avatar">
      </el-form-item>
      <el-form-item>
        <!--<el-button type="primary" @click="saveForm('form')">保存</el-button>-->
        <!--<el-button type="primary" @click="submitForm('form')">提交</el-button>-->
        <el-button type="primary" @click="goBack()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

  import configs from '../../api/config.js'

  export default {
    name: 'AddProductCategory',

    mounted() {
      let that = this ;
      let hashNumber = this.$route.params.hashNumber;
      let categoryNumber = this.$route.params.categoryNumber ;
      console.log("hashNumber="+hashNumber);
      console.log("categoryNumber="+categoryNumber);

      let tempObj = {
        'categoryNumber': categoryNumber,
        'hashNumber': hashNumber
      }
      this.$api.selectCategoryInfo(tempObj,
        success=>{
        that.goods = success.data ;
        },
      fail=>{
        that.$message.error(fail.message)
      })
    },
    destroyed() {
      window.onbeforeunload = null
    },
    data () {
      return {
        goods:{
          categoryName: '',
          belongIndex: '',
          categoryIcon: ''
        } ,
        iconAction:configs.uploadPicUrl, //商品图片上传请求路劲
        isSave: false,
        baseUrl: configs.baseRootUrl
      }
    },
    methods:{
      goBack() {
        //返回列表
        this.$router.go(-1);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .avatar-uploader >>> .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader >>> .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

</style>
