<template>
    <div id="room_view">
        <div class="ui inverted segment">
            <h1 class="ui huge header red">
                Vous êtes sur le point de créer une partie d'Hardwar.
            </h1>
            <h2>
                Donnez un nom à votre partie, et cliquez sur Créer la partie. Un adversaire rejoindra votre partie dans quelques instants</h2>
        <div class="ui grid center aligned">
            <div class="one column row">
                <div class="column seven wide">
                    <div class="ui form">
                        <div class="ui huge inverted field">
                            <label>Nom de la partie</label>
                            <input type="text" v-model="gameName" placeholder="Exemple : WH-paris 2019">
                        </div>
                    </div>
                </div>
            </div>

            <div class="one column row">
                <div class="column">
                    <div class="ui huge red button" @click="createGameButtonClick()"> Créer la partie </div>
                </div>
            </div>
        </div>
        </div>
    </div>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator';
import Axios, { AxiosInstance } from 'axios';

@Component
export default class RoomView extends Vue
{
    private tmpToken = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjUsInJvbGUiOiJST0xFX1VTRVIifQ.USstzodwyIxpFBHGY9tARQewcafO099sASMQMPfYhn0";

    private gameName: string = "";

    private http: AxiosInstance;

    constructor() {
        super();

        this.http = Axios.create({ headers: { 'Content-Type': 'application/json', 'charset' : 'utf-8', 'Authorization': this.tmpToken } });
    }

    private mounted(): void {
        
    }

    private createGameButtonClick(): void {
        this.http.post(`http://battlebots.ddns.net/api/games`, { name: this.gameName })
            .then(rep => {
                console.log(rep)
                this.$router.push({ name: '@player_view', params: { gameData: rep.data } })
            })
            .catch(err => {
                console.warn("Error creating a game");
            });
        ;
    }
}


</script>

<style lang="scss" scoped>
    #room_view {
        text-align: center;
        padding-top: 170px;
        min-height: calc(100vh - 90px);
        background: linear-gradient(346deg, #616161, #000000);

        .form {
            margin-top: 40px;

            label {
                text-align: left;
                color: white
            }
        }

        .red.header {
            margin-top: 50px
        }

        .button {
            margin-top: 50px;
            margin-bottom: 50px;
        }
    }
</style>