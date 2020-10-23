<template>
  <AbstractPanel name="ListGamesPanel">
    <template #header>
      <SuiGridRow>
        <SuiGridColumn>
          <SuiHeader inverted size="huge">Liste des parties</SuiHeader>
        </SuiGridColumn>
      </SuiGridRow>
    </template>
    <template #body>
      <div id="parent">
      <SuiGridRow align="left" id="create-game-panel-body">
        <SuiGridColumn class="huge-column">
          <SuiSegment class="huge-segment" raised stacked="tall" style="height: auto; overflow-y: hidden">
            <div class="ui dimmer" :class="{active: isLoading}">
              <div class="ui text loader">Loading</div>
            </div>
            <SuiHeader
              sub
              inverted
              style="margin-bottom: 15px"
            >{{ openGames.length ? 'Parties Ouvertes' : 'Aucune partie ouverte' }}</SuiHeader>
            <SuiButton size="medium" class="bb-button" @click="$router.push({ name: 'CreateGamePanel' })" v-if="!openGames.length">Créer une nouvelle partie</SuiButton>
            <SuiMessage
              error
              v-if="errorJoin"
            >Une erreur s'est produite. Essayez de rejoindre une autre partie ou d'en créer une nouvelle</SuiMessage>
            <SuiCardGroup stackable class="centered" :items-per-row="3">
              <SuiCard
                v-for="openGame in openGames"
                :key="openGame.id"
                @click="joinGame(openGame.id)"
              >
                <SuiCard-content>
                  <SuiCard-header>{{ openGame.name }}</SuiCard-header>
                  <SuiCard-meta>{{ formatDate(openGame.createdAt) }}</SuiCard-meta>
                </SuiCard-content>
                <SuiCard-content extra>
                  <sui-icon name="unlock" color="blue" />Ouverte
                </SuiCard-content>
                <SuiCard-content extra>
                  <sui-icon name="user" color="violet" />2 joueurs minimum
                </SuiCard-content>
                <SuiCard-content extra>
                  <sui-icon name="users" color="violet" />2 joueurs maximum
                </SuiCard-content>
                <SuiCard-content extra style="text-align: center">
                  <SuiButton basic color="red" @click.stop="deleteGame(openGame.id)">Supprimer la partie</SuiButton>
                </SuiCard-content>
              </SuiCard>
            </SuiCardGroup>
          </SuiSegment>
        </SuiGridColumn>
      </SuiGridRow>

      <SuiGridRow align="left" id="list-games-panel-body-closed">
        <SuiGridColumn class="huge-column">
          <SuiSegment class="huge-segment" raised stacked="tall">
            <SuiHeader
              sub
              inverted
              style="margin-bottom: 15px"
            >{{ closedGames.length ? 'Parties Fermées' : 'Aucune partie terminée' }}</SuiHeader>
            <SuiCardGroup stackable :items-per-row="3">
              <SuiCard v-for="closedGame in closedGames" :key="closedGame.id">
                <sui-dimmer-dimmable>
                  <a
                    class="ui massive right corner label"
                    style="border-color: transparent; opacity: 0.7"
                  >
                    <!-- <i class="mouse pointer icon"></i> -->
                  </a>

                  <sui-dimmer blurring>
                    <!-- <SuiButton inverted>Add Friend</SuiButton> -->
                  </sui-dimmer>
                </sui-dimmer-dimmable>
                <SuiCard-content>
                  <SuiCard-header>{{ closedGame.name }}</SuiCard-header>
                  <SuiCard-meta>{{ formatDate(closedGame.createdAt) }}</SuiCard-meta>
                </SuiCard-content>
                <SuiCard-content extra>
                  <SuiGrid verticalAlign="middle" stackable>
                    <SuiGridRow :columns="2">
                      <SuiGridColumn :width="2">
                        <sui-icon name="lock" color="red" />
                      </SuiGridColumn>
                      <SuiGridColumn :width="13" align="right">
                        <SuiButtonGroup size="mini">
                        <SuiButton size="mini" basic color="blue" @click="infoPage(closedGame.id)" style="z-index: 1000">Infos</SuiButton>
                        </SuiButtonGroup>
                      </SuiGridColumn>
                      
                    </SuiGridRow>
                  </SuiGrid>
                </SuiCard-content>
                <SuiCardContent extra>
                  <sui-icon name="flag checkered" color="violet" />Arene : Caprica VI
                </SuiCardContent>
                <!-- <SuiCard-content extra>
                  <sui-icon name="trash" color="red" /><a>ADMIN : supprimer la partie</a>
                </SuiCard-content>-->
              </SuiCard>
            </SuiCardGroup>
          </SuiSegment>
        </SuiGridColumn>
      </SuiGridRow>
      </div>
    </template>
    <template #footer>
      <SuiGridRow>
        <SuiGridColumn align="right"></SuiGridColumn>
      </SuiGridRow>
    </template>
  </AbstractPanel>
</template>

<script lang="ts">
import { Vue, Component, Inject } from "vue-property-decorator";
import AbstractPanel from "./AbstractPanel.vue";
import { Global } from "@/Global";
import { AxiosResponse } from "axios";
import moment from "moment";

interface Game {
  createdAt: number;
  id: number;
  name: string;
  status: string; // CREATED
}

@Component({ components: { AbstractPanel } })
export default class ListGamesPanel extends Vue {
  private $store!: Global;
  
  

  private errorJoin = false;
  private openGames: Game[] = [];
  private closedGames: Game[] = [];
  private reloadDataInterval = true;
  private isLoading = true;
  
  constructor() {
    super();
  }
  infoPage(gameId) {
    this.$router.push({ name: 'StatsPanel', params: { gameId } })
  }
  created(): void {
    this.$store = this.$global;
    this.reloadDatas();
    
    // use window. to bypass typescipt invalid type error    
    this.$api.$on('DISABLE_AUTO_REFRESH', () => {
      this.reloadDataInterval = false;
    });

    this.$api.$on('ENABLE_AUTO_REFRESH', () => {
      this.reloadDataInterval = true;
    });
  }


  private async reloadDatas(): Promise<void> {
    this.$store.isGameListInit = true;
    try {
      const response: AxiosResponse = await this.$api.getGameList();
      this.openGames = [];
      this.closedGames = [];
      this.isLoading = false;
      response.data.data.forEach((game: Game) => {
        if (game.status === "CREATED") {
          return this.openGames.push(game);
        }
        this.closedGames.push(game);
      });

      setTimeout(() => {
        if (this.reloadDataInterval) {
          return this.reloadDatas();
        }
      }, 5000);
    } catch (e) {
      setTimeout(() => {
        if (this.reloadDataInterval) {
          return this.reloadDatas();
        }
      }, 5000);
    }
  }

  // TODO : move to CreateGamePanel
  async joinGame(gameId: number): Promise<void> {
    // this.errorJoin = false;

    // if (!this.$store.isLogged) {
    //   return this.permissionDenied();
    // }

    // try {
    //   const response: AxiosResponse = await this.$api.joinGame(gameId);
    //   this.$router.push({
    //     name: "FightFrame",
    //     params: { gameInfos: response.data.data, gameId } as any,
    //   });
    // } catch (e) {
    //   console.error(e);
    //   this.errorJoin = true;
    // }
    this.$router.push({
      name: "CreateGamePanel",
      params: { gameId, gameInfos: this.openGames.find((game: any) => game.id === gameId) } as any,
    });
  }

  deleteGame(gameId: number): void {
    this.openGames = this.openGames.filter((openGame: any) => openGame.id !== gameId);
    this.$api.delete(gameId);
  }


  private formatDate(timestamp: number): string {
    return moment(timestamp).format("DD/MM/YYYY - HH:mm");
  }

  @Inject() permissionDenied!: () => void;

  beforeDestroy(): void {
    this.reloadDataInterval = false;
  }
}
</script>

<style lang="less">
#list-games-panel-body-closed {
  margin-top: 10px;
}

#parent {
  overflow-y:scroll;
  height: calc(100vh - 150px);
  width: 100%;
}

#parent::-webkit-scrollbar-thumb {
  background-color: white
}

#create-game-panel-body,
#list-games-panel-body-closed {
  .card .ui.grid {
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 12px;
    padding-bottom: 12px;
  }

  .rating {
    margin-left: 20px;
  }

  @media (max-width: 807px) {
    .card .ui.grid .column {
      padding-top: 0px !important;
      padding-bottom: 0px !important;
    }

    .rating {
      margin-left: 0px;
    }
  }
}
</style>