/*
 * @Author: hidetodong
 * @Date: 2022-06-28 23:09:03
 * @LastEditTime: 2022-06-28 23:32:51
 * @LastEditors: hidetodong
 * @Description: 
 * @FilePath: /vite-router/src/router/index.js
 * HIDETOXIC - 版权所有
 */
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import { createRouter,createWebHashHistory,createWebHistory } from 'vue-router'

const routes = [
    {
        path:'/',
        component:Home,
    },
    {
        path:'/about',
        component:About,
    }
]


// 路由方式
// hash    前端的锚点 监控锚点变化渲染对应的组件 不会向服务端发请求 不能做seo优化 不会导致页面重新加载 加 # 上线有点丑
// window.location.hash onhashchange
// history 当刷新的时候 会真的向服务端请求资源 正常来说服务端是没有这个资源的 监测如果页面不存在 会指定到首页，根据vue-router渲染出对应的页面
// =》 服务端指定首页 再二次渲染 可能会有404问题 =〉服务端渲染只能用history模式
// window.history.pushState()
// 监控前进后退 on('popstate')
// 通过histroryAPI可以实现hash模式 
// 两种方式可以整合在一起 都采用history的方式

// vue-router 通过注入来实现 底层封装一个公共的history

// memory 后端常用 导航条不变化
export const router = createRouter({
    routes,
    history:createWebHistory()
})