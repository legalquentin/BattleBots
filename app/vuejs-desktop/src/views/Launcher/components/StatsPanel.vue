<template>
  <AbstractPanel name="StatsPanel">
    <template #header>
      <SuiGridRow>
        <SuiGridColumn>
          <SuiHeader inverted size="huge">Statistiques</SuiHeader>
        </SuiGridColumn>
      </SuiGridRow>
    </template>
    <template #body>
      <SuiGridRow :columns="1" verticalAlign="middle">
        <SuiGridColumn style="margin-top: 20px" textAlign="left" :width="6">
          <SuiContainer>
            <SuiSegment class="huge-segment" inverted raised stacked style="min-height: 200px">
              <SuiGrid>
                <SuiGridRow :columns="3" style="margin-top: 6px">
                  <SuiGridColumn :width="6">
                    <sui-statistic size="tiny" inverted>
                      <sui-statistic-value style="color: purple">{{ data.name }}</sui-statistic-value>
                      <sui-statistic-label>NOM PARTIE</sui-statistic-label>
                    </sui-statistic>
                  </SuiGridColumn>

                  <SuiGridColumn :width="10">
                    <SuiGrid>
                      <SuiGridRow :columns="2" textAlign="center">
                        <SuiGridColumn>
                          <sui-statistic size="mini" inverted>
                            <sui-statistic-value>{{ numberOfPlayers }}</sui-statistic-value>
                            <sui-statistic-label>Nombre de joueurs</sui-statistic-label>
                          </sui-statistic>
                        </SuiGridColumn>
                        <SuiGridColumn>
                          <sui-statistic size="mini" inverted>
                            <sui-statistic-value
                            >{{ moment.unix(data.createdAt).format('DD/MM/YYYY HH:mm:ss') }}</sui-statistic-value>
                            <sui-statistic-label>date</sui-statistic-label>
                          </sui-statistic>
                        </SuiGridColumn>
                      </SuiGridRow>
                    </SuiGrid>
                  </SuiGridColumn>
                </SuiGridRow>
              </SuiGrid>
            </SuiSegment>
            <SuiGrid style="margin-top: 60px">
              <SuiGridRow>
                <SuiGridColumn>
                  <SuiHeader>Combatants</SuiHeader>
                </SuiGridColumn>
              </SuiGridRow>
            </SuiGrid>
            <SuiGrid style="margin-top: -10px">
              <SuiGridRow :columns="1" verticalAlign="middle" style="margin-top: 6px">
                <SuiGridColumn>
                  <SuiCardGroup center>
                    <sui-card class="centered" v-for="player in data.players" :key="player.id">
                      <sui-card-content>
                        <sui-card-header>
                          <!-- <SuiIcon name="user" color="violet"></SuiIcon> -->
                          {{ player.pseudo }}
                        </sui-card-header>
                      </sui-card-content>
                      <sui-card-content>
                        <sui-header size="small">ROBOT</sui-header>
                        <!--
                                sui-feed is not available yet, therefore base semantic ui has been substituted for now
                        -->
                        <div class="ui small feed">
                          <div class="event">
                            <div class="content">
                              <div class="summary">
                                <b>
                                  <a>NOM</a>
                                </b>
                                 {{ player.botSpecs.name }}
                              </div>
                            </div>
                          </div>
                          <div class="event">
                            <div class="content">
                              <div class="summary">
                                <a>Dommage</a>{{player.botSpecs}}
                              </div>
                            </div>
                          </div>
                          <div class="event">
                            <div class="content">
                              <div class="summary">
                                <a>Resistance</a>
                                player.botSpecs.armor
                              </div>
                            </div>
                          </div>
                          <div class="event">
                            <div class="content">
                              <div class="summary">
                                <a>Touché</a>
                                player.botSpecs.taken
                              </div>
                            </div>
                          </div>
                          <div class="event">
                            <div class="content">
                              <div class="summary">
                                <a>Vitesse</a>
                                player.botSpecs.speed %
                              </div>
                            </div>
                          </div>
                          <div class="event">
                            <div class="content">
                              <div class="summary">
                                <a>Vitesse de tir</a>
                                player.botSpecs.fireRate t/s
                              </div>
                            </div>
                          </div>
                        </div>
                        <!-- end of base semantic ui, to be updated in the future with sui-feed -->
                      </sui-card-content>
                      <sui-card-content extra>
                        <SuiButton
                          color="blue"
                          circular
                          style="background-color: #3b5998"
                          label-position="right"
                          icon="video"
                          @click.native="replayModal = true"
                        >Revoir la partie</SuiButton>
                      </sui-card-content>
                    </sui-card>
                  </SuiCardGroup>
                </SuiGridColumn>
              </SuiGridRow>
            </SuiGrid>
          </SuiContainer>
        </SuiGridColumn>
      </SuiGridRow>
    </template>
    <template #footer>
      <SuiGridRow :columns="2">
        <SuiGridColumn align="right" :width="12"></SuiGridColumn>
      </SuiGridRow>
    </template>
  </AbstractPanel>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Route } from "vue-router";
import AbstractPanel from "./AbstractPanel.vue";
import { Global } from "@/Global";
import _ from "lodash";
import { AxiosResponse, AxiosError } from "axios";
import moment from 'moment';

@Component({ components: { AbstractPanel } })
export default class RegisterPanel extends Vue {
  private gameId!: number;

  private $store!: Global;
  s3Url = "";
  data: any = {
    botSpecs: {}
  };
  moment = moment;

  numberOfPlayers = 0;

  created(): void {
    this.$store = this.$global;
  }

  mounted(): void {
    this.gameId = this.$route.params.gameId as any;
    if (this.gameId === undefined) {
      this.$router.push({ name: 'ListGamesPanel' });
    }
    this.$api.getGameResult(this.gameId).then((response: AxiosResponse) => {
        // this.s3Url = response.data.data.players[0].botSpecs.streams[0].s3Url;      
        this.data = response.data.data;
        this.numberOfPlayers = this.data.players.length;
    }).catch((err: AxiosError) => console.error(err));
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

<style lang="less" scoped>
.huge-segment {
  padding-top: 0px !important;
}
label {
  margin-top: 30px !important;
}
</style>