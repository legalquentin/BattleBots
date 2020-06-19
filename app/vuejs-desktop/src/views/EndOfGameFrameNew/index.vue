<template src="./template.html"></template>

<style lang="less" scoped>
  .game-name {
    display: block;
    overflow-x: hidden;
    overflow-y: hidden;
    max-height: 50px;
  }
</style>

<script lang="ts">
import { Vue, Component, Watch, Ref } from 'vue-property-decorator';
import axios from 'axios';
import _ from 'lodash';
import jsmpeg from "jsmpeg";

import ReplayModal from '../../components/Modals/ReplayModal.vue';

@Component({components: { ReplayModal }})
export default class EndOfGameFrame extends Vue {
  @Ref("videoCanvas") private videoCanvas?: HTMLCanvasElement;
  disconnectModal: boolean = false;
  
  replayModal: Boolean = false;

  mounted() {
    console.log("EndOfGameFrame > mounted");
  var player = new jsmpeg('https://qlg-demo-bucket.s3.eu-central-1.amazonaws.com/a14f5f9f-cf0c-4400-95e3-ba645adf5b48.ts?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAWN2ZPWNZAA5KB57X%2F20200618%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-Date=20200618T125647Z&X-Amz-Expires=7200&X-Amz-Signature=590dade779a64bc000339249e226f5d5a5c649b45f3914f6fce3485b2fa26f37&X-Amz-SignedHeaders=host', {canvas: this.videoCanvas, seekable: true});
}
};
</script>