import  Vue from 'vue'
import Router from 'vue-router'
import Projects from '../components/Projects.vue'
import Formats from '../components/Format.vue'
import FormatItems from '../components/FormatItem.vue'
import LogView from '../components/LogView.vue'
import User from '../components/User.vue'
import Login from '../components/Login.vue'
import Error from '../components/Error.vue'

Vue.use(Router)

export  default  new Router({
    routes:[
        {
            path:'/projects',
            component:Projects
        },
        {
            path:'/formats',
            component:Formats
        },
        {
            path:'/format-items',
            component:FormatItems
        },
        {
            path:'/logs',
            component:LogView
        },
        {
            path:'/users',
            component:User
        },
        {
            path:'/login',
            component:Login
        },
        {
            path:'/error',
            component:Error
        }
    ]
})