<template>
  <div id="launcher">
    <SuiSegment v-if="$router.currentRoute.path !== '/register-panel' && $router.currentRoute.path !== '/login-panel'" basic style="position: absolute; right: 58px; z-index: 1; top: 25px">
      <SuiLabel
        v-if="!$store.isLogged"
        @click="permissionDenied()"
        color="black"
        icon="lock"
        inverted
      >Vous n'êtes pas connecté</SuiLabel>

      <SuiLabel
        v-else
        @click="disconnect()"
        color="blue"
        icon="unlock"
        inverted
      >Vous êtes connecté</SuiLabel>
    </SuiSegment>
    <sui-modal size="mini" :closeIcon="true" basic v-model="loginRegisterMenuState">
      <sui-modal-content>
        <sui-modal-description style="margin-top: 50px">
          <SuiGrid align="center" verticalAlign="middle">
            <SuiGridRow>
              <SuiGridColumn>
                <SuiHeader inverted sub style="text-align: left; margin-bottom: 5px">Deja un compte ?</SuiHeader>
                <SuiButton @click="switchTo('LoginPanel')" size="huge" color="green" fluid>Se connecter</SuiButton>
              </SuiGridColumn>
            </SuiGridRow>
            <SuiGridRow>
              <SuiGridColumn>
                <SuiHeader inverted sub style="text-align: left; margin-bottom: 5px">Pas encore de compte ?</SuiHeader>
                <SuiButton @click="switchTo('RegisterPanel')" size="big" color="blue" fluid>Créer un compte</SuiButton>
              </SuiGridColumn>
            </SuiGridRow>
            

            <SuiGridRow>
              <SuiGridColumn>
                <SuiButton basic inverted>Annuler</SuiButton>
              </SuiGridColumn>
            </SuiGridRow>
          </SuiGrid>
        </sui-modal-description>
      </sui-modal-content>
    </sui-modal>

    <Sidebar defaultTarget="HomePanel">
      <SidebarItem
        class="logo"
        target="logo"
        style="position: absolute; bottom: calc(100vh - 267px); left: -40px; width: 268px !important"
      ></SidebarItem>
      <SidebarItem v-if="$global.isLogged" target="CreateGamePanel">Créer une partie</SidebarItem>
      <SidebarItem v-else target="LoginPanel">Créer une partie</SidebarItem>
      <SidebarItem target="ListGamesPanel">Rejoindre une partie</SidebarItem>
      <SidebarItem target="ReplayPanel">Replay</SidebarItem>

      <SidebarItem target="HowToPlayPanel">Comment jouer ?</SidebarItem>

      <!-- Animated Decorations -->
      <!-- <SidebarItem
        target="nothing"
        style="position: absolute; bottom: -60px; left: 145px; width: 268px !important"
      ></SidebarItem>
      <SidebarItem
        target="nothing"
        style="position: absolute; bottom: -180px; left: 150px; width: 268px !important"
      ></SidebarItem>
      <SidebarItem
        target="nothing"
        style="position: absolute; bottom: 346px; left: 60px; width: 268px !important"
      ></SidebarItem>
      <SidebarItem
        target="nothing"
        style="position: absolute; bottom: 420px; left: 145px; width: 268px !important"
      ></SidebarItem>
      <SidebarItem
        target="nothing"
        style="position: absolute; bottom: -130px; left: 15px; width: 168px !important"
      ></SidebarItem>
      <SidebarItem
        target="nothing"
        style="position: absolute; bottom: 242px; left: 165px; width: 268px !important"
      ></SidebarItem>
      <SidebarItem
        target="nothing"
        style="position: absolute; bottom: 180px; left: 54px; width: 268px !important"
      ></SidebarItem>
      <SidebarItem
        target="nothing"
        style="position: absolute; bottom: 40px; left: 15px; width: 168px !important"
      ></SidebarItem>
      <SidebarItem
        target="nothing"
        style="position: absolute; bottom: 106px; left: 120px; width: 268px !important"
      ></SidebarItem> -->
    </Sidebar>
    <RouterView />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Provide } from "vue-property-decorator";

import Sidebar from "./components/Sidebar.vue";
import SidebarItem from "./components/SidebarItem.vue";
import { Global } from '@/Global';

@Component({ components: { Sidebar, SidebarItem } })
export default class Launcher extends Vue {
  private $store!: Global;
  private loginRegisterMenuState = false;

  created(): void {
    this.$store = this.$global;
    this.$api.$emit('ENABLE_AUTO_REFRESH');
  }

  @Provide() permissionDenied(): void {
    this.loginRegisterMenuState = true;
  }

  private disconnect(): void {
    this.$store.token = '';
    this.$router.push({ name: 'HomePanel' });
  }

  switchTo(name): void {
    this.loginRegisterMenuState = false;
    this.$router.push({ name });
  }
}
</script>

<style lang="less" scoped>
#launcher {
  height: 100%;
  overflow: hidden;
  background-position: fixed;
  display: flex;
}
</style>