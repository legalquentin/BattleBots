<template src="./template.html" lang="html"></template>

<style lang="scss" scoped>
    .secondary-game-button {
        box-shadow: none !important;
    }

    .secondary-game-button:hover {
        box-shadow: 0 0 0 1px #10AC84 inset, 0 0 0 0 #10AC84 inset !important;
    }

    .ui.modal .content.scrolling::-webkit-scrollbar-thumb {
        background-color: white;
    }

    .ui.grid .row {
        min-height: 100px;
    }
</style>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class MainFrame extends Vue {

    openLoginRegisterModal = false;
    helpModal = true;
    energy = 100;
    mounted(): void {
        setInterval(() => {
            if (this.energy === 0) {
                this.energy = 100;
            }
            if (this.helpModal) {
                this.energy -= 5;
            }
        }, 1000);
    }

    passThrough(): void {
        if (localStorage.getItem('jwt')) {
            this.$router.push({ name: 'CreateGameFrame' });
            return;
        }

        this.openLoginRegisterModal = true;
    }

    passToGameList(): void {
        if (localStorage.getItem('jwt')) {
            this.$router.push({ name: 'GamesListFrame' });
            return;
        }

        this.openLoginRegisterModal = true;
    }

    rediff() {
        this.$router.push({ name: 'EndOfGameFrame' });
    }
};

</script>