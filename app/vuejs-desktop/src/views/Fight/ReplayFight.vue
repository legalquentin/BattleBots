<template>
    <div id="Fight">
        <!-- <SuiModal basic v-model="gameContext.endOfGame" scrolling :closable="false">
            <sui-modal-header style="text-align: center !important; ">Partie terminée</sui-modal-header>
            <sui-modal-header style="text-align: center; color: lightgreen">VICTOIRE</sui-modal-header>
            <sui-modal-actions style="text-align: center;">
                <div is="sui-button-group">
                    <sui-button color="facebook" @click.native="$router.push({ name: 'CreateGamePanel' })" label-position="left" icon="redo">Nouvelle partie</sui-button>
                    <sui-button color="blue" @click.native="$router.push({ name: 'StatPanel', params: { gameId } })" label-position="right" icon="chart pie">Détails</sui-button>
                </div>
                <sui-button color="grey" style="margin-left: 50px" @click.native="$router.push({ name: 'ListGamesPanel' })">Retourner au menu principal</sui-button>
            </sui-modal-actions>
        </SuiModal> -->
    
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
                                <SuiButton color="red" @click="$router.push({ name: 'ListGamesPanel' })" fluid>Quitter la partie</SuiButton>
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
                    <!-- <canvas ref="videoCanvas" style="background-color: #85858573;width: 100%; max-height: calc(100vh - 40px); display:block;z-index: -2">
                <p>
                  Please use a browser that supports the Canvas Element, like
                  <a
                    href="http://www.google.com/chrome"
                  >Chrome</a>,
                  <a href="http://www.mozilla.com/firefox/">Firefox</a>,
                  <a href="http://www.apple.com/safari/">Safari</a> or Internet Explorer 10
                </p>
    
                <p>You can also use the Electron 'chrome based' desktop client</p>
              </canvas> -->
                    <!-- <div ref="videoCanvas" data-url="https://qlg-demo-bucket.s3.eu-central-1.amazonaws.com/85bbed05-c682-42ce-a2e2-cfdd9d2d671e..ts?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAWN2ZPWNZMGGGFNH3%2F20201022%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-Date=20201022T141239Z&X-Amz-Expires=7200&X-Amz-Signature=a76cfc9d1a439d7c3c8fedb8519acdcc559c990d3857a1b614a3b8de4b40c4bf&X-Amz-SignedHeaders=host" data-loop="true" data-autoplay="true" style="background-color: #85858573;width: calc(100vw - 300px); height: calc(100vh - 40px);">
                    </div> -->
                    <canvas
                        ref="videoCanvas"
                        width="200"
                        height="200"
                        style="background-color: #85858573;width: 200px; max-height: 200px; display:block;z-index: -2"
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
    
                    <div style="position: absolute; top: 0px; width: calc(100vw - 28px); display:block; height: 100%; opacity: 0.9">
                        <!-- <SuiIcon name="circle outline" inverted size="massive" style="position: absolute; top: calc(50% - (112px / 2)); left: calc(50% - (112px / 2))"></SuiIcon> -->
                        <!-- <sui-icon-group size="massive" style="position: absolute; top: calc(50% - (112px / 2)); left: calc(50% - (112px / 2))">
                    <sui-icon name="circle outline" size="big" color="red" />
                </sui-icon-group>-->
                        
                        <SuiGrid align="left" verticalAlign="top" style="margin: 0;" v-if="!fightMenuState">
                            <SuiGridRow align="right" verticalAlign="middle">
                                <SuiGridColumn>
                                    <div class="ui label" style="margin-right: 0px">
                                        <SuiButton size="mini" style="margin-right: 10px" disabled>ESC</SuiButton>Accéder au menu
                                    </div>
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
// import RawDataMessage, {
// } from "./types/RawDataMessage";



@Component
export default class Fight extends Vue {
    @Ref("videoCanvas") private videoCanvas?: HTMLCanvasElement;
    
    private cameraUrl!: string;
    
    mounted(): void {
        this.cameraUrl = this.$route.params.socketUrl;

        if (!this.cameraUrl || !this.cameraUrl.length) {
            this.$router.back();
        }        
        console.log(this.cameraUrl)
        new jsmpeg(this.cameraUrl, { canvas: this.videoCanvas });
        // const client: WebSocket = new WebSocket(this.cameraUrl);
        // new jsmpeg(client, { canvas: this.videoCanvas });
    }
}
</script>

<style lang="less">
#Fight {
    height: 100%;
    background: linear-gradient(rgba(0, 0, 0, 0.4), #00000099), url("/background.jpg");
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