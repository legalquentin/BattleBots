<template>
    <sui-modal basic v-model="isOpenComputed" scrolling>
        <sui-modal-header>Comment jouer ?</sui-modal-header>
        <sui-modal-content scrolling>
          <sui-modal-description style="color: black">
              <SuiSegment raised>
                <h4 is="sui-header">
                    <sui-icon color="black" name="plug" />
                    Déplacements
                </h4>
                <SuiDivider></SuiDivider>

                    <p>
                        <b>Pour controler le robot, utilisez les touches directionelles de votre clavier :</b>
                        <SuiGrid textAlign="center" style="width: 140px; margin-top: 20px; margin-left: 20px">
                            <SuiGridRow :columns="3">
                                <SuiGridColumn>

                                </SuiGridColumn>
                                <SuiGridColumn>
                                    <SuiButton disabled icon="arrow up" style="box-shadow: 1px 1px 2px black !important" ></SuiButton>
                                </SuiGridColumn>
                                <SuiGridColumn></SuiGridColumn>
                            </SuiGridRow>
                            <SuiGridRow :columns="3" style="margin-top: -20px;">

                                <SuiGridColumn>
                                    <SuiButton style="box-shadow: 1px 1px 2px black !important" disabled icon="arrow left"></SuiButton>
                                </SuiGridColumn>
                                <SuiGridColumn>
                                    <SuiButton  style="box-shadow: 1px 1px 2px black !important" disabled icon="arrow down"></SuiButton>
                                </SuiGridColumn>
                                <SuiGridColumn>
                                    <SuiButton  style="box-shadow: 1px 1px 2px black !important"  disabled icon="arrow right"></SuiButton>
                                </SuiGridColumn>
                            </SuiGridRow>
                        </SuiGrid>
                        
                        
                    </p>
                </SuiSegment>
                <SuiSegment raised>
                    <h4 is="sui-header">
                        <sui-icon name="plug" />
                        Informations sur la partie et votre robot
                    </h4>

                    <SuiDivider></SuiDivider>

                    <p>
                        <b> Vous aurez accès aux informations suivantes tout au long de votre partie :</b>
                    </p>
                    <SuiGrid celled>
                        <SuiGridRow :columns="2" verticalAlign="middle" textAlign="center">
                            <SuiGridColumn :width="6">
                                <sui-progress indicating :percent="energy" label="ENERGIE"/>
                            </SuiGridColumn>
                            <SuiGridColumn :width="10">
                                L'energie restante de votre robot. Lorsqu'elle cette jauge atteint 0, le robot est immobilisé et la partie prend fin.
                            </SuiGridColumn>
                        </SuiGridRow>

                        <SuiGridRow :columns="2" verticalAlign="middle" textAlign="center">
                            <SuiGridColumn :width="10">
                                Affiche le temps écoulé depuis le démarrage de la partie.
                            </SuiGridColumn>
                            <SuiGridColumn :width="6">
                                <sui-statistic size="tiny">
                                    <sui-statistic-value>0</sui-statistic-value>
                                    <sui-statistic-label>secondes écoulées</sui-statistic-label>
                                </sui-statistic>
                            </SuiGridColumn>
                            
                        </SuiGridRow>

                        <SuiGridRow :columns="2" verticalAlign="middle" textAlign="center">
                            <SuiGridColumn :width="6">
                                <sui-statistic size="tiny">
                                    <sui-statistic-value>400</sui-statistic-value>
                                    <sui-statistic-label>secondes restantes</sui-statistic-label>
                                </sui-statistic>
                            </SuiGridColumn>
                            <SuiGridColumn :width="10">
                                Affiche le temps restant avant la fin de la partie. Ce compteur peut être bloqué temporairement en utilisant le pack <b>Givre</b>
                            </SuiGridColumn>
                        </SuiGridRow>

                        
                    </SuiGrid>
              
                </SuiSegment>
          </sui-modal-description>
        </sui-modal-content>
        <sui-modal-actions>
          <sui-button @click.native="isOpenComputed = false">
            Fermer
          </sui-button>
        </sui-modal-actions>
      </sui-modal>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import AVue from '../../views/AVue';

@Component
export default class HelpModal extends AVue  {
    @Prop({ default: false }) isOpen!: boolean; 
    forceOpen: boolean = true;
    energy = 100;
    interval: any = null;

    displayed(): void {
        if (this.interval) {
            clearInterval(this.interval);
        }

        this.interval = setInterval(() => {
            if (this.energy === 0) {
                this.energy = 100;
            }
            if (this.isOpen) {
                this.energy -= 5;
            }
        }, 1000);        
    }

    get isOpenComputed() {
        return this.isOpen && this.forceOpen;
    }

    set isOpenComputed(isOpen: boolean) {
        this.forceOpen = isOpen;
    }
};
</script>