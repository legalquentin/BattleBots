<template src="./template.html"></template>

<style lang="less" scoped>
  .game-name {
    display: block;
    overflow-x: hidden;
    overflow-y: hidden;
    max-height: 50px;
  }

  .end-of-game-frame {
    padding-bottom: 40px;
  }
</style>

<script lang="ts">
import { Vue, Component, Watch, Ref, Prop } from 'vue-property-decorator';
import axios, { AxiosResponse, AxiosError } from 'axios';
import _ from 'lodash';
import jsmpeg from "jsmpeg";
import moment from 'moment';
import ReplayModal from '../../components/Modals/ReplayModal.vue';
import AVue from '../AVue';

@Component({components: { ReplayModal }})
export default class EndOfGameFrame extends AVue {
  @Prop() private gameId: any;

  @Ref("videoCanvas") private videoCanvas?: HTMLCanvasElement;
  disconnectModal: boolean = false;
  
  replayModal: Boolean = false;
  s3Url: string = "";
  data: any = {};
  moment = moment;

  numberOfPlayers: number = 0;

  displayed() {
    document.body.className = "";
  }

  mounted() {
    
    this.connectionManager.getGameResult(this.gameId).then((response: AxiosResponse) => {
        this.s3Url = response.data.data.players[0].botSpecs.streams[0].s3Url;      
        
        this.data = response.data.data;
        this.numberOfPlayers = this.data.players.length;
    }).catch((err: AxiosError) => console.error(err));
    
  }
};
</script>