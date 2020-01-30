<template>
    <article>

        <Navigation></Navigation>
        <RouterView></RouterView>

    </article>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator';

import Navigation from '../components/_NavigationComponent.vue';

@Component({ components: { Navigation } })
export default class DefaultTemplate extends Vue
{

    private mounted()
    {
    }

}

</script>

<style scoped>

</style>