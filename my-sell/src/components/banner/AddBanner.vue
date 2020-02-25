<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 12px;">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>广告栏管理</el-breadcrumb-item>
      <el-breadcrumb-item>广告栏增加</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="height: 15px;"></div>
    <el-form ref="form" :model="goods" label-position="right" :rules="rules" label-width="110px">
      <el-form-item label="广告栏名称" prop="bannerName">
        <el-col :span="12">
          <el-input v-model="goods.bannerName" placeholder="请输入广告栏名称"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="广告栏URL" >
        <el-col :span="18">
          <el-select v-model="goods.bannerUrl" placeholder="请选择广告栏URL" @change="showIndex">
            <el-option
              v-for="item in productList"
              :key="item.goodNumber"
              :label="item.goodName"
              :value="item.goodNumber">
              <span style="float: left">{{ item.goodName }}--</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.goodNumber }}</span>
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="广告栏小图">
        <el-upload
          :headers="myHeaders"
          class="avatar-uploader"
          :action='iconAction'
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          accept="image/jpeg,image/jpg,image/png"
          :limit="1"
        >
          <img v-if="goods.bannerIcon" :src="baseUrl+goods.bannerIcon" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveForm('form')">保存</el-button>
        <el-button type="primary" @click="goBack">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

  import configs from '../../api/config.js'

  export default {
    name: 'AddBanner',
    //信息未保存时 提示保存信息
    beforeRouteLeave (to, from, next) {
      if(!this.isSave){
        this.$confirm('当前页面数据未保存，确定要离开?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          next() ;
        }).catch(() => {
          next(false);
        });
      }else {
        next() ;
      }
    },

    mounted() {
      window.onbeforeunload = function (e) {
        e = e || window.event;
        // 兼容IE8和Firefox 4之前的版本
        if (e) {
          e.returnValue = '关闭提示';
        }
        // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
        return '关闭提示';
      };

      this.getProductData();
    },
    destroyed() {
      window.onbeforeunload = null
    },
    data () {
      return {
        goods:{
          bannerName: '',
          bannerIcon: '',
          bannerUrl: ''
        } ,
        productList:[],
        myHeaders: {
          adminToken: configs.adminToken
        },
        iconAction:configs.uploadPicUrl, //商品图片上传请求路劲
        isSave: false,
        baseUrl: configs.baseRootUrl,
        rules: {
          bannerName: [
            {required: true, message: '请输入广告栏名称', trigger: 'blur'},
            {max: 30, message: '最大30个字符', trigger: 'blur' },
            {min: 1, message: '最小1个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods:{
      //首页展示
      showIndex(value){
        let that = this ;
        console.log("value="+value) ;
      },

      /**
       * 图像上传前的处理
       * **/
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG && !isPNG) {
          this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return (isJPG||isPNG) && isLt2M;
      },

      /**
       * 处理 商品小图
       * **/
      handleAvatarSuccess(res, file) {
        console.log("res="+JSON.stringify(res))
        console.log("file="+JSON.stringify(file))

        if (file.status == 'success'){
          let datas = file.response ;
          if (datas.code == 0) {
            this.goods.bannerIcon = datas.data[0];
            this.$message.success("图片上传成功");
          }else {
            console.log("上传图片失败")
            this.$message.error('上传图片失败');
          }
        }

      },
      //保存
      saveForm(formName) {
        let that = this ;
        this.$refs[formName].validate((valid) => {
          if (valid) {

            const loading = this.$loading({
              lock: true,
              text: '保存中...',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });

            //保存
            that.$api.saveBanner(JSON.stringify(that.goods),
              success=>{
                loading.close() ;
                that.$message.success(success.message);
                that.isSave = true ;
                //返回商品列表
                that.$router.push({ name: 'BannerList', params: { }})
              },
              fail=>{
                that.$message.error(fail.message);
                loading.close() ;
              })
          } else {
            that.$message.error('error submit!!');
            return false;
          }
        });
      },
      goBack() {
        //返回列表
        this.$router.go(-1);
      },
      getProductData() {
        let that = this;

        this.$api.selectProductList({'currentPage':1,'pagesize':10,'selectName':''},
          success=>{
            that.productList = success.data;
          },
          fail=>{
            console.log("error");
            that.$message('加载产品失败');
          });
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
