<template src="./template.html"></template>
<style lang="scss" scoped src="./style.scss"></style>

<script>
import { Vue, Component, Prop, Inject, Watch } from 'vue-property-decorator';

import _ from 'lodash';

@Component
export default class SplashComponent extends Vue {
    @Prop() sequence;

    get currentImg() {
        if (!this.sequence) {
            return;
        }
        return `splashes/${_.get(this.sequence, 'imgName')}`;
    }
}
</script>