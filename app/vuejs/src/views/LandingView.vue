<template>
    <div id="landing_view">
        <h1 class="ui red huge header" style="font-size: 40px">
            Bienvenue sur Hard War !
        </h1>

        <br />

        <h2 class="ui inverted header">
            Des batailles de robots épiques en multi-joueurs
        </h2><br/>
        <div class="ui inverted segment" style="padding: 70px 70px">
            <h3 class="ui inverted header">• Rejoignez une communauté d'amateurs et de passionés toujours en expansion</h3>
            <h3 class="ui inverted header">• Regardez les matchs depuis chez vous</h3>
            <h3 class="ui inverted header">• Rendez chaque partie unique : faites preuve d'instinct, de malice et montez des stratégies</h3>
        
            <RouterLink :to="{ name: '@room_view' }"><button class="ui huge button red">Jouer maintenant !</button></RouterLink>
        </div>
    </div>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator';

@Component
export default class LandingView extends Vue
{
    private mounted(): void 
    {
        this.store
    }
}


</script>

<style lang="scss" scoped>
    #landing_view {
        text-align: center;
        padding-top: 100px;
        min-height: calc(100vh - 90px);
        button {
            margin-top: 50px;
            width: 400px;
            height: 100px
        }
        
        background: linear-gradient(346deg, #616161, #000000);
    }
</style>