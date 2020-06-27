<template>
    <SuiSegment inverted>
        <SuiForm @submit.prevent inverted>
            <SuiFormField>
                <label for="username">Votre nom d'utilisateur :</label>
                <input v-model="loginForm.username" placeholder="Jon Snow" type="text" name="username" />
            </SuiFormField>

            <SuiFormField>
                <label for="password">Entrez votre mot de passe :</label>
                <input v-model="loginForm.password" placeholder="LoremIpsum" type="password" name="password" />
            </SuiFormField>

            <SuiButton @click="loginClick" type="submit" inverted>Se connecter</SuiButton>
            <SuiMessage id="alt-action">
                Pas encore de compte ? <SuiButton color="orange" id="alt-button">S'inscrire</SuiButton>
            </SuiMessage>
            
        </SuiForm>
    </SuiSegment>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Axios, { AxiosInstance } from 'axios';

interface ILoginForm {
    username: string;
    password: string;
};

@Component
export default class LoginView extends Vue
{
    private loginForm: ILoginForm = {
        username: '',
        password: '',
    };

    private loginClick(): void
    {
        const axios: AxiosInstance = Axios.create({ headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'charset' : 'utf-8' } });
        axios.post('http://battlebots.ddns.net/users/register', this.nov(this.loginForm))
            .then(rep => console.log(rep));
    }
}
</script>

<style scoped>
    #alt-action {
        margin-top: 40px;
    }

    #alt-button {
        margin-left: 30px;
    }
</style>