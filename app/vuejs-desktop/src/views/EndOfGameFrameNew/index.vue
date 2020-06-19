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
import { Vue, Component, Watch, Ref, Prop } from 'vue-property-decorator';
import axios, { AxiosResponse, AxiosError } from 'axios';
import _ from 'lodash';
import jsmpeg from "jsmpeg";

import ReplayModal from '../../components/Modals/ReplayModal.vue';

@Component({components: { ReplayModal }})
export default class EndOfGameFrame extends Vue {
  @Prop() private gameId: any;

  @Ref("videoCanvas") private videoCanvas?: HTMLCanvasElement;
  disconnectModal: boolean = false;
  
  replayModal: Boolean = false;
  s3Url: string = "";

  mounted() {
    
    console.log("EndOfGameFrame > mounted", this.gameId);
    this.connectionManager.getGameResult(this.gameId).then((response: AxiosResponse) => {
        this.s3Url = response.data.data.players[0].botSpecs.streams[0].s3Url;      
        console.log(this.s3Url)
    }).catch((err: AxiosError) => console.error(err));
    
  }
};
</script>