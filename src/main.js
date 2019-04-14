import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Layout from './components/Layout.vue'
import router from  './router'
import './config.js'

Vue.use(ElementUI)

new Vue({
    el: '#app',
    router,
    render:h=>h(Layout)
})
