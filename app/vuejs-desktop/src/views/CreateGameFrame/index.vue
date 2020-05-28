<template src="./template.html"></template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import _ from 'lodash';
import axios from 'axios';

@Component
export default class CreateGameFrame extends Vue {
  name: string = "";
  gameCreateLoading = false;
  async createGame(): Promise<void> {
    const jwt: string|null = localStorage.getItem("jwt");
    if (!_.size(jwt)) {
      this.$router.push({ name: "MainFrame" });
    }
    this.gameCreateLoading = true;
    try {
      const result = await axios.post("http://hardwar.ddns.net/api/games", { name: this.name }, {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      });
      this.gameCreateLoading = false;
      console.log(result);
      this.$router.back();
    } catch (error) {
      console.error(error);
    }
  }
}
</script>