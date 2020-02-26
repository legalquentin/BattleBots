import Vue from 'vue';
import Router from 'vue-router';

/*
 * Templates inclusions
 */
import DefaultTemplate from './templates/_DefaultTemplate.vue';
import LoginRegisterTemplate from './templates/_LoginRegisterTemplate.vue';

/*
 * Pages inclusions
 */
import LandingView from './views/LandingView.vue';
import LoginView from './views/LoginView.vue';
import Home from './views/_OLDHome.vue';
import Room from './views/RoomView.vue';

// Router a Vue Plugin. Vue.use load the plugin inside Vue.
Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: DefaultTemplate,
      children: [
        { path: '', name: '@landing_view', component: LandingView }
      ],
    },
    {
      path: '/room',
      component: DefaultTemplate,
      children: [
        { path: '', name: '@room_view', component: Room }
      ],
    },
    {
      path: '/play',
      component: DefaultTemplate,
      children: [
        { path: '', name: '@player_view', component: Home }
      ],
    },
    {
      path: '/login',
      component: LoginRegisterTemplate,
      children: [
        { path: '', name: '@login', component: LoginView }
      ]
    }
  ],
});