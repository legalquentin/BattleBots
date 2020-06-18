// import Vue from 'vue'
// @ts-ignore
import App from './App.vue'
import router from './router'
import SuiVue from 'semantic-ui-vue';
import 'semantic-ui-css/semantic.min.css';
import ConnectionManager from './utils/ConnectionManager';
import { Vue } from 'vue-property-decorator';

Vue.use(SuiVue);
Vue.config.productionTip = false

if (module.hot) {
  module.hot.accept(function () {
    window.location.reload();
  });
}

require('v8-compile-cache');

Vue.prototype.connectionManager = new ConnectionManager();

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
