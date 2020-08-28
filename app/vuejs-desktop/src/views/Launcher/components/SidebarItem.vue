<template>
  <RouterLink
    style="z-index: 0"
    v-if="target === 'logo'"
    id="sidebar-item"
    class="row"
    :class="{ extra: extra, white: rand <= 0 || rand > 5, blue: rand === 1, violet: rand === 2, pink: rand === 3, orange: rand === 4, red: rand === 5 }"
    :to="{ name: defaultTarget }"
    tag="div"
  >
    <SuiGridColumn>
      <SuiHeader inverted sub>
        <slot />
      </SuiHeader>
    </SuiGridColumn>
  </RouterLink>

  <div
    v-else-if="target === 'nothing'"
    id="sidebar-item"
    class="row"
    :class="{ extra: extra, white: rand > -1, blue: rand === 1, violet: rand === 2, pink: rand === 3, orange: rand === 4, red: rand === 5 }"
    tag="div"
    style="pointer-events: none"
  >
    <SuiGridColumn>
      <SuiHeader inverted sub>
        <slot />
      </SuiHeader>
    </SuiGridColumn>
  </div>
  
  <RouterLink
    v-else
    id="sidebar-item"
    :class="{ active: isActiveRoute }"
    :to="{ name: finalTarget, params: { isCreateGame: isCreateGame } }"
    class="row"
    tag="div"
  >
    <SuiGridColumn>
      <SuiHeader inverted sub>
        <slot />
      </SuiHeader>
    </SuiGridColumn>
  </RouterLink>
</template>

<script lang="ts">
import { Vue, Component, Prop, Inject } from "vue-property-decorator";

@Component
export default class SidebarItem extends Vue {
  @Prop()
  private readonly target!: string;

  @Inject()
  private defaultTarget!: string;

  private isCreateGame = false;

  get isActiveRoute(): boolean {
    return this.$route.name === this.target;
  }

  get finalTarget(): string {
    return !this.isActiveRoute ? this.target : this.defaultTarget;
  }

  private rand = -1;

  get extra(): boolean {
    if (!this.isReadyToAnimate) {
      return false;
    }
    return this.rand % 2 === 0;
  }

  private isReadyToAnimate = false;
  private colorTurnoverInterval!: number;
  private colorTurnoverTimeout!: number;

  mounted(): void {
      this.isCreateGame = this.target === 'LoginPanel';
      this.colorTurnoverInterval = window.setInterval(() => this.colorTurnover(), Math.floor(Math.random() * (120 - 60) + 60) * 1000);
      this.colorTurnoverTimeout = window.setTimeout(() => this.colorTurnover(true), Math.floor(Math.random() * (30 - 10) + 10) * 1000);
  }

  onDestroy(): void {
    alert("onDestroy")
    window.clearInterval(this.colorTurnoverInterval);
    window.clearTimeout(this.colorTurnoverTimeout);
  }

  private colorTurnover(white = false): void {
    this.rand = !white ? Math.floor(Math.random() * (12 - 0) + 0) : 0;
    this.isReadyToAnimate = true;
  }
}
</script>

<style lang="less" scoped>
#sidebar-item {
  padding-bottom: 35px;
  padding-top: 38px;
  padding-left: 20px;
  transition: padding-left 4s linear, background linear 200ms,
    filter ease-in 20s;
  font-size: 22px;
  text-shadow: 0 0 10px black !important;
  cursor: pointer;
  user-select: none;

  &:hover,
  &.active {
    background: rgb(8, 73, 177);
  }
  &.white {
    background: whitesmoke;
    filter: blur(55px);
    opacity: 0.8;
    transition: background linear 60s;
    will-change: background;
    //filter ease-in 5s;

    &.extra {
      background: grey;
    }
  }

  &.blue {
    opacity: 0.8;
    background: lightblue;
    filter: blur(55px);
    transition: background linear 60s;
    will-change: background;
    //filter ease-in 5s;

    &.extra {
      background: blue;
    }
  }

  &.violet {
    opacity: 0.8;
    background: violet;
    filter: blur(55px);
    transition: background linear 60s;
    will-change: background;
    //filter ease-in 5s;

    &.extra {
      background: purple;
    }
  }

  &.orange {
    opacity: 0.8;
    background: orange;
    filter: blur(55px);
    transition: background linear 60s;
    will-change: background;
    //filter ease-in 5s;

    &.extra {
      background: red;
    }
  }

  &.pink {
    opacity: 0.8;
    background: pink;
    filter: blur(55px);
    transition: background linear 60s;
    will-change: background;
    //filter ease-in 5s;

    &.extra {
      background: brown;
    }
  }

  &.red {
    opacity: 0.8;
    background: red;
    filter: blur(55px);
    transition: background linear 60s;
    will-change: background;
    //filter ease-in 5s;

    &.extra {
      background: red;
    }
  }
}
</style>