<template>
  <SuiModal basic v-model="isOpen" scrolling :closable="false">
    <sui-modal-header style="text-align: center !important; ">Partie terminée</sui-modal-header>
    <sui-modal-header style="text-align: center; color: lightgreen">VICTOIRE</sui-modal-header>
    <sui-modal-actions style="text-align: center;">
      <div is="sui-button-group">
        <sui-button  color="facebook" @click.native="disconnect()" label-position="left" icon="redo">Nouvelle partie</sui-button>
        <sui-button  color="blue" @click.native="disconnect()" label-position="right" icon="chart pie">Détails</sui-button>
      </div>
      <sui-button color="grey" style="margin-left: 50px" @click.native="$router.push({ name: 'GamesListFrame' })">Retourner au menu principal</sui-button>
    </sui-modal-actions>
  </SuiModal>
</template>

<style lang="less" scoped>
</style>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class EndOfGameModal extends Vue {
  @Prop({ default: false }) isOpen?: boolean;

  mounted() {}
}
</script>