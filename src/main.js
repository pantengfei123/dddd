import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.min.css'
import './assets/css/global.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import "./assets/font/iconfont.css"

Vue.use(ElementUI)
Vue.use(MintUI);
// axios.defaults.baseURL="http://timemeetyou.com:8889/api/private/v1/";
//拦截器
axios.interceptors.request.use(config=>{
  // if(config.url!=="login"){
    config.headers.Authorization=window.sessionStorage.getItem("token")
  // }
  //在最后必须 return config
  return config
  
})
Vue.prototype.axios=axios;
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
