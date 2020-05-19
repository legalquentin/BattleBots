<template src="./template.html" lang="html"></template>

<style lang="scss" scoped>
    .secondary-game-button {
        box-shadow: none !important;
    }

    .secondary-game-button:hover {
        box-shadow: 0 0 0 1px #10AC84 inset, 0 0 0 0 #10AC84 inset !important;
    }
</style>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class MainFrame extends Vue {

    mounted(): void {
        
    }

};

</script>