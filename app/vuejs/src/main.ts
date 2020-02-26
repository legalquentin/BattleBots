import { Vue } from 'vue-property-decorator';
import qs from 'qs';

import App from './App.vue';
import router from './router';
import Store from './utils/Store';

import SuiVue from 'semantic-ui-vue';
import 'semantic-ui-css/semantic.min.css';


Vue.config.productionTip = false;
Vue.use(SuiVue);

// Register the store
Vue.prototype.store = new Store();
Vue.prototype.nov = (obj: Object): string => qs.stringify(obj);

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');


