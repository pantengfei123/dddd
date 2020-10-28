import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import MintUI from 'mint-ui'
import "mint-ui/lib/style.min.css"
import axios from 'axios'

Vue.use(MintUI);
Vue.prototype.axios=axios;
createApp(App).use(store).use(router).mount('#app')
