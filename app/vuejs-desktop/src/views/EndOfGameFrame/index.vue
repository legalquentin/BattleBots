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
import { Vue, Component, Watch } from 'vue-property-decorator';
import axios from 'axios';
import _ from 'lodash';

@Component
export default class EndOfGameFrame extends Vue {
  disconnectModal: boolean = false;
  mounted() {
    console.log("EndOfGameFrame > mounted");
  }
};
</script>