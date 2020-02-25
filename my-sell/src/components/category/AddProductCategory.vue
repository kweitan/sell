<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 12px;">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>类目增加</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="height: 15px;"></div>
    <el-form ref="form" :model="goods" label-position="right" :rules="rules" label-width="110px">
      <el-form-item label="商品类目" prop="categoryName">
        <el-col :span="12">
        <el-input v-model="goods.categoryName" placeholder="请输入商品类目名称"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="是否在首页展示" >
        <el-col :span="12">
        <el-select v-model="goods.belongIndex" placeholder="请选择是否是首页" @change="showIndex">
          <el-option label="是" value="1"></el-option>
          <el-option label="否" value="0"></el-option>
        </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="首页商品小图">
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
          <img v-if="goods.categoryIcon" :src="baseUrl+goods.categoryIcon" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveForm('form')">保存</el-button>
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
        myHeaders: {
          adminToken: configs.adminToken
        },
        iconAction:configs.uploadPicUrl, //商品图片上传请求路劲
        isSave: false,
        baseUrl: configs.baseRootUrl,
        rules: {
          categoryName: [
            {required: true, message: '请输入商品类目名称', trigger: 'blur'},
            {max: 30, message: '最大30个字符', trigger: 'blur' },
            {min: 1, message: '最小1个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods:{
      goBack() {
        //返回列表
        this.$router.go(-1);
      },
      //首页展示
      showIndex(value){
        let that = this ;
        console.log("value="+value) ;
        if (value == 1){
          this.$api.countIndex(
            success=>{},
            fail=>{
              that.$message.error(fail.message);
            })
        }
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
        //res={"code":0,"message":"成功","data":["/resources/common/images/products/1581600705240686599.png"]}
        console.log("res="+JSON.stringify(res))
        //file={"status":"success","name":"星期六 1.png","size":40605,"percentage":100,"uid":1581600705217,
        // "raw":{"uid":1581600705217},"response":{"code":0,"message":"成功","data":["/resources/common/images/products/1581600705240686599.png"]}}
        console.log("file="+JSON.stringify(file))
        //this.imageUrl = URL.createObjectURL(file.raw);

        if (file.status == 'success'){
          let datas = file.response ;
          if (datas.code == 0) {
            this.goods.categoryIcon = datas.data[0];
            this.$message.success("图片上传成功");
          }else {
            console.log("上传图片失败")
            this.$message.error('上传图片失败');
          }
        }

      },
      //保存
      // saveForm(formName){
      //   let that = this ;
      //   this.$refs[formName].validate((valid) => {
      //     if (valid) {
      //       that.$message.success(success.message);
      //       that.isSave = true ;
      //       //返回商品列表
      //       that.$router.push({ name: 'ProductCategory', params: { }})
      //     } else {
      //       that.$message.error('error submit!!');
      //       return false;
      //     }
      //   });
      // },
      //保存
      saveForm(formName) {
        let that = this ;
        this.$refs[formName].validate((valid) => {
          if (valid) {

            if (that.goods.belongIndex == 1 && that.goods.categoryIcon == ''){
              that.$message.error("请选择小图");
              return false;
            }

            const loading = this.$loading({
              lock: true,
              text: '保存中...',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });

            //保存
            that.$api.saveCategory(JSON.stringify(that.goods),
              success=>{
                loading.close() ;
                that.$message.success(success.message);
                that.isSave = true ;
                //返回商品列表
                that.$router.push({ name: 'ProductCategory', params: { }})
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
      //重置
      resetForm(formName) {
        let that = this ;
        this.$confirm('此操作将重置内容, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.$refs[formName].resetFields();
          that.goods.categoryIcon = '';
          that.goods.belongIndex = '';
          this.$message({
            type: 'success',
            message: '已重置'
          });

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
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
