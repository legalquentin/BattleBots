import Vue, { Component } from 'vue'
import VueRouter, { RouteConfig, Route } from 'vue-router'
import Home from '../views/__1.vue'
import { Dictionary } from 'vue-router/types/router';

Vue.use(VueRouter)

const routes: RouteConfig[] = [
  { path: '/', component: () => import('../views/Launcher/Launcher.vue'), children: [
    { path: '', name: 'HomePanel', component: () => import('../views/Launcher/components/HomePanel.vue') },
    { path: 'create-game-panel', name: 'CreateGamePanel', component: () => import('../views/Launcher/components/CreateGamePanel.vue') },
    { path: 'list-games-panel', name: 'ListGamesPanel', component: () => import('../views/Launcher/components/ListGamesPanel.vue') },
    { path: 'replay-panel', name: 'ReplayPanel', component: () => import('../views/Launcher/components/ReplayPanel.vue') },
    { path: 'stats-panel', name: 'StatsPanel', component: () => import('../views/Launcher/components/StatsPanel.vue') },

    { path: 'register-panel', name: 'RegisterPanel', component: () => import('../views/Launcher/components/RegisterPanel.vue') },
    { path: 'login-panel', name: 'LoginPanel', component: () => import('../views/Launcher/components/LoginPanel.vue') },

    { path: 'how-to-play-panel', name: 'HowToPlayPanel', component: () => import('../views/Launcher/components/HowToPlayPanel.vue') },
  ] },

  { path: '/fight', name: 'FightFrame', component: () => import('../views/Fight/Fight.vue') },
  { path: '/replay-fight', name: 'ReplayFightFrame', component: () => import('../views/Fight/ReplayFight.vue') }
];


const router = new VueRouter({
  routes
})

export default router
