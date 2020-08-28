<template>
  <div id="Fight">
    <SuiModal basic v-model="gameContext.endOfGame" scrolling :closable="false">
      <sui-modal-header style="text-align: center !important; ">Partie terminée</sui-modal-header>
      <sui-modal-header style="text-align: center; color: lightgreen">VICTOIRE</sui-modal-header>
      <sui-modal-actions style="text-align: center;">
        <div is="sui-button-group">
          <sui-button color="facebook" @click.native="$router.push({ name: 'CreateGamePanel' })" label-position="left" icon="redo">Nouvelle partie</sui-button>
          <sui-button color="blue" @click.native="$router.push({ name: 'StatsPanel', params: { gameId } })" label-position="right" icon="chart pie">Détails</sui-button>
        </div>
        <sui-button color="grey" style="margin-left: 50px" @click.native="$router.push({ name: 'ListGamesPanel' })">Retourner au menu principal</sui-button>
      </sui-modal-actions>
    </SuiModal>

    <!-- TOMOVE -->
    <sui-modal size="mini" basic v-model="fightMenuState">
      <sui-modal-content>
        <sui-modal-description>
          <SuiGrid align="center" verticalAlign="middle">
            <SuiGridRow>
              <SuiGridColumn>
                <SuiButton size="huge" @click="fightMenuState = false" fluid>Reprendre</SuiButton>
              </SuiGridColumn>
            </SuiGridRow>
            <SuiGridRow>
              <SuiGridColumn>
                <SuiButton
                  color="red"
                  @click="$router.push({ name: 'ListGamesPanel' })"
                  fluid
                >Quitter la partie</SuiButton>
              </SuiGridColumn>
            </SuiGridRow>
          </SuiGrid>
        </sui-modal-description>
      </sui-modal-content>
    </sui-modal>
    <!-- // TOMOVE -->

    <SuiGrid verticalAlign="middle" align="center" style="margin: 0; height: 100%">
      <SuiGridRow>
        <SuiGridColumn style="position: relative">
          <canvas
            ref="videoCanvas"
            style="background-color: #85858573;width: 100%; max-height: calc(100vh - 40px); display:block;z-index: -2"
          >
            <p>
              Please use a browser that supports the Canvas Element, like
              <a
                href="http://www.google.com/chrome"
              >Chrome</a>,
              <a href="http://www.mozilla.com/firefox/">Firefox</a>,
              <a href="http://www.apple.com/safari/">Safari</a> or Internet Explorer 10
            </p>

            <p>You can also use the Electron 'chrome based' desktop client</p>
          </canvas>

          <div
            style="position: absolute; top: 0px; width: calc(100vw - 28px); display:block; height: 100%; opacity: 0.9"
          >
            <!-- <SuiIcon name="circle outline" inverted size="massive" style="position: absolute; top: calc(50% - (112px / 2)); left: calc(50% - (112px / 2))"></SuiIcon> -->
            <!-- <sui-icon-group size="massive" style="position: absolute; top: calc(50% - (112px / 2)); left: calc(50% - (112px / 2))">
                <sui-icon name="circle outline" size="big" color="red" />
            </sui-icon-group>-->
            <div
              v-if="!fightMenuState"
              style="border-radius: 50%; width: 50px; height: 50px; border: 2px solid white; position: absolute; left: calc(50% - (20px / 2)); top: calc(50% - (20px / 2)); box-shadow: 0 0 5px black"
            >
              <div
                style="width: 200%; height: 0px; border: 1px solid white; position: absolute;top: 50%; left: -50%; box-shadow: 0 0 5px black"
              ></div>
              <div
                style="height: 200%; width: 1px; border: 1px solid white; position: absolute; top: -50%; left: 50%; box-shadow: 0 0 5px black"
              ></div>
            </div>
            <SuiGrid align="left" verticalAlign="top" style="margin: 0;" v-if="!fightMenuState">
              <SuiGridRow align="right" verticalAlign="middle">
                <SuiGridColumn>
                  <span class="ui label" style="margin-right: 0px">
                    <SuiButton size="mini" style="margin-right: 10px" disabled>ESC</SuiButton>Accéder au menu
                  </span>
                </SuiGridColumn>
              </SuiGridRow>
            </SuiGrid>

            <SuiGrid style="position: absolute; width: 30%; bottom: 0px; right: 0px; margin: 0;">
              <SuiGridRow :columns="2" verticalAlign="middle">
                <SuiGridColumn align="right" style="position: relative">
                  <span class="ui label">Vie</span>
                </SuiGridColumn>
                <SuiGridColumn align="right" style="position: relative">
                  <sui-progress state="active" color="red" :percent="gameContext.life" />
                </SuiGridColumn>
              </SuiGridRow>

              <SuiGridRow :columns="2" verticalAlign="middle">
                <SuiGridColumn align="right" style="position: relative">
                  <span class="ui label">Surchauffe</span>
                </SuiGridColumn>
                <SuiGridColumn align="right" style="position: relative">
                  <sui-progress state="active" color="red" :percent="gameContext.thermal" />
                </SuiGridColumn>
              </SuiGridRow>

              <SuiGridRow :columns="2" verticalAlign="middle">
                <SuiGridColumn align="right" style="position: relative">
                  <span class="ui label">Energie</span>
                </SuiGridColumn>
                <SuiGridColumn align="right" style="position: relative">
                  <sui-progress state="active" color="yellow" :percent="gameContext.energy" />
                </SuiGridColumn>
              </SuiGridRow>
            </SuiGrid>

            <SuiGrid
              v-if="notifications.length"
              style="position: absolute; width: 440px; bottom: 0px; left: 0px; margin: 0; background-color: rgba(0, 0, 0, 0.2); padding-top: 12px; padding-bottom: 12px; border-radius: 5px; margin: 12px; border: 2px solid rgba(0, 0, 0, 0.5)"
            >
              <!-- <SuiGridRow :columns="2" verticalAlign="middle" style="padding: 4px">
                <SuiGridColumn :width="5" align="center" style="position: relative">
                  <span class="ui label circular icon">
                    <SuiIcon name="time"/>
                    23h42
                  </span>
                </SuiGridColumn>
                <SuiGridColumn align="left" style="position: relative; margin-left: 2px">
                  <span class="ui label blue" style="background-color: #2980b9 !important">Fire !</span>
                </SuiGridColumn>
              </SuiGridRow>
              <SuiGridRow :columns="2" verticalAlign="middle" style="padding: 4px">
                <SuiGridColumn :width="5" align="center" style="position: relative">
                  <span class="ui label circular icon">
                    <SuiIcon name="time"/>
                    23h43
                  </span>
                </SuiGridColumn>
                <SuiGridColumn align="left" style="position: relative; margin-left: 2px">
                  <span class="ui label" style="background-color: #e74c3c">Nothing found</span>
                </SuiGridColumn>
              </SuiGridRow>

              <SuiGridRow :columns="2" verticalAlign="middle" style="padding: 4px">
                <SuiGridColumn :width="5" align="center" style="position: relative">
                  <span class="ui label circular icon">
                    <SuiIcon name="time"/>
                    23h42
                  </span>
                </SuiGridColumn>
                <SuiGridColumn align="left" style="position: relative; margin-left: 2px">
                  <span class="ui label">Fire !</span>
                </SuiGridColumn>
              </SuiGridRow>-->
              <SuiGridRow
                v-for="notification in notifications"
                :key="notification.text"
                :columns="2"
                verticalAlign="middle"
                style="padding: 4px"
              >
                <SuiGridColumn :width="4" align="center" style="position: relative; padding-left: 0px">
                  <span class="ui label circular icon">
                    <SuiIcon name="time" />
                    {{ notification.time.format('HH:mm:ss') }}
                  </span>
                </SuiGridColumn>
                <SuiGridColumn :width="11" align="left" style="position: relative; margin-left: 2px">
                  <span
                    class="ui label"
                    :style="{ 'background-color': notification.color }"
                  >{{ notification.text }}</span>
                </SuiGridColumn>
              </SuiGridRow>
            </SuiGrid>
          </div>
        </SuiGridColumn>
      </SuiGridRow>
    </SuiGrid>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref } from "vue-property-decorator";
import jsmpeg from "jsmpeg";
import _ from "lodash";

import GameContext from "./types/GameContext";
import RawDataMessage, {
  MessagesTypesEnum,
  NotifTypesEnum,
} from "./types/RawDataMessage";

import moment from "moment";

class Notification {
  public time: moment.Moment;

  constructor(
    private text: string,
    private color: string,
    private container: Notification[]
  ) {
    this.time = moment();

    setTimeout(() => {
      this.container.shift();
      while (this.container.length > 10) {
        this.container.shift();
      }
    }, 6000);
  }
}

@Component
export default class Fight extends Vue {
  private lambdaKeyPress: (event: any) => void = (event: any) =>
    this.onKeyboardKeyPress(event);

  @Ref("videoCanvas") private videoCanvas?: HTMLCanvasElement;

  private fightMenuState = false;
  private notifications: Notification[] = [];

  created(): void {
    addEventListener("keydown", this.lambdaKeyPress);

    this.$api.$emit('DISABLE_AUTO_REFRESH');
  }

  beforeDestroy(): void {
    removeEventListener("keydown", this.lambdaKeyPress);
    removeEventListener("keydown", this.lambdaCtrlKeyDown);
    removeEventListener("keyup", this.lambdaCtrlKeyUp);

    this.$ws.close();
    this.$ws.getEventListener().off("message", this.lambdaOnGameMessage);
  }

  private gameInfos: any;
  private gameId: any;
  private playerId: number | null = Number(localStorage.getItem("userId"));

  private cameraUrl!: string;
  private controlUrl!: string;

  private gameContext: GameContext = new GameContext();

  private allowedKeyboardKeys: { [key: string]: boolean } = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    Space: false,
  };

  private lambdaOnGameMessage: (rawDataMessage: RawDataMessage) => void = (
    rawDataMessage: RawDataMessage
  ) => this.onGameMessage(rawDataMessage);

  mounted(): void {
    // this.notifications.push(
    //   new Notification("test", "blue", this.notifications)
    // );
    // setInterval(() => {
    //   this.notifications.push(
    //     new Notification("test", "blue", this.notifications)
    //   );
    // }, 1000);

    try {
      this.gameInfos = this.$route.params.gameInfos;
      this.gameId = this.$route.params.gameId;
      console.log(this.gameInfos, this.gameId);
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

      this.$ws.getEventListener().on("message", this.lambdaOnGameMessage);
    } catch (e) {
      this.notifications.push(
        new Notification("Une erreur s'est produite au moment du chargement de la partie", "#c0392b", this.notifications)
      );
    }
  }

  private cam(): void {
    const client: WebSocket = new WebSocket(this.cameraUrl);
    new jsmpeg(client, { canvas: this.videoCanvas });

    this.$ws.start(this.controlUrl).onerror = (event) => {
      // this.joinGameFormDisplay = true;
      alert("Le serveur a coupé la connexion.");
    };

    this.handleKeyEvents();
  }

  private allowed: string[] = [];

  private handleKeyEvents() {
    this.allowed = Object.keys(this.allowedKeyboardKeys);
    window.addEventListener("keydown", this.lambdaCtrlKeyDown);

    window.addEventListener("keyup", this.lambdaCtrlKeyUp);
  }

  private lambdaCtrlKeyDown: (event: any) => void = (event: any) =>
    this.onKeyDown(event);
  private lambdaCtrlKeyUp: (event: any) => void = (event: any) =>
    this.onKeyUp(event);

  private onKeyDown(e: any): void {
    console.log("keydown", this.allowed, this.allowedKeyboardKeys[e.code], e);
    if (
      this.allowed.includes(e.code) &&
      this.allowedKeyboardKeys[e.code] == false
    ) {
      this.allowedKeyboardKeys[e.code] = true;
      this.$ws.send(e.keyCode, true);
    }
  }

  private onKeyUp(e: any): void {
    if (
      this.allowed.includes(e.code) &&
      this.allowedKeyboardKeys[e.code] == true
    ) {
      this.allowedKeyboardKeys[e.code] = false;
      this.$ws.send(e.keyCode, false);
    }
  }

  private onGameMessage(message: RawDataMessage): void {
    if (message.dt >= 10) {
      switch (message.dt) {
        case NotifTypesEnum.ERROR:
          this.notifications.push(
            new Notification(
              message.dv as string,
              "#c0392b",
              this.notifications
            )
          );
          break;
        case NotifTypesEnum.INFO:
          this.notifications.push(
            new Notification(
              message.dv as string,
              "#2980b9",
              this.notifications
            )
          );
          break;
        case NotifTypesEnum.SUCCESS:
          this.notifications.push(
            new Notification(
              message.dv as string,
              "#27ae60",
              this.notifications
            )
          );
          break;
        case NotifTypesEnum.WARN:
          this.notifications.push(
            new Notification(
              message.dv as string,
              "#d35400",
              this.notifications
            )
          );
          break;
      }
      return;
    }

    switch (message.dt) {
      case MessagesTypesEnum.ENERGY:
        this.gameContext.energy = (!message.dv ? 0 : message.dv) as number;
        break;
      case MessagesTypesEnum.THERMAL:
        this.gameContext.thermal = (!message.dv ? 0 : message.dv) as number;
        break;
      case MessagesTypesEnum.LIFE:
        this.gameContext.life = (!message.dv ? 0 : message.dv) as number;
        break;
      case MessagesTypesEnum.END_OF_GAME:
        this.gameContext.endOfGame = true;
        break;
    }
  }

  private onKeyboardKeyPress(event: any): void {
    switch (event.code) {
      case "Escape":
        this.fightMenuState = !this.fightMenuState;
        break;
    }
  }
}
</script>

<style lang="less">
#Fight {
  height: 100%;
  background: linear-gradient(rgba(0, 0, 0, 0.4), #00000099),
    url("/background.jpg");

  .ui.active.progress .bar {
    position: absolute;
  }
  .ui.progress.active {
    height: 24px;
    margin: 0;
    background: rgba(0, 0, 0, 0.5);
  }
  .label {
    color: white;
    background: rgba(0, 0, 0, 0.5);
    margin-right: -20px;
  }
}
</style>