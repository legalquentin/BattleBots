<template src="./template.html"></template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import axios from "axios";
import _ from "lodash";

import IGame from '../../types/IGame';

abstract class AVue extends Vue {
  protected abstract displayed(): void;

  @Watch('$route.name', {immediate: true})
  private routed(): void {
    this.displayed();
  };
};

@Component
export default class GamesListFrame extends AVue {
  private gamesList: IGame[] = [];

  protected async displayed() {
    const jwt: string|null = localStorage.getItem("jwt");
    if (!_.size(jwt)) {
      this.$router.push({ name: "MainFrame" });
    }

    try {
      const result = await axios.get("http://localhost/api/games", {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      });
      this.gamesList = _.get(result, 'data.data', null);
    } catch (error) {
        console.error(error);
    }
  }

  private async joinGame(gameId: number) {
    const jwt: string|null = localStorage.getItem("jwt");
    if (!_.size(jwt)) {
      this.$router.push({ name: "MainFrame" });
    }

    try {
      const result = await axios.put(`http://localhost/api/games/join/${gameId}`, {}, {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      });
      console.log(result);
    } catch (error) {
        console.error(error);
    }
  }
}
</script>