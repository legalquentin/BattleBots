<template src="./template.html"></template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import _ from "lodash";
import axios, { AxiosResponse, AxiosError } from "axios";
import AVue from '../AVue';

@Component
export default class CreateGameFrame extends AVue {
  name: string = "";
  gameCreateLoading = false;
  displayed() {
    document.body.className = "";
  }

  async createGame(): Promise<void> {
    const jwt: string | null = localStorage.getItem("jwt");
    if (!_.size(jwt)) {
      this.$router.push({ name: "MainFrame" });
    }
    this.gameCreateLoading = true;
    
  
  try {
    const result = await this.connectionManager.createGame(this.name);

    const gameId: number = result.data.data.id;
    this.connectionManager
      .joinGame(gameId)
      .then((response: AxiosResponse) => {
        this.$router.push({
          name: "GameFrame",
          params: { gameInfos: response.data.data, gameId } as any
        });
      })
      .catch(() => {
        throw "error";
      })
      .finally(() => {
        this.gameCreateLoading = false;
      });
  } catch (err) {
    this.gameCreateLoading = false;
    alert(
          "Une erreur fatale s'est produite lors de la création de la partie :/ Merci de remonter le problème aux développeurs"
        );
    this.$router.back();
  }
  

  
    
  }
}
</script>