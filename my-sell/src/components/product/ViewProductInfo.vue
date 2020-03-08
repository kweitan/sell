<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 12px;">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品查看</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="height: 15px;"></div>
    <el-form ref="productInfo" :model="productInfo" label-position="right" label-width="110px" size="small" disable>
      <el-form-item label="商品标题">
        <el-col :span="12">
          <el-input v-model="productInfo.goodName" placeholder="请输入商品标题"></el-input>
        </el-col>

      </el-form-item>
      <el-form-item label="商品类目" >
        <el-tag
          v-for="item in productCategoryList"
          :disable-transitions="false"
        >
          {{item.categoryName}}
        </el-tag>
        <!--<el-checkbox-group >-->
          <!--<el-checkbox v-for="item in productCategoryList" :label="item.categoryNumber+'&'+item.goodHashNumber" name="type">{{item.categoryName}}</el-checkbox>-->
        <!--</el-checkbox-group>-->
      </el-form-item>
      <el-form-item label="商品品牌">
        <el-col :span="8">
          <el-input v-model="productDetailInfo.productDetailField" placeholder="请输入商品品牌"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="商品小图">
          <img :src="baseUrl+productInfo.goodIcon" class="avatar">
      </el-form-item>
      <el-form-item label="商品明细图">
        <!--<img v-for="item in productDetailInfo.productDetailIcon" style="height: 180px;width: 180px;margin-right: 10px;" :src="baseUrl+item" >-->
        <el-upload
          disabled
          :action="iconAction"
          list-type="picture-card"
          accept="image/jpeg,image/jpg,image/png"
          :file-list="detailIcons"
          :limit="4"
        >
        </el-upload>
      </el-form-item>
      <el-form-item label="商品价格" >
        <el-col :span="8">
          <el-input maxlength="8" placeholder="请输入金额" oninput="value=value.replace(/[^\d.]/g,'')" type="number" step="0.01" v-model="productInfo.goodPrice"></el-input>
        </el-col>

      </el-form-item>
      <el-form-item label="商品库存" >
        <el-col :span="8">
          <el-input v-model="productInfo.goodStock" placeholder="请输入库存" maxlength="6" type="number"></el-input>
        </el-col>

      </el-form-item>
      <el-form-item label="商品规格">
        <el-col :span="12">
          <el-input v-model="productInfo.goodStandard" placeholder="请输入商品规格"></el-input>
        </el-col>

      </el-form-item>
      <el-form-item label="商品提示">
        <el-col :span="12">
          <el-input v-model="productInfo.goodTips" placeholder="请输入商品提示"></el-input>
        </el-col>

      </el-form-item>
      <el-form-item label="商品标签">
        <el-tag
          :key="tag"
          v-for="tag in dynamicTags"
          :disable-transitions="false"
          >
          {{tag}}
        </el-tag>

      </el-form-item>
      <el-form-item label="商品单位" prop="productUnit">
        <el-select v-model="productInfo.goodUnit" placeholder="请选择商品单位" disabled>
          <el-option label="斤" value="斤"></el-option>
          <el-option label="盒" value="盒"></el-option>
          <el-option label="件" value="件"></el-option>
          <el-option label="箱" value="箱"></el-option>
          <el-option label="个" value="个"></el-option>
          <el-option label="只" value="只"></el-option>
          <el-option label="条" value="条"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="商品简单描述" >
        <el-col :span="12">
          <el-input type="textarea" v-model="productInfo.goodDescription" placeholder="请输入商品描述，不超过50个字"></el-input>
        </el-col>

      </el-form-item>

      <el-form-item label="商品详细描述" prop="productDetailDesc">

        <el-col :span="18">
          <quill-editor ref="myTextEditor" v-model="productDetailInfo.productDetailDescription" class="myQuillEditor" />
        </el-col>
      </el-form-item>

      <el-form-item>
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
        productInfo:{},
        productDetailInfo:{},
        dynamicTags:[],
        productCategoryList:[],
        baseUrl: configs.baseRootUrl,
        detailIcons:[],
        iconAction:configs.uploadPicUrl, //商品图片上传请求路劲
      }
    },

    /**
     * 计算属性
     * **/
    mounted() {
      //页面切换传递过来的参数
      //console.log(this.$route.params.id, this.id)
      console.log("productInfo="+this.$route.params.productInfo);

      let productInfo = JSON.parse(this.$route.params.productInfo) ;

      this.productInfo = productInfo ;

      // console.log("goodLabels="+productInfo.goodLabels)
      let arrs = productInfo.goodLabels.split("*") ;
      // console.log("goodLabels="+arrs[0])
      this.dynamicTags = arrs ;

      console.log("productDetailInfo="+this.$route.params.productDetailInfo);
      let productDetailInfo = JSON.parse(this.$route.params.productDetailInfo) ;

      let detailIconArrs = productDetailInfo.productDetailIcon.split("&") ;
      let len = detailIconArrs.length;
      for (let i=0;i < len;i++){
        let obj = {
          'name': i,
          'url': this.baseUrl+detailIconArrs[i]
        }
        this.detailIcons.push(obj);
      }

      productDetailInfo.productDetailIcon = detailIconArrs ;

      this.productDetailInfo = productDetailInfo ;
      // this.productDetailInfo.productDetailIcon

      console.log("productCategoryList="+this.$route.params.productCategoryList);
      let productCategoryList = JSON.parse(this.$route.params.productCategoryList) ;
      this.productCategoryList = productCategoryList ;

    },

    /**
     * 当前页面销毁
     */
    destroyed() {
    },


    created: function(){

    },

    methods: {
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
