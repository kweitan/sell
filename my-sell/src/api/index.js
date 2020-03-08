import configs from './config'
import router from "../router"
import store from "../store"

// 配置API接口地址
// var root = 'http://7e51f1bac025ef32.natapp.cc/hotsell'
// 引用axios
var axios = require('axios')
// 自定义判断元素类型JS
function toType (obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
// 参数过滤函数
function filterNull (o) {
  for (var key in o) {
    if (o[key] === null) {
      delete o[key]
    }
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
    } else if (toType(o[key]) === 'object') {
      o[key] = filterNull(o[key])
    } else if (toType(o[key]) === 'array') {
      o[key] = filterNull(o[key])
    }
  }
  return o
}

/*
  接口处理函数
  这个函数每个项目都是不一样的，我现在调整的是适用于
  https://cnodejs.org/api/v1 的接口，如果是其他接口
  需要根据接口的参数进行调整。参考说明文档地址：
  主要是，不同的接口的成功标识和失败提示是不一致的。
  另外，不同的项目的处理方法也是不一致的，这里出错就是简单的alert
*/
function apiAxios (method, url, params, success, failure,adminToken) {
  let that = this ;
  if (params) {
    params = filterNull(params)
  }
  axios({
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? params : null,
    params: method === 'GET' || method === 'DELETE' ? params : null,
    baseURL: configs.baseRootUrl,
    headers: {'adminToken': adminToken === undefined?'':adminToken},
    withCredentials: false
  })
    .then(function (res) {
      if (res.data.code === 0) {
        if (success) {
          success(res.data)
        }
      }else if(res.data.code === 911){
        //调整登录界面
        router.push({name: 'Login'});
      } else {
        if (failure) {
          failure(res.data)
        } else {
          console.log('error: ' + JSON.stringify(res.data))
        }
      }
    })
    .catch(function (err) {
      let res = err.response
      if (err) {
        //window.alert('api error, HTTP CODE: ' + res.status)
        console.log("err="+err)
        alert(err);
        // console.log('api error, HTTP CODE: ' + res.code+';MESSAGE：'+ res.message)
      }
    })
}

function newPostAxios (method,url, params, success, failure) {
  let that = this ;
  axios({
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? params : null,
    params: method === 'GET' || method === 'DELETE' ? params : null,
    baseURL: configs.baseRootUrl,
    headers: {
      'adminToken': store.getters.adminToken,
      'content-type': 'application/json;charset=UTF-8'
      // 'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    withCredentials: false
  })
    .then(function (res) {
      if (res.data.code === 0) {
        if (success) {
          success(res.data)
        }
      } else if(res.data.code === 911){
        //调整登录界面
        router.push({name: 'Login'});
      }else {
        if (failure) {
          failure(res.data)
        } else {
          console.log('error: ' + JSON.stringify(res.data))
        }
      }
    })
    .catch(function (err) {
      let res = err.response
      if (err) {
        alert(err)
      }
    })
}

function newGetAxios (method,url, params, success, failure) {
  let that = this ;
  console.log("configs.adminToken="+configs.adminToken)
  axios({
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? params : null,
    params: method === 'GET' || method === 'DELETE' ? params : null,
    baseURL: configs.baseRootUrl,
    headers: {
      'adminToken': store.getters.adminToken
    },
    withCredentials: false
  })
    .then(function (res) {
      if (res.data.code === 0) {
        if (success) {
          success(res.data)
        }
      } else if(res.data.code === 911){
        //调整登录界面
        router.push({name: 'Login'});
      }else {
        if (failure) {
          failure(res.data)
        } else {
          console.log('error: ' + JSON.stringify(res.data))
        }
      }
    })
    .catch(function (err) {
      let res = err.response
      if (err) {
        alert(err)
      }
    })
}


/*
 * 提交商品
 */
function submitProductInfo(params,success,failure) {
  let url = "/admin/product/save" ;
  return newPostAxios('POST', url, params, success, failure)
}

/*
 * 提交商品类目
 */
function saveCategory(params,success,failure) {
  let url = "/admin/productCategory/save" ;
  return newPostAxios('POST', url, params, success, failure)
}

/*
 * 更新商品类目
 */
function updateCategory(params,success,failure) {
  let url = "/admin/productCategory/update" ;
  return newPostAxios('POST', url, params, success, failure)
}

/*
 * 请求商品明细
 */
function getProductDetailInfoByProductNumber(params,success,failure) {
  let url = "/admin/product/getProductDetailInfoByNumber" ;
  return newGetAxios('GET', url, params, success, failure)
}


/*
 * 根据产品编码 查找所属类目信息
 */
function getCategoryInfoByNumber(params,success,failure) {
  let url = "/admin/product/getCategoryInfoByNumber" ;
  return newGetAxios('GET', url, params, success, failure)
}

/*
 * 根据类目信息
 */
function selectCategoryInfo(params,success,failure) {
  let url = "/admin/productCategory/selectCategoryInfo" ;
  return newGetAxios('GET', url, params, success, failure)
}

/*
 * 上架 商品
 */
function upProductInfo(params,success,failure) {
  let url = "/admin/product/upProductInfo" ;
  return newGetAxios('GET', url, params, success,failure)
}

/*
 * 下架 商品
 */
function downProductInfo(params,success,failure) {
  let url = "/admin/product/downProductInfo" ;
  return newGetAxios('GET', url, params, success, failure)
}

/*
 * 根据产品编码 删除产品
 */
function deleteProductInfoByNumber(params,success,failure) {
  let url = "/admin/product/deleteProductInfoByNumber" ;
  return newGetAxios('GET', url, params, success, failure)
}

/*
 * 根据类目编码 删除类目
 */
function deleteCategoryByNumber(params,success,failure) {
  let url = "/admin/productCategory/deleteCategory" ;
  return newGetAxios('GET', url, params, success, failure)
}

/*
 * 获取产品列表
 */
function selectProductList(params,success,failure) {
  let url = "/admin/product/list" ;
  return newGetAxios('GET', url, params, success, failure)
}

/*
 * 获取所有类目数据
 */
function getAllCategoryInfoList(success,failure) {
  let url = "/admin/productCategory/listAll" ;
  return newGetAxios('GET', url, null, success, failure)
}

/*
 * 分页获取所有类目数据
 */
function getCategoryInfoListByPage(params,success,failure) {
  let url = "/admin/productCategory/list" ;
  return newGetAxios('GET', url, params, success, failure)
}

/*
 * 用户列表
 */
function getBuyerInfoListByPage(params,success,failure) {
  let url = "/admin/buyer/list" ;
  return newGetAxios('GET', url, params, success, failure)
}

/*
 * 更新商品
 */
function updateProductInfo(params,success,failure) {
  let url = "/admin/product/update" ;
  return newPostAxios('POST', url, params, success, failure)
}

/*
 * 请求单个商品+明细 数据
 */
function getProductAndDetailInfoByNumber(params,success,failure) {
  let url = "/admin/product/getProductByNumber" ;
  return newGetAxios('GET', url, params, success, failure)
}

/*
 * 计算类目首页条数
 */
function countIndex(success,failure) {
  let url = "/admin/productCategory/countIndex" ;
  return newGetAxios('GET', url, null, success, failure)
}


/*
 * 获取订单
 */
function findAllOrderList(params,success,failure) {
  let url = "/admin/order/listAll" ;
  return newGetAxios('GET', url, params, success, failure)
}

/*
 * 获取订单详情
 */
function selectOrderDetail(params,success,failure) {
  let url = "/admin/order/lookupOrderDetail" ;
  return newGetAxios('GET', url, params, success, failure)
}

/*
 * 保存订单备注
 */
function saveOrderRemark(params,success,failure) {
  let url = "/admin/order/saveOrderRemark" ;
  return newGetAxios('GET', url, params, success, failure)
}

/*
 * 修改支付金额接口
 */
function modifyActPayFee(params,success,failure) {
  let url = "/admin/order/modifyActPayFee" ;
  return newPostAxios('POST', url, params, success, failure)
}


/*
 * 获取产品评论列表
 */
function findProductReviewList(params,success,failure) {
  let url = "/admin/productReview/list" ;
  return newGetAxios('GET', url, params, success, failure)
}

/*
 * 删除产品评论
 */
function deleteProductReview(params,success,failure) {
  let url = "/admin/productReview/deleteProductReview" ;
  return newGetAxios('GET', url, params, success, failure)
}

/*
 * 修改产品评论
 */
function modifyProductReview(params,success,failure) {
  let url = "/admin/productReview/deleteProductReview" ;
  return newGetAxios('GET', url, params, success, failure)
}

/*
 * 类目上下移动
 */
function moveCategoryInfo(params,success,failure) {
  let url = "/admin/productCategory/moveCategoryInfo" ;
  return newGetAxios('GET', url, params, success, failure)
}

/*
 * 商品上下移动
 */
function moveProductInfo(params,success,failure) {
  let url = "/admin/product/moveProductInfo" ;
  return newGetAxios('GET', url, params, success, failure)
}

/*
 * 登录校验
 */
function sellerLogin(params,success,failure) {
  let url = "/admin/login/login" ;
  return newPostAxios('POST', url, params, success, failure)
}

/*
 * 登出校验
 */
function sellerLogout(success,failure) {
  let url = "/admin/login/logout" ;
  return newGetAxios('POST', url, '', success, failure)
}

/*
 * 广告修改
 */
function updateBanner(params,success,failure) {
  let url = "/admin/banner/update" ;
  return newPostAxios('POST', url, params, success, failure)
}

/*
 * 广告保存
 */
function saveBanner(params,success,failure) {
  let url = "/admin/banner/save" ;
  return newPostAxios('POST', url, params, success, failure)
}

/*
 * 广告栏列表
 */
function getBannerList(params,success,failure) {
  let url = "/admin/banner/list" ;
  return newGetAxios('GET', url, params, success, failure)
}

/*
 * 广告栏查看
 */
function lookupDetailBanner(params,success,failure) {
  let url = "/admin/banner/lookupDetail" ;
  return newGetAxios('GET', url, params, success, failure)
}

/*
 * 删除广告栏
 */
function deleteBanner(params,success,failure) {
  let url = "/admin/banner/delete" ;
  return newGetAxios('GET', url, params, success, failure)
}

// 返回在vue模板中的调用接口
export default {
  get: function (url, params, success, failure) {
    return apiAxios('GET', url, params, success, failure)
  },
  post: function (url, params, success, failure) {
    return apiAxios('POST', url, params, success, failure)
  },
  put: function (url, params, success, failure) {
    return apiAxios('PUT', url, params, success, failure)
  },
  delete: function (url, params, success, failure) {
    return apiAxios('DELETE', url, params, success, failure)
  },
  submitProductInfo: function (params,success,failure) {
    return submitProductInfo(params,success,failure)
  },
  getProductDetailInfoByProductNumber: function (params,success,failure) {
    return getProductDetailInfoByProductNumber(params,success,failure)
  },
  getCategoryInfoByNumber: function (params,success,failure) {
    return getCategoryInfoByNumber(params,success,failure)
  },
  upProductInfo: function (params,success,failure) {
    return upProductInfo(params,success,failure)
  },
  downProductInfo: function (params,success,failure) {
    return downProductInfo(params,success,failure)
  },
  deleteProductInfoByNumber: function (params,success,failure) {
    return deleteProductInfoByNumber(params,success,failure)
  },
  selectProductList: function (params,success,failure) {
    return selectProductList(params,success,failure)
  },
  getAllCategoryInfoList: function (success,failure) {
    return getAllCategoryInfoList(success,failure)
  },
  updateProductInfo: function (params,success,failure) {
    return updateProductInfo(params,success,failure)
  },
  getProductAndDetailInfoByNumber: function (params,success,failure) {
    return getProductAndDetailInfoByNumber(params,success,failure)
  },
  getCategoryInfoListByPage: function (params,success,failure) {
    return getCategoryInfoListByPage(params,success,failure)
  },
  saveCategory: function (params,success,failure) {
    return saveCategory(params,success,failure)
  },
  countIndex: function (success,failure) {
    return countIndex(success,failure)
  },
  selectCategoryInfo: function (params,success,failure) {
    return selectCategoryInfo(params,success,failure)
  },
  updateCategory: function (params,success,failure) {
    return updateCategory(params,success,failure)
  },
  deleteCategoryByNumber: function (params,success,failure) {
    return deleteCategoryByNumber(params,success,failure)
  },
  findAllOrderList: function (params,success,failure) {
    return findAllOrderList(params,success,failure)
  },
  moveCategoryInfo: function (params,success,failure) {
    return moveCategoryInfo(params,success,failure)
  },
  moveProductInfo: function (params,success,failure) {
    return moveProductInfo(params,success,failure)
  },
  sellerLogin: function (params,success,failure) {
    return sellerLogin(params,success,failure)
  },
  sellerLogout: function (success,failure) {
    return sellerLogout(success,failure)
  },
  getBuyerInfoListByPage: function (params,success,failure) {
    return getBuyerInfoListByPage(params,success,failure)
  },
  updateBanner: function (params,success,failure) {
    return updateBanner(params,success,failure)
  },
  saveBanner: function (params,success,failure) {
    return saveBanner(params,success,failure)
  },
  getBannerList: function (params,success,failure) {
    return getBannerList(params,success,failure)
  },
  lookupDetailBanner: function (params,success,failure) {
    return lookupDetailBanner(params,success,failure)
  },
  deleteBanner: function (params,success,failure) {
    return deleteBanner(params,success,failure)
  },
  selectOrderDetail: function (params,success,failure) {
    return selectOrderDetail(params,success,failure)
  },
  modifyActPayFee: function (params,success,failure) {
    return modifyActPayFee(params,success,failure)
  },
  findProductReviewList: function (params,success,failure) {
    return findProductReviewList(params,success,failure)
  },
  deleteProductReview: function (params,success,failure) {
    return deleteProductReview(params,success,failure)
  },
  modifyProductReview: function (params,success,failure) {
    return modifyProductReview(params,success,failure)
  },
  saveOrderRemark: function (params,success,failure) {
    return saveOrderRemark(params,success,failure)
  }
}
