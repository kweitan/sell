<template>
  <div height="100%" width="100%" :class="isLogin === '1'?'login-true':'login-false'">
    <div class="login-content" >
      <div style="height: 60px;"></div>
      <div class="login-content-logo">中台服务</div>
      <div style="height: 10px;"></div>
      <div class="login-content-items">
        <div style="height: 60px;"></div>
        <el-input style="width: 350px;height: 48px;"
                  placeholder="请输入用户名"
                  v-model="username"
                  clearable>
        </el-input>
        <div class="dividing-line"></div>
        <el-input placeholder="请输入密码" v-model="password" show-password style="width: 350px;height: 48px;"></el-input>
        <div class="dividing-line"></div>
        <div class="verify-content" style="width: 350px;height: 48px;">
          <div class="image-code">

            <el-input style="width: 190px;height: 48px;display: flex;"
                      placeholder="请输入验证码"
                      v-model="verifyCode"
                      clearable>
            </el-input>
            <img class="refreshImages" :src="imageUrl" @click="changeImgCode"></img>
          </div>

        </div>
        <div style="height: 20px;"></div>
        <el-button type="primary" style="width: 350px;height: 36px;" :loading="isLoading" @click="login">登 录</el-button>

      </div>
      <div style="height: 440px;"></div>
    </div>
  </div>

</template>

<script>
  import configs from '../../api/config.js'

  export default {
    name: 'HelloWorld',
    data () {
      return {
        username: '',
        password: '',
        verifyCode:'',
        captcha: '',
        imageUrl: configs.verifyCodeUrl,
        isLoading: false
      }
    },
    created() {

    },
    computed:{
      isLogin(){
        return this.$store.getters.isLogin
      }
    },
    mounted() {
      console.log("-isLogin="+ this.isLogin)
    },
    methods:{
      // 点击图片修改图片src
      changeImgCode() {
        var num=Math.ceil(Math.random()*10);//生成一个随机数（防止缓存）
        this.imageUrl = configs.verifyCodeUrl + "?" + num;
        // console.log("this.imageUrl ="+this.imageUrl)

      },
      login(){
        let that = this ;
        that.isLoading = true ;
        let params = {
          'username': this.username,
          'password': this.password,
          'verifyCode': this.verifyCode
        }
        let str = JSON.stringify(params);
        // console.log("params="+str)

        this.$api.sellerLogin(str,
          success=>{
            that.$message.success("登录成功")
            let obj = success.data ;
            that.$router.push({name: 'Home', params: {'loginInfo': JSON.stringify(obj)}});


          },
          fail=>{
            that.$message.error(fail.message)
            that.isLoading = false ;
          });
      }
    }
  }
</script>

<style scoped>
  .login-content{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .login-true{
    background-color: #ffffff;
  }

  .login-false{
    background-color: #b8e5f8;
  }

  .login-content-items{
    width: 400px;
    height: 320px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #ffffff;
    border-radius: 5px;
  }

  .dividing-line{
    height: 1px;
    background-color: #409EFF;
    margin-top: 6px;
    margin-bottom: 6px;
  }

  .login-content-logo{
    font-size: 30px;
    color: #409EFF;
    font-weight: bold;
  }


  .verify-content{
    display: flex;
  }

  .refreshImages{
    position: absolute;
    top: -4px;
    left: 200px;
    height: 46px;
    width: 140px;
  }

  .image-code{
    position: relative;
    display: flex;
  }
</style>
