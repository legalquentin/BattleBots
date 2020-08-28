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
      <SuiGridRow verticalAlign="middle" align="left" id="create-game-panel-body">
        <SuiGridColumn class="huge-column">
          <SuiSegment class="huge-segment" raised stacked="tall">
            <SuiHeader
              sub
              inverted
              style="margin-bottom: 15px"
            >{{ openGames.length ? 'Parties Ouvertes' : 'Aucune partie' }}</SuiHeader>
            <SuiMessage
              error
              v-if="errorJoin"
            >Une erreur s'est produite. Essayez de rejoindre une autre partie ou d'en créer une nouvelle</SuiMessage>
            <sui-card-group stackable class="centered" :items-per-row="3">
              <sui-card
                v-for="openGame in openGames"
                :key="openGame.id"
                @click="joinGame(openGame.id)"
              >
                <sui-dimmer-dimmable>
                  <a
                    class="ui massive right corner label"
                    style="border-color: transparent; opacity: 0.7"
                  >
                    <i class="mouse pointer icon"></i>
                  </a>

                  <sui-dimmer blurring>
                    <!-- <sui-button inverted>Add Friend</sui-button> -->
                  </sui-dimmer>
                </sui-dimmer-dimmable>
                <sui-card-content>
                  <sui-card-header>{{ openGame.name }}</sui-card-header>
                  <sui-card-meta>{{ formatDate(openGame.createdAt) }}</sui-card-meta>
                </sui-card-content>
                <sui-card-content extra>
                  <sui-icon name="unlock" color="blue" />Ouverte
                </sui-card-content>
                <sui-card-content extra>
                  <sui-icon name="user" color="violet" />2 joueurs minimum
                </sui-card-content>
                <sui-card-content extra>
                  <sui-icon name="users" color="violet" />2 joueurs maximum
                </sui-card-content>
              </sui-card>
            </sui-card-group>
          </SuiSegment>
        </SuiGridColumn>
      </SuiGridRow>

      <SuiGridRow verticalAlign="middle" align="left" id="list-games-panel-body-closed">
        <SuiGridColumn class="huge-column">
          <SuiSegment class="huge-segment" raised stacked="tall">
            <SuiHeader
              sub
              inverted
              style="margin-bottom: 15px"
            >{{ closedGames.length ? 'Parties Fermées' : 'Aucune partie terminée' }}</SuiHeader>
            <sui-card-group stackable :items-per-row="3">
              <sui-card v-for="closedGame in closedGames" :key="closedGame.id">
                <sui-dimmer-dimmable>
                  <a
                    class="ui massive right corner label"
                    style="border-color: transparent; opacity: 0.7"
                  >
                    <!-- <i class="mouse pointer icon"></i> -->
                  </a>

                  <sui-dimmer blurring>
                    <!-- <sui-button inverted>Add Friend</sui-button> -->
                  </sui-dimmer>
                </sui-dimmer-dimmable>
                <sui-card-content>
                  <sui-card-header>{{ closedGame.name }}</sui-card-header>
                  <sui-card-meta>{{ formatDate(closedGame.createdAt) }}</sui-card-meta>
                </sui-card-content>
                <sui-card-content extra>
                  <SuiGrid verticalAlign="middle" stackable>
                    <SuiGridRow :columns="2">
                      <SuiGridColumn :width="6">
                        <sui-icon name="lock" color="red" />Fermée
                      </SuiGridColumn>
                      <SuiGridColumn :width="10" align="right">
                        <SuiButtonGroup size="mini">
                        <SuiButton size="mini" basic color="red">Replay</SuiButton>
                        <SuiButton size="mini" basic color="blue" @click="infoPage(closedGames.id)" style="z-index: 1000">Infos</SuiButton>
                        </SuiButtonGroup>
                      </SuiGridColumn>
                      
                    </SuiGridRow>
                  </SuiGrid>
                </sui-card-content>
                <SuiCardContent extra>
                  <sui-icon name="flag checkered" color="violet" />Gagnant : Plume
                </SuiCardContent>
                <!-- <sui-card-content extra>
                  <sui-icon name="trash" color="red" /><a>ADMIN : supprimer la partie</a>
                </sui-card-content>-->
              </sui-card>
            </sui-card-group>
          </SuiSegment>
        </SuiGridColumn>
      </SuiGridRow>
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
  
  constructor() {
    super();
  }
  infoPage(gameId) {
    alert("ok")
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

  async joinGame(gameId: number): Promise<void> {
    this.errorJoin = false;

    if (!this.$store.isLogged) {
      return this.permissionDenied();
    }

    try {
      const response: AxiosResponse = await this.$api.joinGame(gameId);
      this.$router.push({
        name: "FightFrame",
        params: { gameInfos: response.data.data, gameId } as any,
      });
    } catch (e) {
      console.error(e);
      this.errorJoin = true;
    }
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