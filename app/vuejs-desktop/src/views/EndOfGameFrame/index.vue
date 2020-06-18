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
  var player = new jsmpeg('https://qlg-demo-bucket.s3.eu-central-1.amazonaws.com/ddc6fa7f-cdb2-4bf4-a212-01e17558a4d1.ts?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAWN2ZPWNZAA5KB57X%2F20200618%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-Date=20200618T084124Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=66d73d69da8551f8a6c7206593bea701193d0cd1c309226dba20fb73e1ee2c4f', {canvas: this.videoCanvas, seekable: true});
}
};
</script>