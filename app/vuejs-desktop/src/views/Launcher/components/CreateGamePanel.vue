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
                <a class="ui massive right corner label" style="border-color: transparent; opacity: 0.7">
                  <i class="mouse pointer icon"></i>
                </a>
                <sui-image
                    src="https://4.bp.blogspot.com/-1gMZZms4XcM/W8JgGB1PbyI/AAAAAAAAdiA/3fBsdu1p3gIPuqpWQitpJLiChZyMLgqhgCLcBGAs/s1600/razorback-rearshot.jpg"
                />
                <sui-card-content>
                  <sui-card-header>Razorback</sui-card-header>
                  <sui-card-meta>Create in Sep 4240</sui-card-meta>
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

              <sui-card :class="{ active: isActive[1] }" @click="setActive(1)">
                <sui-dimmer-dimmable
                  
                >
                <a class="ui massive right corner label" style="border-color: transparent; opacity: 0.7">
                  <i class="mouse pointer icon"></i>
                </a>
                  <sui-image
                    src="https://cdna.artstation.com/p/assets/images/images/012/579/212/4k/jason-clarke-roci-overflight-final-f000.jpg"
                  />
                  <sui-dimmer blurring>
                    <!-- <sui-button inverted>Add Friend</sui-button> -->
                  </sui-dimmer>
                </sui-dimmer-dimmable>
                <sui-card-content>
                  <sui-card-header>Rocinante</sui-card-header>
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