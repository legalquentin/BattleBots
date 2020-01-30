<template>
    <article id="login-register-template">
        <SuiGrid id="back-container">
            <SuiGridRow :columns="1">
                <SuiGridColumn align="left">
                    <RouterLink :to="{ name: '@landing_view' }"> <SuiButton>Retour</SuiButton> </RouterLink>
                </SuiGridColumn>
            </SuiGridRow>
        </SuiGrid>
        

        <RouterView />
    </article>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator';

@Component
export default class LoginRegisterTemplate extends Vue
{
    
}

</script>

<style scoped>
    #back-container
    {
        margin-top: 2px;
    }
</style>