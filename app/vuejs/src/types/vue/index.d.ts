import Vue from 'vue-property-decorator';
import Store from '../../utils/Store';

declare module 'vue/types/vue' {
  interface Vue {
    store: Store,
    nov(obj: Object): string,
  }
}