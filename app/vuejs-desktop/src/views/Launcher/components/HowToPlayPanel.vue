<template>
    <AbstractPanel name="StatsPanel">
        <template #header>
                  <SuiGridRow>
                    <SuiGridColumn>
                      <SuiHeader inverted size="huge">Comment jouer</SuiHeader>
                    </SuiGridColumn>
                  </SuiGridRow>
        </template>

        <template #body>
            <SuiGridRow :columns="1">
                <SuiGridColumn style="margin-top: 20px" textAlign="left" :width="16">
                    <SuiSegment class="huge-segment" inverted raised stacked>
                        <SuiGrid verticalAlign="middle" align="center">
                            <SuiGridRow :columns="1" style="margin-top: 6px">
                                <SuiGridColumn>
                                    <SuiHeader inverted>Créer une partie</SuiHeader>
                                    <SuiDivider inverted/>

                                    Pour créer une partie vous devez cliquer sur "Créer une partie" à gauche de l'écran.
                                    Vous serez invité à choisir le nom de votre partie puis à choisir votre robot.
                                </SuiGridColumn>
                            </SuiGridRow>

                            <SuiGridRow :columns="1" style="margin-top: 6px">
                                <SuiGridColumn>
                                    <SuiHeader inverted>Rejoindre une partie</SuiHeader>
                                    <SuiDivider inverted/>

                                    Pour rejoindre une partie vous devez cliquer sur "Rejoindre une partie" à gauche de l'écran, puis cliquer sur la partie que vous souhaitez rejoindre.
                                    La liste des robots disponible va apparaitre, sélectionnez le robot souhaité. Cela va débloquer le bouton "Rejoindre la partie"
                                </SuiGridColumn>
                            </SuiGridRow>

                            <SuiGridRow :columns="1" style="margin-top: 6px">
                                <SuiGridColumn inverted>
                                    <SuiHeader inverted>Comment jouer</SuiHeader>
                                    <SuiDivider inverted/>

                                    Pour vous déplacer utilisez les touches directionelles de votre clavier (les flèches).
                                    Attention, vous déplacer vous fait perdre de l'énergie et augmente la chaleur du robot.
                                    Lorsque la chaleur est au maximum, votre robot ne peut plus se déplacer le temps qu'elle baisse, et lorsque vous n'avez plus d'énergie le robot est immobilisé jusqu'à la fin de la partie.

                                    Pour tirer, utilisez la barre espace de votre clavier. Recevoir un tir vous fait perdre de la vie. Le joueur ayant le moins de vie perd. L'égalité est possible.
                                </SuiGridColumn>
                            </SuiGridRow>
                        </SuiGrid>
                    </SuiSegment>
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
export default class HowToPlayPanel extends Vue {
    
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
    padding-bottom: 40px !important;
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

.ui.header {
    margin-top: 30px;
}
</style>