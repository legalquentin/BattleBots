<template src="./template.html"></template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import _ from "lodash";
import axios, { AxiosResponse } from "axios";

@Component
export default class CreateGameFrame extends Vue {
  name: string = "";
  gameCreateLoading = false;
  async createGame(): Promise<void> {
    const jwt: string | null = localStorage.getItem("jwt");
    if (!_.size(jwt)) {
      this.$router.push({ name: "MainFrame" });
    }
    this.gameCreateLoading = true;
    const result = await axios.post(
      "http://hardwar.ddns.net/api/games",
      { name: this.name },
      {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      }
    );
  console.log(',',result)
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
        alert(
          "Une erreur fatale s'est produite lors de la création de la partie :/ Merci de remonter le problème aux développeurs"
        );
        this.$router.back();
      })
      .finally(() => {
        this.gameCreateLoading = false;
      });
  }
}
</script>