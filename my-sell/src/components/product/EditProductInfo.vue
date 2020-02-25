<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 12px;">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品编辑</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="height: 15px;"></div>
    <el-form ref="goods" :model="goods" label-position="right" :rules="rules" label-width="110px" size="small">
      <el-form-item label="商品标题" prop="productName">
        <el-col :span="12">
          <el-input v-model="goods.productName" placeholder="请输入商品标题"></el-input>
        </el-col>

      </el-form-item>
      <el-form-item label="商品类目" prop="categoryArrs">
        <el-checkbox-group v-model="goods.categoryArrs">
          <el-checkbox v-for="item in categoryList" :label="item.categoryNumber+'&'+item.goodHashNumber" name="type">{{item.categoryName}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="商品品牌" prop="productDetailField">
        <el-col :span="8">
          <el-select v-model="goods.productDetailField" placeholder="请选择商品品牌">
            <el-option v-for="item in logos" :label="item.value" :value="item.value" :key="item.value"></el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="商品小图">
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
          <img v-if="goods.productIcon" :src="baseUrl+goods.productIcon" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="商品明细图">
        <el-upload
          :headers="myHeaders"
          :action='iconAction'
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handlePictureCardSuccess"
          accept="image/jpeg,image/jpg,image/png"
          :limit="4"
          :file-list="productDetailIconArr"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" size="tiny">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="商品价格" prop="productPrice">
        <el-col :span="8">
          <el-input maxlength="8" placeholder="请输入金额" oninput="value=value.replace(/[^\d.]/g,'')" type="number" step="0.01" v-model="goods.productPrice"></el-input>
        </el-col>

      </el-form-item>
      <el-form-item label="商品库存" prop="productStock">
        <el-col :span="8">
          <el-input v-model="goods.productStock" placeholder="请输入库存" maxlength="6" type="number"></el-input>
        </el-col>

      </el-form-item>
      <el-form-item label="商品规格" prop="productStandard">
        <el-col :span="12">
          <el-input v-model="goods.productStandard" placeholder="请输入商品规格"></el-input>
        </el-col>

      </el-form-item>
      <el-form-item label="商品提示" prop="productTips">
        <el-col :span="12">
          <el-input v-model="goods.productTips" placeholder="请输入商品提示"></el-input>
        </el-col>

      </el-form-item>
      <el-form-item label="商品标签" prop="productLabels">
        <el-tag
          :key="tag"
          v-for="tag in dynamicTags"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)">
          {{tag}}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"

        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput" style="margin-left: 0;">+ 增加标签</el-button>

      </el-form-item>
      <el-form-item label="商品单位" prop="productUnit">
        <el-select v-model="goods.productUnit" placeholder="请选择商品单位">
          <el-option label="斤" value="斤"></el-option>
          <el-option label="盒" value="盒"></el-option>
          <el-option label="件" value="件"></el-option>
          <el-option label="箱" value="箱"></el-option>
          <el-option label="个" value="个"></el-option>
          <el-option label="只" value="只"></el-option>
          <el-option label="条" value="条"></el-option>
          <el-option label="份" value="份"></el-option>
          <el-option label="袋" value="袋"></el-option>
          <el-option label="包" value="包"></el-option>
          <el-option label="支" value="支"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="商品简单描述" prop="productDesc">
        <el-col :span="12">
          <el-input type="textarea" v-model="goods.productDesc" placeholder="请输入商品描述，不超过50个字" maxlength="50"></el-input>
        </el-col>

      </el-form-item>

      <el-form-item label="商品详细描述" prop="productDetailDesc">

        <el-col :span="18">
          <quill-editor ref="myTextEditor" v-model="goods.productDetailDesc" class="myQuillEditor" :options="myQuillEditor" />
        </el-col>
      </el-form-item>

      <el-form-item>
        <!--<el-button type="primary" @click="submitForm('goods')">保存</el-button> -->
        <el-button type="primary" @click="updateForm('goods')">保存</el-button>
        <el-button type="primary" @click="goBack()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  /**
   * 导入组件 JS CSS
   */
  import { quillEditor } from 'vue-quill-editor'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'

  import configs from '../../api/config.js'

  import quillConfig from '../../utils/quill-config'

  export default {
    /**
     * 引用组件
     */
    components: {
      quillEditor
    },

    /**
     * 当前数据对象
     */
    data() {
      return {
        goods: {
          productName: '', //商品名称
          productPrice: '', //商品价格
          productStock: '', //商品库存
          productStandard: '', //商品规格
          productTips: '', //商品提示
          productLabels: '', //商品标签
          productUnit: '', //商品单位
          productDesc: '', //商品简单描述
          productNumber:'',
          hashNumber: '',
          productDetailField: '', //商品属性
          categoryArrs: [], //类目编码数组
          categoryNewArrs:{},
          productDetailIcon: '', //商品明细图
          productIcon: '', //商品小图 控制1M以内
          productDetailDesc: '' //商品详细描述
        },
        myHeaders: {
          adminToken: configs.adminToken
        },
        showReturnVisible: true,
        dialogVisible: false,
        dialogImageUrl: '',
        dynamicTags: [], //商品标签
        inputVisible: false,
        inputValue: '',
        // editorOption: {},
        categoryList: {}, //商品类目对象数组
        iconAction:configs.uploadPicUrl, //商品图片上传请求路劲
        myQuillEditor: quillConfig,
        baseUrl: configs.baseRootUrl,
        productDetailIconArr:[],
        detailIcons:[],
        logos:[
          {'name':'品牌','value':'每时美味生鲜'}
        ],
        //表单数据校验规则
        rules:{
          productName :[
            {required: true, message: '请输入商品标题', trigger: 'blur'},
            {max: 50, message: '最大50个字符', trigger: 'blur' },
            {min: 6, message: '最小6个字符', trigger: 'blur' }
          ],
          categoryArrs: [
            { type: 'array', required: true, message: '请至少商品类目', trigger: 'change' }
          ],
          productPrice: [
            { required: true, message: '商品价格不能为空'}
          ],
          productStock: [
            { required: true, message: '商品库存不能为空'}
          ],
          productStandard: [
            { required: true, message: '请输入商品规格', trigger: 'blur' }
          ],
          productDetailField: [
            { required: true, message: '请输入商品品牌', trigger: 'blur' }
          ],
          productTips: [
            { required: true, message: '请输入商品提示', trigger: 'blur' }
          ],
          productUnit: [
            { required: true, message: '请至少选择一个商品单位', trigger: 'change' }
          ],
          productDesc: [
            { required: true, message: '请输入简单描述', trigger: 'blur' }
          ]

        },
      }
    },

    /**
     * 信息未保存时 提示保存信
     * **/
    beforeRouteLeave (to, from, next) {

      /**
       * 复选框测试数据
       */
      // console.log("长度："+this.goods.categoryArrs.length)
      // for (let i =0;i<this.goods.categoryArrs.length;i++) {
      //   console.log("复选框值位="+this.goods.categoryArrs[i]);
      // }

      if (this.showReturnVisible){
        this.$confirm('当前页面数据未保存，确定要离开?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          next() ;
        }).catch(() => {
          next(false);
        });
      } else{
        next() ;
      }


    },

    /**
     * 计算属性
     * **/
    mounted() {
      let that = this ;

      //获取所有分类
      this.getCategoryData() ;

      //页面切换传递过来的参数
      let productNumber = this.$route.params.productNumber ;
      let hashNumber = this.$route.params.hashNumber ;
      console.log("productNumber="+productNumber);
      console.log("hashNumber="+hashNumber);
      let tempObj = {
        'productNumber': productNumber,
        'hashNumber': hashNumber
      }

      //商品
      this.$api.getProductAndDetailInfoByNumber(tempObj,
      success=>{
        let data = success.data ;
        console.log("goods="+JSON.stringify(data))
        let tags = data.goodLabels.split("*");
        that.dynamicTags = tags ;

        that.goods.productName = data.goodName;
        that.goods.productPrice = data.goodPrice;
        that.goods.productStock = data.goodStock;
        that.goods.productStandard =data.goodStandard;
        that.goods.productTips = data.goodTips;
        that.goods.productUnit = data.goodUnit;
        that.goods.productDesc = data.goodDescription;
        that.goods.productNumber = productNumber;
        that.goods.hashNumber = hashNumber;
        that.goods.productIcon = data.goodIcon;
        that.goods.productDetailField =data.productDetailField;
        console.log()
        let arrs = data.productDetailIcon.split("&");
        let len = arrs.length;
        for (let i=0;i < len;i++){
          let obj = {
            'name': i,
            'url': that.baseUrl+arrs[i],
            'response':{'code':0,'message':'成功','data':[arrs[i]]
            }
          }
          that.productDetailIconArr.push(obj);
          that.detailIcons.push(obj);
        }
        that.goods.productDetailDesc =data.productDetailDescription;
      },
      fail=>{
        that.$message.error(fail.message);
      });


      //商品分类
      this.$api.getCategoryInfoByNumber(tempObj,
        success=>{
          // console.log("selectedCategoryList="+JSON.stringify(success.data))
          let selectedCategoryList = success.data ;
          let len = selectedCategoryList.length ;
          for (let i=0; i<len; i++){
            let obj = selectedCategoryList[i].categoryNumber+'&'+ selectedCategoryList[i].goodHashNumber;
            that.goods.categoryArrs.push(obj)
          }
          // console.log("that.goods.categoryArrs="+JSON.stringify(that.goods.categoryArrs))
        },
        fail=>{
          that.$message.error(fail.message);
        });


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

    /**
     * 当前页面销毁
     */
    destroyed() {
      window.onbeforeunload = null
    },


    created: function(){
      console.log("configs.uploadPicUrl="+ configs.uploadPicUrl)
      console.log("configs.testContent="+ configs.testContent)
      //this.iconAction = configs.uploadPicUrl ;
    },

    methods: {
      goBack() {
        //返回列表
        this.$confirm('当前页面数据未保存，确定要离开?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.showReturnVisible = false ;
          this.$router.go(-1);
        }).catch(() => {

        });

      },
      /**
       * 获取类目数据
       */
      getCategoryData(){
        let that = this ;
        this.$api.getAllCategoryInfoList(
          success=>{
            console.log("categoryList="+success.data);
            that.categoryList = success.data;
        },fail=>{
            console.log("error");
            that.$message.error(fail.message);
          });
      },
      /**
       * 提交保存
       * */
      updateForm(formName) {
        let that = this ;
        console.log('submit!');

        // 组装数据

        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(valid)

            let tmpStr = [];
            for (let j=0;j<that.detailIcons.length;j++){
              tmpStr.push(that.detailIcons[j].response.data[0])
            }
            if (tmpStr.length > 1) {
              that.goods.productDetailIcon = tmpStr.join("&");
            }else {
              that.goods.productDetailIcon = tmpStr.join("");
            }


            this.goods.productLabels = this.dynamicTags.join("*")
            // 组装数据
            let arrs = []
            for (let i=0;i < this.goods.categoryArrs.length; i++){
              let str = this.goods.categoryArrs[i].split("&") ;
              let categoryNumber = str[0];
              let goodHashNumber = str[1]
              let tempObj = {
                'categoryNumber': categoryNumber,
                'goodHashNumber': goodHashNumber
              }
              arrs.push(tempObj);
            }
            this.goods.categoryNewArrs = arrs ;
            let content = this.goods;
            console.log("提交内容为："+JSON.stringify(content)) ;
            that.$api.updateProductInfo(JSON.stringify(content),
              success=>{
                that.$message.success(success.message);
                that.showReturnVisible = false ;
                //返回商品列表
                that.$router.push({ name: 'ProductInfo', params: { }})
              },
              fail=>{
                that.$message.error(fail.message);
            });
          } else {
            that.$message.error('error submit!!');
            return false;
          }
        });
      },
      /**
       * 重置
       * **/
      resetForm(formName) {
        this.$refs[formName].resetFields();
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
            this.goods.productIcon = datas.data[0];
            this.$message.success("图片上传成功");
          }else {
            console.log("上传图片失败")
            this.$message.error('上传图片失败');
          }
        }

      },
      /**
       * 处理 商品明细图
       * **/
      handlePictureCardSuccess(res, file,fileList){
        console.log("res="+JSON.stringify(res))
        console.log("file="+JSON.stringify(file))
        console.log("fileList="+JSON.stringify(fileList))
        // console.log("productDetailIconArr="+JSON.stringify(this.productDetailIconArr))
        this.detailIcons = fileList;
        let arrNew=new Array();
        arrNew.push(this.goods.productDetailIcon);
        if (file.status == 'success'){
          let res = file.response ;
          if (res.code == 0){
            arrNew.push(res.data[0]);
            let icons = this.goods.productDetailIcon;
            if (icons.length > 0) {
              this.goods.productDetailIcon = arrNew.join("&");
            }else {
              this.goods.productDetailIcon = arrNew.join("");
            }
            this.$message.success(res.message);
            console.log("商品明细图:"+this.goods.productDetailIcon) ;
          } else{
            this.$message.error(res.message);
          }
        } else {
          this.$message.error("图像上传失败");
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

      handleRemove(file, fileList) {
        console.log(file, fileList);
        console.log("file="+JSON.stringify(file))
        console.log("fileList="+JSON.stringify(fileList))
        // console.log("productDetailIconArr="+JSON.stringify(this.productDetailIconArr))
        this.detailIcons = fileList;
      },

      /**
       * 放大预览商品明细图
       * @param file
       */
      handlePictureCardPreview(file) {
        console.log("card-file="+JSON.stringify(file));
        console.log("file.url="+file.url) ;
        /***
         * card-file={"status":"success","name":"2019-11-09_57.05.jpg","size":297911,"percentage":100,"uid":1581643612721,
         * "raw":{"uid":1581643612721},"url":"blob:http://localhost:8080/96825c59-e88b-4cc6-894a-29e3623a9a52",
         * "response":{"code":0,"message":"成功","data":["/images/products/4a21c153-b0ff-40e5-b179-2e9783bf21081581643613290903182.jpeg"]}}
         * @type {string|string}
         */
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
        //
        // let arrNew=new Array();
        // arrNew.push(this.goods.productDetailIcon);
        // if (file.status == 'success'){
        //   let res = file.response ;
        //   if (res.code == 0){
        //     arrNew.push(res.data[0]);
        //     this.goods.productDetailIcon = "&".join(arrNew)
        //     this.dialogImageUrl = file.url;
        //     this.dialogVisible = true;
        //     this.$message.error(res.message);
        //   } else{
        //     this.$message.error(res.message);
        //   }
        // } else {
        //   this.$message.error("图像上传失败");
        // }

      },

      /**
       * 商品标签 删除操作 保存
       */
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },

      /**
       * 商品标签 点击增加时 焦点聚集
       */
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      /**
       * 商品标签 增加操作 保存
       */
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.dynamicTags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
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
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

  .ql-container ql-snow{
    min-height: 200px !important;
  }
</style>
