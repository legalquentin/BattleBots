<template>
  <AbstractPanel name="LoginPanel">
    <template #header>
      <SuiGridRow>
        <SuiGridColumn>
          <SuiHeader inverted size="huge">Se connecter</SuiHeader>
        </SuiGridColumn>
      </SuiGridRow>
    </template>
    <template #body>
      <SuiGridRow verticalAlign="middle" align="left" id="create-game-panel-body">
        <SuiGridColumn class="huge-column">
          <SuiSegment class="huge-segment" raised stacked="tall">
            <!-- <SuiHeader sub inverted style="margin-bottom: 15px">Ouvertes</SuiHeader> -->
            <sui-form inverted style="width: 500px; margin: 0 auto; padding-bottom: 30px">
              <sui-form-field>
                <label>Pseudo</label>
                <sui-input v-model="formModel.username" size="big" placeholder="smith_j" />
              </sui-form-field>
              <sui-form-field>
                <label>Mot de passe</label>
                <sui-input type="password" v-model="formModel.password" size="big" placeholder="••••••••••" />
              </sui-form-field>
            </sui-form>
          </SuiSegment>
        </SuiGridColumn>
      </SuiGridRow>
    </template>
    <template #footer>
      <SuiGridRow :columns="2">
        <SuiGridColumn align="right" :width="12">
          <SuiButton
            @click="$router.push({ name: 'RegisterPanel', params: { isCreateGame: isCreateGame  } })"
            basic
            inverted
            style="box-shadow: none !important"
          >Pas encore de compte ?</SuiButton>
        </SuiGridColumn>
        <SuiGridColumn align="right" :width="4">
          <SuiButton
            @click="login()"
            size="huge"
            style="border: 2px solid rgb(21,77,117); color: white; background: background: rgb(8,73,177);
background: linear-gradient(180deg, rgba(8,73,177,1) 0%, rgba(39,115,134,1) 43%, rgba(39,115,134,1) 49%, rgba(39,115,134,1) 55%, rgba(22,51,128,1) 100%);"
          >Se connecter</SuiButton>
        </SuiGridColumn>
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
import { AxiosResponse } from "axios";

@Component({ components: { AbstractPanel } })
export default class RegisterPanel extends Vue {
  private isCreateGame = false;

  private $store!: Global;
  private formModel: {
    username: string;
    password: string;
  } = {
    username: "",
    password: "",
  };

  created(): void {
    this.$store = this.$global;
  }

  mounted(): void {
    this.isCreateGame = this.$route.params.isCreateGame as any;
  }

  async login(): Promise<void | Route> {
    this.isCreateGame = this.$route.params.isCreateGame as any;
    try {
      const response: AxiosResponse = await this.$api.login(
        _.clone(this.formModel)
      );
      (this.$global as Global).token = response.data.data.data;

      const profile = await this.$api.profile(response.data.data.data);

      localStorage.setItem("userId", _.get(profile, "data.data.id"));

      if (!this.isCreateGame) {
        return this.$router.push({ name: "ListGamesPanel" });
      }

      this.$router.push({ name: "CreateGamePanel" });
    } catch (e) {
      console.log(e);
    }
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