<template src="./template.html"></template>

<style lang="scss" scoped>
    .tchat-frame .ui.message {
        margin-top: 30px
    }

    .tchat-frame .ui.message:first-child {
        margin-top: 10px;
    }
</style>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class GameFrame extends Vue {

};

</script>