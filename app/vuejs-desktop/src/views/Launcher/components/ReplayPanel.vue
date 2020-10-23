<template>
  <AbstractPanel name="ReplayPanel">
    <template #header>
      <SuiGridRow>
        <SuiGridColumn>
          <SuiHeader inverted size="huge">Liste des parties terminées</SuiHeader>
        </SuiGridColumn>
      </SuiGridRow>
    </template>
    <template #body>
      <SuiGridRow verticalAlign="middle" align="left" id="list-games-panel-body-closed">
        <SuiGridColumn class="huge-column">
          <SuiSegment class="huge-segment" raised stacked="tall" style="height: calc(100vh - 150px); overflow-y: scroll">
            <div class="ui dimmer" :class="{active: isLoading}">
              <div class="ui text loader">Loading</div>
            </div>
            <SuiHeader sub inverted style="margin-bottom: 15px">Cliquez sur une partie pour visionner le replay</SuiHeader>
            <SuiCardGroup stackable :items-per-row="3">
              <SuiCard v-for="game in closedGames" :key="game.id">
                <SuiCard-content>
                  <SuiCard-header>{{ game.name }}</SuiCard-header>
                  <SuiCard-meta>{{ formatDate(game.createdAt) }}</SuiCard-meta>
                </SuiCard-content>
                <SuiCardContent extra>
                  <SuiGrid verticalAlign="middle" stackable>
                    <SuiGridRow :columns="1">
                      <SuiGridColumn align="center">
                        <SuiButtonGroup size="mini">
                        <SuiButton size="mini" basic color="red" @click="getStatsForReplay(game.id)" :loading="isLoadingStatsForReplay">Replay</SuiButton>
                        <SuiButton size="mini" basic color="blue" @click="$router.push({ name: 'StatsPanel', params: { gameId: game.id } })" style="z-index: 1000">Infos</SuiButton>
                        </SuiButtonGroup>
                      </SuiGridColumn>
                    </SuiGridRow>
                  </SuiGrid>
                </SuiCardContent>
                <SuiCardContent extra>
                    <sui-icon name="flag checkered" color="violet" />Gagnant : Plume
                </SuiCardContent>
                <!-- <SuiCard-content extra>
                  <sui-icon name="trash" color="red" /><a>ADMIN : supprimer la partie</a>
                </SuiCard-content> -->
                
              </SuiCard>
            </SuiCardGroup>
          </SuiSegment>
        </SuiGridColumn>
      </SuiGridRow>
    </template>
    <template #footer>
      <SuiGridRow>
        <SuiGridColumn align="right">
        </SuiGridColumn>
      </SuiGridRow>
    </template>
  </AbstractPanel>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import AbstractPanel from "./AbstractPanel.vue";
import { Global } from '@/Global';
import { AxiosResponse } from 'axios';
import moment from 'moment';
import _ from 'lodash';

interface Game {
  createdAt: number;
  id: number;
  name: string;
  status: string; // CREATED
}

@Component({ components: { AbstractPanel } })
export default class ReplayPanel extends Vue {
  private $store!: Global;

  private openGames: Game[] = [];
  private closedGames: Game[] = [];
  private reloadDataInterval = true;
  private isLoadingStatsForReplay = false;

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

  private formatDate(timestamp: number): string {
    return moment(timestamp).format("DD/MM/YYYY - HH:mm");
  }

  private getStatsForReplay(gameId: number): string {
    this.isLoadingStatsForReplay = true;
    this.$api.getGameResult(gameId).then((gameInfos) => {
      const gameInfo: any = gameInfos.data.data;
      const s3Url: string = _.first(gameInfo.players[0].botSpecs.streams).s3Url;
      this.isLoadingStatsForReplay = false;
      this.$router.push({ name: 'ReplayFightFrame', params: { socketUrl: s3Url } });
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
}
</script>

<style lang="less">

  #list-games-panel-body-closed {
    .card .ui.grid {
      padding-left: 0px;
      padding-right: 0px;
      padding-top: 12px;
      padding-bottom: 12px
    }

  .rating {
      margin-left: 20px
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