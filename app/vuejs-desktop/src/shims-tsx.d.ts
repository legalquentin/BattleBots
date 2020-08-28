import Vue, { VNode } from 'vue'
import ApiComponent from './network/ApiComponent';
import WebsocketManager from './network/WebsocketComponent';

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
}

declare module 'vue/types/vue' {
  import { Vue } from 'vue-property-decorator'
  import { Global as G} from './Global';
  import ApiComponent from './network/ApiComponent';
  import WebsocketComponent from './network/WebsocketComponent';
  // 3. Declare augmentation for Vue
  interface Vue {
    $global: G,
    $api: ApiComponent,
    $ws: WebsocketComponent,
  }
}
