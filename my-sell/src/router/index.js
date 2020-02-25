import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/components/Home'

import ProductInfo from '@/components/product/ProductInfo'

import AddProductInfo from '@/components/product/AddProductInfo'

import ViewProductInfo from '@/components/product/ViewProductInfo'

import ProductCategory from '@/components/category/ProductCategory'

import AddProductCategory from '@/components/category/AddProductCategory'

import ViewProductCategory from '@/components/category/ViewProductCategory'

import EditProductCategory from '@/components/category/EditProductCategory'

import EditProductInfo from '@/components/product/EditProductInfo'

import OrderList from '@/components/order/OrderList'

import OrderDetail from '@/components/order/OrderDetail'

import Login from '@/components/login/Login'

import BuyerList from '@/components/buyer/BuyerList'

import BannerList from '@/components/banner/BannerList'

import AddBanner from '@/components/banner/AddBanner'

import EditBanner from '@/components/banner/EditBanner'

import ViewBanner from '@/components/banner/ViewBanner'

import ProductReviewList from  '@/components/productReview/ProductReviewList'


Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      name: 'Home',
      children: [
        {
          path: 'admin/product/list',
          name: 'ProductInfo',
          component: ProductInfo
        },
        {
          path: 'admin/product/ShowAddProduct',
          name: 'ShowAddProduct',
          component: AddProductInfo
        },
        {
          path: 'admin/productCategory/list',
          name: 'ProductCategory',
          component: ProductCategory
        },
        {
          path: 'admin/category/AddProductCategory',
          name: 'AddProductCategory',
          component: AddProductCategory
        },
        {
          path: 'admin/product/ViewProductInfo',
          name: 'ViewProductInfo',
          component: ViewProductInfo
        },
        {
          path: 'admin/product/EditProductInfo',
          name: 'EditProductInfo',
          component: EditProductInfo
        },
        {
          path: 'admin/category/ViewProductCategory',
          name: 'ViewProductCategory',
          component: ViewProductCategory
        },
        {
          path: 'admin/category/EditProductCategory',
          name: 'EditProductCategory',
          component: EditProductCategory
        },
        {
          path: 'admin/order/OrderList',
          name: 'OrderList',
          component: OrderList
        },
        {
          path: 'admin/buyer/BuyerList',
          name: 'BuyerList',
          component: BuyerList
        },
        {
          path: 'admin/banner/BannerList',
          name: 'BannerList',
          component: BannerList
        },
        {
          path: 'admin/banner/AddBanner',
          name: 'AddBanner',
          component: AddBanner
        },
        {
          path: 'admin/banner/EditBanner',
          name: 'EditBanner',
          component: EditBanner
        },
        {
          path: 'admin/banner/ViewBanner',
          name: 'ViewBanner',
          component: ViewBanner
        },
        {
          path: 'admin/order/OrderDetail',
          name: 'OrderDetail',
          component: OrderDetail
        },
        {
          path: 'admin/productReview/ProductReviewList',
            name: 'ProductReviewList',
          component: ProductReviewList
        }
      ]
    },

  ],
  mode: 'history'
})
