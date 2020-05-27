<template src="./template.html"></template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import _ from 'lodash';
import axios from 'axios';

@Component
export default class CreateGameFrame extends Vue {
  name: string = "";

  async createGame(): Promise<void> {
    const jwt: string|null = localStorage.getItem("jwt");
    if (!_.size(jwt)) {
      this.$router.push({ name: "MainFrame" });
    }

    try {
      const result = await axios.post("http://hardwar.ddns.net/api/games", { name: this.name }, {
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