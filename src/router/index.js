import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect:'/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'hone',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../components/Home.vue'),
    children:[
      {
        path:"/home/welcome",
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../components/welcome.vue')
      },
      {
        path:"/home/user",
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../components/user/user.vue')
      },
      {
        path:"/home/roles",
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../components/right/roles.vue')
      },
      {
        path:"/home/right",
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../components/right/rights.vue')
      },
      {
        path:"/home/goods",
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../components/goods/goods.vue')
      },
      {
        path:"/home/params",
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../components/goods/params.vue')
      },
      {
        path:"/home/categories",
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../components/goods/categories.vue')
      },
      {
        path:"/home/orders",
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../components/order/orderlist.vue')
      },
      {
        path:"/home/reports",
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../components/report/reports.vue')
      },
    ]
  }
]
const router = new VueRouter({
  routes
})
//挂载路由导航守卫
router.beforeEach((to,from,next)=>{
  // to 将要访问的路径
  // from 代表从哪个路径跳转过来
  // next 是一个函数 便是放行
  // next（）放行   next("/login")强制跳转
        if(to.path==="/login")return next();
        //获取token
        const tokenStr=window.sessionStorage.getItem("token");
        if(!tokenStr) return next("/login");
        next();
        
    })

export default router
