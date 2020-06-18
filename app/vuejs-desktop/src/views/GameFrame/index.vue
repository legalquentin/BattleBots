<script lang="ts">
import { Vue, Component, Prop, Ref } from "vue-property-decorator";
import jsmpeg from "jsmpeg";
import _ from "lodash";
import moment from "moment";
import { shell } from "electron";
import axios from "axios";

import SocketService from "./SocketService";

import EndOfGameModal from '../EndOfGameFrame/index.vue';

type keyOpt = {
  [key: string]: boolean;
};

@Component({ components: { EndOfGameModal } })
export default class GameFrame extends Vue {
  @Ref("videoCanvas") private videoCanvas?: HTMLCanvasElement;
  @Prop() private gameInfos: any;
  @Prop() private gameId: any;

  private playerId: number | null = Number(localStorage.getItem("userId"));

  private cameraUrl: string = "";
  private controlUrl: string = "";

  private socketService: SocketService = new SocketService();

  private botContext: { energy: number } = { energy: 100 };

  private keys: keyOpt = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    Space: false
  };

  private isGameRunning = true;
  private createdAt?: moment.Moment;

  elapsedTime: number = 0;
  remainingTime: number = 0;

  helpModal: boolean = false;

  isEndOfGame: boolean = false;

  mounted() {
    if (!this.playerId) {
      alert("Something goes wrong. Please try login again...");
      this.$router.replace({ name: "LoginFrame" });
    }
    console.log("test", this.gameInfos);
    this.createdAt = moment(this.gameInfos.game.createdAt);

    this.cameraUrl = `wss://hardwar.ddns.net/api/bots/wscam?gameid=${
      this.gameId
    }&playerid=${this.playerId}&token=${
      _.find(
        this.gameInfos.game.players,
        (player: any) => Number(player.id) === this.playerId
      ).token
    }`;
    this.controlUrl = `wss://hardwar.ddns.net/api/bots/ws?gameid=${
      this.gameId
    }&playerid=${this.playerId}&token=${
      _.find(
        this.gameInfos.game.players,
        (player: any) => Number(player.id) === this.playerId
      ).token
    }`;

    this.cam();

    this.tick();

    this.socketService
      .getEventListener()
      .on("message", (message: any) => this.onGameMessage(message));
  }

  private tick() {
    const now: moment.Moment = moment();
    if (this.createdAt) {
      this.elapsedTime = now.diff(this.createdAt, "seconds");
      this.remainingTime = 300 - this.elapsedTime;

      if (this.remainingTime < 1) {
        return;
      }
    }

    setTimeout(() => window.requestIdleCallback(() => this.tick()), 1000);
  }

  beforeCreate() {
    document.body.className = "game";
  }

  private onGameMessage(message: any) {
    // switch(message.dt) {
    //   case 1:
    //     console.log('gros connard', message.dv);
    //     this.botContext.energy = message.dv === undefined ? 0 : message.dv;
    //     break;
    // }
    // console.log(message);
    if (message.dt === 1) {
      this.botContext.energy = !message.dv ? 0 : message.dv;
      return;
    }

    if (message.dt === -1) {
      //  && message.dv === 0
      console.log("ticked");
      this.isEndOfGame = true;
      // this.deleteGame(this.gameId);

      // this.$router.back();
    }

    // return;
    // const player: any = _.find(
    //   message.players,
    //   (player: any) => Number(player.id) === this.playerId
    // );
    // this.botContext = player.botContext;
    // let createdAt: string = message.createdAt;
    // this.createdAt = moment(createdAt);
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
      if (allowed.includes(e.code) && this.keys[e.code] == false) {
        this.keys[e.code] = true;
        this.socketService.send(e.keyCode, true);
      }
    });

    window.addEventListener("keyup", e => {
      if (allowed.includes(e.code) && this.keys[e.code] == true) {
        this.keys[e.code] = false;
        this.socketService.send(e.keyCode, false);
      }
    });
  }

  public openExternal() {
    shell.openExternal("https://hardwar.ddns.net");
  }

  private async deleteGame(gameId: number) {
    const jwt: string | null = localStorage.getItem("jwt");
    if (!_.size(jwt)) {
      this.$router.push({ name: "MainFrame" });
    }

    try {
      const result = await axios.delete(
        `http://hardwar.ddns.net/api/games/${gameId}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`
          }
        }
      );
    } catch (error) {
      console.error(error);
    }
  }
}
</script>

<template src="./template.html"></template>

<style lang="scss" scoped>
.tchat-frame .ui.message {
  margin-top: 30px;
}

.tchat-frame .ui.message:first-child {
  margin-top: 10px;
}

#videoCanvas {
  border-radius: 0.28571429rem;
}
</style>