<template>
  <div id="abstract-panel" class="ui basic segment inverted">
      <SuiGrid verticalAlign="middle" class="header">
        <slot name="header"></slot>
      </SuiGrid>
      <SuiGrid class="body">
        <slot name="body"></slot>
      </SuiGrid>
      <SuiGrid verticalAlign="middle" class="footer">
        <slot name="footer"></slot>
      </SuiGrid>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({ inject: [] })
export default class AbstractPanel extends Vue {
  @Prop()
  private named!: string;
}
</script>

<style lang="less" scoped>
#abstract-panel {
  width: 100%;
  box-shadow: -1px 0 80px black;
  background-color: rgb(42, 42, 42);
  margin-top: 0px;
  padding: 20px 60px;

  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-flex-wrap: nowrap;
  -ms-flex-wrap: nowrap;
  flex-wrap: nowrap;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-align-content: center;
  -ms-flex-line-pack: center;
  align-content: center;
  -webkit-align-items: stretch;
  -ms-flex-align: stretch;
  align-items: stretch;

  .header, .footer {
    -webkit-order: 0;
    -ms-flex-order: 0;
    order: 0;
    -webkit-flex: 0 1 auto;
    -ms-flex: 0 1 auto;
    flex: 0 1 auto;
    -webkit-align-self: auto;
    -ms-flex-item-align: auto;
    align-self: auto;
    margin-bottom: 0px;
  }

  .body {
    -webkit-order: 0;
    -ms-flex-order: 0;
    order: 0;
    -webkit-flex: 1 1 auto;
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
    -webkit-align-self: auto;
    -ms-flex-item-align: auto;
    align-self: auto;
    overflow-y: scroll;
  }
}
</style>