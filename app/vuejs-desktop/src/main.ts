import { Vue } from 'vue-property-decorator'
import App from './App.vue'
import router from './router'

import SuiVue from 'semantic-ui-vue';
import $global, { Global } from './Global';
/* ... */

import ApiComponent from './network/ApiComponent';
import WebsocketComponent from './network/WebsocketComponent';

// vue proto overrides. See ./shims-tsx.d.ts for types declarations
Vue.prototype.$global = $global;
Vue.prototype.$api = new ApiComponent();
Vue.prototype.$ws = new WebsocketComponent();

Vue.use(SuiVue);
import 'semantic-ui-css/semantic.min.css';

Vue.config.productionTip = false

const vue = new Vue({
  router,
  render: h => h(App)
})

// vue.$global = $global;

vue.$mount('#app')
