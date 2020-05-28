<template src="./template.html"></template>

<style lang="scss" scoped>
.tchat-frame .ui.message {
  margin-top: 30px;
}

.tchat-frame .ui.message:first-child {
  margin-top: 10px;
}

</style>

<script lang="ts">
import { Vue, Component, Prop, Ref } from "vue-property-decorator";
import jsmpeg from "jsmpeg";

import { shell } from "electron";
import SocketService from "./SocketService";

type keyOpt = {
  [key: string]: boolean;
};

@Component
export default class GameFrame extends Vue {
  @Ref("videoCanvas") private videoCanvas?: HTMLCanvasElement;
  @Prop() private gameInfos: any;
  @Prop() private gameId: any;

  private cameraUrl: string = `wss://hardwar.ddns.net/api/bots/wscam?gameid=${
    this.gameId
  }&playerid=${1}&token=${this.gameInfos.token}`;
  private controlUrl: string = `wss://hardwar.ddns.net/api/bots/ws?gameid=${
    this.gameId
  }&playerid=${1}&token=${this.gameInfos.token}`;

  private socketService: SocketService = new SocketService();

  private keys: keyOpt = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    Space: false
  };

  mounted() {
    console.log(this.gameInfos);
    console.log(this.videoCanvas);
    console.log(this.cameraUrl);
    this.cam();
  }

  beforeCreate() {
        document.body.className = 'game';
}

  private cam() {
    const client: WebSocket = new WebSocket(this.cameraUrl);
    new jsmpeg(client, { canvas: this.videoCanvas });

    this.socketService.start(this.controlUrl).onerror = event => {
      // this.joinGameFormDisplay = true;
      alert("SOCKET CONNECTION FAILED");
    };

    this.handleKeyEvents();
  }

  private handleKeyEvents() {
    const allowed = Object.keys(this.keys);
    window.addEventListener("keydown", e => {
    console.log("tamaman")
      if (allowed.includes(e.code) && this.keys[e.code] == false) {
        this.keys[e.code] = true;
        this.socketService.send(e.keyCode, true);
      }
    });

    window.addEventListener("keyup", e => {
        console.log("tonpapa")
      if (allowed.includes(e.code) && this.keys[e.code] == true) {
        this.keys[e.code] = false;
        this.socketService.send(e.keyCode, false);
      }
    });
  }

  public openExternal() {
    shell.openExternal("https://hardwar.ddns.net");
  }
}
</script>