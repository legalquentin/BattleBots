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
          <SuiSegment class="huge-segment" raised stacked="tall">
            <SuiHeader sub inverted style="margin-bottom: 15px">Cliquez sur une partie pour visionner le replay</SuiHeader>
            <sui-card-group stackable :items-per-row="3">
              <sui-card v-for="game in closedGames" :key="game.id">
                <sui-dimmer-dimmable
                  
                >
                <a class="ui massive right corner label" style="border-color: transparent; opacity: 0.7">
                  <!-- <i class="mouse pointer icon"></i> -->
                </a>
                  
                  <sui-dimmer blurring>
                    <!-- <sui-button inverted>Add Friend</sui-button> -->
                  </sui-dimmer>
                </sui-dimmer-dimmable>
                <sui-card-content>
                  <sui-card-header>{{ game.name }}</sui-card-header>
                  <sui-card-meta>{{ formatDate(game.createdAt) }}</sui-card-meta>
                </sui-card-content>
                <SuiCardContent extra>
                  <SuiButtonGroup size="mini">
                    <SuiButton size="mini" fluid basic color="red">Replay</SuiButton>
                    <SuiButton size="mini" fluid basic color="blue" style="z-index: 1000" @click="$router.push({ name: 'StatsPanel', params: { gameId: game.id } })">Infos</SuiButton>
                  </SuiButtonGroup>
                </SuiCardContent>
                <SuiCardContent extra>
                    <sui-icon name="flag checkered" color="violet" />Gagnant : Plume
                </SuiCardContent>
                <!-- <sui-card-content extra>
                  <sui-icon name="trash" color="red" /><a>ADMIN : supprimer la partie</a>
                </sui-card-content> -->
                
              </sui-card>
            </sui-card-group>
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