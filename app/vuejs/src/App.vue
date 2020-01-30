<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
  /*
   * DANGER
   * Here be dragons ...

   * This this the global css file. Any SASS rule here will apply to all the project
   * For local components changes, please ass a <style scoped> at the end of you component file.vue
   */

  /**
   * COLORS
   */

  // Definitions :

  // common
  $white: #f0f0f0;
  $black: #111111;

  // hardwar
  $robot-blue: #1e5d88;
  $robot-green: #55ad7a;

  #app {


    // Buttons :
    /* ? here we can use !important when needed for force override semantic-ui styles.
    /* ? other way is to super-charge every customized element parent, that would be anoying as F*** */

    .ui.blue.button, .ui.blue.buttons .button { background-color: $robot-blue }
    // .ui.green.button, .ui.green.buttons .button { background-color: $robot-green }


    // Buttons' labels borders & text color (make it transparent)
    .ui.button {
      .ui.label {
        border-color: $white !important;
        color: $black !important;
      }
    }

    .ui.huge.header
    {
      text-transform: uppercase;
    }
  }

</style>
