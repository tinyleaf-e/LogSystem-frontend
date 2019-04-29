import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Layout from './components/Layout.vue'
import router from  './router'
import config from './config.js'
import axios from 'axios'
import qs from 'qs'

import cookies from "js-cookie"
import dateformat from 'dateformat'

Vue.use(ElementUI)
Vue.prototype.$qs=qs;
Vue.prototype.$ajax = axios;
Vue.prototype.$cookie = cookies;
Vue.prototype.$dateformat = dateformat;

new Vue({
    el: '#app',
    router,
    render:h=>h(Layout)
})
