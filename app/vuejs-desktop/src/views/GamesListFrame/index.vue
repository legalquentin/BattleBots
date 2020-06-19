<template src="./template.html"></template>

<style lang="less" scoped>
  .game-name {
    display: block;
    overflow-x: hidden;
    overflow-y: hidden;
    max-height: 50px;
  }
</style>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import axios, { AxiosError, AxiosResponse } from 'axios';
import _ from 'lodash';

import AVue from '../AVue';

import IGame from '../../types/IGame';

import EndOfGameModal from '../../components/Modals/EndOfGameModal.vue';



@Component({
  components: { EndOfGameModal }
})
export default class GamesListFrame extends AVue {
  private gamesList: IGame[] = [];
  private disconnectModal: boolean = false;

  protected async displayed() {
    const jwt: string|null = localStorage.getItem('jwt');
    if (!_.size(jwt)) {
      this.$router.push({ name: 'MainFrame' });
    }
    
    this.connectionManager.getGameList().then((response: AxiosResponse) => {
      this.gamesList = _.get(response, 'data.data', null);
    }).catch((error: AxiosError|string) => {
      if (error === "LoginFrame") {
        return this.$router.push({ name: 'LoginFrame' });
      }
      console.error(error);
    })

    document.body.className = "";
  }

  private async joinGame(gameId: number) {
    const jwt: string|null = localStorage.getItem('jwt');
    if (!_.size(jwt)) {
      this.$router.push({ name: 'MainFrame' });
    }

    this.connectionManager
      .joinGame(gameId)
      .then((response: AxiosResponse) => {
        this.$router.push({
          name: "GameFrame",
          params: { gameInfos: response.data.data, gameId } as any
        });
      })
      .catch((error: AxiosError) => {
        console.error(error);
      })
  }

  private async deleteGame(gameId: number) {
    const jwt: string|null = localStorage.getItem('jwt');
    if (!_.size(jwt)) {
      this.$router.push({ name: 'MainFrame' });
    }

    this.connectionManager.delete(gameId)
      .then((response: AxiosResponse) => {
        this.gamesList = _.filter(this.gamesList, (game: IGame) => game.id !== gameId);
      }).catch((err: AxiosError) => {
        console.error(err);
      })
    ;
  }

  disconnect() {
    this.disconnectModal = false;
    localStorage.removeItem('jwt');
    this.$router.push({ name: 'MainFrame' });
  }

}
</script>