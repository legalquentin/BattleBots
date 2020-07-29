<script lang="ts">
import { Vue, Component, Prop, Ref } from "vue-property-decorator";
import jsmpeg from "jsmpeg";
import _ from "lodash";
import moment from "moment";
import { shell } from "electron";
import axios from "axios";
import VueNotifications from "vue-notifications";


import SocketService from "./SocketService";

import EndOfGameModal from '../../components/Modals/EndOfGameModal.vue';
import HelpModal from '../../components/Modals/HelpModal.vue';

type keyOpt = {
  [key: string]: boolean;
};

@Component({ components: { EndOfGameModal, HelpModal }, 
notifications: {
    showSuccessMsg: {
      type: VueNotifications.types.success,
      title: 'Hello there',
      message: 'That\'s the success!'
    },
    showInfoMsg: {
      type: VueNotifications.types.info,
      title: 'Hey you',
      message: 'Here is some info for you'
    },
    showWarnMsg: {
      type: VueNotifications.types.warn,
      title: 'Wow, man',
      message: 'That\'s the kind of warning'
    },
    showErrorMsg: {
      type: VueNotifications.types.error,
      title: 'Wow-wow',
      message: 'That\'s the error'
    }
  }})
export default class GameFrame extends Vue {
  @Ref("videoCanvas") private videoCanvas?: HTMLCanvasElement;
  @Prop() private gameInfos: any;
  @Prop() public gameId: any;

  private playerId: number | null = Number(localStorage.getItem("userId"));

  private cameraUrl: string = "";
  private controlUrl: string = "";

  private socketService: SocketService = new SocketService();

  private botContext: { energy: number, thermal: number } = { energy: 100, thermal: 0 };

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

  isHelpModalOpened: boolean = true;

  isEndOfGame: boolean = false;

  mounted() {
    document.body.className = "game";
    if (!this.playerId) {
      alert("Something goes wrong. Please try login again...");
      this.$router.replace({ name: "LoginFrame" });
    }
    this.createdAt = moment(this.gameInfos.game.createdAt);

    this.cameraUrl = `${process.env.VUE_APP_WS_CAM_URL}?gameid=${
      this.gameId
    }&playerid=${this.playerId}&token=${
      _.find(
        this.gameInfos.game.players,
        (player: any) => Number(player.id) === this.playerId
      ).token
    }`;
    this.controlUrl = `${process.env.VUE_APP_WS_CTRL_URL}?gameid=${
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
    
    this.showInfoMsg()

    if (message.dt === 1) {
      this.botContext.energy = !message.dv ? 0 : message.dv;
      return;
    }
    
    if (message.dt === 2) {
      this.botContext.thermal = !message.dv ? 0 : message.dv;
      return;
    }
 
    if (message.dt === -1) {
      this.isEndOfGame = true;
    }
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
    shell.openExternal("https://battlebots.ddns.net");
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