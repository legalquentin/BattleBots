import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

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
  },

  {
    path: '/GameFrame',
    name: 'GameFrame',
    component: () => import('@/views/GameFrame/index.vue'),
  }
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: routes as RouteConfig[],
})

export default router
