<template lang="html">
    <div id="default-template">
        

        <SuiContainer>
            <Navigation />
            <SuiGrid align="center">
                
                <SuiGridRow :columns="1" verticalAlign="middle">
                    <SuiGridColumn>
                        <router-view />
                    </SuiGridColumn>
                </SuiGridRow>
            </SuiGrid>

        
            
        </SuiContainer>

    </div>
</template>

<script lang="ts">

    import { Vue, Component } from 'vue-property-decorator';
    import Navigation from '../components/Navigation.vue';

    @Component({
        components: { Navigation }
    })
    class DefaultTemplate extends Vue
    {
        public mounted()
        {
            console.log("DefaultTemplate mounted !");
        }
    }

    export default DefaultTemplate;

</script>

<style>

    #app, #default-template, #body, #default-template .ui.grid
    {
        min-height: calc(100vh - 0px);
    }

    #body
    {
        background: url("../../public/darkness.png");
    }
</style>
