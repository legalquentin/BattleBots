import Vue from 'vue';
import Router from 'vue-router';
import DefaultTemplate from './views/DefaultTemplate.vue';
import Home from './views/Home.vue';
import About from './views/About.vue';

Vue.use(Router);
console.log(process.env.BASE_URL)
export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'default-template',
      component: DefaultTemplate,
      children: [
        {
          path: '',
          name: 'home',
          component: Home,
        },
        {
          path: 'test',
          name: 'test',
          component: About,
        },
      ],
    },
  ],
});
