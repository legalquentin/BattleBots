import Vue from 'vue'
import VueRouter from 'vue-router'

import SplashView from '@/views/SplashScreen/index.vue';
import MainFrame from '@/views/MainFrame/index.vue';
import GameFrame from '@/views/GameFrame/index.vue';
import RegisterFrame from '@/views/RegisterFrame/index.vue';
import LoginFrame from '@/views/LoginFrame/index.vue';
import GamesListFrame from '@/views/GamesListFrame/index.vue';
import CreateGameFrame from '@/views/CreateGameFrame/index.vue';
import EndOfGameFrame from '@/views/EndOfGameFrame/index.vue';

Vue.use(VueRouter)

const routes = [
  /**
   * General
   */
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
    component: GameFrame,
    props: true,
  },
  
  /**
   * Authentication & User management
   */
  {
    path: '/RegisterFrame',
    name: 'RegisterFrame',
    component: RegisterFrame,
  },

  {
    path: '/LoginFrame',
    name: 'LoginFrame',
    component: LoginFrame,
  },

  /**
   * Game management
   */
  {
    path: '/GamesListFrame',
    name: 'GamesListFrame',
    component: GamesListFrame,
  },

  {
    path: '/CreateGameFrame',
    name: 'CreateGameFrame',
    component: CreateGameFrame,
  },

  {
    path: '/EndOfGameFrame',
    name: 'EndOfGameFrame',
    component: EndOfGameFrame,
  }
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
