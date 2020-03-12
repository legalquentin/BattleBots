import Vue from 'vue'
import VueRouter from 'vue-router'

import SplashView from '../views/SplashScreen/index.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'splash',
    component: SplashView
  },
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
