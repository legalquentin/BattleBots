// import Vue from 'vue'
// @ts-ignore
import App from './App.vue'
import router from './router'
import SuiVue from 'semantic-ui-vue';
import 'semantic-ui-css/semantic.min.css';
import ConnectionManager from './utils/ConnectionManager';
import { Vue } from 'vue-property-decorator';
import VueNotifications from 'vue-notifications'
import iziToast from 'izitoast'// https://github.com/dolce/iziToast
import 'izitoast/dist/css/iziToast.min.css'

Vue.use(SuiVue);
Vue.config.productionTip = false

function toast ({title, message, type, timeout, cb}) {
  if (type === VueNotifications.types.warn) type = 'warning'
  return iziToast[type]({title, message, timeout})
}

const options = {
  success: toast,
  error: toast,
  info: toast,
  warn: toast
}

Vue.use(VueNotifications, options)

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
