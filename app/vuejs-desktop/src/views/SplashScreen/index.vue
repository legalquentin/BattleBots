<template src="./template.html"></template>
<style lang="scss" scoped src="./style.scss"></style>

<script lang="ts">

import { Vue, Component, Provide } from 'vue-property-decorator';

import SplashComponent from '../../components/Splash/index.vue';
import _ from 'lodash';

import electron, { BrowserWindow } from 'electron';
import isElectron from 'is-electron';

@Component({
    components : { Splash: SplashComponent }
})
export default class SplashScreenView extends Vue {

    splashIndex = 0;

    splashes = [
        {
            imgName: 'splash1.png',
            durationMS: 2000,
            isActive: false,
        },
        {
            imgName: 'splash2.png',
            durationMS: 2000,
            isActive: false,
        },
    ];

    currentSplashDatas = {
        imgName: '',
        durationMS: -1,
        isActive: false,
    };

    private changeSplashTimeout: any;

    skip() {
        console.log("-------")
        this.currentSplashDatas = this.splashes[this.splashIndex];
        if (this.changeSplashTimeout) {
            clearTimeout(this.changeSplashTimeout);
        }
        this.recMounted();
    }

    mounted() {
        if (isElectron()) {
            const eWindow: BrowserWindow = electron.remote.getCurrentWindow();
            // eWindow.setFullScreen(true);
        }

        // mounted is unset from 'this' after it initial call
        this.recMounted(); // we call recMounted who will recurse
    }

    recMounted() {
        if (this.splashIndex >= this.splashes.length) {
            return this.postPone();
        }
        console.log("ok")
        // will reactivly display the current splash component
        // until setTimeout resolved
        this.currentSplashDatas = _.set(
            _.get(this.splashes, this.splashIndex),
            'isActive',
            true,
        );
        
        this.changeSplashTimeout = setTimeout(() => {
            this.recMounted();
        }, this.currentSplashDatas.durationMS)
        this.splashIndex += 1;
    }

    postPone() {
        this.$router.push({ name: 'MainFrame' });
    }
};
</script>