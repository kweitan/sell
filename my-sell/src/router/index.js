import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import ProductInfo from '@/components/product/ProductInfo'
import AddProductInfo from '@/components/product/AddProductInfo'

import ProductCategory from '@/components/category/ProductCategory'

import AddEditorProductCategory from '@/components/category/AddEditorProductCategory'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/admin/product/list',
      name: 'ProductInfo',
      component: ProductInfo
    },
    {
      path: '/admin/product/ShowAddProduct',
      name: 'ShowAddProduct',
      component: AddProductInfo
    },
    {
      path: '/admin/productCategory/list',
      name: 'ProductCategory',
      component: ProductCategory
    },
    {
      path: 'admin/category/AddEditorProductCategory',
      name: 'AddEditorProductCategory',
      component: AddEditorProductCategory
    }
  ]
})
