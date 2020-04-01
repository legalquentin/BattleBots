<template src="./template.html"></template>
<style lang="scss" scoped src="./style.scss"></style>

<script>

import { Vue, Component, Provide } from 'vue-property-decorator';

import SplashComponent from '../../components/Splash/index.vue';
import _ from 'lodash';

import electron from 'electron';

@Component({
    components : { Splash: SplashComponent }
})
export default class SplashScreenView extends Vue {

    splashIndex = 0;

    splashes = [
        {
            imgName: 'splash1.png',
            durationMS: 10000,
            isActive: false,
        },
        {
            imgName: 'splash2.png',
            durationMS: 10000,
            isActive: false,
        },
    ];

    currentSplashDatas = {
        imgName: '',
        durationMS: '',
        isActive: false,
    };

    mounted() {
        // TODO: if using electron
        const eWindow = electron.remote.getCurrentWindow();
        eWindow.setFullScreen(true);
        // :TODO

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
        
        setTimeout(() => {
            this.recMounted();
        }, this.currentSplashDatas.durationMS)
        this.splashIndex += 1;
    }

    postPone() {
        console.log('postPone');
    }
};
</script>