<template id="bar-template">
  <div class="column">
    <div class="ui yellow inverted progress" 
         id="loading-bar"
         ref="progress">
      <div class="bar"></div>
      <!-- <div class="label">{{ label }}</div> -->
    </div>
  </div>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator';

export default class Progress extends Vue
{
    private mounted(): void 
    {
        this.store
    }
}
</script>