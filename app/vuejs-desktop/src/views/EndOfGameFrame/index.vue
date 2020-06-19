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

@Component
export default class EndOfGameFrame extends Vue {
  @Ref("videoCanvas") private videoCanvas?: HTMLCanvasElement;
  disconnectModal: boolean = false;
  
  mounted() {
    console.log("EndOfGameFrame > mounted");
  var player = new jsmpeg('https://qlg-demo-bucket.s3.eu-central-1.amazonaws.com/a3bd9e28-ba40-48d0-a5e5-23578da50034.ts?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAWN2ZPWNZAA5KB57X%2F20200619%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-Date=20200619T162322Z&X-Amz-Expires=7200&X-Amz-Signature=4a10e7b33f36ad701a3767b496db04f38affc9c3dc5c1e4e43975043d32c39cd&X-Amz-SignedHeaders=host', {canvas: this.videoCanvas, seekable: true});
}
};
</script>