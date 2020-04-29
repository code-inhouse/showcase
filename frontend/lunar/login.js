import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

import AuthLogo from './components/AuthLogo.vue'

import Login from './pages/Login.vue'
import HedgehogLogin from './pages/HedgehogLogin.vue'
import HedgehogRegister from './pages/HedgehogRegister.vue'
import Auth from './pages/Auth.vue'
import Register from './pages/Register.vue'
import RequestRecovery from './pages/RequestRecovery.vue'
import RecoverPassword from './pages/RecoverPassword.vue'

Vue.component('auth-logo', AuthLogo)

Vue.use(VueRouter)
Vue.use(VueResource)

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/auth',
      name: 'Auth',
      component: Auth,
      children: [{
        path: 'login',
        component: Login,
      }, {
        path: 'hedgehog/login',
        component: HedgehogLogin,
      }, {
        path: 'hedgehog/register',
        component: HedgehogRegister,
      }, {
        path: 'register',
        component: Register,
      }, {
        path: 'recover',
        component: RequestRecovery,
      }, {
        path: 'confirm-recover/:token',
        component: RecoverPassword,
      }]
    },
  ]
})

new Vue({
  el: '#app',
  router
})
