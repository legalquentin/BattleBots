import ConnectionManager from './utils/ConnectionManager'

declare module '*.vue' {
  import Vue from 'vue'
  
  export default Vue
}


declare module "vue/types/vue" {
  interface Vue {
    connectionManager: ConnectionManager;
  }
}

declare module "semantic-ui-vue";
