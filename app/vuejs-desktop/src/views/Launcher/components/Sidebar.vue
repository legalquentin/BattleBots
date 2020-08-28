<template>
  <div id="sidebar">
    <SuiGrid verticalAlign="middle" id="sidebar-grid">
      <SuiGridRow>
        <SuiGridColumn>
          <SuiGrid verticalAlign="middle">
            <slot />
          </SuiGrid>
        </SuiGridColumn>
      </SuiGridRow>
    </SuiGrid>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Provide } from "vue-property-decorator";

@Component({ inject: [] })
export default class Sidebar extends Vue {
  @Prop()
  @Provide()
  private defaultTarget!: string;
}
</script>

<style scoped lang="less">
#sidebar {
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 270px;
  background: linear-gradient(rgba(0, 0, 0, 0.4), #00000099),
    url("/background.jpg");
  
  object-fit: cover;
  background-size: 2050px;
  background-position: fixed;
  width: 270px;
  background-position: center center;
  border-left: 1px solid rgba(40, 40, 40, 1);
  border-right: 1px solid rgba(40, 40, 40, 1);

  #sidebar-grid {
    height: 100%;
    margin: 0;
    transition: backdrop-filter linear 400ms;
    // backdrop-filter: blur(60px);
  }
  #sidebar-grid:hover {
    backdrop-filter: blur(9px);
  }

  
}
</style>