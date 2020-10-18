<template>
  <AbstractPanel name="CreateGamePanel">
    <template #header>
      <SuiGridRow>
        <SuiGridColumn>
          <SuiHeader inverted size="huge">Créer une nouvelle partie</SuiHeader>
        </SuiGridColumn>
      </SuiGridRow>
    </template>
    <template #body>
      <SuiGridRow verticalAlign="middle" align="left" id="create-game-panel-body">
        <SuiGridColumn class="huge-column dimmer active">
          <SuiSegment class="huge-segment" raised :style="{height: !isWaitingForPlayer ? 'auto' : 'calc(100vh - 200px)'}">
            <SuiHeader v-if="!isWaitingForPlayer" sub inverted style="margin-bottom: 15px">Nom de la partie</SuiHeader>
            <sui-input v-if="!isWaitingForPlayer" v-model="gameName" size="big" fluid placeholder="Iron Clash III" icon="pencil" style="z-index: 1" />
            <SuiMessage v-if="gameNameError" error>Indiquer un nom de partie est obligatoire</SuiMessage>
            <!-- <SuiDivider v-if="!isWaitingForPlayer" /> -->
            <SuiHeader v-if="isWaitingForPlayer" sub inverted style="margin-bottom: 15px">Choix de votre robot</SuiHeader>
            <sui-card-group v-if="isWaitingForPlayer" stackable :items-per-row="3">
              <sui-card :class="{ active: isActive[0] }" @click="setActive(0)">
                <sui-dimmer-dimmable
                  
                >
                <a class="ui massive right corner label" style="border-color: transparent; opacity: 0.7">
                  <i class="mouse pointer icon"></i>
                </a>
                  <sui-image
                    src="https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQZvHg9JsXT0Rs5avryEueIpCdaoBTQa_Il3XjP-F_Qo1SikB69lRGpW0HGFFrnYhbJOM6bemg5Sg&usqp=CAc"
                  />
                </sui-dimmer-dimmable>
                <sui-card-content>
                  <sui-card-header>R2</sui-card-header>
                  <sui-card-meta>Create in Sep 4231</sui-card-meta>
                </sui-card-content>
                <sui-card-content extra>
                  <sui-icon name="heart" color="red" />15 de vie
                </sui-card-content>
                <sui-card-content extra>
                  <sui-icon name="lightning" color="yellow" />200 d'énergie
                </sui-card-content>
                <sui-card-content extra>
                  
                  <SuiGrid verticalAlign="middle" stackable align="left">
                    <SuiGridRow>
                      <SuiGridColumn>
                        <sui-icon name="fire" color="orange" />Dissipation thermique
                      </SuiGridColumn>
                    </SuiGridRow>
                    <SuiGridRow>
                      <SuiGridColumn>
                        <sui-rating icon="home" color="orange" style="pointer-events: none;" :rating="2" :max-rating="4" />
                      </SuiGridColumn>
                    </SuiGridRow>
                  </SuiGrid>
                  
                </sui-card-content>
              </sui-card>

              <sui-card :class="{ active: isActive[1] }" @click="setActive(1)">
                <sui-dimmer-dimmable
                  
                >
                <a class="ui massive right corner label" style="border-color: transparent; opacity: 0.7">
                  <i class="mouse pointer icon"></i>
                </a>
                  <sui-image
                    src="data:image/jpeg;base64,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"
                  />
                  <sui-dimmer blurring>
                    <!-- <sui-button inverted>Add Friend</sui-button> -->
                  </sui-dimmer>
                </sui-dimmer-dimmable>
                <sui-card-content>
                  <sui-card-header>C3PO</sui-card-header>
                  <sui-card-meta>Create in Sep 4220</sui-card-meta>
                </sui-card-content>
                <sui-card-content extra>
                  <sui-icon name="heart" color="red" />1 de vie
                </sui-card-content>
                <sui-card-content extra>
                  <sui-icon name="lightning" color="yellow" />2 d'énergie
                </sui-card-content>
                <sui-card-content extra>
                  
                  <SuiGrid verticalAlign="middle" stackable align="left">
                    <SuiGridRow>
                      <SuiGridColumn>
                        <sui-icon name="fire" color="orange" />Dissipation thermique
                      </SuiGridColumn>
                    </SuiGridRow>
                    <SuiGridRow>
                      <SuiGridColumn>
                        <sui-rating icon="home" color="orange" style="pointer-events: none;" :rating="0" :max-rating="4" />
                      </SuiGridColumn>
                    </SuiGridRow>
                  </SuiGrid>
                  
                </sui-card-content>
              </sui-card>

              <sui-card :class="{ active: isActive[2] }" @click="setActive(2)">
                <sui-dimmer-dimmable
                  
                >
                <a class="ui massive right corner label" style="border-color: transparent; opacity: 0.7">
                  <i class="mouse pointer icon"></i>
                </a>
                  <sui-image
                    src="data:image/jpeg;base64,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"
                  />
                  <sui-dimmer blurring>
                    <!-- <sui-button inverted>Add Friend</sui-button> -->
                  </sui-dimmer>
                </sui-dimmer-dimmable>
                <sui-card-content>
                  <sui-card-header>C3PO</sui-card-header>
                  <sui-card-meta>Create in Sep 4220</sui-card-meta>
                </sui-card-content>
                <sui-card-content extra>
                  <sui-icon name="heart" color="red" />1 de vie
                </sui-card-content>
                <sui-card-content extra>
                  <sui-icon name="lightning" color="yellow" />2 d'énergie
                </sui-card-content>
                <sui-card-content extra>
                  
                  <SuiGrid verticalAlign="middle" stackable align="left">
                    <SuiGridRow>
                      <SuiGridColumn>
                        <sui-icon name="fire" color="orange" />Dissipation thermique
                      </SuiGridColumn>
                    </SuiGridRow>
                    <SuiGridRow>
                      <SuiGridColumn>
                        <sui-rating icon="home" color="orange" style="pointer-events: none;" :rating="0" :max-rating="4" />
                      </SuiGridColumn>
                    </SuiGridRow>
                  </SuiGrid>
                  
                </sui-card-content>
              </sui-card>
            </sui-card-group>
          </SuiSegment>
        </SuiGridColumn>
      </SuiGridRow>
    </template>
    <template #footer>
      <SuiGridRow>
        <SuiGridColumn align="right">
          <SuiButton
            v-if="!isWaitingForPlayer"
            size="huge"
            style="border: 2px solid rgb(21,77,117); color: white; background: background: rgb(8,73,177);
background: linear-gradient(180deg, rgba(8,73,177,1) 0%, rgba(39,115,134,1) 43%, rgba(39,115,134,1) 49%, rgba(39,115,134,1) 55%, rgba(22,51,128,1) 100%);"
            @click="createGame()"
            :loading="isCreatingGame"
          >Créer la partie</SuiButton>
          <SuiButton
            v-else
            size="huge"
            style="border: 2px solid rgb(21,77,117); color: white; background: background: rgb(8,73,177);
background: linear-gradient(180deg, rgba(8,73,177,1) 0%, rgba(39,115,134,1) 43%, rgba(39,115,134,1) 49%, rgba(39,115,134,1) 55%, rgba(22,51,128,1) 100%);"
            :disabled="isActive.every((isActive) => !isActive)"
            @click="joinGame()"
          >Rejoindre la partie</SuiButton>
          <!-- linear-gradient(rgb(37,107,132), rgb(21,77,117)) -->
        </SuiGridColumn>
      </SuiGridRow>
    </template>
  </AbstractPanel>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import AbstractPanel from "./AbstractPanel.vue";

@Component({ components: { AbstractPanel } })
export default class HomePanel extends Vue {
  private $store!: Global;

  private gameName = '';
  private gameNameError = false;
  private isCreatingGame = false;
  private isWaitingForPlayer = false;
  private isDirectlyWaitingForPlayer = false;

  private gameInfos!: any;

  private isActive: boolean[] = [false, false, false];
  private activeIndex = -1;

  public created() {
    this.$store = this.$global;
  }

  public mounted() {
    const gameId: number|undefined = this.$route.params.gameId;
    if (gameId) {
      this.isWaitingForPlayer = true;
      this.isDirectlyWaitingForPlayer = true;
    }
    if (this.$route.params.gameInfos && !this.gameInfos) {
      this.gameInfos = this.$route.params.gameInfos;
    }
  }

  private setActive(activeIndex: number): void {
    this.activeIndex = activeIndex;
    this.isActive = [false, false, false];
    this.isActive[activeIndex] = !this.isActive[activeIndex];
  }

  private async createGame(): Promise<void> {
    if (!this.gameName.length) {
      this.gameNameError = true;
      return;
    }

    try {
      this.isCreatingGame = true;
      this.gameInfos = (await this.$api.createGame(this.gameName)).data;

      this.isCreatingGame = false;
      this.isWaitingForPlayer = true;
      // alert('should redirect')
    } catch(e) {
      console.log(e);
    }
  }

  async joinGame(): Promise<void> {
    this.errorJoin = false;

    if (!this.$store.isLogged) {
      return this.permissionDenied();
    }
    console.log(this.gameInfos)
    if (this.isDirectlyWaitingForPlayer) {
      try {
        const response: AxiosResponse = await this.$api.joinGame(this.gameInfos.id, this.activeIndex + 1);
        this.$router.push({
          name: "FightFrame",
          params: { gameInfos: this.gameInfos, gameId: this.gameInfos.data.id } as any,
        });
      } catch (e) {
        console.error(e);
        this.errorJoin = true;
      }
      return;
    }
    try {
      const response: AxiosResponse = await this.$api.joinGame(this.gameInfos.data.id, this.activeIndex + 1);
      this.$router.push({
        name: "FightFrame",
        params: { gameInfos: response.data.data, gameId: this.gameInfos.data.id } as any,
      });
    } catch (e) {
      console.error(e);
      this.errorJoin = true;
    }
  }

  @Watch('gameName')
  private setGameNameError(): void {
    this.gameNameError = false;
  }
}
</script>

<style lang="less">
  #create-game-panel-body {
    .huge-segment {
      height: calc(100vh - 200px);
      overflow-y: scroll;

      &::-webkit-scrollbar-thumb {
        background-color: white
      }
    }

    .card .ui.grid {
      padding-left: 0px;
      padding-right: 0px;
      padding-top: 12px;
      padding-bottom: 12px
    }

  .rating {
      margin-left: 20px
  }

  .ui.card {
    border: 3px solid transparent;
  }

  .ui.card.active {
    opacity: 1;
    border: 3px solid #0849b1;
    box-shadow: 0 0 15px #0849b1;
  }  

  @media (max-width: 807px){
    .card .ui.grid .column {
      padding-top: 0px !important;
      padding-bottom: 0px !important;
    }

    .rating {
      margin-left: 0px;
      ;
    }
  }
    
  }
</style>