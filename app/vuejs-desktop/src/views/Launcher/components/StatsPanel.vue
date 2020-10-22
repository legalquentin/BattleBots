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
    <SuiGridRow :columns="1"  v-if="data">
        <SuiGridColumn style="margin-top: 20px" textAlign="left" :width="16">
            <SuiSegment class="huge-segment" inverted raised stacked>
                <div class="ui dimmer" :class="{active: isLoading}">
                  <div class="ui text loader">Loading</div>
                </div>
                <SuiGrid style="height: 80px" verticalAlign="middle" align="center">
                    <SuiGridRow :columns="2" style="margin-top: 6px">
                        <SuiGridColumn :width="6">
                            <sui-statistic size="tiny" inverted>
                                <sui-statistic-value class="micro">{{ data.name }}</sui-statistic-value>
                                <sui-statistic-label>Nom de la partie</sui-statistic-label>
                            </sui-statistic>
                        </SuiGridColumn>
    
                        <SuiGridColumn :width="10">
                            <SuiGrid>
                                <SuiGridRow :columns="2" textAlign="center">
                                    <SuiGridColumn>
                                        <sui-statistic size="mini" inverted>
                                            <sui-statistic-value class="micro">{{ numberOfPlayers }}</sui-statistic-value>
                                            <sui-statistic-label>Joueurs</sui-statistic-label>
                                        </sui-statistic>
                                    </SuiGridColumn>
                                    <SuiGridColumn>
                                        <sui-statistic size="mini" inverted>
                                            <sui-statistic-value class="micro">{{ moment.unix(data.createdAt).format('DD/MM/YYYY HH:mm:ss') }}</sui-statistic-value>
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
                        <SuiHeader inverted size="huge">Combatants</SuiHeader>
                    </SuiGridColumn>
                </SuiGridRow>
            </SuiGrid>
            <SuiGrid v-if="data" class="details cards" style="margin-top: 20px; height: calc(100vh - 350px); overflow-y: scroll">
                <SuiGridRow :columns="1" verticalAlign="middle" style="margin-top: 6px">
                    <SuiGridColumn>
                      <div class="ui dimmer" :class="{active: isLoading}">
                        <div class="ui text loader">Loading</div>
                      </div>
                        <SuiCardGroup center>
                            <sui-card v-for="(player, index) in data.players" :key="player.id">
                                <sui-dimmer-dimmable>
                                    <sui-image v-if="player.botSpecs && player.botSpecs.name === 'Rocinante'" src="https://cdna.artstation.com/p/assets/images/images/012/579/212/4k/jason-clarke-roci-overflight-final-f000.jpg" />
                                    <sui-image v-else src="https://i.pinimg.com/736x/aa/08/29/aa08298584a51bda1a738d64b3484788.jpg" />
                                    <sui-dimmer blurring>
                                    </sui-dimmer>
                                </sui-dimmer-dimmable>
                                <sui-card-content v-if="player.botSpecs">
                                    <SuiButton @click="$router.push({ name: 'ReplayPanel' })">Replay</SuiButton>
                                </sui-card-content>
                                <sui-card-content v-if="player.botSpecs">
                                    <sui-card-header>{{ player.botSpecs.name }}</sui-card-header>
                                    <sui-card-meta>Joueur : {{ player.pseudo }} </sui-card-meta>
                                </sui-card-content>
                                <sui-card-content extra>
                                    <sui-icon name="heart" color="red" />1 de vie
                                </sui-card-content>
                                <sui-card-content extra v-if="player.botSpecs">
                                    <sui-icon name="lightning" color="yellow" />{{ player.botSpecs.energy }} d'énergie
                                </sui-card-content>
                                <sui-card-content extra v-if="player.botSpecs && index === 0">
                                    <span v-if="firstPlayerHealth > secondPlayerHealth"><sui-icon name="flag" color="violet" />Victoire !</span>
                                    <span v-else-if="firstPlayerHealth === secondPlayerHealth"><sui-icon name="flag" color="violet" />Egalité</span>
                                    <span v-else><sui-icon name="flag" color="violet" />Défaite ...</span>
                                </sui-card-content>
                                <sui-card-content extra v-if="player.botSpecs && index === 1">
                                    <span v-if="firstPlayerHealth < secondPlayerHealth"><sui-icon name="flag" color="violet" />Victoire !</span>
                                    <span v-else-if="firstPlayerHealth === secondPlayerHealth"><sui-icon name="flag" color="violet" />Egalité</span>
                                    <span v-else><sui-icon name="flag" color="violet" />Défaite ...</span>
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
                        </SuiCardGroup>
                    </SuiGridColumn>
                </SuiGridRow>
            </SuiGrid>
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
    isLoading = true;

    private firstPlayerHealth = 0;
    private secondPlayerHealth = 0;

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
            this.isLoading = false;
            _.each(this.data.players, (player: any, index: number) => {
              if (index === 0) {
                this.firstPlayerHealth = player.botContext.health;
              } else {
                this.secondPlayerHealth = player.botContext.health;
              }
            });
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

.details.cards .card .image {
  min-width: 340px !important; 
}

.ui.statistic .micro {
  font-size: 20px !important
}
</style>