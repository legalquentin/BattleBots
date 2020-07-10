import { Vue, Watch } from 'vue-property-decorator';

// AbstractVue
export default abstract class AVue extends Vue {
    protected abstract displayed(): void;
  
    @Watch('$route.name', {immediate: true})
    private routed(): void {
      this.displayed();
    };
};