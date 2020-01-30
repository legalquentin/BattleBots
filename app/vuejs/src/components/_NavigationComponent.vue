<template>
  <article id="navigation">
    <SuiMenu icon="labeled" inverted id="top-nav">
      <RouterLink :to="{ name: '@landing_view' }">
        <SuiMenuItem active id="header">
          <img src="../../public/SVG/terminate.svg" />
          <span class="strong">Hard War</span>
        </SuiMenuItem>
      </RouterLink>

      <RouterLink :to="{ name: '@room_view' }">
        <SuiMenuItem>
          <img src="../../public/SVG/mmmh_robot.svg" />
          <span>Créer une partie</span>
        </SuiMenuItem>
      </RouterLink>

      <RouterLink :to="{ name: '@player_view' }">
        <SuiMenuItem>
          <img src="../../public/SVG/snif_bot.svg" />
          <span>Rejoindre une partie</span>
        </SuiMenuItem>
      </RouterLink>

      <!--<SuiMenuMenu position="right">
        <SuiMenuItem>
          <SuiButton color="blue" icon="no">
            <img src="../../public/SVG/daftpunk_bot.svg" />

            Nous rejoindre
            <a
              is="sui-label"
              slot="label"
              basic
              color="blue"
              pointing="left"
            >42</a>
          </SuiButton>
        </SuiMenuItem>

        <SuiMenuItem>
          <SuiButton color="green" icon="no">
            <img src="../../public/SVG/patata_robot_1.svg" />

            Se connecter
            <a
              is="sui-label"
              slot="label"
              basic
              color="green"
              pointing="left"
            >24</a>
          </SuiButton>
        </SuiMenuItem>
      </SuiMenuMenu>-->
    </SuiMenu>
    <div class="d-wrap"><div class="decoration"></div></div>
    <div class="decoration-banner"></div>
    <div class="decoration-again"></div>
  </article>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({ name: "Navigation" })
export default class NavigationComponent extends Vue {
  private mounted(): void {
    console.log("this.store => ", this.store);
    this.store.setUnlog();
  }
}
</script>

<style scoped lang="scss">
#navigation {
  .d-wrap {
    overflow: hidden;
    height: 90px;
    position: absolute;
    top: -12px;
    width: 100%;
    z-index: -8;
  }

  .decoration {
    // background-image: url('../../public/JPEG/room.png');
        background: linear-gradient(346deg, #616161, #000000);
background-size: 400% 400%;
    height: calc(100vh + 10px);
    background-size: cover;
    //background-position-x: 0;
    
    box-shadow: 3px 0px 23px black;
    filter: blur(6px);
    overflow:hidden;
  }

  .decoration-banner {
background:
radial-gradient(black 15%, transparent 16%) 0 0,
radial-gradient(black 15%, transparent 16%) 8px 8px,
radial-gradient(rgba(255,255,255,.1) 15%, transparent 20%) 0 1px,
radial-gradient(rgba(255,255,255,.1) 15%, transparent 20%) 8px 9px;
background-color:#282828;
background-size:16px 16px;
    height: 26px;
    // background-size: cover;
    z-index: -8;
    position: relative;
    margin-left: -3px;
    margin-top: 0px;
    box-shadow: 3px 5px 6px black;
    
  }

  .decoration-again {
    background: linear-gradient(346deg, #616161, #000000);
    
    background-position: fixed;

-webkit-animation: AnimationName 5s ease infinite;
-moz-animation: AnimationName 5s ease infinite;
animation: AnimationName 5s ease infinite;

@-webkit-keyframes AnimationName {
    0%{background-position:39% 0%}
    50%{background-position:62% 100%}
    100%{background-position:39% 0%}
}
@-moz-keyframes AnimationName {
    0%{background-position:39% 0%}
    50%{background-position:62% 100%}
    100%{background-position:39% 0%}
}
@keyframes AnimationName {
    0%{background-position:39% 0%}
    50%{background-position:62% 100%}
    100%{background-position:39% 0%}
}
    // background-image: url('../../public/JPEG/room.png');
    //height: 100%;
    //width: calc(100%);
    //background-size: cover;
    z-index: -9;
    position: absolute;
    top: 0px;
    margin-left: 0px;
    margin-top: 0px;
    
  }
  

  #top-nav {
    border-radius: 0;
    margin-bottom: 0;
    box-shadow: 0 3px 6px black;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.3);


    .item {
      position: relative;
      height: 80px;
      min-width: 205px;
      // The logo
      &#header {
        flex-direction: row;
        width: 180px;

        span {
          position: absolute;
          bottom: 27px;
          left: calc(100% - 95px);
          white-space: nowrap;
          font-size: 18px;

          &.strong {
            font-weight: 1000;
          }
        }

        img {
          position: absolute;
          top: calc(100% - 63px);
          width: 60px;
        }
      }

      .ui.button {
        position: relative;
        top: 14px;

        img {
          position: absolute;
          right: calc(100% - 48px);
          height: 34px;
          top: 1px;
        }
      }

      span {
        position: absolute;
        bottom: 10px;

        &.strong {
          font-weight: 1000;
        }
      }

      img {
        position: absolute;
        top: 10px;
        width: 50px;
      }
    }
  }
}
</style>