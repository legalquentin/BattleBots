<template>
  <div id="app" style="min-height: 100%">
    <!--<div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/coco">Coco l'asticot</router-link>
    </div>
    -->
    
    <router-view/>
  </div>
</template>

<style lang="less">

// When using <transition name>, we have weird unknow render bug. Need more efforts

// .fade-enter-active, .fade-leave-active {
//   transition-property: opacity;
//   transition-duration: .30s;
// }

// .fade-enter-active {
//   transition-delay: .30s;
// }

// .fade-enter, .fade-leave-active {
//   opacity: 0
// }

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}


body
{
  background-color: whitesmoke !important;
  &.game {
      overflow-y: hidden;
  }
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.mini.button .arrow.up {
  color: red;
  background-color: transparent !important;
}

.mini.button.register-jump-button .random {
  color: #a333c8;
  background-color: transparent !important;
}

.mini.button.login-jump-button .random {
  color: #f2711c;
  background-color: transparent !important;
}


.ui.progress .bar {
  min-width: 0em !important;
}

.bar {
  min-width: 0em !important;
}
</style>


<script lang="ts">
require('electron').webFrame.setZoomFactor(1.2);
</script>
