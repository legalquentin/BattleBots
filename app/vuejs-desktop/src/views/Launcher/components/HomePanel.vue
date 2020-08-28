<template>
    <AbstractPanel name="Home">
        <template #header>
            <SuiGridRow verticalAlign="middle" align="left">
                <SuiGridColumn>
                    <SuiHeader inverted size="huge">Actualitées Battlebots</SuiHeader>
                </SuiGridColumn>
            </SuiGridRow>
        </template>
        <template #body>
            <SuiGridRow verticalAlign="top" align="left">
                <SuiGridColumn>
                    <SuiSegments>
                    <SuiSegment class="huge-segment" inverted style="position: relative">
                        <SuiLabel color="black" ribbon>
                            <SuiIcon name="time" />
                            25/08/2020 à 13h41
                        </SuiLabel>
                        <SuiHeader sub color="blue" inverted>Nouveau client de jeu</SuiHeader>
                        <SuiDivider />
                        <p>
                            A la suite des premiers retours utilisateurs, nous avons totalement revu l'éxperience utilisateur et le design du client de jeu
                        </p>
                        <p>
                            Les changements les plus notables sont :
                            <ul>
                                <li>Nouvelle interface : une interface plus sombre et une identité graphique plus forte. L'ancien client était trop minimaliste, trop blanc et n'avait pas assez de personnalité</li>
                                <li>Une navigation revue et simplifiée : désormais les principales pages sont accessibles depuis la barre verticale à gauche du client</li>
                                <li>Plein écran : le jeu se lance automatiquement en plein écran pour le client lourd, et les flux vidéos des robots sont désormais adaptés à la taille de la fenêtre</li>
                                <li>Nouveaux modules HUD : des nouvelles jauges pour indiquer la vie et la surchauffe du robot</li>
                                <li>Un nouveau centre de notification : pour obtenir les informations sur la partie en cours d'un simple coup d'oeuil</li>
                            </ul>
                        </p>
                        <p>Toute l'équipe vous remercie pour vos retours et vous souhaite de passer un bon moment sur Battlebots ! 😃</p>
                    </SuiSegment>

                    <SuiSegment class="huge-segment" inverted style="position: relative; padding-top: 30px">
                        <SuiLabel color="black" ribbon>
                            <SuiIcon name="time" />
                            15/07/2020 à 18h12
                        </SuiLabel>
                        <SuiHeader sub color="blue" inverted>Ouverture des tests utilisateurs</SuiHeader>
                        <SuiDivider inverted/>
                        <p>
                            Après plusieurs mois de développement, l'équipe Battlebots est heureuse de vous présenter la première version Alpha de Battlebots ! 🥁</p>
                            <p>Nous souhaitons nous rapprocher de nos utilisateurs, vous recevrez donc avec le jeu un formulaire Google Form.</p>
                            <p>N'hésitez pas à le remplir et à nous donner vos impressions pour que ce jeu soit <b>le votre</b>
                        </p>
                    </SuiSegment>

                    
                    </SuiSegments>
                </SuiGridColumn>
            </SuiGridRow>
        </template>
        <template #footer>
            <SuiGridRow>
                <SuiGridColumn>
                    <!-- <SuiHeader inverted size="huge">Bienvenue sur Battlebots</SuiHeader> -->
                </SuiGridColumn>
            </SuiGridRow>
        </template>
    </AbstractPanel>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import AbstractPanel from './AbstractPanel.vue';

@Component({ components: { AbstractPanel } })
export default class HomePanel extends Vue {
}

</script>