<template src="./template.html" lang="html"></template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class MainFrame extends Vue {

    mounted(): void {
        alert("Mounted lifecycle");
    }

};

</script>