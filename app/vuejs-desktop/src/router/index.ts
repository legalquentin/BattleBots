import Vue from 'vue'
import VueRouter from 'vue-router'

import SplashView from '@/views/SplashScreen/index.vue';
import MainFrame from '@/views/MainFrame/index.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'splash',
    component: SplashView,
  },

  {
    path: '/MainFrame',
    name: 'MainFrame',
    component: MainFrame,
  }
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
